-- Seed Data for Entertainment Media Database

-- =====================
-- NODES
-- =====================

-- Actors (NodeID 1-10)
INSERT INTO Nodes (NodeType) VALUES ('Actor');  -- 1
INSERT INTO Nodes (NodeType) VALUES ('Actor');  -- 2
INSERT INTO Nodes (NodeType) VALUES ('Actor');  -- 3
INSERT INTO Nodes (NodeType) VALUES ('Actor');  -- 4
INSERT INTO Nodes (NodeType) VALUES ('Actor');  -- 5
INSERT INTO Nodes (NodeType) VALUES ('Actor');  -- 6
INSERT INTO Nodes (NodeType) VALUES ('Actor');  -- 7
INSERT INTO Nodes (NodeType) VALUES ('Actor');  -- 8
INSERT INTO Nodes (NodeType) VALUES ('Actor');  -- 9
INSERT INTO Nodes (NodeType) VALUES ('Actor');  -- 10

-- Directors (NodeID 11-15)
INSERT INTO Nodes (NodeType) VALUES ('Director');  -- 11
INSERT INTO Nodes (NodeType) VALUES ('Director');  -- 12
INSERT INTO Nodes (NodeType) VALUES ('Director');  -- 13
INSERT INTO Nodes (NodeType) VALUES ('Director');  -- 14
INSERT INTO Nodes (NodeType) VALUES ('Director');  -- 15

-- Movies (NodeID 16-30)
INSERT INTO Nodes (NodeType) VALUES ('Movie');  -- 16
INSERT INTO Nodes (NodeType) VALUES ('Movie');  -- 17
INSERT INTO Nodes (NodeType) VALUES ('Movie');  -- 18
INSERT INTO Nodes (NodeType) VALUES ('Movie');  -- 19
INSERT INTO Nodes (NodeType) VALUES ('Movie');  -- 20
INSERT INTO Nodes (NodeType) VALUES ('Movie');  -- 21
INSERT INTO Nodes (NodeType) VALUES ('Movie');  -- 22
INSERT INTO Nodes (NodeType) VALUES ('Movie');  -- 23
INSERT INTO Nodes (NodeType) VALUES ('Movie');  -- 24
INSERT INTO Nodes (NodeType) VALUES ('Movie');  -- 25
INSERT INTO Nodes (NodeType) VALUES ('Movie');  -- 26
INSERT INTO Nodes (NodeType) VALUES ('Movie');  -- 27
INSERT INTO Nodes (NodeType) VALUES ('Movie');  -- 28
INSERT INTO Nodes (NodeType) VALUES ('Movie');  -- 29
INSERT INTO Nodes (NodeType) VALUES ('Movie');  -- 30

-- =====================
-- ACTORS
-- =====================
INSERT INTO Actor (NodeID, ActorID, Name, DateOfBirth, Nationality) VALUES
(1,  1,  'Leonardo DiCaprio',    '1974-11-11', 'American'),
(2,  2,  'Tom Hardy',            '1977-09-15', 'British'),
(3,  3,  'Joseph Gordon-Levitt', '1981-02-17', 'American'),
(4,  4,  'Elliot Page',          '1987-02-21', 'Canadian'),
(5,  5,  'Matt Damon',           '1970-10-08', 'American'),
(6,  6,  'Christian Bale',       '1974-01-30', 'British'),
(7,  7,  'Heath Ledger',         '1979-04-04', 'Australian'),
(8,  8,  'Margot Robbie',        '1990-07-02', 'Australian'),
(9,  9,  'Brad Pitt',            '1963-12-18', 'American'),
(10, 10, 'Cillian Murphy',       '1976-05-25', 'Irish');

-- =====================
-- DIRECTORS
-- =====================
INSERT INTO Director (NodeID, DirectorID, Name, DateOfBirth, Nationality, Awards) VALUES
(11, 1, 'Christopher Nolan',  '1970-07-30', 'British-American', 'Academy Award for Best Director'),
(12, 2, 'Martin Scorsese',    '1942-11-17', 'American',         'Academy Award for Best Director'),
(13, 3, 'Quentin Tarantino',  '1963-03-27', 'American',         'Academy Award for Best Original Screenplay'),
(14, 4, 'Denis Villeneuve',   '1967-10-03', 'Canadian',         'Canadian Screen Award'),
(15, 5, 'Greta Gerwig',       '1983-08-04', 'American',         'Golden Globe Nomination for Best Director');

