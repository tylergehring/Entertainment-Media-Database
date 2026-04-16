-- Pre-fetched TMDB image URLs.
-- Baked in so a fresh spin-up requires no API key or network calls.
-- Re-generate with: python3 backend/enrich_images.py --force

-- Movies
UPDATE Movie SET PosterURL='https://image.tmdb.org/t/p/w500/xlaY2zyzMfkhk0HSC5VUwzoZPU1.jpg' WHERE NodeID=16;
UPDATE Movie SET PosterURL='https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg' WHERE NodeID=17;
UPDATE Movie SET PosterURL='https://image.tmdb.org/t/p/w500/yQvGrMoipbRoddT0ZR8tPoR7NfX.jpg' WHERE NodeID=18;
UPDATE Movie SET PosterURL='https://image.tmdb.org/t/p/w500/nT97ifVT2J1yMQmeq20Qblg61T.jpg'  WHERE NodeID=19;
UPDATE Movie SET PosterURL='https://image.tmdb.org/t/p/w500/kW9LmvYHAaS9iA0tHmZVq8hQYoq.jpg' WHERE NodeID=20;
UPDATE Movie SET PosterURL='https://image.tmdb.org/t/p/w500/ji3ecJphATlVgWNY0B0RVXZizdf.jpg' WHERE NodeID=21;
UPDATE Movie SET PosterURL='https://image.tmdb.org/t/p/w500/7sfbEnaARXDDhKm0CZ7D7uc2sbo.jpg' WHERE NodeID=22;
UPDATE Movie SET PosterURL='https://image.tmdb.org/t/p/w500/8j58iEBw9pOXFD2L0nt0ZXeHviB.jpg' WHERE NodeID=23;
UPDATE Movie SET PosterURL='https://image.tmdb.org/t/p/w500/7oWY8VDWW7thTzWh3OKYRkWUlD5.jpg' WHERE NodeID=24;
UPDATE Movie SET PosterURL='https://image.tmdb.org/t/p/w500/b4Oe15CGLL61Ped0RAS9JpqdmCt.jpg' WHERE NodeID=25;
UPDATE Movie SET PosterURL='https://image.tmdb.org/t/p/w500/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg' WHERE NodeID=26;
UPDATE Movie SET PosterURL='https://image.tmdb.org/t/p/w500/hr0L2aueqlP2BYUblTTjmtn0hw4.jpg' WHERE NodeID=27;
UPDATE Movie SET PosterURL='https://image.tmdb.org/t/p/w500/iuFNMS8U5cb6xfzi51Dbkovj7vM.jpg' WHERE NodeID=28;
UPDATE Movie SET PosterURL='https://image.tmdb.org/t/p/w500/nrmXQ0zcZUL8jFLrakWc90IR8z9.jpg' WHERE NodeID=29;
UPDATE Movie SET PosterURL='https://image.tmdb.org/t/p/w500/gDzOcq0pfeCeqMBwKIJlSmQpjkZ.jpg' WHERE NodeID=30;
UPDATE Movie SET PosterURL='https://image.tmdb.org/t/p/w500/jSziioSwPVrOy9Yow3XhWIBDjq1.jpg' WHERE NodeID=48;
UPDATE Movie SET PosterURL='https://image.tmdb.org/t/p/w500/191nKfP0ehp3uIvWqgPbFmI4lv9.jpg' WHERE NodeID=49;
UPDATE Movie SET PosterURL='https://image.tmdb.org/t/p/w500/n0ybibhJtQ5icDqTp8eRytcIHJx.jpg' WHERE NodeID=50;
UPDATE Movie SET PosterURL='https://image.tmdb.org/t/p/w500/fASz8A0yFE3QB6LgGoOfwvFSseV.jpg' WHERE NodeID=51;
UPDATE Movie SET PosterURL='https://image.tmdb.org/t/p/w500/wN2xWp1eIwCKOD0BHTcErTBv1Uq.jpg' WHERE NodeID=52;
UPDATE Movie SET PosterURL='https://image.tmdb.org/t/p/w500/viWheBd44bouiLCHgNMvahLThqx.jpg' WHERE NodeID=53;
UPDATE Movie SET PosterURL='https://image.tmdb.org/t/p/w500/nOd6vjEmzCT0k4VYqsA2hwyi87C.jpg' WHERE NodeID=54;
UPDATE Movie SET PosterURL='https://image.tmdb.org/t/p/w500/kZ2nZw8D681aphje8NJi8EfbL1U.jpg' WHERE NodeID=55;
UPDATE Movie SET PosterURL='https://image.tmdb.org/t/p/w500/lQcXgb0fFzffnLV5WY0Q0X2WW7E.jpg' WHERE NodeID=56;
UPDATE Movie SET PosterURL='https://image.tmdb.org/t/p/w500/uDO8zWDhfWwoFdKS4fzkUJt0Rf0.jpg' WHERE NodeID=57;
UPDATE Movie SET PosterURL='https://image.tmdb.org/t/p/w500/7fn624j5lj3xTme2SgiLCeuedmO.jpg' WHERE NodeID=58;
UPDATE Movie SET PosterURL='https://image.tmdb.org/t/p/w500/9OkCLM73MIU2CrKZbqiT8Ln1wY2.jpg' WHERE NodeID=59;
UPDATE Movie SET PosterURL='https://image.tmdb.org/t/p/w500/pEzNVQfdzYDzVK0XqxERIw2x2se.jpg' WHERE NodeID=60;
UPDATE Movie SET PosterURL='https://image.tmdb.org/t/p/w500/gajva2L0rPYkEWjzgFlBXCAVBE5.jpg' WHERE NodeID=61;
UPDATE Movie SET PosterURL='https://image.tmdb.org/t/p/w500/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg' WHERE NodeID=62;
UPDATE Movie SET PosterURL='https://image.tmdb.org/t/p/w500/fKTPH2WvH8nHTXeBYBVhawtRqtR.jpg' WHERE NodeID=63;
UPDATE Movie SET PosterURL='https://image.tmdb.org/t/p/w500/sPX89Td70IDDjVr85jdSBb4rWGr.jpg' WHERE NodeID=64;
UPDATE Movie SET PosterURL='https://image.tmdb.org/t/p/w500/Ag2B2KHKQPukjH7WutmgnnSNurZ.jpg' WHERE NodeID=65;

