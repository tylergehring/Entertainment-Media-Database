-- Extended Seed Data for Entertainment Media Database
-- Run AFTER seed.sql (and migrate_add_images.sql if applicable).
-- Assumes NodeIDs 1-30 already exist from seed.sql.
--
-- Adds:
--   12 actors    (NodeID 31-42, ActorID 11-22)
--    5 directors (NodeID 43-47, DirectorID 6-10)
--   18 movies    (NodeID 48-65, MovieID 16-33)
-- Plus edges connecting new AND existing nodes.

-- =====================
-- NODES
-- =====================

-- New Actors (NodeID 31-42)
INSERT INTO Nodes (NodeType) VALUES ('Actor');   -- 31
INSERT INTO Nodes (NodeType) VALUES ('Actor');   -- 32
INSERT INTO Nodes (NodeType) VALUES ('Actor');   -- 33
INSERT INTO Nodes (NodeType) VALUES ('Actor');   -- 34
INSERT INTO Nodes (NodeType) VALUES ('Actor');   -- 35
INSERT INTO Nodes (NodeType) VALUES ('Actor');   -- 36
INSERT INTO Nodes (NodeType) VALUES ('Actor');   -- 37
INSERT INTO Nodes (NodeType) VALUES ('Actor');   -- 38
INSERT INTO Nodes (NodeType) VALUES ('Actor');   -- 39
INSERT INTO Nodes (NodeType) VALUES ('Actor');   -- 40
INSERT INTO Nodes (NodeType) VALUES ('Actor');   -- 41
INSERT INTO Nodes (NodeType) VALUES ('Actor');   -- 42

-- New Directors (NodeID 43-47)
INSERT INTO Nodes (NodeType) VALUES ('Director'); -- 43
INSERT INTO Nodes (NodeType) VALUES ('Director'); -- 44
INSERT INTO Nodes (NodeType) VALUES ('Director'); -- 45
INSERT INTO Nodes (NodeType) VALUES ('Director'); -- 46
INSERT INTO Nodes (NodeType) VALUES ('Director'); -- 47

-- New Movies (NodeID 48-65)
INSERT INTO Nodes (NodeType) VALUES ('Movie');   -- 48
INSERT INTO Nodes (NodeType) VALUES ('Movie');   -- 49
INSERT INTO Nodes (NodeType) VALUES ('Movie');   -- 50
INSERT INTO Nodes (NodeType) VALUES ('Movie');   -- 51
INSERT INTO Nodes (NodeType) VALUES ('Movie');   -- 52
INSERT INTO Nodes (NodeType) VALUES ('Movie');   -- 53
INSERT INTO Nodes (NodeType) VALUES ('Movie');   -- 54
INSERT INTO Nodes (NodeType) VALUES ('Movie');   -- 55
INSERT INTO Nodes (NodeType) VALUES ('Movie');   -- 56
INSERT INTO Nodes (NodeType) VALUES ('Movie');   -- 57
INSERT INTO Nodes (NodeType) VALUES ('Movie');   -- 58
INSERT INTO Nodes (NodeType) VALUES ('Movie');   -- 59
INSERT INTO Nodes (NodeType) VALUES ('Movie');   -- 60
INSERT INTO Nodes (NodeType) VALUES ('Movie');   -- 61
INSERT INTO Nodes (NodeType) VALUES ('Movie');   -- 62
INSERT INTO Nodes (NodeType) VALUES ('Movie');   -- 63
INSERT INTO Nodes (NodeType) VALUES ('Movie');   -- 64
INSERT INTO Nodes (NodeType) VALUES ('Movie');   -- 65

-- =====================
-- ACTORS
-- =====================
INSERT INTO Actor (NodeID, ActorID, Name, DateOfBirth, Nationality) VALUES
(31, 11, 'Ryan Gosling',       '1980-11-12', 'Canadian'),
(32, 12, 'Emma Stone',         '1988-11-06', 'American'),
(33, 13, 'Joaquin Phoenix',    '1974-10-28', 'American'),
(34, 14, 'Natalie Portman',    '1981-06-09', 'Israeli-American'),
(35, 15, 'Morgan Freeman',     '1937-06-01', 'American'),
(36, 16, 'Anne Hathaway',      '1982-11-12', 'American'),
(37, 17, 'Robert De Niro',     '1943-08-17', 'American'),
(38, 18, 'Emily Blunt',        '1983-02-23', 'British'),
(39, 19, 'Timothee Chalamet',  '1995-12-27', 'American'),
(40, 20, 'Zendaya',            '1996-09-01', 'American'),
(41, 21, 'Oscar Isaac',        '1979-03-09', 'Guatemalan-American'),
(42, 22, 'Scarlett Johansson', '1984-11-22', 'American');