-- =====================
-- MOVIES
-- =====================
INSERT INTO Movie (NodeID, MovieID, Title, Rating, ReleaseDate, Genre, Runtime) VALUES
(16, 1,  'Inception',              '8.8', '2010-07-16', 'Sci-Fi',    148),
(17, 2,  'The Dark Knight',        '9.0', '2008-07-18', 'Action',    152),
(18, 3,  'Interstellar',           '8.7', '2014-11-07', 'Sci-Fi',    169),
(19, 4,  'The Departed',           '8.5', '2006-10-06', 'Crime',     151),
(20, 5,  'The Wolf of Wall Street','8.2', '2013-12-25', 'Comedy',    180),
(21, 6,  'The Revenant',           '8.0', '2015-12-25', 'Adventure', 156),
(22, 7,  'Inglourious Basterds',   '8.3', '2009-08-21', 'War',       153),
(23, 8,  'Once Upon a Time in Hollywood', '7.6', '2019-07-26', 'Comedy', 161),
(24, 9,  'Django Unchained',       '8.4', '2012-12-25', 'Western',   165),
(25, 10, 'Dunkirk',               '7.8', '2017-07-21', 'War',       106),
(26, 11, 'Oppenheimer',           '8.5', '2023-07-21', 'Drama',     180),
(27, 12, 'The Dark Knight Rises',  '8.4', '2012-07-20', 'Action',    164),
(28, 13, 'Barbie',                '6.8', '2023-07-21', 'Comedy',    114),
(29, 14, 'Shutter Island',        '8.2', '2010-02-19', 'Thriller',  138),
(30, 15, 'Dune',                  '8.0', '2021-10-22', 'Sci-Fi',    155);

-- =====================
-- EDGES: ACTED_IN
-- =====================

-- Inception (1): DiCaprio, Hardy, Gordon-Levitt, Elliot Page, Cillian Murphy
INSERT INTO Edges (SourceNodeID, TargetNodeID, EdgeType, Metadata) VALUES
(1,  16, 'ACTED_IN', '{"role": "Cobb", "star": true}'),
(2,  16, 'ACTED_IN', '{"role": "Eames", "star": false}'),
(3,  16, 'ACTED_IN', '{"role": "Arthur", "star": false}'),
(4,  16, 'ACTED_IN', '{"role": "Ariadne", "star": false}'),
(10, 16, 'ACTED_IN', '{"role": "Robert Fischer", "star": false}');

-- The Dark Knight (2): Bale, Ledger
INSERT INTO Edges (SourceNodeID, TargetNodeID, EdgeType, Metadata) VALUES
(6, 17, 'ACTED_IN', '{"role": "Bruce Wayne", "star": true}'),
(7, 17, 'ACTED_IN', '{"role": "Joker", "star": true}');