-- Actors
UPDATE Actor SET PhotoURL='https://image.tmdb.org/t/p/w500/wo2hJpn04vbtmh0B9utCFdsQhxM.jpg' WHERE NodeID=1;
UPDATE Actor SET PhotoURL='https://image.tmdb.org/t/p/w500/d81K0RH8UX7tZj49tZaQhZ9ewH.jpg'  WHERE NodeID=2;
UPDATE Actor SET PhotoURL='https://image.tmdb.org/t/p/w500/z2FA8js799xqtfiFjBTicFYdfk.jpg'   WHERE NodeID=3;
UPDATE Actor SET PhotoURL='https://image.tmdb.org/t/p/w500/nXO8DE4biVXY4UDYP0NdIY1zvXS.jpg' WHERE NodeID=4;
UPDATE Actor SET PhotoURL='https://image.tmdb.org/t/p/w500/At3JgvaNeEN4Z4ESKlhhes85Xo3.jpg'  WHERE NodeID=5;
UPDATE Actor SET PhotoURL='https://image.tmdb.org/t/p/w500/7Pxez9J8fuPd2Mn9kex13YALrCQ.jpg'  WHERE NodeID=6;
UPDATE Actor SET PhotoURL='https://image.tmdb.org/t/p/w500/AdWKVqyWpkYSfKE5Gb2qn8JzHni.jpg' WHERE NodeID=7;
UPDATE Actor SET PhotoURL='https://image.tmdb.org/t/p/w500/8LqG2N6j98lFGMpuYsRUAhOunSd.jpg'  WHERE NodeID=8;
UPDATE Actor SET PhotoURL='https://image.tmdb.org/t/p/w500/r9DzKQLNbh5QfXlrFGHoVNKER7X.jpg'  WHERE NodeID=9;
UPDATE Actor SET PhotoURL='https://image.tmdb.org/t/p/w500/2lKs67r7FI4bPu0AXxMUJZxmUXn.jpg' WHERE NodeID=10;
UPDATE Actor SET PhotoURL='https://image.tmdb.org/t/p/w500/lyUyVARQKhGxaxy0FbPJCQRpiaW.jpg' WHERE NodeID=31;
UPDATE Actor SET PhotoURL='https://image.tmdb.org/t/p/w500/cZ8a3QvAnj2cgcgVL6g4XaqPzpL.jpg'  WHERE NodeID=32;
UPDATE Actor SET PhotoURL='https://image.tmdb.org/t/p/w500/u38k3hQBDwNX0VA22aQceDp9Iyv.jpg'  WHERE NodeID=33;
UPDATE Actor SET PhotoURL='https://image.tmdb.org/t/p/w500/edPU5HxncLWa1YkgRPNkSd68ONG.jpg' WHERE NodeID=34;
UPDATE Actor SET PhotoURL='https://image.tmdb.org/t/p/w500/jPsLqiYGSofU4s6BjrxnefMfabb.jpg'  WHERE NodeID=35;
UPDATE Actor SET PhotoURL='https://image.tmdb.org/t/p/w500/s6tflSD20MGz04ZR2R1lZvhmC4Y.jpg'  WHERE NodeID=36;
UPDATE Actor SET PhotoURL='https://image.tmdb.org/t/p/w500/cT8htcckIuyI1Lqwt1CvD02ynTh.jpg'  WHERE NodeID=37;
UPDATE Actor SET PhotoURL='https://image.tmdb.org/t/p/w500/5nCSG5TL1bP1geD8aaBfaLnLLCD.jpg'  WHERE NodeID=38;
UPDATE Actor SET PhotoURL='https://image.tmdb.org/t/p/w500/axENiFIrSz5B7UuWkMT7PDe7CaO.jpg' WHERE NodeID=39;
UPDATE Actor SET PhotoURL='https://image.tmdb.org/t/p/w500/3WdOloHpjtjL96uVOhFRRCcYSwq.jpg'  WHERE NodeID=40;
UPDATE Actor SET PhotoURL='https://image.tmdb.org/t/p/w500/dW5U5yrIIPmMjRThR9KT2xH6nTz.jpg'  WHERE NodeID=41;
UPDATE Actor SET PhotoURL='https://image.tmdb.org/t/p/w500/6bBCPmc55gzP7TR9Th4WbykrYd0.jpg'  WHERE NodeID=42;

