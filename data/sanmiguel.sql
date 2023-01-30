-- MySQL dump 10.13  Distrib 8.0.32, for Linux (x86_64)
--
-- Host: localhost    Database: sanmiguel
-- ------------------------------------------------------
-- Server version	8.0.32-0buntu0.22.04.1

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
-- Table structure for table `bookings`
--

DROP TABLE IF EXISTS `bookings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `bookings` (
  `bookingID` int unsigned NOT NULL AUTO_INCREMENT,
  `bookID` int unsigned NOT NULL,
  `partnerDni` varchar(45) NOT NULL,
  `reserveDate` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `delivered` tinyint unsigned DEFAULT '0',
  `cancelReserved` tinyint unsigned DEFAULT '0',
  `cancelReason` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`bookingID`),
  KEY `book_id` (`bookID`),
  KEY `dni_partner` (`partnerDni`),
  CONSTRAINT `bookings_ibfk_1` FOREIGN KEY (`bookID`) REFERENCES `books` (`bookID`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `bookings_ibfk_2` FOREIGN KEY (`partnerDni`) REFERENCES `partners` (`dni`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `bookings`
--

LOCK TABLES `bookings` WRITE;
/*!40000 ALTER TABLE `bookings` DISABLE KEYS */;
/*!40000 ALTER TABLE `bookings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `books`
--

DROP TABLE IF EXISTS `books`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `books` (
  `bookID` int unsigned NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `author` varchar(255) NOT NULL DEFAULT 'Unknown',
  `editorial` varchar(255) DEFAULT NULL,
  `isbn` varchar(255) DEFAULT 'not ISBN',
  `type` varchar(255) DEFAULT NULL,
  `language` varchar(255) DEFAULT NULL,
  `collection` varchar(255) DEFAULT NULL,
  `purchase_date` datetime DEFAULT NULL,
  `observation` varchar(800) DEFAULT NULL,
  `reserved` tinyint(1) DEFAULT '0',
  `lastUpdate` datetime DEFAULT NULL,
  PRIMARY KEY (`bookID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `books`
--

LOCK TABLES `books` WRITE;
/*!40000 ALTER TABLE `books` DISABLE KEYS */;
/*!40000 ALTER TABLE `books` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `coverBooks`
--

DROP TABLE IF EXISTS `coverBooks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `coverBooks` (
  `coverID` int unsigned NOT NULL AUTO_INCREMENT,
  `bookID` int unsigned NOT NULL,
  `nameCover` varchar(255) NOT NULL,
  PRIMARY KEY (`coverID`),
  KEY `FK_bookID_1_idx` (`bookID`),
  CONSTRAINT `FK_bookID_1` FOREIGN KEY (`bookID`) REFERENCES `books` (`bookID`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `coverBooks`
--

LOCK TABLES `coverBooks` WRITE;
/*!40000 ALTER TABLE `coverBooks` DISABLE KEYS */;
/*!40000 ALTER TABLE `coverBooks` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `familys`
--

DROP TABLE IF EXISTS `familys`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `familys` (
  `familyID` int unsigned NOT NULL AUTO_INCREMENT,
  `familyDni` varchar(45) NOT NULL,
  `partnerID` int unsigned NOT NULL,
  `partnerDni` varchar(45) NOT NULL,
  PRIMARY KEY (`familyID`),
  UNIQUE KEY `id_UNIQUE` (`familyID`),
  KEY `partnet_frk_1_idx` (`partnerDni`),
  CONSTRAINT `partnet_frk_1` FOREIGN KEY (`partnerDni`) REFERENCES `partners` (`dni`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `familys`
--

LOCK TABLES `familys` WRITE;
/*!40000 ALTER TABLE `familys` DISABLE KEYS */;
/*!40000 ALTER TABLE `familys` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `partners`
--

DROP TABLE IF EXISTS `partners`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `partners` (
  `partnerID` int unsigned NOT NULL AUTO_INCREMENT,
  `dni` varchar(45) NOT NULL,
  `scanner` varchar(255) DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `lastname` varchar(255) NOT NULL,
  `direction` varchar(255) DEFAULT NULL,
  `population` varchar(255) DEFAULT NULL,
  `phone1` bigint DEFAULT '0',
  `phone2` bigint DEFAULT '0',
  `email` varchar(255) DEFAULT NULL,
  `date` datetime DEFAULT CURRENT_TIMESTAMP,
  `updateDate` datetime DEFAULT CURRENT_TIMESTAMP,
  `activeFamily` tinyint unsigned DEFAULT '0',
  PRIMARY KEY (`partnerID`),
  UNIQUE KEY `id_partner_UNIQUE` (`partnerID`),
  UNIQUE KEY `dni_UNIQUE` (`dni`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `partners`
--

LOCK TABLES `partners` WRITE;
/*!40000 ALTER TABLE `partners` DISABLE KEYS */;
/*!40000 ALTER TABLE `partners` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sessions`
--

DROP TABLE IF EXISTS `sessions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sessions` (
  `session_id` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `expires` int unsigned NOT NULL,
  `data` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin,
  PRIMARY KEY (`session_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sessions`
--

LOCK TABLES `sessions` WRITE;
/*!40000 ALTER TABLE `sessions` DISABLE KEYS */;
/*!40000 ALTER TABLE `sessions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `email` varchar(255) NOT NULL,
  `username` varchar(100) NOT NULL,
  `fullname` varchar(100) NOT NULL,
  `rol` varchar(45) NOT NULL,
  `pass` varchar(255) NOT NULL,
  `_ss` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'admin@mail.com','ADMIN','Administrator','admin','$2a$08$eXn12bZRZNsRJJFilDN3eOD0lPK0kBYYaR79ws2PU4nMJNSApk2RO',0);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `votes`
--

DROP TABLE IF EXISTS `votes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `votes` (
  `id_vote` int unsigned NOT NULL AUTO_INCREMENT,
  `bookID` int unsigned NOT NULL,
  `bookingID` int unsigned NOT NULL,
  `score` tinyint unsigned NOT NULL DEFAULT '0',
  `review` varchar(400) DEFAULT 'No comment',
  `deliver_date_review` datetime DEFAULT NULL,
  `fullnamePartner` varchar(45) NOT NULL DEFAULT 'Unknown',
  `reviewOn` tinyint DEFAULT '0',
  PRIMARY KEY (`id_vote`),
  UNIQUE KEY `id_booking` (`bookingID`),
  KEY `book_id` (`bookID`),
  KEY `partner_dni` (`bookingID`),
  CONSTRAINT `vote_ibfk_1` FOREIGN KEY (`bookID`) REFERENCES `books` (`bookID`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `votes`
--

LOCK TABLES `votes` WRITE;
/*!40000 ALTER TABLE `votes` DISABLE KEYS */;
/*!40000 ALTER TABLE `votes` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2023-01-28  2:38:39
