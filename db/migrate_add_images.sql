-- Migration: add image URL columns to Movie, Actor, Director
-- Run this once against the live database before running enrich_images.py
--
--   mysql -u <user> -p <database> < db/migrate_add_images.sql

ALTER TABLE Movie    ADD COLUMN PosterURL VARCHAR(500) DEFAULT NULL;
ALTER TABLE Actor    ADD COLUMN PhotoURL  VARCHAR(500) DEFAULT NULL;
ALTER TABLE Director ADD COLUMN PhotoURL  VARCHAR(500) DEFAULT NULL;
