-- MySQL dump 10.13  Distrib 8.0.45, for Linux (x86_64)
--
-- Host: localhost    Database: mydatabase
-- ------------------------------------------------------
-- Server version	8.0.45

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `Actor`
--

DROP TABLE IF EXISTS `Actor`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Actor` (
  `NodeID` int NOT NULL,
  `ActorID` varchar(50) NOT NULL,
  `Name` varchar(255) NOT NULL,
  `DateOfBirth` date DEFAULT NULL,
  `Nationality` varchar(100) DEFAULT NULL,
  `PhotoURL` varchar(500) DEFAULT NULL,
  PRIMARY KEY (`NodeID`),
  UNIQUE KEY `ActorID` (`ActorID`),
  CONSTRAINT `Actor_ibfk_1` FOREIGN KEY (`NodeID`) REFERENCES `Nodes` (`NodeID`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Actor`
--

LOCK TABLES `Actor` WRITE;
/*!40000 ALTER TABLE `Actor` DISABLE KEYS */;
INSERT INTO `Actor` VALUES (1,'act001','Leonardo DiCaprio','1974-11-11','American','https://image.tmdb.org/t/p/w500/wo2hJpn04vbtmh0B9utCFdsQhxM.jpg'),(2,'act002','Tom Hardy','1977-09-15','British','https://image.tmdb.org/t/p/w500/d81K0RH8UX7tZj49tZaQhZ9ewH.jpg'),(3,'act003','Joseph Gordon-Levitt','1981-02-17','American','https://image.tmdb.org/t/p/w500/z2FA8js799xqtfiFjBTicFYdfk.jpg'),(4,'act004','Elliot Page','1987-02-21','Canadian','https://image.tmdb.org/t/p/w500/nXO8DE4biVXY4UDYP0NdIY1zvXS.jpg'),(5,'act005','Matt Damon','1970-10-08','American','https://image.tmdb.org/t/p/w500/At3JgvaNeEN4Z4ESKlhhes85Xo3.jpg'),(6,'act006','Christian Bale','1974-01-30','British','https://image.tmdb.org/t/p/w500/7Pxez9J8fuPd2Mn9kex13YALrCQ.jpg'),(7,'act007','Heath Ledger','1979-04-04','Australian','https://image.tmdb.org/t/p/w500/AdWKVqyWpkYSfKE5Gb2qn8JzHni.jpg'),(8,'act008','Margot Robbie','1990-07-02','Australian','https://image.tmdb.org/t/p/w500/8LqG2N6j98lFGMpuYsRUAhOunSd.jpg'),(9,'act009','Brad Pitt','1963-12-18','American','https://image.tmdb.org/t/p/w500/r9DzKQLNbh5QfXlrFGHoVNKER7X.jpg'),(10,'act010','Cillian Murphy','1976-05-25','Irish','https://image.tmdb.org/t/p/w500/2lKs67r7FI4bPu0AXxMUJZxmUXn.jpg'),(31,'11','Ryan Gosling','1980-11-12','Canadian','https://image.tmdb.org/t/p/w500/lyUyVARQKhGxaxy0FbPJCQRpiaW.jpg'),(32,'12','Emma Stone','1988-11-06','American','https://image.tmdb.org/t/p/w500/cZ8a3QvAnj2cgcgVL6g4XaqPzpL.jpg'),(33,'13','Joaquin Phoenix','1974-10-28','American','https://image.tmdb.org/t/p/w500/u38k3hQBDwNX0VA22aQceDp9Iyv.jpg'),(34,'14','Natalie Portman','1981-06-09','Israeli-American','https://image.tmdb.org/t/p/w500/edPU5HxncLWa1YkgRPNkSd68ONG.jpg'),(35,'15','Morgan Freeman','1937-06-01','American','https://image.tmdb.org/t/p/w500/jPsLqiYGSofU4s6BjrxnefMfabb.jpg'),(36,'16','Anne Hathaway','1982-11-12','American','https://image.tmdb.org/t/p/w500/s6tflSD20MGz04ZR2R1lZvhmC4Y.jpg'),(37,'17','Robert De Niro','1943-08-17','American','https://image.tmdb.org/t/p/w500/cT8htcckIuyI1Lqwt1CvD02ynTh.jpg'),(38,'18','Emily Blunt','1983-02-23','British','https://image.tmdb.org/t/p/w500/5nCSG5TL1bP1geD8aaBfaLnLLCD.jpg'),(39,'19','TimothÃ©e Chalamet','1995-12-27','American','https://image.tmdb.org/t/p/w500/axENiFIrSz5B7UuWkMT7PDe7CaO.jpg'),(40,'20','Zendaya','1996-09-01','American','https://image.tmdb.org/t/p/w500/3WdOloHpjtjL96uVOhFRRCcYSwq.jpg'),(41,'21','Oscar Isaac','1979-03-09','Guatemalan-American','https://image.tmdb.org/t/p/w500/dW5U5yrIIPmMjRThR9KT2xH6nTz.jpg'),(42,'22','Scarlett Johansson','1984-11-22','American','https://image.tmdb.org/t/p/w500/6bBCPmc55gzP7TR9Th4WbykrYd0.jpg');
/*!40000 ALTER TABLE `Actor` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Director`
--

DROP TABLE IF EXISTS `Director`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Director` (
  `NodeID` int NOT NULL,
  `DirectorID` varchar(50) NOT NULL,
  `Name` varchar(255) NOT NULL,
  `DateOfBirth` date DEFAULT NULL,
  `Nationality` varchar(100) DEFAULT NULL,
  `Awards` varchar(255) DEFAULT NULL,
  `PhotoURL` varchar(500) DEFAULT NULL,
  PRIMARY KEY (`NodeID`),
  UNIQUE KEY `DirectorID` (`DirectorID`),
  CONSTRAINT `Director_ibfk_1` FOREIGN KEY (`NodeID`) REFERENCES `Nodes` (`NodeID`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Director`
--

LOCK TABLES `Director` WRITE;
/*!40000 ALTER TABLE `Director` DISABLE KEYS */;
INSERT INTO `Director` VALUES (11,'dir001','Christopher Nolan','1970-07-30','British-American','Academy Award for Best Director','https://image.tmdb.org/t/p/w500/xuAIuYSmsUzKlUMBFGVZaWsY3DZ.jpg'),(12,'dir002','Martin Scorsese','1942-11-17','American','Academy Award for Best Director','https://image.tmdb.org/t/p/w500/9U9Y5GQuWX3EZy39B8nkk4NY01S.jpg'),(13,'dir003','Quentin Tarantino','1963-03-27','American','Academy Award for Best Original Screenplay','https://image.tmdb.org/t/p/w500/1gjcpAa99FAOWGnrUvHEXXsRs7o.jpg'),(14,'dir004','Denis Villeneuve','1967-10-03','Canadian','Canadian Screen Award','https://image.tmdb.org/t/p/w500/zdDx9Xs93UIrJFWYApYR28J8M6b.jpg'),(15,'dir005','Greta Gerwig','1983-08-04','American','Golden Globe Nomination for Best Director','https://image.tmdb.org/t/p/w500/3H0xzU12GTNJyQTpGysEuI9KyiQ.jpg'),(43,'6','David Fincher','1962-08-28','American','BAFTA Award for Best Direction','https://image.tmdb.org/t/p/w500/tpEczFclQZeKAiCeKZZ0adRvtfz.jpg'),(44,'7','Ridley Scott','1937-11-30','British','Academy Award Nomination for Best Director','https://image.tmdb.org/t/p/w500/97SO7H0UlS3racqjeW5JTy8c6GM.jpg'),(45,'8','Darren Aronofsky','1969-02-12','American','Cannes Film Festival Grand Jury Prize','https://image.tmdb.org/t/p/w500/tOjz8mVI2HeQBvU6KNjIExMBsXL.jpg'),(46,'9','Alfonso CuarÃ³n','1961-11-28','Mexican','Academy Award for Best Director','https://image.tmdb.org/t/p/w500/gaHhrzPfxfc3cbQLkDt54gtP3n1.jpg'),(47,'10','Damien Chazelle','1985-01-19','American','Academy Award for Best Director','https://image.tmdb.org/t/p/w500/14kRZ3XxNMyBv717YQSXr3wCucy.jpg');
/*!40000 ALTER TABLE `Director` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Edges`
--

DROP TABLE IF EXISTS `Edges`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Edges` (
  `EdgeID` int NOT NULL AUTO_INCREMENT,
  `SourceNodeID` int NOT NULL,
  `TargetNodeID` int NOT NULL,
  `EdgeType` enum('ACTED_IN','DIRECTED') NOT NULL,
  `Metadata` json DEFAULT NULL,
  `CreatedAt` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`EdgeID`),
  KEY `SourceNodeID` (`SourceNodeID`),
  KEY `TargetNodeID` (`TargetNodeID`),
  CONSTRAINT `Edges_ibfk_1` FOREIGN KEY (`SourceNodeID`) REFERENCES `Nodes` (`NodeID`) ON DELETE CASCADE,
  CONSTRAINT `Edges_ibfk_2` FOREIGN KEY (`TargetNodeID`) REFERENCES `Nodes` (`NodeID`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=83 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Edges`
--

LOCK TABLES `Edges` WRITE;
/*!40000 ALTER TABLE `Edges` DISABLE KEYS */;
INSERT INTO `Edges` VALUES (1,1,16,'ACTED_IN','{\"role\": \"Cobb\", \"star\": true}','2026-03-26 16:23:09'),(2,2,16,'ACTED_IN','{\"role\": \"Eames\", \"star\": false}','2026-03-26 16:23:09'),(3,3,16,'ACTED_IN','{\"role\": \"Arthur\", \"star\": false}','2026-03-26 16:23:09'),(4,4,16,'ACTED_IN','{\"role\": \"Ariadne\", \"star\": false}','2026-03-26 16:23:09'),(5,10,16,'ACTED_IN','{\"role\": \"Robert Fischer\", \"star\": false}','2026-03-26 16:23:09'),(6,6,17,'ACTED_IN','{\"role\": \"Bruce Wayne\", \"star\": true}','2026-03-26 16:23:09'),(7,7,17,'ACTED_IN','{\"role\": \"Joker\", \"star\": true}','2026-03-26 16:23:09'),(8,5,18,'ACTED_IN','{\"role\": \"Dr. Mann\", \"star\": false}','2026-03-26 16:23:09'),(9,1,19,'ACTED_IN','{\"role\": \"Billy Costigan\", \"star\": true}','2026-03-26 16:23:09'),(10,5,19,'ACTED_IN','{\"role\": \"Colin Sullivan\", \"star\": true}','2026-03-26 16:23:09'),(11,1,20,'ACTED_IN','{\"role\": \"Jordan Belfort\", \"star\": true}','2026-03-26 16:23:09'),(12,8,20,'ACTED_IN','{\"role\": \"Naomi Lapaglia\", \"star\": false}','2026-03-26 16:23:09'),(13,1,21,'ACTED_IN','{\"role\": \"Hugh Glass\", \"star\": true}','2026-03-26 16:23:09'),(14,2,21,'ACTED_IN','{\"role\": \"John Fitzgerald\", \"star\": false}','2026-03-26 16:23:09'),(15,9,22,'ACTED_IN','{\"role\": \"Lt. Aldo Raine\", \"star\": true}','2026-03-26 16:23:09'),(16,1,23,'ACTED_IN','{\"role\": \"Rick Dalton\", \"star\": true}','2026-03-26 16:23:09'),(17,9,23,'ACTED_IN','{\"role\": \"Cliff Booth\", \"star\": true}','2026-03-26 16:23:09'),(18,8,23,'ACTED_IN','{\"role\": \"Sharon Tate\", \"star\": false}','2026-03-26 16:23:09'),(19,1,24,'ACTED_IN','{\"role\": \"Calvin Candie\", \"star\": false}','2026-03-26 16:23:10'),(20,2,25,'ACTED_IN','{\"role\": \"Farrier\", \"star\": true}','2026-03-26 16:23:10'),(21,10,25,'ACTED_IN','{\"role\": \"Shivering Soldier\", \"star\": false}','2026-03-26 16:23:10'),(22,10,26,'ACTED_IN','{\"role\": \"J. Robert Oppenheimer\", \"star\": true}','2026-03-26 16:23:10'),(23,5,26,'ACTED_IN','{\"role\": \"Leslie Groves\", \"star\": false}','2026-03-26 16:23:10'),(24,6,27,'ACTED_IN','{\"role\": \"Bruce Wayne\", \"star\": true}','2026-03-26 16:23:10'),(25,2,27,'ACTED_IN','{\"role\": \"Bane\", \"star\": false}','2026-03-26 16:23:10'),(26,8,28,'ACTED_IN','{\"role\": \"Barbie\", \"star\": true}','2026-03-26 16:23:10'),(27,1,29,'ACTED_IN','{\"role\": \"Teddy Daniels\", \"star\": true}','2026-03-26 16:23:10'),(28,11,16,'DIRECTED','{}','2026-03-26 16:23:10'),(29,11,17,'DIRECTED','{}','2026-03-26 16:23:10'),(30,11,18,'DIRECTED','{}','2026-03-26 16:23:10'),(31,11,25,'DIRECTED','{}','2026-03-26 16:23:10'),(32,11,26,'DIRECTED','{}','2026-03-26 16:23:10'),(33,11,27,'DIRECTED','{}','2026-03-26 16:23:10'),(34,12,19,'DIRECTED','{}','2026-03-26 16:23:10'),(35,12,20,'DIRECTED','{}','2026-03-26 16:23:10'),(36,12,29,'DIRECTED','{}','2026-03-26 16:23:10'),(37,13,22,'DIRECTED','{}','2026-03-26 16:23:10'),(38,13,23,'DIRECTED','{}','2026-03-26 16:23:10'),(39,13,24,'DIRECTED','{}','2026-03-26 16:23:10'),(40,14,30,'DIRECTED','{}','2026-03-26 16:23:10'),(41,15,28,'DIRECTED','{}','2026-03-26 16:23:10'),(42,9,48,'ACTED_IN','{\"role\": \"Tyler Durden\", \"star\": true}','2026-04-16 01:17:58'),(43,9,49,'ACTED_IN','{\"role\": \"Detective Mills\", \"star\": true}','2026-04-16 01:17:58'),(44,35,49,'ACTED_IN','{\"role\": \"Detective Somerset\", \"star\": true}','2026-04-16 01:17:58'),(45,5,51,'ACTED_IN','{\"role\": \"Mark Watney\", \"star\": true}','2026-04-16 01:17:58'),(46,33,52,'ACTED_IN','{\"role\": \"Commodus\", \"star\": false}','2026-04-16 01:17:58'),(47,34,53,'ACTED_IN','{\"role\": \"Nina Sayers\", \"star\": true}','2026-04-16 01:17:58'),(48,31,57,'ACTED_IN','{\"role\": \"Sebastian\", \"star\": true}','2026-04-16 01:17:58'),(49,32,57,'ACTED_IN','{\"role\": \"Mia\", \"star\": true}','2026-04-16 01:17:58'),(50,37,59,'ACTED_IN','{\"role\": \"Jimmy Conway\", \"star\": true}','2026-04-16 01:17:58'),(51,38,60,'ACTED_IN','{\"role\": \"Dr. Louise Banks\", \"star\": true}','2026-04-16 01:17:58'),(52,31,61,'ACTED_IN','{\"role\": \"K\", \"star\": true}','2026-04-16 01:17:58'),(53,39,62,'ACTED_IN','{\"role\": \"Paul Atreides\", \"star\": true}','2026-04-16 01:17:58'),(54,40,62,'ACTED_IN','{\"role\": \"Chani\", \"star\": true}','2026-04-16 01:17:58'),(55,41,62,'ACTED_IN','{\"role\": \"Duke Leto Atreides\", \"star\": false}','2026-04-16 01:17:58'),(56,6,64,'ACTED_IN','{\"role\": \"Bruce Wayne\", \"star\": true}','2026-04-16 01:17:58'),(57,6,65,'ACTED_IN','{\"role\": \"Alfred Borden\", \"star\": true}','2026-04-16 01:17:58'),(58,42,65,'ACTED_IN','{\"role\": \"Olivia Wenscombe\", \"star\": false}','2026-04-16 01:17:58'),(59,36,18,'ACTED_IN','{\"role\": \"Amelia Brand\", \"star\": false}','2026-04-16 01:17:58'),(60,36,27,'ACTED_IN','{\"role\": \"Selina Kyle\", \"star\": false}','2026-04-16 01:17:58'),(61,39,30,'ACTED_IN','{\"role\": \"Paul Atreides\", \"star\": true}','2026-04-16 01:17:58'),(62,40,30,'ACTED_IN','{\"role\": \"Chani\", \"star\": false}','2026-04-16 01:17:58'),(63,41,30,'ACTED_IN','{\"role\": \"Duke Leto Atreides\", \"star\": false}','2026-04-16 01:17:58'),(64,38,26,'ACTED_IN','{\"role\": \"Katherine Oppenheimer\", \"star\": false}','2026-04-16 01:17:58'),(65,43,48,'DIRECTED','{}','2026-04-16 01:17:58'),(66,43,49,'DIRECTED','{}','2026-04-16 01:17:58'),(67,43,50,'DIRECTED','{}','2026-04-16 01:17:58'),(68,44,51,'DIRECTED','{}','2026-04-16 01:17:58'),(69,44,52,'DIRECTED','{}','2026-04-16 01:17:58'),(70,45,53,'DIRECTED','{}','2026-04-16 01:17:58'),(71,45,54,'DIRECTED','{}','2026-04-16 01:17:58'),(72,46,55,'DIRECTED','{}','2026-04-16 01:17:58'),(73,46,56,'DIRECTED','{}','2026-04-16 01:17:58'),(74,47,57,'DIRECTED','{}','2026-04-16 01:17:58'),(75,47,58,'DIRECTED','{}','2026-04-16 01:17:58'),(76,12,59,'DIRECTED','{}','2026-04-16 01:17:58'),(77,14,60,'DIRECTED','{}','2026-04-16 01:17:58'),(78,14,61,'DIRECTED','{}','2026-04-16 01:17:58'),(79,14,62,'DIRECTED','{}','2026-04-16 01:17:58'),(80,11,63,'DIRECTED','{}','2026-04-16 01:17:58'),(81,11,64,'DIRECTED','{}','2026-04-16 01:17:58'),(82,11,65,'DIRECTED','{}','2026-04-16 01:17:58');
/*!40000 ALTER TABLE `Edges` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `GraphEdges`
--

DROP TABLE IF EXISTS `GraphEdges`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `GraphEdges` (
  `GraphID` int NOT NULL,
  `EdgeID` int NOT NULL,
  PRIMARY KEY (`GraphID`,`EdgeID`),
  KEY `EdgeID` (`EdgeID`),
  CONSTRAINT `GraphEdges_ibfk_1` FOREIGN KEY (`GraphID`) REFERENCES `Graphs` (`GraphID`) ON DELETE CASCADE,
  CONSTRAINT `GraphEdges_ibfk_2` FOREIGN KEY (`EdgeID`) REFERENCES `Edges` (`EdgeID`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `GraphEdges`
--

LOCK TABLES `GraphEdges` WRITE;
/*!40000 ALTER TABLE `GraphEdges` DISABLE KEYS */;
/*!40000 ALTER TABLE `GraphEdges` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `GraphNodes`
--

DROP TABLE IF EXISTS `GraphNodes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `GraphNodes` (
  `GraphID` int NOT NULL,
  `NodeID` int NOT NULL,
  PRIMARY KEY (`GraphID`,`NodeID`),
  KEY `NodeID` (`NodeID`),
  CONSTRAINT `GraphNodes_ibfk_1` FOREIGN KEY (`GraphID`) REFERENCES `Graphs` (`GraphID`) ON DELETE CASCADE,
  CONSTRAINT `GraphNodes_ibfk_2` FOREIGN KEY (`NodeID`) REFERENCES `Nodes` (`NodeID`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `GraphNodes`
--

LOCK TABLES `GraphNodes` WRITE;
/*!40000 ALTER TABLE `GraphNodes` DISABLE KEYS */;
/*!40000 ALTER TABLE `GraphNodes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Graphs`
--

DROP TABLE IF EXISTS `Graphs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Graphs` (
  `GraphID` int NOT NULL AUTO_INCREMENT,
  `Name` varchar(255) NOT NULL,
  `Description` varchar(500) DEFAULT NULL,
  `CreatedAt` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`GraphID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Graphs`
--

LOCK TABLES `Graphs` WRITE;
/*!40000 ALTER TABLE `Graphs` DISABLE KEYS */;
/*!40000 ALTER TABLE `Graphs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Movie`
--

DROP TABLE IF EXISTS `Movie`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Movie` (
  `NodeID` int NOT NULL,
  `MovieID` varchar(50) NOT NULL,
  `Title` varchar(255) NOT NULL,
  `Rating` varchar(10) DEFAULT NULL,
  `ReleaseDate` date DEFAULT NULL,
  `Genre` varchar(100) DEFAULT NULL,
  `Runtime` int DEFAULT NULL,
  `PosterURL` varchar(500) DEFAULT NULL,
  PRIMARY KEY (`NodeID`),
  UNIQUE KEY `MovieID` (`MovieID`),
  CONSTRAINT `Movie_ibfk_1` FOREIGN KEY (`NodeID`) REFERENCES `Nodes` (`NodeID`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Movie`
--

LOCK TABLES `Movie` WRITE;
/*!40000 ALTER TABLE `Movie` DISABLE KEYS */;
INSERT INTO `Movie` VALUES (16,'mov001','Inception','8.8','2010-07-16','Sci-Fi',148,'https://image.tmdb.org/t/p/w500/xlaY2zyzMfkhk0HSC5VUwzoZPU1.jpg'),(17,'mov002','The Dark Knight','9.0','2008-07-18','Action',152,'https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg'),(18,'mov003','Interstellar','8.7','2014-11-07','Sci-Fi',169,'https://image.tmdb.org/t/p/w500/yQvGrMoipbRoddT0ZR8tPoR7NfX.jpg'),(19,'mov004','The Departed','8.5','2006-10-06','Crime',151,'https://image.tmdb.org/t/p/w500/nT97ifVT2J1yMQmeq20Qblg61T.jpg'),(20,'mov005','The Wolf of Wall Street','8.2','2013-12-25','Comedy',180,'https://image.tmdb.org/t/p/w500/kW9LmvYHAaS9iA0tHmZVq8hQYoq.jpg'),(21,'mov006','The Revenant','8.0','2015-12-25','Adventure',156,'https://image.tmdb.org/t/p/w500/ji3ecJphATlVgWNY0B0RVXZizdf.jpg'),(22,'mov007','Inglourious Basterds','8.3','2009-08-21','War',153,'https://image.tmdb.org/t/p/w500/7sfbEnaARXDDhKm0CZ7D7uc2sbo.jpg'),(23,'mov008','Once Upon a Time in Hollywood','7.6','2019-07-26','Comedy',161,'https://image.tmdb.org/t/p/w500/8j58iEBw9pOXFD2L0nt0ZXeHviB.jpg'),(24,'mov009','Django Unchained','8.4','2012-12-25','Western',165,'https://image.tmdb.org/t/p/w500/7oWY8VDWW7thTzWh3OKYRkWUlD5.jpg'),(25,'mov010','Dunkirk','7.8','2017-07-21','War',106,'https://image.tmdb.org/t/p/w500/b4Oe15CGLL61Ped0RAS9JpqdmCt.jpg'),(26,'mov011','Oppenheimer','8.5','2023-07-21','Drama',180,'https://image.tmdb.org/t/p/w500/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg'),(27,'mov012','The Dark Knight Rises','8.4','2012-07-20','Action',164,'https://image.tmdb.org/t/p/w500/hr0L2aueqlP2BYUblTTjmtn0hw4.jpg'),(28,'mov013','Barbie','6.8','2023-07-21','Comedy',114,'https://image.tmdb.org/t/p/w500/iuFNMS8U5cb6xfzi51Dbkovj7vM.jpg'),(29,'mov014','Shutter Island','8.2','2010-02-19','Thriller',138,'https://image.tmdb.org/t/p/w500/nrmXQ0zcZUL8jFLrakWc90IR8z9.jpg'),(30,'mov015','Dune','8.0','2021-10-22','Sci-Fi',155,'https://image.tmdb.org/t/p/w500/gDzOcq0pfeCeqMBwKIJlSmQpjkZ.jpg'),(48,'16','Fight Club','8.8','1999-10-15','Drama',139,'https://image.tmdb.org/t/p/w500/jSziioSwPVrOy9Yow3XhWIBDjq1.jpg'),(49,'17','Se7en','8.6','1995-09-22','Thriller',127,'https://image.tmdb.org/t/p/w500/191nKfP0ehp3uIvWqgPbFmI4lv9.jpg'),(50,'18','The Social Network','7.7','2010-10-01','Drama',120,'https://image.tmdb.org/t/p/w500/n0ybibhJtQ5icDqTp8eRytcIHJx.jpg'),(51,'19','The Martian','8.0','2015-10-02','Sci-Fi',144,'https://image.tmdb.org/t/p/w500/fASz8A0yFE3QB6LgGoOfwvFSseV.jpg'),(52,'20','Gladiator','8.5','2000-05-05','Action',155,'https://image.tmdb.org/t/p/w500/wN2xWp1eIwCKOD0BHTcErTBv1Uq.jpg'),(53,'21','Black Swan','8.0','2010-12-03','Thriller',108,'https://image.tmdb.org/t/p/w500/viWheBd44bouiLCHgNMvahLThqx.jpg'),(54,'22','Requiem for a Dream','8.3','2000-10-06','Drama',102,'https://image.tmdb.org/t/p/w500/nOd6vjEmzCT0k4VYqsA2hwyi87C.jpg'),(55,'23','Gravity','7.7','2013-10-04','Sci-Fi',91,'https://image.tmdb.org/t/p/w500/kZ2nZw8D681aphje8NJi8EfbL1U.jpg'),(56,'24','Children of Men','7.9','2006-09-22','Sci-Fi',109,'https://image.tmdb.org/t/p/w500/lQcXgb0fFzffnLV5WY0Q0X2WW7E.jpg'),(57,'25','La La Land','8.0','2016-12-09','Drama',128,'https://image.tmdb.org/t/p/w500/uDO8zWDhfWwoFdKS4fzkUJt0Rf0.jpg'),(58,'26','Whiplash','8.5','2014-10-10','Drama',107,'https://image.tmdb.org/t/p/w500/7fn624j5lj3xTme2SgiLCeuedmO.jpg'),(59,'27','Goodfellas','8.7','1990-09-19','Crime',146,'https://image.tmdb.org/t/p/w500/9OkCLM73MIU2CrKZbqiT8Ln1wY2.jpg'),(60,'28','Arrival','7.9','2016-11-11','Sci-Fi',116,'https://image.tmdb.org/t/p/w500/pEzNVQfdzYDzVK0XqxERIw2x2se.jpg'),(61,'29','Blade Runner 2049','8.0','2017-10-06','Sci-Fi',164,'https://image.tmdb.org/t/p/w500/gajva2L0rPYkEWjzgFlBXCAVBE5.jpg'),(62,'30','Dune: Part Two','8.5','2024-03-01','Sci-Fi',167,'https://image.tmdb.org/t/p/w500/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg'),(63,'31','Memento','8.4','2000-10-11','Thriller',113,'https://image.tmdb.org/t/p/w500/fKTPH2WvH8nHTXeBYBVhawtRqtR.jpg'),(64,'32','Batman Begins','8.2','2005-06-15','Action',140,'https://image.tmdb.org/t/p/w500/sPX89Td70IDDjVr85jdSBb4rWGr.jpg'),(65,'33','The Prestige','8.5','2006-10-20','Thriller',130,'https://image.tmdb.org/t/p/w500/Ag2B2KHKQPukjH7WutmgnnSNurZ.jpg');
/*!40000 ALTER TABLE `Movie` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Nodes`
--

DROP TABLE IF EXISTS `Nodes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Nodes` (
  `NodeID` int NOT NULL AUTO_INCREMENT,
  `NodeType` enum('Movie','Actor','Director') NOT NULL,
  `CreatedAt` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`NodeID`)
) ENGINE=InnoDB AUTO_INCREMENT=66 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Nodes`
--

LOCK TABLES `Nodes` WRITE;
/*!40000 ALTER TABLE `Nodes` DISABLE KEYS */;
INSERT INTO `Nodes` VALUES (1,'Actor','2026-03-26 16:23:09'),(2,'Actor','2026-03-26 16:23:09'),(3,'Actor','2026-03-26 16:23:09'),(4,'Actor','2026-03-26 16:23:09'),(5,'Actor','2026-03-26 16:23:09'),(6,'Actor','2026-03-26 16:23:09'),(7,'Actor','2026-03-26 16:23:09'),(8,'Actor','2026-03-26 16:23:09'),(9,'Actor','2026-03-26 16:23:09'),(10,'Actor','2026-03-26 16:23:09'),(11,'Director','2026-03-26 16:23:09'),(12,'Director','2026-03-26 16:23:09'),(13,'Director','2026-03-26 16:23:09'),(14,'Director','2026-03-26 16:23:09'),(15,'Director','2026-03-26 16:23:09'),(16,'Movie','2026-03-26 16:23:09'),(17,'Movie','2026-03-26 16:23:09'),(18,'Movie','2026-03-26 16:23:09'),(19,'Movie','2026-03-26 16:23:09'),(20,'Movie','2026-03-26 16:23:09'),(21,'Movie','2026-03-26 16:23:09'),(22,'Movie','2026-03-26 16:23:09'),(23,'Movie','2026-03-26 16:23:09'),(24,'Movie','2026-03-26 16:23:09'),(25,'Movie','2026-03-26 16:23:09'),(26,'Movie','2026-03-26 16:23:09'),(27,'Movie','2026-03-26 16:23:09'),(28,'Movie','2026-03-26 16:23:09'),(29,'Movie','2026-03-26 16:23:09'),(30,'Movie','2026-03-26 16:23:09'),(31,'Actor','2026-04-16 01:17:58'),(32,'Actor','2026-04-16 01:17:58'),(33,'Actor','2026-04-16 01:17:58'),(34,'Actor','2026-04-16 01:17:58'),(35,'Actor','2026-04-16 01:17:58'),(36,'Actor','2026-04-16 01:17:58'),(37,'Actor','2026-04-16 01:17:58'),(38,'Actor','2026-04-16 01:17:58'),(39,'Actor','2026-04-16 01:17:58'),(40,'Actor','2026-04-16 01:17:58'),(41,'Actor','2026-04-16 01:17:58'),(42,'Actor','2026-04-16 01:17:58'),(43,'Director','2026-04-16 01:17:58'),(44,'Director','2026-04-16 01:17:58'),(45,'Director','2026-04-16 01:17:58'),(46,'Director','2026-04-16 01:17:58'),(47,'Director','2026-04-16 01:17:58'),(48,'Movie','2026-04-16 01:17:58'),(49,'Movie','2026-04-16 01:17:58'),(50,'Movie','2026-04-16 01:17:58'),(51,'Movie','2026-04-16 01:17:58'),(52,'Movie','2026-04-16 01:17:58'),(53,'Movie','2026-04-16 01:17:58'),(54,'Movie','2026-04-16 01:17:58'),(55,'Movie','2026-04-16 01:17:58'),(56,'Movie','2026-04-16 01:17:58'),(57,'Movie','2026-04-16 01:17:58'),(58,'Movie','2026-04-16 01:17:58'),(59,'Movie','2026-04-16 01:17:58'),(60,'Movie','2026-04-16 01:17:58'),(61,'Movie','2026-04-16 01:17:58'),(62,'Movie','2026-04-16 01:17:58'),(63,'Movie','2026-04-16 01:17:58'),(64,'Movie','2026-04-16 01:17:58'),(65,'Movie','2026-04-16 01:17:58');
/*!40000 ALTER TABLE `Nodes` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-04-23 19:06:15
