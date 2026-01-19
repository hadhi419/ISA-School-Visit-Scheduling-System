-- MariaDB dump 10.19  Distrib 10.4.32-MariaDB, for Win64 (AMD64)
--
-- Host: localhost    Database: isa_school_visit_management
-- ------------------------------------------------------
-- Server version	10.4.32-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `approval_logs`
--

DROP TABLE IF EXISTS `approval_logs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `approval_logs` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `visit_id` int(11) NOT NULL,
  `approved_by` int(11) NOT NULL,
  `role` enum('ADE','DDE','ZDE') NOT NULL,
  `status` enum('APPROVED','REJECTED') NOT NULL,
  `comment` text DEFAULT NULL,
  `approved_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `visit_id` (`visit_id`),
  KEY `approved_by` (`approved_by`),
  CONSTRAINT `approval_logs_ibfk_1` FOREIGN KEY (`visit_id`) REFERENCES `visits` (`id`),
  CONSTRAINT `approval_logs_ibfk_2` FOREIGN KEY (`approved_by`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1602 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `approval_logs`
--

LOCK TABLES `approval_logs` WRITE;
/*!40000 ALTER TABLE `approval_logs` DISABLE KEYS */;
INSERT INTO `approval_logs` VALUES (1387,1455,9,'ADE','REJECTED','Change school from omanthi to Aisha school on 11th','2026-01-19 16:57:10'),(1388,1456,9,'ADE','REJECTED','Change school from omanthi to Aisha school on 11th','2026-01-19 16:57:10'),(1389,1457,9,'ADE','REJECTED','Change school from omanthi to Aisha school on 11th','2026-01-19 16:57:10'),(1390,1458,9,'ADE','REJECTED','Change school from omanthi to Aisha school on 11th','2026-01-19 16:57:10'),(1391,1459,9,'ADE','REJECTED','Change school from omanthi to Aisha school on 11th','2026-01-19 16:57:10'),(1392,1460,9,'ADE','REJECTED','Change school from omanthi to Aisha school on 11th','2026-01-19 16:57:10'),(1393,1461,9,'ADE','REJECTED','Change school from omanthi to Aisha school on 11th','2026-01-19 16:57:10'),(1394,1462,9,'ADE','REJECTED','Change school from omanthi to Aisha school on 11th','2026-01-19 16:57:10'),(1395,1464,9,'ADE','REJECTED','Change school from omanthi to Aisha school on 11th','2026-01-19 16:57:10'),(1396,1465,9,'ADE','REJECTED','Change school from omanthi to Aisha school on 11th','2026-01-19 16:57:10'),(1397,1466,9,'ADE','REJECTED','Change school from omanthi to Aisha school on 11th','2026-01-19 16:57:10'),(1398,1467,9,'ADE','REJECTED','Change school from omanthi to Aisha school on 11th','2026-01-19 16:57:10'),(1399,1468,9,'ADE','REJECTED','Change school from omanthi to Aisha school on 11th','2026-01-19 16:57:10'),(1400,1469,9,'ADE','REJECTED','Change school from omanthi to Aisha school on 11th','2026-01-19 16:57:10'),(1401,1470,9,'ADE','REJECTED','Change school from omanthi to Aisha school on 11th','2026-01-19 16:57:10'),(1402,1471,9,'ADE','REJECTED','Change school from omanthi to Aisha school on 11th','2026-01-19 16:57:10'),(1403,1472,9,'ADE','REJECTED','Change school from omanthi to Aisha school on 11th','2026-01-19 16:57:10'),(1404,1474,9,'ADE','REJECTED','Change school from omanthi to Aisha school on 11th','2026-01-19 16:57:10'),(1405,1475,9,'ADE','REJECTED','Change school from omanthi to Aisha school on 11th','2026-01-19 16:57:10'),(1406,1476,9,'ADE','REJECTED','Change school from omanthi to Aisha school on 11th','2026-01-19 16:57:10'),(1407,1455,9,'ADE','APPROVED',NULL,'2026-01-19 16:58:21'),(1408,1456,9,'ADE','APPROVED',NULL,'2026-01-19 16:58:21'),(1409,1457,9,'ADE','APPROVED',NULL,'2026-01-19 16:58:21'),(1410,1458,9,'ADE','APPROVED',NULL,'2026-01-19 16:58:21'),(1411,1459,9,'ADE','APPROVED',NULL,'2026-01-19 16:58:21'),(1412,1460,9,'ADE','APPROVED',NULL,'2026-01-19 16:58:21'),(1413,1461,9,'ADE','APPROVED',NULL,'2026-01-19 16:58:21'),(1414,1462,9,'ADE','APPROVED',NULL,'2026-01-19 16:58:21'),(1415,1464,9,'ADE','APPROVED',NULL,'2026-01-19 16:58:21'),(1416,1465,9,'ADE','APPROVED',NULL,'2026-01-19 16:58:21'),(1417,1466,9,'ADE','APPROVED',NULL,'2026-01-19 16:58:21'),(1418,1467,9,'ADE','APPROVED',NULL,'2026-01-19 16:58:21'),(1419,1468,9,'ADE','APPROVED',NULL,'2026-01-19 16:58:21'),(1420,1469,9,'ADE','APPROVED',NULL,'2026-01-19 16:58:21'),(1421,1470,9,'ADE','APPROVED',NULL,'2026-01-19 16:58:21'),(1422,1471,9,'ADE','APPROVED',NULL,'2026-01-19 16:58:21'),(1423,1472,9,'ADE','APPROVED',NULL,'2026-01-19 16:58:21'),(1424,1474,9,'ADE','APPROVED',NULL,'2026-01-19 16:58:21'),(1425,1475,9,'ADE','APPROVED',NULL,'2026-01-19 16:58:21'),(1426,1476,9,'ADE','APPROVED',NULL,'2026-01-19 16:58:21'),(1438,1455,8,'DDE','REJECTED','Change school to Haadhi on 26th\n','2026-01-19 16:58:55'),(1439,1456,8,'DDE','REJECTED','Change school to Haadhi on 26th\n','2026-01-19 16:58:55'),(1440,1457,8,'DDE','REJECTED','Change school to Haadhi on 26th\n','2026-01-19 16:58:55'),(1441,1458,8,'DDE','REJECTED','Change school to Haadhi on 26th\n','2026-01-19 16:58:55'),(1442,1459,8,'DDE','REJECTED','Change school to Haadhi on 26th\n','2026-01-19 16:58:55'),(1443,1460,8,'DDE','REJECTED','Change school to Haadhi on 26th\n','2026-01-19 16:58:55'),(1444,1461,8,'DDE','REJECTED','Change school to Haadhi on 26th\n','2026-01-19 16:58:55'),(1445,1462,8,'DDE','REJECTED','Change school to Haadhi on 26th\n','2026-01-19 16:58:55'),(1446,1464,8,'DDE','REJECTED','Change school to Haadhi on 26th\n','2026-01-19 16:58:55'),(1447,1465,8,'DDE','REJECTED','Change school to Haadhi on 26th\n','2026-01-19 16:58:55'),(1448,1466,8,'DDE','REJECTED','Change school to Haadhi on 26th\n','2026-01-19 16:58:55'),(1449,1467,8,'DDE','REJECTED','Change school to Haadhi on 26th\n','2026-01-19 16:58:55'),(1450,1468,8,'DDE','REJECTED','Change school to Haadhi on 26th\n','2026-01-19 16:58:55'),(1451,1469,8,'DDE','REJECTED','Change school to Haadhi on 26th\n','2026-01-19 16:58:55'),(1452,1470,8,'DDE','REJECTED','Change school to Haadhi on 26th\n','2026-01-19 16:58:55'),(1453,1471,8,'DDE','REJECTED','Change school to Haadhi on 26th\n','2026-01-19 16:58:55'),(1454,1472,8,'DDE','REJECTED','Change school to Haadhi on 26th\n','2026-01-19 16:58:55'),(1455,1474,8,'DDE','REJECTED','Change school to Haadhi on 26th\n','2026-01-19 16:58:55'),(1456,1475,8,'DDE','REJECTED','Change school to Haadhi on 26th\n','2026-01-19 16:58:55'),(1457,1476,8,'DDE','REJECTED','Change school to Haadhi on 26th\n','2026-01-19 16:58:55'),(1458,1455,9,'ADE','APPROVED',NULL,'2026-01-19 17:03:38'),(1459,1456,9,'ADE','APPROVED',NULL,'2026-01-19 17:03:38'),(1460,1457,9,'ADE','APPROVED',NULL,'2026-01-19 17:03:38'),(1461,1458,9,'ADE','APPROVED',NULL,'2026-01-19 17:03:38'),(1462,1459,9,'ADE','APPROVED',NULL,'2026-01-19 17:03:38'),(1463,1460,9,'ADE','APPROVED',NULL,'2026-01-19 17:03:38'),(1464,1461,9,'ADE','APPROVED',NULL,'2026-01-19 17:03:38'),(1465,1462,9,'ADE','APPROVED',NULL,'2026-01-19 17:03:38'),(1466,1464,9,'ADE','APPROVED',NULL,'2026-01-19 17:03:38'),(1467,1465,9,'ADE','APPROVED',NULL,'2026-01-19 17:03:38'),(1468,1466,9,'ADE','APPROVED',NULL,'2026-01-19 17:03:38'),(1469,1467,9,'ADE','APPROVED',NULL,'2026-01-19 17:03:38'),(1470,1468,9,'ADE','APPROVED',NULL,'2026-01-19 17:03:38'),(1471,1469,9,'ADE','APPROVED',NULL,'2026-01-19 17:03:38'),(1472,1470,9,'ADE','APPROVED',NULL,'2026-01-19 17:03:38'),(1473,1471,9,'ADE','APPROVED',NULL,'2026-01-19 17:03:38'),(1474,1472,9,'ADE','APPROVED',NULL,'2026-01-19 17:03:38'),(1475,1474,9,'ADE','APPROVED',NULL,'2026-01-19 17:03:38'),(1476,1475,9,'ADE','APPROVED',NULL,'2026-01-19 17:03:38'),(1477,1476,9,'ADE','APPROVED',NULL,'2026-01-19 17:03:38'),(1489,1455,9,'ADE','APPROVED',NULL,'2026-01-19 17:07:41'),(1490,1456,9,'ADE','APPROVED',NULL,'2026-01-19 17:07:41'),(1491,1457,9,'ADE','APPROVED',NULL,'2026-01-19 17:07:41'),(1492,1458,9,'ADE','APPROVED',NULL,'2026-01-19 17:07:41'),(1493,1459,9,'ADE','APPROVED',NULL,'2026-01-19 17:07:41'),(1494,1460,9,'ADE','APPROVED',NULL,'2026-01-19 17:07:41'),(1495,1461,9,'ADE','APPROVED',NULL,'2026-01-19 17:07:41'),(1496,1462,9,'ADE','APPROVED',NULL,'2026-01-19 17:07:41'),(1497,1464,9,'ADE','APPROVED',NULL,'2026-01-19 17:07:41'),(1498,1465,9,'ADE','APPROVED',NULL,'2026-01-19 17:07:41'),(1499,1466,9,'ADE','APPROVED',NULL,'2026-01-19 17:07:41'),(1500,1467,9,'ADE','APPROVED',NULL,'2026-01-19 17:07:41'),(1501,1468,9,'ADE','APPROVED',NULL,'2026-01-19 17:07:41'),(1502,1469,9,'ADE','APPROVED',NULL,'2026-01-19 17:07:41'),(1503,1470,9,'ADE','APPROVED',NULL,'2026-01-19 17:07:41'),(1504,1471,9,'ADE','APPROVED',NULL,'2026-01-19 17:07:41'),(1505,1472,9,'ADE','APPROVED',NULL,'2026-01-19 17:07:41'),(1506,1474,9,'ADE','APPROVED',NULL,'2026-01-19 17:07:41'),(1507,1475,9,'ADE','APPROVED',NULL,'2026-01-19 17:07:41'),(1508,1476,9,'ADE','APPROVED',NULL,'2026-01-19 17:07:41'),(1520,1455,8,'DDE','REJECTED','No no ','2026-01-19 17:09:05'),(1521,1456,8,'DDE','REJECTED','No no ','2026-01-19 17:09:05'),(1522,1457,8,'DDE','REJECTED','No no ','2026-01-19 17:09:05'),(1523,1458,8,'DDE','REJECTED','No no ','2026-01-19 17:09:05'),(1524,1459,8,'DDE','REJECTED','No no ','2026-01-19 17:09:05'),(1525,1460,8,'DDE','REJECTED','No no ','2026-01-19 17:09:05'),(1526,1461,8,'DDE','REJECTED','No no ','2026-01-19 17:09:05'),(1527,1462,8,'DDE','REJECTED','No no ','2026-01-19 17:09:05'),(1528,1464,8,'DDE','REJECTED','No no ','2026-01-19 17:09:05'),(1529,1465,8,'DDE','REJECTED','No no ','2026-01-19 17:09:05'),(1530,1466,8,'DDE','REJECTED','No no ','2026-01-19 17:09:05'),(1531,1467,8,'DDE','REJECTED','No no ','2026-01-19 17:09:05'),(1532,1468,8,'DDE','REJECTED','No no ','2026-01-19 17:09:05'),(1533,1469,8,'DDE','REJECTED','No no ','2026-01-19 17:09:05'),(1534,1470,8,'DDE','REJECTED','No no ','2026-01-19 17:09:05'),(1535,1471,8,'DDE','REJECTED','No no ','2026-01-19 17:09:05'),(1536,1472,8,'DDE','REJECTED','No no ','2026-01-19 17:09:05'),(1537,1474,8,'DDE','REJECTED','No no ','2026-01-19 17:09:05'),(1538,1475,8,'DDE','REJECTED','No no ','2026-01-19 17:09:05'),(1539,1476,8,'DDE','REJECTED','No no ','2026-01-19 17:09:05'),(1540,1455,9,'ADE','APPROVED',NULL,'2026-01-19 17:10:27'),(1541,1456,9,'ADE','APPROVED',NULL,'2026-01-19 17:10:27'),(1542,1457,9,'ADE','APPROVED',NULL,'2026-01-19 17:10:27'),(1543,1458,9,'ADE','APPROVED',NULL,'2026-01-19 17:10:27'),(1544,1459,9,'ADE','APPROVED',NULL,'2026-01-19 17:10:27'),(1545,1460,9,'ADE','APPROVED',NULL,'2026-01-19 17:10:27'),(1546,1461,9,'ADE','APPROVED',NULL,'2026-01-19 17:10:27'),(1547,1462,9,'ADE','APPROVED',NULL,'2026-01-19 17:10:27'),(1548,1464,9,'ADE','APPROVED',NULL,'2026-01-19 17:10:27'),(1549,1465,9,'ADE','APPROVED',NULL,'2026-01-19 17:10:27'),(1550,1466,9,'ADE','APPROVED',NULL,'2026-01-19 17:10:27'),(1551,1467,9,'ADE','APPROVED',NULL,'2026-01-19 17:10:27'),(1552,1468,9,'ADE','APPROVED',NULL,'2026-01-19 17:10:27'),(1553,1469,9,'ADE','APPROVED',NULL,'2026-01-19 17:10:27'),(1554,1470,9,'ADE','APPROVED',NULL,'2026-01-19 17:10:27'),(1555,1471,9,'ADE','APPROVED',NULL,'2026-01-19 17:10:27'),(1556,1472,9,'ADE','APPROVED',NULL,'2026-01-19 17:10:27'),(1557,1474,9,'ADE','APPROVED',NULL,'2026-01-19 17:10:27'),(1558,1475,9,'ADE','APPROVED',NULL,'2026-01-19 17:10:27'),(1559,1476,9,'ADE','APPROVED',NULL,'2026-01-19 17:10:27'),(1571,1455,8,'DDE','APPROVED',NULL,'2026-01-19 17:10:40'),(1572,1456,8,'DDE','APPROVED',NULL,'2026-01-19 17:10:40'),(1573,1457,8,'DDE','APPROVED',NULL,'2026-01-19 17:10:40'),(1574,1458,8,'DDE','APPROVED',NULL,'2026-01-19 17:10:40'),(1575,1459,8,'DDE','APPROVED',NULL,'2026-01-19 17:10:40'),(1576,1460,8,'DDE','APPROVED',NULL,'2026-01-19 17:10:40'),(1577,1461,8,'DDE','APPROVED',NULL,'2026-01-19 17:10:40'),(1578,1462,8,'DDE','APPROVED',NULL,'2026-01-19 17:10:40'),(1579,1464,8,'DDE','APPROVED',NULL,'2026-01-19 17:10:40'),(1580,1465,8,'DDE','APPROVED',NULL,'2026-01-19 17:10:40'),(1581,1466,8,'DDE','APPROVED',NULL,'2026-01-19 17:10:40'),(1582,1467,8,'DDE','APPROVED',NULL,'2026-01-19 17:10:40'),(1583,1468,8,'DDE','APPROVED',NULL,'2026-01-19 17:10:40'),(1584,1469,8,'DDE','APPROVED',NULL,'2026-01-19 17:10:40'),(1585,1470,8,'DDE','APPROVED',NULL,'2026-01-19 17:10:40'),(1586,1471,8,'DDE','APPROVED',NULL,'2026-01-19 17:10:40'),(1587,1472,8,'DDE','APPROVED',NULL,'2026-01-19 17:10:40'),(1588,1474,8,'DDE','APPROVED',NULL,'2026-01-19 17:10:40'),(1589,1475,8,'DDE','APPROVED',NULL,'2026-01-19 17:10:40'),(1590,1476,8,'DDE','APPROVED',NULL,'2026-01-19 17:10:40');
/*!40000 ALTER TABLE `approval_logs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `locations`
--

DROP TABLE IF EXISTS `locations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `locations` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(200) NOT NULL,
  `category` enum('SCHOOL','DIVISION') DEFAULT 'SCHOOL',
  `address` varchar(255) DEFAULT NULL,
  `parent_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `parent_id` (`parent_id`),
  CONSTRAINT `locations_ibfk_1` FOREIGN KEY (`parent_id`) REFERENCES `locations` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `locations`
--

LOCK TABLES `locations` WRITE;
/*!40000 ALTER TABLE `locations` DISABLE KEYS */;
INSERT INTO `locations` VALUES (1,'Kidachchurai Karubippankul','SCHOOL',NULL,NULL),(2,'Tharanikkulam Ganesh Vidyalaya','SCHOOL',NULL,NULL),(3,'Parannaddakal GTMS','SCHOOL',NULL,NULL),(4,'Maravankulam Barathidasan School','SCHOOL',NULL,NULL),(5,'Omanthi Central College','SCHOOL',NULL,NULL),(6,'Kankesanthurai Hindu College','SCHOOL',NULL,NULL),(7,'Chavakachcheri Hindu College','SCHOOL',NULL,NULL),(8,'Point Pedro Central College','SCHOOL',NULL,NULL),(9,'Kidachchurai school','SCHOOL',NULL,NULL),(10,'Aisha School','SCHOOL',NULL,NULL),(11,'haadhi','SCHOOL',NULL,NULL);
/*!40000 ALTER TABLE `locations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `full_name` varchar(150) NOT NULL,
  `email` varchar(150) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('ISA','ADE','DDE','ZDE','ADMIN') NOT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (5,'Sarah','isa.sarah@gmail.com','$2b$10$AjD1JGvIyZMcvcia35LAhumXHpnAARyPhASm365lM4DrIgFLJRGJW','ISA','0771234567','2025-11-25 08:47:56'),(6,'silva','zde.silva@example.com','$2b$10$AjD1JGvIyZMcvcia35LAhumXHpnAARyPhASm365lM4DrIgFLJRGJW','ZDE','0777654321','2025-12-10 07:55:50'),(7,'John Doe','isa.john@gmail.com','$2b$10$AjD1JGvIyZMcvcia35LAhumXHpnAARyPhASm365lM4DrIgFLJRGJW','ISA','0779876543','2025-12-10 13:54:54'),(8,'Kamal Perera','dde.kamal@example.com','$2b$10$AjD1JGvIyZMcvcia35LAhumXHpnAARyPhASm365lM4DrIgFLJRGJW','DDE','0771122334','2026-01-07 07:00:45'),(9,'Max','ade.max@gmail.com','$2b$10$AjD1JGvIyZMcvcia35LAhumXHpnAARyPhASm365lM4DrIgFLJRGJW','ADE','0770000000','2026-01-16 11:57:55');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `visit_evidence`
--

DROP TABLE IF EXISTS `visit_evidence`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `visit_evidence` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `visit_id` int(11) NOT NULL,
  `file_url` varchar(255) NOT NULL,
  `file_type` enum('IMG','PDF','DOC','OTHER') DEFAULT 'IMG',
  `uploaded_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `visit_id` (`visit_id`),
  CONSTRAINT `visit_evidence_ibfk_1` FOREIGN KEY (`visit_id`) REFERENCES `visits` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=49 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `visit_evidence`
--

LOCK TABLES `visit_evidence` WRITE;
/*!40000 ALTER TABLE `visit_evidence` DISABLE KEYS */;
INSERT INTO `visit_evidence` VALUES (43,1484,'uploads/photos/1768843794279-821996167.jpg','IMG','2026-01-19 17:29:54'),(44,1485,'uploads/photos/1768843866241-230527422.jpg','IMG','2026-01-19 17:31:06'),(45,1486,'uploads/photos/1768844062258-1414310.jpg','IMG','2026-01-19 17:34:22'),(48,1489,'uploads/photos/1768845881252-92526988.jpg','IMG','2026-01-19 18:04:41');
/*!40000 ALTER TABLE `visit_evidence` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `visit_plan`
--

DROP TABLE IF EXISTS `visit_plan`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `visit_plan` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `isa_id` int(11) NOT NULL,
  `month` varchar(20) NOT NULL,
  `location_id` int(11) DEFAULT NULL,
  `planned_date` date NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `isa_id` (`isa_id`),
  KEY `location_id` (`location_id`),
  CONSTRAINT `visit_plan_ibfk_1` FOREIGN KEY (`isa_id`) REFERENCES `users` (`id`),
  CONSTRAINT `visit_plan_ibfk_2` FOREIGN KEY (`location_id`) REFERENCES `locations` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=503 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `visit_plan`
--

LOCK TABLES `visit_plan` WRITE;
/*!40000 ALTER TABLE `visit_plan` DISABLE KEYS */;
INSERT INTO `visit_plan` VALUES (486,5,'February',NULL,'0000-00-00','2026-01-19 17:10:40'),(487,5,'February',NULL,'0000-00-00','2026-01-19 17:10:40'),(488,5,'February',NULL,'0000-00-00','2026-01-19 17:10:40'),(489,5,'February',NULL,'0000-00-00','2026-01-19 17:10:40'),(490,5,'February',NULL,'0000-00-00','2026-01-19 17:10:40'),(491,5,'February',6,'0000-00-00','2026-01-19 17:10:40'),(492,5,'February',7,'0000-00-00','2026-01-19 17:10:40'),(493,5,'February',4,'0000-00-00','2026-01-19 17:10:40'),(494,5,'February',5,'0000-00-00','2026-01-19 17:10:40'),(495,5,'February',1,'0000-00-00','2026-01-19 17:10:40'),(496,5,'February',10,'0000-00-00','2026-01-19 17:10:40'),(497,5,'February',3,'0000-00-00','2026-01-19 17:10:40'),(498,5,'February',2,'0000-00-00','2026-01-19 17:10:40'),(499,5,'February',NULL,'0000-00-00','2026-01-19 17:10:40'),(500,5,'February',NULL,'0000-00-00','2026-01-19 17:10:40'),(501,5,'February',NULL,'0000-00-00','2026-01-19 17:10:40'),(502,5,'February',11,'0000-00-00','2026-01-19 17:10:40');
/*!40000 ALTER TABLE `visit_plan` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `visits`
--

DROP TABLE IF EXISTS `visits`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `visits` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `isa_id` int(11) NOT NULL,
  `location_id` int(11) DEFAULT NULL,
  `actual_location_id` int(11) DEFAULT NULL,
  `location_change_reason` text DEFAULT NULL,
  `visit_date` varchar(20) NOT NULL,
  `month` varchar(20) NOT NULL,
  `duty` enum('HNST','EXAM','DEV','EVAL','HOLI') NOT NULL DEFAULT 'HNST',
  `actual_duty` enum('HNST','EXAM','DEV','EVAL','HOLI') DEFAULT NULL,
  `report_text` text DEFAULT NULL,
  `status` enum('IN_PROCESS','PENDING','VISITED','ADE_APPROVED','ADE_REJECTED','DDE_APPROVED','DDE_REJECTED','ZDE_APPROVED','ZDE_REJECTED') NOT NULL DEFAULT 'IN_PROCESS',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `date` date DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_isa_month_date` (`isa_id`,`month`,`visit_date`),
  UNIQUE KEY `idx_unique_visit` (`isa_id`,`location_id`,`visit_date`,`duty`),
  KEY `location_id` (`location_id`),
  KEY `fk_actual_location` (`actual_location_id`),
  CONSTRAINT `fk_actual_location` FOREIGN KEY (`actual_location_id`) REFERENCES `locations` (`id`) ON DELETE SET NULL,
  CONSTRAINT `visits_ibfk_1` FOREIGN KEY (`isa_id`) REFERENCES `users` (`id`),
  CONSTRAINT `visits_ibfk_2` FOREIGN KEY (`location_id`) REFERENCES `locations` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1502 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `visits`
--

LOCK TABLES `visits` WRITE;
/*!40000 ALTER TABLE `visits` DISABLE KEYS */;
INSERT INTO `visits` VALUES (1455,5,NULL,NULL,NULL,'2','February','HOLI',NULL,NULL,'DDE_APPROVED','2026-01-19 16:49:37','2026-01-19 17:10:39','2026-02-02'),(1456,5,NULL,NULL,NULL,'3','February','HOLI',NULL,NULL,'DDE_APPROVED','2026-01-19 16:49:39','2026-01-19 17:10:39','2026-02-03'),(1457,5,NULL,NULL,NULL,'4','February','HOLI',NULL,NULL,'DDE_APPROVED','2026-01-19 16:49:41','2026-01-19 17:10:39','2026-02-04'),(1458,5,NULL,NULL,NULL,'5','February','HOLI',NULL,NULL,'DDE_APPROVED','2026-01-19 16:49:43','2026-01-19 17:10:39','2026-02-05'),(1459,5,NULL,NULL,NULL,'6','February','HOLI',NULL,NULL,'DDE_APPROVED','2026-01-19 16:49:47','2026-01-19 17:10:39','2026-02-06'),(1460,5,6,NULL,NULL,'9','February','EXAM',NULL,NULL,'DDE_APPROVED','2026-01-19 16:49:53','2026-01-19 17:10:39','2026-02-09'),(1461,5,7,NULL,NULL,'16','February','EXAM',NULL,NULL,'DDE_APPROVED','2026-01-19 16:49:56','2026-01-19 17:10:39','2026-02-16'),(1462,5,4,NULL,NULL,'23','February','EXAM',NULL,NULL,'DDE_APPROVED','2026-01-19 16:50:01','2026-01-19 17:10:39','2026-02-23'),(1464,5,5,NULL,NULL,'10','February','HNST',NULL,NULL,'DDE_APPROVED','2026-01-19 16:50:25','2026-01-19 17:10:39','2026-02-10'),(1465,5,1,NULL,NULL,'17','February','HNST',NULL,NULL,'DDE_APPROVED','2026-01-19 16:50:30','2026-01-19 17:10:39','2026-02-17'),(1466,5,10,NULL,NULL,'24','February','HNST',NULL,NULL,'DDE_APPROVED','2026-01-19 16:50:35','2026-01-19 17:10:39','2026-02-24'),(1467,5,10,NULL,NULL,'11','February','EVAL',NULL,NULL,'DDE_APPROVED','2026-01-19 16:50:40','2026-01-19 17:10:39','2026-02-11'),(1468,5,3,NULL,NULL,'18','February','EVAL',NULL,NULL,'DDE_APPROVED','2026-01-19 16:50:50','2026-01-19 17:10:39','2026-02-18'),(1469,5,2,NULL,NULL,'25','February','EVAL',NULL,NULL,'DDE_APPROVED','2026-01-19 16:51:01','2026-01-19 17:10:39','2026-02-25'),(1470,5,NULL,NULL,NULL,'12','February','HOLI',NULL,NULL,'DDE_APPROVED','2026-01-19 16:51:06','2026-01-19 17:10:39','2026-02-12'),(1471,5,1,NULL,NULL,'19','February','DEV',NULL,NULL,'DDE_APPROVED','2026-01-19 16:51:10','2026-01-19 17:10:39','2026-02-19'),(1472,5,3,NULL,NULL,'26','February','DEV',NULL,NULL,'DDE_APPROVED','2026-01-19 16:51:17','2026-01-19 17:10:39','2026-02-26'),(1474,5,NULL,NULL,NULL,'13','February','HOLI',NULL,NULL,'DDE_APPROVED','2026-01-19 16:52:21','2026-01-19 17:10:39','2026-02-13'),(1475,5,NULL,NULL,NULL,'20','February','HOLI',NULL,NULL,'DDE_APPROVED','2026-01-19 16:52:23','2026-01-19 17:10:39','2026-02-20'),(1476,5,11,NULL,NULL,'27','February','EVAL',NULL,NULL,'DDE_APPROVED','2026-01-19 16:52:25','2026-01-19 17:10:39','2026-02-27'),(1480,5,NULL,NULL,NULL,'1','January','HOLI',NULL,NULL,'DDE_APPROVED','2026-01-19 17:23:55','2026-01-19 17:25:47','2026-01-01'),(1481,5,NULL,NULL,NULL,'2','January','HOLI',NULL,NULL,'DDE_APPROVED','2026-01-19 17:23:55','2026-01-19 17:25:47','2026-01-02'),(1482,5,NULL,NULL,NULL,'5','January','HOLI',NULL,NULL,'DDE_APPROVED','2026-01-19 17:23:55','2026-01-19 17:25:47','2026-01-05'),(1483,5,NULL,NULL,NULL,'6','January','HOLI',NULL,NULL,'DDE_APPROVED','2026-01-19 17:23:55','2026-01-19 17:25:47','2026-01-06'),(1484,5,6,1,NULL,'7','January','EXAM','','It was good','VISITED','2026-01-19 17:23:55','2026-01-19 17:29:54','2026-01-07'),(1485,5,7,1,NULL,'8','January','EXAM',NULL,'Hehe hi','VISITED','2026-01-19 17:23:55','2026-01-19 17:31:06','2026-01-08'),(1486,5,4,4,NULL,'9','January','EXAM','EXAM','Hehehe','VISITED','2026-01-19 17:23:55','2026-01-19 17:34:22','2026-01-09'),(1489,5,10,2,'Summaaaa','14','January','HNST','EVAL','Hdhs','VISITED','2026-01-19 17:23:55','2026-01-19 18:03:56','2026-01-14'),(1490,5,10,NULL,NULL,'15','January','EVAL',NULL,NULL,'DDE_APPROVED','2026-01-19 17:23:55','2026-01-19 17:25:47','2026-01-15'),(1491,5,3,NULL,NULL,'16','January','EVAL',NULL,NULL,'DDE_APPROVED','2026-01-19 17:23:55','2026-01-19 17:25:47','2026-01-16'),(1492,5,2,NULL,NULL,'19','January','EVAL',NULL,NULL,'DDE_APPROVED','2026-01-19 17:23:55','2026-01-19 17:25:47','2026-01-19'),(1493,5,7,NULL,NULL,'20','January','DEV',NULL,NULL,'DDE_APPROVED','2026-01-19 17:23:55','2026-01-19 17:25:47','2026-01-20'),(1494,5,1,NULL,NULL,'21','January','DEV',NULL,NULL,'DDE_APPROVED','2026-01-19 17:23:55','2026-01-19 17:25:47','2026-01-21'),(1495,5,3,NULL,NULL,'22','January','DEV',NULL,NULL,'DDE_APPROVED','2026-01-19 17:23:55','2026-01-19 17:25:47','2026-01-22'),(1496,5,NULL,NULL,NULL,'23','January','HOLI',NULL,NULL,'DDE_APPROVED','2026-01-19 17:23:55','2026-01-19 17:25:47','2026-01-23'),(1497,5,NULL,NULL,NULL,'26','January','HOLI',NULL,NULL,'DDE_APPROVED','2026-01-19 17:23:55','2026-01-19 17:25:47','2026-01-26'),(1498,5,NULL,NULL,NULL,'27','January','HOLI',NULL,NULL,'DDE_APPROVED','2026-01-19 17:23:55','2026-01-19 17:25:47','2026-01-27'),(1499,5,NULL,NULL,NULL,'28','January','HOLI',NULL,NULL,'DDE_APPROVED','2026-01-19 17:23:55','2026-01-19 17:25:47','2026-01-28'),(1500,5,NULL,NULL,NULL,'29','January','HOLI',NULL,NULL,'DDE_APPROVED','2026-01-19 17:23:55','2026-01-19 17:25:47','2026-01-29'),(1501,5,11,NULL,NULL,'30','January','EVAL',NULL,NULL,'DDE_APPROVED','2026-01-19 17:23:55','2026-01-19 17:25:47','2026-01-30');
/*!40000 ALTER TABLE `visits` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-01-19 23:43:08