-- Directors
UPDATE Director SET PhotoURL='https://image.tmdb.org/t/p/w500/xuAIuYSmsUzKlUMBFGVZaWsY3DZ.jpg' WHERE NodeID=11;
UPDATE Director SET PhotoURL='https://image.tmdb.org/t/p/w500/9U9Y5GQuWX3EZy39B8nkk4NY01S.jpg'  WHERE NodeID=12;
UPDATE Director SET PhotoURL='https://image.tmdb.org/t/p/w500/1gjcpAa99FAOWGnrUvHEXXsRs7o.jpg'  WHERE NodeID=13;
UPDATE Director SET PhotoURL='https://image.tmdb.org/t/p/w500/zdDx9Xs93UIrJFWYApYR28J8M6b.jpg'  WHERE NodeID=14;
UPDATE Director SET PhotoURL='https://image.tmdb.org/t/p/w500/3H0xzU12GTNJyQTpGysEuI9KyiQ.jpg'  WHERE NodeID=15;
UPDATE Director SET PhotoURL='https://image.tmdb.org/t/p/w500/tpEczFclQZeKAiCeKZZ0adRvtfz.jpg' WHERE NodeID=43;
UPDATE Director SET PhotoURL='https://image.tmdb.org/t/p/w500/97SO7H0UlS3racqjeW5JTy8c6GM.jpg'  WHERE NodeID=44;
UPDATE Director SET PhotoURL='https://image.tmdb.org/t/p/w500/tOjz8mVI2HeQBvU6KNjIExMBsXL.jpg'  WHERE NodeID=45;
UPDATE Director SET PhotoURL='https://image.tmdb.org/t/p/w500/gaHhrzPfxfc3cbQLkDt54gtP3n1.jpg' WHERE NodeID=46;
UPDATE Director SET PhotoURL='https://image.tmdb.org/t/p/w500/14kRZ3XxNMyBv717YQSXr3wCucy.jpg'  WHERE NodeID=47;