-- =====================
-- DIRECTORS
-- =====================
INSERT INTO Director (NodeID, DirectorID, Name, DateOfBirth, Nationality, Awards) VALUES
(43, 6,  'David Fincher',    '1962-08-28', 'American', 'BAFTA Award for Best Direction'),
(44, 7,  'Ridley Scott',     '1937-11-30', 'British',  'Academy Award Nomination for Best Director'),
(45, 8,  'Darren Aronofsky', '1969-02-12', 'American', 'Cannes Film Festival Grand Jury Prize'),
(46, 9,  'Alfonso Cuarón',   '1961-11-28', 'Mexican',  'Academy Award for Best Director'),
(47, 10, 'Damien Chazelle',  '1985-01-19', 'American', 'Academy Award for Best Director');

-- =====================
-- MOVIES
-- =====================
INSERT INTO Movie (NodeID, MovieID, Title, Rating, ReleaseDate, Genre, Runtime) VALUES
(48, 16, 'Fight Club',           '8.8', '1999-10-15', 'Drama',    139),
(49, 17, 'Se7en',                '8.6', '1995-09-22', 'Thriller', 127),
(50, 18, 'The Social Network',   '7.7', '2010-10-01', 'Drama',    120),
(51, 19, 'The Martian',          '8.0', '2015-10-02', 'Sci-Fi',   144),
(52, 20, 'Gladiator',            '8.5', '2000-05-05', 'Action',   155),
(53, 21, 'Black Swan',           '8.0', '2010-12-03', 'Thriller', 108),
(54, 22, 'Requiem for a Dream',  '8.3', '2000-10-06', 'Drama',    102),
(55, 23, 'Gravity',              '7.7', '2013-10-04', 'Sci-Fi',    91),
(56, 24, 'Children of Men',      '7.9', '2006-09-22', 'Sci-Fi',   109),
(57, 25, 'La La Land',           '8.0', '2016-12-09', 'Drama',    128),
(58, 26, 'Whiplash',             '8.5', '2014-10-10', 'Drama',    107),
(59, 27, 'Goodfellas',           '8.7', '1990-09-19', 'Crime',    146),
(60, 28, 'Arrival',              '7.9', '2016-11-11', 'Sci-Fi',   116),
(61, 29, 'Blade Runner 2049',    '8.0', '2017-10-06', 'Sci-Fi',   164),
(62, 30, 'Dune: Part Two',       '8.5', '2024-03-01', 'Sci-Fi',   167),
(63, 31, 'Memento',              '8.4', '2000-10-11', 'Thriller', 113),
(64, 32, 'Batman Begins',        '8.2', '2005-06-15', 'Action',   140),
(65, 33, 'The Prestige',         '8.5', '2006-10-20', 'Thriller', 130);

-- =====================
-- EDGES: ACTED_IN (new movies)
-- =====================

-- Fight Club (48): Brad Pitt
INSERT INTO Edges (SourceNodeID, TargetNodeID, EdgeType, Metadata) VALUES
(9,  48, 'ACTED_IN', '{"role": "Tyler Durden", "star": true}');

-- Se7en (49): Brad Pitt, Morgan Freeman
INSERT INTO Edges (SourceNodeID, TargetNodeID, EdgeType, Metadata) VALUES
(9,  49, 'ACTED_IN', '{"role": "Detective Mills", "star": true}'),
(35, 49, 'ACTED_IN', '{"role": "Detective Somerset", "star": true}');

-- The Martian (51): Matt Damon
INSERT INTO Edges (SourceNodeID, TargetNodeID, EdgeType, Metadata) VALUES
(5,  51, 'ACTED_IN', '{"role": "Mark Watney", "star": true}');

-- Gladiator (52): Joaquin Phoenix
INSERT INTO Edges (SourceNodeID, TargetNodeID, EdgeType, Metadata) VALUES
(33, 52, 'ACTED_IN', '{"role": "Commodus", "star": false}');

-- Black Swan (53): Natalie Portman
INSERT INTO Edges (SourceNodeID, TargetNodeID, EdgeType, Metadata) VALUES
(34, 53, 'ACTED_IN', '{"role": "Nina Sayers", "star": true}');

-- La La Land (57): Ryan Gosling, Emma Stone
INSERT INTO Edges (SourceNodeID, TargetNodeID, EdgeType, Metadata) VALUES
(31, 57, 'ACTED_IN', '{"role": "Sebastian", "star": true}'),
(32, 57, 'ACTED_IN', '{"role": "Mia", "star": true}');

-- Goodfellas (59): Robert De Niro
INSERT INTO Edges (SourceNodeID, TargetNodeID, EdgeType, Metadata) VALUES
(37, 59, 'ACTED_IN', '{"role": "Jimmy Conway", "star": true}');

-- Arrival (60): Emily Blunt
INSERT INTO Edges (SourceNodeID, TargetNodeID, EdgeType, Metadata) VALUES
(38, 60, 'ACTED_IN', '{"role": "Dr. Louise Banks", "star": true}');

