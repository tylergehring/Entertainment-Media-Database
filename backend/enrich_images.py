#!/usr/bin/env python3
"""
TMDB image enrichment script.

Walks every Movie, Actor, and Director row that has no image URL yet,
searches TMDB for a match, and writes the full CDN image URL back to the DB.

Usage:
    # From the backend/ directory (or any directory with DB env vars set):
    python enrich_images.py

    # Force re-fetch even for rows that already have a URL:
    python enrich_images.py --force

Environment variables (same as the Flask app):
    TMDB_API_KEY   — required
    DB_HOST        — default: localhost
    DB_USER        — default: myuser
    DB_PASSWORD    — default: mypassword
    DB_NAME        — default: mydatabase
"""

import argparse
import os
import time

import pymysql
import requests

# ---------------------------------------------------------------------------
# Config
# ---------------------------------------------------------------------------

TMDB_KEY  = os.environ.get("TMDB_API_KEY", "")
TMDB_BASE = "https://api.themoviedb.org/3"
IMG_BASE  = "https://image.tmdb.org/t/p/w500"

RATE_DELAY = 0.26   # seconds between TMDB requests (~40 req/10 s limit)

# ---------------------------------------------------------------------------
# DB helpers
# ---------------------------------------------------------------------------

def get_conn():
    return pymysql.connect(
        host=os.environ.get("DB_HOST", "localhost"),
        user=os.environ.get("DB_USER", "myuser"),
        password=os.environ.get("DB_PASSWORD", "mypassword"),
        database=os.environ.get("DB_NAME", "mydatabase"),
        cursorclass=pymysql.cursors.DictCursor,
    )

# ---------------------------------------------------------------------------
# TMDB helpers
# ---------------------------------------------------------------------------

def tmdb_get(path: str, params: dict) -> dict:
    params["api_key"] = TMDB_KEY
    r = requests.get(f"{TMDB_BASE}{path}", params=params, timeout=10)
    r.raise_for_status()
    time.sleep(RATE_DELAY)
    return r.json()


def find_movie_poster(title: str, year: str | None) -> str | None:
    params = {"query": title, "include_adult": "false"}
    if year:
        params["year"] = year
    data = tmdb_get("/search/movie", params)
    results = data.get("results", [])
    if not results:
        # Retry without year constraint if the first search returned nothing
        if year:
            data = tmdb_get("/search/movie", {"query": title, "include_adult": "false"})
            results = data.get("results", [])
    if results and results[0].get("poster_path"):
        return IMG_BASE + results[0]["poster_path"]
    return None


def find_person_photo(name: str) -> str | None:
    data = tmdb_get("/search/person", {"query": name, "include_adult": "false"})
    results = data.get("results", [])
    if results and results[0].get("profile_path"):
        return IMG_BASE + results[0]["profile_path"]
    return None

# ---------------------------------------------------------------------------
# Enrichment routines
# ---------------------------------------------------------------------------

def enrich_movies(conn, force: bool):
    with conn.cursor() as cur:
        if force:
            cur.execute("SELECT NodeID, Title, ReleaseDate FROM Movie")
        else:
            cur.execute("SELECT NodeID, Title, ReleaseDate FROM Movie WHERE PosterURL IS NULL")
        rows = cur.fetchall()

    print(f"\n[Movies] {len(rows)} rows to process")
    updated = skipped = 0

    for row in rows:
        node_id = row["NodeID"]
        title   = row["Title"]
        year    = str(row["ReleaseDate"])[:4] if row["ReleaseDate"] else None

        try:
            url = find_movie_poster(title, year)
        except Exception as e:
            print(f"  ✗ [{node_id}] {title!r} — TMDB error: {e}")
            skipped += 1
            continue

        if url:
            with conn.cursor() as cur:
                cur.execute("UPDATE Movie SET PosterURL = %s WHERE NodeID = %s", (url, node_id))
            conn.commit()
            print(f"  ✓ [{node_id}] {title!r}")
            updated += 1
        else:
            print(f"  – [{node_id}] {title!r} — no poster found")
            skipped += 1

    print(f"[Movies] done — {updated} updated, {skipped} skipped")


def enrich_actors(conn, force: bool):
    with conn.cursor() as cur:
        if force:
            cur.execute("SELECT NodeID, Name FROM Actor")
        else:
            cur.execute("SELECT NodeID, Name FROM Actor WHERE PhotoURL IS NULL")
        rows = cur.fetchall()

    print(f"\n[Actors] {len(rows)} rows to process")
    updated = skipped = 0

    for row in rows:
        node_id = row["NodeID"]
        name    = row["Name"]

        try:
            url = find_person_photo(name)
        except Exception as e:
            print(f"  ✗ [{node_id}] {name!r} — TMDB error: {e}")
            skipped += 1
            continue

        if url:
            with conn.cursor() as cur:
                cur.execute("UPDATE Actor SET PhotoURL = %s WHERE NodeID = %s", (url, node_id))
            conn.commit()
            print(f"  ✓ [{node_id}] {name!r}")
            updated += 1
        else:
            print(f"  – [{node_id}] {name!r} — no photo found")
            skipped += 1

    print(f"[Actors] done — {updated} updated, {skipped} skipped")


def enrich_directors(conn, force: bool):
    with conn.cursor() as cur:
        if force:
            cur.execute("SELECT NodeID, Name FROM Director")
        else:
            cur.execute("SELECT NodeID, Name FROM Director WHERE PhotoURL IS NULL")
        rows = cur.fetchall()

    print(f"\n[Directors] {len(rows)} rows to process")
    updated = skipped = 0

    for row in rows:
        node_id = row["NodeID"]
        name    = row["Name"]

        try:
            url = find_person_photo(name)
        except Exception as e:
            print(f"  ✗ [{node_id}] {name!r} — TMDB error: {e}")
            skipped += 1
            continue

        if url:
            with conn.cursor() as cur:
                cur.execute("UPDATE Director SET PhotoURL = %s WHERE NodeID = %s", (url, node_id))
            conn.commit()
            print(f"  ✓ [{node_id}] {name!r}")
            updated += 1
        else:
            print(f"  – [{node_id}] {name!r} — no photo found")
            skipped += 1

    print(f"[Directors] done — {updated} updated, {skipped} skipped")

# ---------------------------------------------------------------------------
# Entry point
# ---------------------------------------------------------------------------

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Enrich EMDB with TMDB image URLs")
    parser.add_argument("--force", action="store_true", help="Re-fetch even rows that already have an image URL")
    parser.add_argument("--movies-only",    action="store_true")
    parser.add_argument("--actors-only",    action="store_true")
    parser.add_argument("--directors-only", action="store_true")
    args = parser.parse_args()

    if not TMDB_KEY:
        print("ERROR: TMDB_API_KEY environment variable is not set.")
        print("  export TMDB_API_KEY=your_key_here")
        raise SystemExit(1)

    conn = get_conn()
    try:
        run_all = not (args.movies_only or args.actors_only or args.directors_only)

        if run_all or args.movies_only:
            enrich_movies(conn, args.force)
        if run_all or args.actors_only:
            enrich_actors(conn, args.force)
        if run_all or args.directors_only:
            enrich_directors(conn, args.force)

        print("\nAll done.")
    finally:
        conn.close()
