-- MySQL dump 10.13  Distrib 8.0.30, for Linux (x86_64)
--
-- Host: localhost    Database: sanmiguel
-- ------------------------------------------------------
-- Server version	8.0.30-0ubuntu0.22.04.1

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

CREATE DATABASE sanmiguel CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

--
-- Table structure for table `bookings`
--

CREATE TABLE `bookings` (
  `id_booking` int unsigned NOT NULL AUTO_INCREMENT,
  `book_id` int unsigned NOT NULL,
  `partner_dni` varchar(10) NOT NULL,
  `reservation_date` date NOT NULL,
  `deliver_date` date NOT NULL,
  PRIMARY KEY (`id_booking`),
  KEY `book_id` (`book_id`),
  KEY `dni_partner` (`partner_dni`),
  CONSTRAINT `bookings_ibfk_1` FOREIGN KEY (`book_id`) REFERENCES `books` (`id_book`),
  CONSTRAINT `bookings_ibfk_2` FOREIGN KEY (`partner_dni`) REFERENCES `partners` (`dni`)
) ENGINE=InnoDB AUTO_INCREMENT=1;
/*!40101 SET character_set_client = @saved_cs_client */;


--
-- Table structure for table `books`
--

CREATE TABLE `books` (
  `id_book` int unsigned NOT NULL AUTO_INCREMENT,
  `title` varchar(50) NOT NULL,
  `author` varchar(50) NOT NULL DEFAULT 'Unknown',
  `isbn` int DEFAULT NULL,
  `type` varchar(45) DEFAULT NULL,
  `language` varchar(25) DEFAULT NULL,
  `collection` varchar(50) DEFAULT NULL,
  `purchase_date` date DEFAULT NULL,
  `reserved` tinyint(1) DEFAULT '0',
  `comment` varchar(800) COLLATE utf8mb4_spanish_ci NULL  DEFAULT 'No comments',
  `num_votes` int unsigned not null default 0,
  `total_score` int unsigned not null default 0,
  `rating` decimal(8,2) not null default 0.00,
  PRIMARY KEY (`id_book`),
  UNIQUE KEY `title` (`title`)
) ENGINE=InnoDB AUTO_INCREMENT=1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `partners`
--

CREATE TABLE `partners` (
  `id_partner` int unsigned NOT NULL AUTO_INCREMENT,
  `dni` varchar(10) NOT NULL,
  `scanner` varchar(25) DEFAULT NULL,
  `name` varchar(45) NOT NULL,
  `lastname` varchar(45) NOT NULL,
  `direction` varchar(45) DEFAULT NULL,
  `phone` int NOT NULL,
  `email` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id_partner`),
  UNIQUE KEY `dni` (`dni`)
) ENGINE=InnoDB AUTO_INCREMENT=1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `email` varchar(255) NOT NULL,
  `firstname` varchar(100) NOT NULL,
  `lastname` varchar(100) NOT NULL,
  `rol` varchar(45) NOT NULL,
  `pass` varchar(255) NOT NULL,
  `_ss` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `votes`
--

CREATE TABLE `votes` (
    `id_vote` int unsigned not null AUTO_INCREMENT,
    `book_id` int unsigned NOT NULL,
    `partner_dni` varchar(10) NOT NULL,
    `score` tinyint(1) unsigned not null default 0,
    `review` varchar(4000) null,
    primary key (id_vote),
    KEY `book_id` (`book_id`),
    KEY `partner_dni` (`partner_dni`),
    CONSTRAINT `vote_ibfk_1` FOREIGN KEY (`book_id`) REFERENCES `books` (`id_book`),
  CONSTRAINT `vote_ibfk_2` FOREIGN KEY (`partner_dni`) REFERENCES `partners` (`dni`)
) ENGINE=InnoDB AUTO_INCREMENT=1;

-- Dump completed on 2022-09-14 16:45:53