-- Interstellar (3): Damon, Bale (cameo-ish, but let's use Damon)
INSERT INTO Edges (SourceNodeID, TargetNodeID, EdgeType, Metadata) VALUES
(5, 18, 'ACTED_IN', '{"role": "Dr. Mann", "star": false}');

-- The Departed (4): DiCaprio, Damon
INSERT INTO Edges (SourceNodeID, TargetNodeID, EdgeType, Metadata) VALUES
(1, 19, 'ACTED_IN', '{"role": "Billy Costigan", "star": true}'),
(5, 19, 'ACTED_IN', '{"role": "Colin Sullivan", "star": true}');

-- The Wolf of Wall Street (5): DiCaprio, Margot Robbie
INSERT INTO Edges (SourceNodeID, TargetNodeID, EdgeType, Metadata) VALUES
(1, 20, 'ACTED_IN', '{"role": "Jordan Belfort", "star": true}'),
(8, 20, 'ACTED_IN', '{"role": "Naomi Lapaglia", "star": false}');

-- The Revenant (6): DiCaprio, Hardy
INSERT INTO Edges (SourceNodeID, TargetNodeID, EdgeType, Metadata) VALUES
(1, 21, 'ACTED_IN', '{"role": "Hugh Glass", "star": true}'),
(2, 21, 'ACTED_IN', '{"role": "John Fitzgerald", "star": false}');

-- Inglourious Basterds (7): Brad Pitt
INSERT INTO Edges (SourceNodeID, TargetNodeID, EdgeType, Metadata) VALUES
(9, 22, 'ACTED_IN', '{"role": "Lt. Aldo Raine", "star": true}');

-- Once Upon a Time in Hollywood (8): DiCaprio, Brad Pitt, Margot Robbie
INSERT INTO Edges (SourceNodeID, TargetNodeID, EdgeType, Metadata) VALUES
(1, 23, 'ACTED_IN', '{"role": "Rick Dalton", "star": true}'),
(9, 23, 'ACTED_IN', '{"role": "Cliff Booth", "star": true}'),
(8, 23, 'ACTED_IN', '{"role": "Sharon Tate", "star": false}');

-- Django Unchained (9): DiCaprio
INSERT INTO Edges (SourceNodeID, TargetNodeID, EdgeType, Metadata) VALUES
(1, 24, 'ACTED_IN', '{"role": "Calvin Candie", "star": false}');

-- Dunkirk (10): Hardy, Cillian Murphy
INSERT INTO Edges (SourceNodeID, TargetNodeID, EdgeType, Metadata) VALUES
(2,  25, 'ACTED_IN', '{"role": "Farrier", "star": true}'),
(10, 25, 'ACTED_IN', '{"role": "Shivering Soldier", "star": false}');

-- Oppenheimer (11): Cillian Murphy, Matt Damon
INSERT INTO Edges (SourceNodeID, TargetNodeID, EdgeType, Metadata) VALUES
(10, 26, 'ACTED_IN', '{"role": "J. Robert Oppenheimer", "star": true}'),
(5,  26, 'ACTED_IN', '{"role": "Leslie Groves", "star": false}');

-- The Dark Knight Rises (12): Bale, Hardy
INSERT INTO Edges (SourceNodeID, TargetNodeID, EdgeType, Metadata) VALUES
(6, 27, 'ACTED_IN', '{"role": "Bruce Wayne", "star": true}'),
(2, 27, 'ACTED_IN', '{"role": "Bane", "star": false}');

-- Barbie (13): Margot Robbie
INSERT INTO Edges (SourceNodeID, TargetNodeID, EdgeType, Metadata) VALUES
(8, 28, 'ACTED_IN', '{"role": "Barbie", "star": true}');

-- Shutter Island (14): DiCaprio
INSERT INTO Edges (SourceNodeID, TargetNodeID, EdgeType, Metadata) VALUES
(1, 29, 'ACTED_IN', '{"role": "Teddy Daniels", "star": true}');

-- Dune (15): no actors from our list (could add but keeping it clean)

-- =====================
-- EDGES: DIRECTED
-- =====================
INSERT INTO Edges (SourceNodeID, TargetNodeID, EdgeType, Metadata) VALUES
(11, 16, 'DIRECTED', '{}'),  -- Nolan -> Inception
(11, 17, 'DIRECTED', '{}'),  -- Nolan -> The Dark Knight
(11, 18, 'DIRECTED', '{}'),  -- Nolan -> Interstellar
(11, 25, 'DIRECTED', '{}'),  -- Nolan -> Dunkirk
(11, 26, 'DIRECTED', '{}'),  -- Nolan -> Oppenheimer
(11, 27, 'DIRECTED', '{}'),  -- Nolan -> The Dark Knight Rises
(12, 19, 'DIRECTED', '{}'),  -- Scorsese -> The Departed
(12, 20, 'DIRECTED', '{}'),  -- Scorsese -> Wolf of Wall Street
(12, 29, 'DIRECTED', '{}'),  -- Scorsese -> Shutter Island
(13, 22, 'DIRECTED', '{}'),  -- Tarantino -> Inglourious Basterds
(13, 23, 'DIRECTED', '{}'),  -- Tarantino -> Once Upon a Time
(13, 24, 'DIRECTED', '{}'),  -- Tarantino -> Django Unchained
(14, 30, 'DIRECTED', '{}'),  -- Villeneuve -> Dune
(15, 28, 'DIRECTED', '{}');  -- Gerwig -> Barbie