-- Blade Runner 2049 (61): Ryan Gosling
INSERT INTO Edges (SourceNodeID, TargetNodeID, EdgeType, Metadata) VALUES
(31, 61, 'ACTED_IN', '{"role": "K", "star": true}');

-- Dune: Part Two (62): Timothée Chalamet, Zendaya, Oscar Isaac
INSERT INTO Edges (SourceNodeID, TargetNodeID, EdgeType, Metadata) VALUES
(39, 62, 'ACTED_IN', '{"role": "Paul Atreides", "star": true}'),
(40, 62, 'ACTED_IN', '{"role": "Chani", "star": true}'),
(41, 62, 'ACTED_IN', '{"role": "Duke Leto Atreides", "star": false}');

-- Batman Begins (64): Christian Bale
INSERT INTO Edges (SourceNodeID, TargetNodeID, EdgeType, Metadata) VALUES
(6,  64, 'ACTED_IN', '{"role": "Bruce Wayne", "star": true}');

-- The Prestige (65): Christian Bale, Scarlett Johansson
INSERT INTO Edges (SourceNodeID, TargetNodeID, EdgeType, Metadata) VALUES
(6,  65, 'ACTED_IN', '{"role": "Alfred Borden", "star": true}'),
(42, 65, 'ACTED_IN', '{"role": "Olivia Wenscombe", "star": false}');

-- =====================
-- EDGES: ACTED_IN (existing movies, new actors)
-- =====================

-- Interstellar (NodeID 18): Anne Hathaway
INSERT INTO Edges (SourceNodeID, TargetNodeID, EdgeType, Metadata) VALUES
(36, 18, 'ACTED_IN', '{"role": "Amelia Brand", "star": false}');

-- The Dark Knight Rises (NodeID 27): Anne Hathaway
INSERT INTO Edges (SourceNodeID, TargetNodeID, EdgeType, Metadata) VALUES
(36, 27, 'ACTED_IN', '{"role": "Selina Kyle", "star": false}');

-- Dune (NodeID 30): Timothée Chalamet, Zendaya, Oscar Isaac
INSERT INTO Edges (SourceNodeID, TargetNodeID, EdgeType, Metadata) VALUES
(39, 30, 'ACTED_IN', '{"role": "Paul Atreides", "star": true}'),
(40, 30, 'ACTED_IN', '{"role": "Chani", "star": false}'),
(41, 30, 'ACTED_IN', '{"role": "Duke Leto Atreides", "star": false}');

-- Oppenheimer (NodeID 26): Emily Blunt
INSERT INTO Edges (SourceNodeID, TargetNodeID, EdgeType, Metadata) VALUES
(38, 26, 'ACTED_IN', '{"role": "Katherine Oppenheimer", "star": false}');

-- =====================
-- EDGES: DIRECTED (new movies, new directors)
-- =====================
INSERT INTO Edges (SourceNodeID, TargetNodeID, EdgeType, Metadata) VALUES
-- David Fincher (43)
(43, 48, 'DIRECTED', '{}'),  -- Fight Club
(43, 49, 'DIRECTED', '{}'),  -- Se7en
(43, 50, 'DIRECTED', '{}'),  -- The Social Network
-- Ridley Scott (44)
(44, 51, 'DIRECTED', '{}'),  -- The Martian
(44, 52, 'DIRECTED', '{}'),  -- Gladiator
-- Darren Aronofsky (45)
(45, 53, 'DIRECTED', '{}'),  -- Black Swan
(45, 54, 'DIRECTED', '{}'),  -- Requiem for a Dream
-- Alfonso Cuarón (46)
(46, 55, 'DIRECTED', '{}'),  -- Gravity
(46, 56, 'DIRECTED', '{}'),  -- Children of Men
-- Damien Chazelle (47)
(47, 57, 'DIRECTED', '{}'),  -- La La Land
(47, 58, 'DIRECTED', '{}');  -- Whiplash

-- =====================
-- EDGES: DIRECTED (new movies, existing directors)
-- =====================
INSERT INTO Edges (SourceNodeID, TargetNodeID, EdgeType, Metadata) VALUES
-- Martin Scorsese (12)
(12, 59, 'DIRECTED', '{}'),  -- Goodfellas
-- Denis Villeneuve (14)
(14, 60, 'DIRECTED', '{}'),  -- Arrival
(14, 61, 'DIRECTED', '{}'),  -- Blade Runner 2049
(14, 62, 'DIRECTED', '{}'),  -- Dune: Part Two
-- Christopher Nolan (11)
(11, 63, 'DIRECTED', '{}'),  -- Memento
(11, 64, 'DIRECTED', '{}'),  -- Batman Begins
(11, 65, 'DIRECTED', '{}');  -- The Prestige
