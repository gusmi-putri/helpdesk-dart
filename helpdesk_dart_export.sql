-- MySQL dump 10.13  Distrib 8.4.3, for Win64 (x86_64)
--
-- Host: localhost    Database: helpdesk_dart
-- ------------------------------------------------------
-- Server version	8.4.3

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
-- Table structure for table `ai_nb_categories`
--

DROP TABLE IF EXISTS `ai_nb_categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ai_nb_categories` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `document_count` int unsigned NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `ai_nb_categories_name_unique` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ai_nb_categories`
--

LOCK TABLES `ai_nb_categories` WRITE;
/*!40000 ALTER TABLE `ai_nb_categories` DISABLE KEYS */;
/*!40000 ALTER TABLE `ai_nb_categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ai_nb_words`
--

DROP TABLE IF EXISTS `ai_nb_words`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ai_nb_words` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `category_id` bigint unsigned NOT NULL,
  `word` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `frequency` int unsigned NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `ai_nb_words_category_id_word_unique` (`category_id`,`word`),
  CONSTRAINT `ai_nb_words_category_id_foreign` FOREIGN KEY (`category_id`) REFERENCES `ai_nb_categories` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ai_nb_words`
--

LOCK TABLES `ai_nb_words` WRITE;
/*!40000 ALTER TABLE `ai_nb_words` DISABLE KEYS */;
/*!40000 ALTER TABLE `ai_nb_words` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cache`
--

DROP TABLE IF EXISTS `cache`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cache` (
  `key` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `value` mediumtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `expiration` bigint NOT NULL,
  PRIMARY KEY (`key`),
  KEY `cache_expiration_index` (`expiration`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cache`
--

LOCK TABLES `cache` WRITE;
/*!40000 ALTER TABLE `cache` DISABLE KEYS */;
INSERT INTO `cache` VALUES ('sisfo-dart-cache-1b6453892473a467d07372d45eb05abc2031647a','i:1;',1791802851),('sisfo-dart-cache-1b6453892473a467d07372d45eb05abc2031647a:timer','i:1791802851;',1791802851),('sisfo-dart-cache-5c785c036466adea360111aa28563bfd556b5fba','i:3;',1791800240),('sisfo-dart-cache-5c785c036466adea360111aa28563bfd556b5fba:timer','i:1791800240;',1791800240),('sisfo-dart-cache-login:pengguna1|127.0.0.1','i:1;',1791800482),('sisfo-dart-cache-login:pengguna1|127.0.0.1:timer','i:1791800482;',1791800482),('sisfo-dart-cache-login:user1|127.0.0.1','i:1;',1791800495),('sisfo-dart-cache-login:user1|127.0.0.1:timer','i:1791800495;',1791800495),('sisfo-dart-cache-spatie.permission.cache','a:3:{s:5:\"alias\";a:4:{s:1:\"a\";s:2:\"id\";s:1:\"b\";s:4:\"name\";s:1:\"c\";s:10:\"guard_name\";s:1:\"r\";s:5:\"roles\";}s:11:\"permissions\";a:29:{i:0;a:4:{s:1:\"a\";i:1;s:1:\"b\";s:20:\"view-dashboard-admin\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:2:{i:0;i:1;i:1;i:2;}}i:1;a:4:{s:1:\"a\";i:2;s:1:\"b\";s:19:\"view-dashboard-staf\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:2:{i:0;i:1;i:1;i:3;}}i:2;a:4:{s:1:\"a\";i:3;s:1:\"b\";s:22:\"view-dashboard-teknisi\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:2:{i:0;i:1;i:1;i:4;}}i:3;a:4:{s:1:\"a\";i:4;s:1:\"b\";s:22:\"view-dashboard-pelapor\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:2:{i:0;i:1;i:1;i:5;}}i:4;a:4:{s:1:\"a\";i:5;s:1:\"b\";s:12:\"create-users\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:1:{i:0;i:1;}}i:5;a:4:{s:1:\"a\";i:6;s:1:\"b\";s:10:\"read-users\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:2:{i:0;i:1;i:1;i:2;}}i:6;a:4:{s:1:\"a\";i:7;s:1:\"b\";s:12:\"update-users\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:1:{i:0;i:1;}}i:7;a:4:{s:1:\"a\";i:8;s:1:\"b\";s:12:\"delete-users\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:1:{i:0;i:1;}}i:8;a:4:{s:1:\"a\";i:9;s:1:\"b\";s:14:\"create-satuans\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:2:{i:0;i:1;i:1;i:3;}}i:9;a:4:{s:1:\"a\";i:10;s:1:\"b\";s:12:\"read-satuans\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:3:{i:0;i:1;i:1;i:2;i:2;i:3;}}i:10;a:4:{s:1:\"a\";i:11;s:1:\"b\";s:14:\"update-satuans\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:2:{i:0;i:1;i:1;i:3;}}i:11;a:4:{s:1:\"a\";i:12;s:1:\"b\";s:14:\"delete-satuans\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:1:{i:0;i:1;}}i:12;a:4:{s:1:\"a\";i:13;s:1:\"b\";s:12:\"create-units\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:2:{i:0;i:1;i:1;i:3;}}i:13;a:4:{s:1:\"a\";i:14;s:1:\"b\";s:10:\"read-units\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:3:{i:0;i:1;i:1;i:2;i:2;i:3;}}i:14;a:4:{s:1:\"a\";i:15;s:1:\"b\";s:12:\"update-units\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:2:{i:0;i:1;i:1;i:3;}}i:15;a:4:{s:1:\"a\";i:16;s:1:\"b\";s:12:\"delete-units\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:1:{i:0;i:1;}}i:16;a:4:{s:1:\"a\";i:17;s:1:\"b\";s:14:\"create-reports\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:2:{i:0;i:1;i:1;i:5;}}i:17;a:4:{s:1:\"a\";i:18;s:1:\"b\";s:12:\"read-reports\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:3:{i:0;i:1;i:1;i:2;i:2;i:3;}}i:18;a:4:{s:1:\"a\";i:19;s:1:\"b\";s:14:\"update-reports\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:2:{i:0;i:1;i:1;i:3;}}i:19;a:4:{s:1:\"a\";i:20;s:1:\"b\";s:14:\"delete-reports\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:1:{i:0;i:1;}}i:20;a:4:{s:1:\"a\";i:21;s:1:\"b\";s:14:\"assign-reports\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:2:{i:0;i:1;i:1;i:3;}}i:21;a:4:{s:1:\"a\";i:22;s:1:\"b\";s:14:\"verify-reports\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:2:{i:0;i:1;i:1;i:3;}}i:22;a:4:{s:1:\"a\";i:23;s:1:\"b\";s:15:\"process-reports\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:2:{i:0;i:1;i:1;i:4;}}i:23;a:4:{s:1:\"a\";i:24;s:1:\"b\";s:12:\"export-recap\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:3:{i:0;i:1;i:1;i:2;i:2;i:3;}}i:24;a:4:{s:1:\"a\";i:25;s:1:\"b\";s:16:\"create-mutations\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:2:{i:0;i:1;i:1;i:3;}}i:25;a:4:{s:1:\"a\";i:26;s:1:\"b\";s:14:\"read-mutations\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:3:{i:0;i:1;i:1;i:2;i:2;i:3;}}i:26;a:4:{s:1:\"a\";i:27;s:1:\"b\";s:16:\"update-mutations\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:1:{i:0;i:1;}}i:27;a:4:{s:1:\"a\";i:28;s:1:\"b\";s:16:\"delete-mutations\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:1:{i:0;i:1;}}i:28;a:4:{s:1:\"a\";i:29;s:1:\"b\";s:9:\"read-logs\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:1:{i:0;i:1;}}}s:5:\"roles\";a:5:{i:0;a:3:{s:1:\"a\";i:1;s:1:\"b\";s:5:\"Admin\";s:1:\"c\";s:3:\"web\";}i:1;a:3:{s:1:\"a\";i:2;s:1:\"b\";s:10:\"Supervisor\";s:1:\"c\";s:3:\"web\";}i:2;a:3:{s:1:\"a\";i:3;s:1:\"b\";s:4:\"Staf\";s:1:\"c\";s:3:\"web\";}i:3;a:3:{s:1:\"a\";i:4;s:1:\"b\";s:7:\"Teknisi\";s:1:\"c\";s:3:\"web\";}i:4;a:3:{s:1:\"a\";i:5;s:1:\"b\";s:7:\"Pelapor\";s:1:\"c\";s:3:\"web\";}}}',1791862770);
/*!40000 ALTER TABLE `cache` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cache_locks`
--

DROP TABLE IF EXISTS `cache_locks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cache_locks` (
  `key` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `owner` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `expiration` bigint NOT NULL,
  PRIMARY KEY (`key`),
  KEY `cache_locks_expiration_index` (`expiration`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cache_locks`
--

LOCK TABLES `cache_locks` WRITE;
/*!40000 ALTER TABLE `cache_locks` DISABLE KEYS */;
/*!40000 ALTER TABLE `cache_locks` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `failed_jobs`
--

DROP TABLE IF EXISTS `failed_jobs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `failed_jobs` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `uuid` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `connection` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `queue` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `payload` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `exception` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `failed_jobs`
--

LOCK TABLES `failed_jobs` WRITE;
/*!40000 ALTER TABLE `failed_jobs` DISABLE KEYS */;
/*!40000 ALTER TABLE `failed_jobs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `job_batches`
--

DROP TABLE IF EXISTS `job_batches`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `job_batches` (
  `id` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `total_jobs` int NOT NULL,
  `pending_jobs` int NOT NULL,
  `failed_jobs` int NOT NULL,
  `failed_job_ids` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `options` mediumtext COLLATE utf8mb4_unicode_ci,
  `cancelled_at` int DEFAULT NULL,
  `created_at` int NOT NULL,
  `finished_at` int DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `job_batches`
--

LOCK TABLES `job_batches` WRITE;
/*!40000 ALTER TABLE `job_batches` DISABLE KEYS */;
/*!40000 ALTER TABLE `job_batches` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `jobs`
--

DROP TABLE IF EXISTS `jobs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `jobs` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `queue` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `payload` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `attempts` tinyint unsigned NOT NULL,
  `reserved_at` int unsigned DEFAULT NULL,
  `available_at` int unsigned NOT NULL,
  `created_at` int unsigned NOT NULL,
  PRIMARY KEY (`id`),
  KEY `jobs_queue_index` (`queue`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `jobs`
--

LOCK TABLES `jobs` WRITE;
/*!40000 ALTER TABLE `jobs` DISABLE KEYS */;
/*!40000 ALTER TABLE `jobs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `maintenance_reports`
--

DROP TABLE IF EXISTS `maintenance_reports`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `maintenance_reports` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `satuan_id` bigint unsigned NOT NULL,
  `user_id` bigint unsigned NOT NULL,
  `nama_giat` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `periode` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `tahun` int NOT NULL,
  `anggaran_pendukung` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `jumlah_anggaran` decimal(15,2) NOT NULL,
  `dokumen_anggaran` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `dokumen_lpj` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `maintenance_reports_satuan_id_foreign` (`satuan_id`),
  KEY `maintenance_reports_user_id_foreign` (`user_id`),
  CONSTRAINT `maintenance_reports_satuan_id_foreign` FOREIGN KEY (`satuan_id`) REFERENCES `satuans` (`id`),
  CONSTRAINT `maintenance_reports_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `maintenance_reports`
--

LOCK TABLES `maintenance_reports` WRITE;
/*!40000 ALTER TABLE `maintenance_reports` DISABLE KEYS */;
/*!40000 ALTER TABLE `maintenance_reports` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `migrations`
--

DROP TABLE IF EXISTS `migrations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `migrations` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `migration` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `batch` int NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=38 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `migrations`
--

LOCK TABLES `migrations` WRITE;
/*!40000 ALTER TABLE `migrations` DISABLE KEYS */;
INSERT INTO `migrations` VALUES (1,'0001_01_01_000000_create_users_table',1),(2,'0001_01_01_000001_create_cache_table',1),(3,'0001_01_01_000002_create_jobs_table',1),(4,'2026_04_21_045217_create_personal_access_tokens_table',1),(5,'2026_04_22_110033_create_units_table',1),(6,'2026_04_22_110048_create_reports_table',1),(7,'2026_04_22_132410_create_system_logs_table',1),(8,'2026_05_11_090200_add_email_to_users_table',1),(9,'2026_06_11_112600_add_repair_funding_fields_to_reports_table',1),(10,'2026_06_11_113300_change_dokumen_anggaran_to_text_in_reports_table',1),(11,'2026_06_11_114000_replace_sector_dummy_satuan_names',1),(12,'2026_06_11_143334_create_unit_mutations_table',1),(13,'2026_06_15_152826_rename_jenis_dart_to_jenis_in_units_table',1),(14,'2026_06_15_153419_drop_nama_dart_from_units_table',1),(15,'2026_06_17_115753_add_mutation_fields_to_users_table',1),(16,'2026_06_19_130729_add_tautan_video_to_reports_table',1),(17,'2026_06_19_131005_add_lat_lng_to_units_table',1),(18,'2026_06_22_134955_create_satuans_table',1),(19,'2026_06_23_092525_add_is_verified_to_satuans_table',1),(20,'2026_06_23_211003_add_pending_columns_to_satuans_table',1),(21,'2026_06_24_095923_modify_satuans_table',1),(22,'2026_06_24_100038_add_satuan_id_to_users_and_units',1),(23,'2026_07_01_103438_create_user_mutations_table',1),(24,'2026_07_01_103442_remove_pending_action_from_users_table',1),(25,'2026_07_02_104346_add_soft_deletes_to_users_table',1),(26,'2026_07_03_000000_drop_unused_report_unit_columns',1),(27,'2026_07_03_000001_drop_kotama_from_satuans_table',1),(28,'2026_07_03_125108_add_soft_deletes_to_users_table',1),(29,'2026_07_17_091622_add_attempts_to_password_reset_tokens_table',1),(30,'2026_07_17_103000_add_locked_until_to_password_reset_tokens_table',1),(31,'2026_07_17_103455_add_locked_until_to_users_table',1),(32,'2026_07_25_202539_rename_old_roles_table',1),(33,'2026_07_25_202540_create_permission_tables',1),(34,'2026_07_25_202645_migrate_users_to_spatie_and_drop_old_role',1),(35,'2026_07_29_203659_create_notifications_table',1),(36,'2026_07_31_150732_create_ai_nb_tables',1),(37,'2026_09_15_211423_create_maintenance_reports_table',1);
/*!40000 ALTER TABLE `migrations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `model_has_permissions`
--

DROP TABLE IF EXISTS `model_has_permissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `model_has_permissions` (
  `permission_id` bigint unsigned NOT NULL,
  `model_type` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `model_id` bigint unsigned NOT NULL,
  PRIMARY KEY (`permission_id`,`model_id`,`model_type`),
  KEY `model_has_permissions_model_id_model_type_index` (`model_id`,`model_type`),
  CONSTRAINT `model_has_permissions_permission_id_foreign` FOREIGN KEY (`permission_id`) REFERENCES `permissions` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `model_has_permissions`
--

LOCK TABLES `model_has_permissions` WRITE;
/*!40000 ALTER TABLE `model_has_permissions` DISABLE KEYS */;
/*!40000 ALTER TABLE `model_has_permissions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `model_has_roles`
--

DROP TABLE IF EXISTS `model_has_roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `model_has_roles` (
  `role_id` bigint unsigned NOT NULL,
  `model_type` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `model_id` bigint unsigned NOT NULL,
  PRIMARY KEY (`role_id`,`model_id`,`model_type`),
  KEY `model_has_roles_model_id_model_type_index` (`model_id`,`model_type`),
  CONSTRAINT `model_has_roles_role_id_foreign` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `model_has_roles`
--

LOCK TABLES `model_has_roles` WRITE;
/*!40000 ALTER TABLE `model_has_roles` DISABLE KEYS */;
INSERT INTO `model_has_roles` VALUES (1,'App\\Models\\User',1),(3,'App\\Models\\User',2),(4,'App\\Models\\User',3),(5,'App\\Models\\User',4);
/*!40000 ALTER TABLE `model_has_roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `notifications`
--

DROP TABLE IF EXISTS `notifications`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `notifications` (
  `id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `type` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `notifiable_type` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `notifiable_id` bigint unsigned NOT NULL,
  `data` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `read_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `notifications_notifiable_type_notifiable_id_index` (`notifiable_type`,`notifiable_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notifications`
--

LOCK TABLES `notifications` WRITE;
/*!40000 ALTER TABLE `notifications` DISABLE KEYS */;
INSERT INTO `notifications` VALUES ('1a4ccacf-7aff-429a-94e9-06dff50ccda4','App\\Notifications\\SystemNotification','App\\Models\\User',2,'{\"message\":\"Laporan baru diterima dari Operator Satkai AKMIL\",\"type\":\"info\",\"actionUrl\":null}',NULL,'2026-10-12 10:59:48','2026-10-12 10:59:48'),('5593bdbf-7ca2-43e9-bfe9-1af99a52de0b','App\\Notifications\\SystemNotification','App\\Models\\User',2,'{\"message\":\"Laporan baru diterima dari Operator Satkai AKMIL\",\"type\":\"info\",\"actionUrl\":null}',NULL,'2026-10-12 10:34:29','2026-10-12 10:34:29'),('696eea9c-40c5-44ef-aee5-8107764fc1e3','App\\Notifications\\SystemNotification','App\\Models\\User',1,'{\"message\":\"Laporan baru diterima dari Operator Satkai AKMIL\",\"type\":\"info\",\"actionUrl\":null}',NULL,'2026-10-12 10:34:28','2026-10-12 10:34:28'),('b37beaa4-fc90-4313-b8b4-dde106305f56','App\\Notifications\\SystemNotification','App\\Models\\User',1,'{\"message\":\"Laporan baru diterima dari Operator Satkai AKMIL\",\"type\":\"info\",\"actionUrl\":null}',NULL,'2026-10-12 10:31:40','2026-10-12 10:31:40'),('de535595-67cb-4dea-8cb7-1562a77e57af','App\\Notifications\\SystemNotification','App\\Models\\User',1,'{\"message\":\"Laporan baru diterima dari Operator Satkai AKMIL\",\"type\":\"info\",\"actionUrl\":null}',NULL,'2026-10-12 10:59:47','2026-10-12 10:59:47');
/*!40000 ALTER TABLE `notifications` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `password_reset_tokens`
--

DROP TABLE IF EXISTS `password_reset_tokens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `password_reset_tokens` (
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `token` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `attempts` int NOT NULL DEFAULT '0',
  `locked_until` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `password_reset_tokens`
--

LOCK TABLES `password_reset_tokens` WRITE;
/*!40000 ALTER TABLE `password_reset_tokens` DISABLE KEYS */;
/*!40000 ALTER TABLE `password_reset_tokens` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `permissions`
--

DROP TABLE IF EXISTS `permissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `permissions` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `guard_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `permissions_name_guard_name_unique` (`name`,`guard_name`)
) ENGINE=InnoDB AUTO_INCREMENT=30 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `permissions`
--

LOCK TABLES `permissions` WRITE;
/*!40000 ALTER TABLE `permissions` DISABLE KEYS */;
INSERT INTO `permissions` VALUES (1,'view-dashboard-admin','web','2026-10-12 03:39:20','2026-10-12 03:39:20'),(2,'view-dashboard-staf','web','2026-10-12 03:39:20','2026-10-12 03:39:20'),(3,'view-dashboard-teknisi','web','2026-10-12 03:39:20','2026-10-12 03:39:20'),(4,'view-dashboard-pelapor','web','2026-10-12 03:39:20','2026-10-12 03:39:20'),(5,'create-users','web','2026-10-12 03:39:20','2026-10-12 03:39:20'),(6,'read-users','web','2026-10-12 03:39:20','2026-10-12 03:39:20'),(7,'update-users','web','2026-10-12 03:39:20','2026-10-12 03:39:20'),(8,'delete-users','web','2026-10-12 03:39:20','2026-10-12 03:39:20'),(9,'create-satuans','web','2026-10-12 03:39:20','2026-10-12 03:39:20'),(10,'read-satuans','web','2026-10-12 03:39:20','2026-10-12 03:39:20'),(11,'update-satuans','web','2026-10-12 03:39:20','2026-10-12 03:39:20'),(12,'delete-satuans','web','2026-10-12 03:39:20','2026-10-12 03:39:20'),(13,'create-units','web','2026-10-12 03:39:20','2026-10-12 03:39:20'),(14,'read-units','web','2026-10-12 03:39:20','2026-10-12 03:39:20'),(15,'update-units','web','2026-10-12 03:39:20','2026-10-12 03:39:20'),(16,'delete-units','web','2026-10-12 03:39:20','2026-10-12 03:39:20'),(17,'create-reports','web','2026-10-12 03:39:20','2026-10-12 03:39:20'),(18,'read-reports','web','2026-10-12 03:39:20','2026-10-12 03:39:20'),(19,'update-reports','web','2026-10-12 03:39:20','2026-10-12 03:39:20'),(20,'delete-reports','web','2026-10-12 03:39:20','2026-10-12 03:39:20'),(21,'assign-reports','web','2026-10-12 03:39:20','2026-10-12 03:39:20'),(22,'verify-reports','web','2026-10-12 03:39:20','2026-10-12 03:39:20'),(23,'process-reports','web','2026-10-12 03:39:20','2026-10-12 03:39:20'),(24,'export-recap','web','2026-10-12 03:39:20','2026-10-12 03:39:20'),(25,'create-mutations','web','2026-10-12 03:39:20','2026-10-12 03:39:20'),(26,'read-mutations','web','2026-10-12 03:39:20','2026-10-12 03:39:20'),(27,'update-mutations','web','2026-10-12 03:39:20','2026-10-12 03:39:20'),(28,'delete-mutations','web','2026-10-12 03:39:20','2026-10-12 03:39:20'),(29,'read-logs','web','2026-10-12 03:39:20','2026-10-12 03:39:20');
/*!40000 ALTER TABLE `permissions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `personal_access_tokens`
--

DROP TABLE IF EXISTS `personal_access_tokens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `personal_access_tokens` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `tokenable_type` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `tokenable_id` bigint unsigned NOT NULL,
  `name` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `token` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `abilities` text COLLATE utf8mb4_unicode_ci,
  `last_used_at` timestamp NULL DEFAULT NULL,
  `expires_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `personal_access_tokens_token_unique` (`token`),
  KEY `personal_access_tokens_tokenable_type_tokenable_id_index` (`tokenable_type`,`tokenable_id`),
  KEY `personal_access_tokens_expires_at_index` (`expires_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `personal_access_tokens`
--

LOCK TABLES `personal_access_tokens` WRITE;
/*!40000 ALTER TABLE `personal_access_tokens` DISABLE KEYS */;
/*!40000 ALTER TABLE `personal_access_tokens` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `reports`
--

DROP TABLE IF EXISTS `reports`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `reports` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `unit_id` bigint unsigned NOT NULL,
  `user_id` bigint unsigned NOT NULL,
  `staff_id` bigint unsigned DEFAULT NULL,
  `teknisi_id` bigint unsigned DEFAULT NULL,
  `tanggal_lapor` timestamp NOT NULL,
  `lokasi_laporan` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `klasifikasi` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `tingkat_kerusakan` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `urgensi` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `jenis_perbaikan` enum('Swadaya','Non-Swadaya') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'Swadaya',
  `deskripsi_kerusakan` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `file_bukti` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `tautan_video` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `dokumen_anggaran` text COLLATE utf8mb4_unicode_ci,
  `keterangan_anggaran` text COLLATE utf8mb4_unicode_ci,
  `file_bukti_selesai` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `tautan_video_selesai` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `alasan_penolakan` text COLLATE utf8mb4_unicode_ci,
  `status_laporan` enum('Pending','Diverifikasi','Diterima Teknisi','Diproses','Selesai','Ditolak') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'Pending',
  `metode_perbaikan` enum('Online','Offline') COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `tgl_ditunjuk` timestamp NULL DEFAULT NULL,
  `tgl_selesai` timestamp NULL DEFAULT NULL,
  `catatan_teknisi` text COLLATE utf8mb4_unicode_ci,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `reports_unit_id_foreign` (`unit_id`),
  KEY `reports_user_id_foreign` (`user_id`),
  KEY `reports_staff_id_foreign` (`staff_id`),
  KEY `reports_teknisi_id_foreign` (`teknisi_id`),
  CONSTRAINT `reports_staff_id_foreign` FOREIGN KEY (`staff_id`) REFERENCES `users` (`id`),
  CONSTRAINT `reports_teknisi_id_foreign` FOREIGN KEY (`teknisi_id`) REFERENCES `users` (`id`),
  CONSTRAINT `reports_unit_id_foreign` FOREIGN KEY (`unit_id`) REFERENCES `units` (`id`),
  CONSTRAINT `reports_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reports`
--

LOCK TABLES `reports` WRITE;
/*!40000 ALTER TABLE `reports` DISABLE KEYS */;
INSERT INTO `reports` VALUES (1,1,4,2,3,'2026-10-10 03:39:22','AKMIL','HARDWARE','SEDANG','RUTIN','Swadaya','Lensa pecah akibat benturan objek asing.',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Selesai','Offline','2026-10-10 03:39:22','2026-10-11 03:39:22','Penggantian modul lensa V3 berhasil dilakukan.',NULL,'2026-10-12 03:39:22','2026-10-12 03:39:22'),(2,3,4,NULL,NULL,'2026-10-12 03:39:22','AKMIL','ELEKTRONIK','BERAT','Sangat Mendesak','Swadaya','Radar tidak merespon perintah frekuensi X.',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Pending',NULL,NULL,NULL,NULL,NULL,'2026-10-12 03:39:22','2026-10-12 03:39:22'),(3,4,4,NULL,NULL,'2026-10-11 22:39:22','AKMIL','HARDWARE','RINGAN','Bisa Menunggu','Swadaya','Braket dudukan sensor longgar.',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Diverifikasi',NULL,NULL,NULL,NULL,NULL,'2026-10-12 03:39:22','2026-10-12 03:39:22'),(4,12,4,2,3,'2026-10-11 23:39:22','YONIF RAIDER 303/SSM','HARDWARE','SEDANG','Bisa Menunggu','Swadaya','Kabel daya sensor gerak terkelupas.',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Diterima Teknisi',NULL,'2026-10-12 00:39:22',NULL,NULL,NULL,'2026-10-12 03:39:22','2026-10-12 03:39:22'),(5,15,4,2,3,'2026-10-11 19:39:22','YONIF RAIDER 303/SSM','ELEKTRONIK','BERAT','Sangat Mendesak','Swadaya','Layar monitor simulator berkedip terus menerus.',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Diproses',NULL,'2026-10-11 20:39:22',NULL,NULL,NULL,'2026-10-12 03:39:22','2026-10-12 03:39:22'),(6,22,4,NULL,NULL,'2026-10-09 03:39:22','YONIF 315/GARUDA','S','RINGAN','Pemeliharaan Rutin','Swadaya','Laporan uji coba saja, tidak ada kerusakan riil.',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Ditolak',NULL,NULL,NULL,NULL,NULL,'2026-10-12 03:39:22','2026-10-12 03:39:22'),(7,7,4,NULL,NULL,'2026-10-12 10:31:37','AKMIL','SEDANG','Sedang','Sangat Mendesak','Swadaya','Kerusakan pada rel dart sehingga dia terhambat ketika digunakan','[\"reports\\/6accb708128f53.13282028_1791801096.jpeg\"]','https://docs.google.com/document/d/1MUK80f7B2Q5D9qLI0jTPAOFZ0r4cA5Yj9e0zeBU7LZk/edit?tab=t.0',NULL,NULL,NULL,NULL,NULL,'Pending',NULL,NULL,NULL,NULL,NULL,'2026-10-12 10:31:37','2026-10-12 10:31:37'),(8,7,4,NULL,NULL,'2026-10-12 10:34:28','AKMIL','SEDANG','Sedang','Sangat Mendesak','Swadaya','Kerusakan pada rel dart sehingga dia terhambat ketika digunakan','[\"reports\\/6accb7b4a4ce19.09890433_1791801268.jpeg\"]','https://docs.google.com/document/d/1MUK80f7B2Q5D9qLI0jTPAOFZ0r4cA5Yj9e0zeBU7LZk/edit?tab=t.0',NULL,NULL,NULL,NULL,NULL,'Pending',NULL,NULL,NULL,NULL,NULL,'2026-10-12 10:34:28','2026-10-12 10:34:28'),(9,2,4,NULL,NULL,'2026-10-12 10:59:47','AKMIL','SEDANG','Sedang','Bisa Menunggu','Swadaya','Lesan tidak bisa bergerak alias tidak muncul pop up ketika sedang digunakan','[\"reports\\/6accbda3883458.42462984_1791802787.jpeg\"]','https://docs.google.com/document/d/1MUK80f7B2Q5D9qLI0jTPAOFZ0r4cA5Yj9e0zeBU7LZk/edit?tab=t.0',NULL,NULL,NULL,NULL,NULL,'Pending',NULL,NULL,NULL,NULL,NULL,'2026-10-12 10:59:47','2026-10-12 10:59:47');
/*!40000 ALTER TABLE `reports` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `role_has_permissions`
--

DROP TABLE IF EXISTS `role_has_permissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `role_has_permissions` (
  `permission_id` bigint unsigned NOT NULL,
  `role_id` bigint unsigned NOT NULL,
  PRIMARY KEY (`permission_id`,`role_id`),
  KEY `role_has_permissions_role_id_foreign` (`role_id`),
  CONSTRAINT `role_has_permissions_permission_id_foreign` FOREIGN KEY (`permission_id`) REFERENCES `permissions` (`id`) ON DELETE CASCADE,
  CONSTRAINT `role_has_permissions_role_id_foreign` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `role_has_permissions`
--

LOCK TABLES `role_has_permissions` WRITE;
/*!40000 ALTER TABLE `role_has_permissions` DISABLE KEYS */;
INSERT INTO `role_has_permissions` VALUES (1,1),(2,1),(3,1),(4,1),(5,1),(6,1),(7,1),(8,1),(9,1),(10,1),(11,1),(12,1),(13,1),(14,1),(15,1),(16,1),(17,1),(18,1),(19,1),(20,1),(21,1),(22,1),(23,1),(24,1),(25,1),(26,1),(27,1),(28,1),(29,1),(1,2),(6,2),(10,2),(14,2),(18,2),(24,2),(26,2),(2,3),(9,3),(10,3),(11,3),(13,3),(14,3),(15,3),(18,3),(19,3),(21,3),(22,3),(24,3),(25,3),(26,3),(3,4),(23,4),(4,5),(17,5);
/*!40000 ALTER TABLE `role_has_permissions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `roles`
--

DROP TABLE IF EXISTS `roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `roles` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `guard_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `roles_name_guard_name_unique` (`name`,`guard_name`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `roles`
--

LOCK TABLES `roles` WRITE;
/*!40000 ALTER TABLE `roles` DISABLE KEYS */;
INSERT INTO `roles` VALUES (1,'Admin','web','2026-10-12 03:39:20','2026-10-12 03:39:20'),(2,'Supervisor','web','2026-10-12 03:39:20','2026-10-12 03:39:20'),(3,'Staf','web','2026-10-12 03:39:20','2026-10-12 03:39:20'),(4,'Teknisi','web','2026-10-12 03:39:20','2026-10-12 03:39:20'),(5,'Pelapor','web','2026-10-12 03:39:21','2026-10-12 03:39:21');
/*!40000 ALTER TABLE `roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `satuans`
--

DROP TABLE IF EXISTS `satuans`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `satuans` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `kode_satuan` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `nama_satuan` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `alamat` text COLLATE utf8mb4_unicode_ci,
  `is_verified` tinyint(1) NOT NULL DEFAULT '0',
  `pending_action` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `pending_changes` json DEFAULT NULL,
  `latitude` decimal(10,8) DEFAULT NULL,
  `longitude` decimal(11,8) DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `satuans_nama_satuan_unique` (`nama_satuan`),
  UNIQUE KEY `satuans_kode_satuan_unique` (`kode_satuan`)
) ENGINE=InnoDB AUTO_INCREMENT=49 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `satuans`
--

LOCK TABLES `satuans` WRITE;
/*!40000 ALTER TABLE `satuans` DISABLE KEYS */;
INSERT INTO `satuans` VALUES (1,'SAT-001','MAKOSTRAD','Jl. Medan Merdeka, Jakarta Pusat, DKI Jakarta',1,NULL,NULL,-6.17380000,106.82860000,1,'2026-10-12 03:39:19','2026-10-12 03:39:19'),(2,'SAT-002','DIVIF 1 KOSTRAD','Cilodong, Kota Depok, Jawa Barat',1,NULL,NULL,-6.43850000,106.84580000,1,'2026-10-12 03:39:19','2026-10-12 03:39:19'),(3,'SAT-003','DIVIF 2 KOSTRAD','Singosari, Kabupaten Malang, Jawa Timur',1,NULL,NULL,-7.87610000,112.66870000,1,'2026-10-12 03:39:19','2026-10-12 03:39:19'),(4,'SAT-004','DIVIF 3 KOSTRAD','Pakatto, Kabupaten Gowa, Sulawesi Selatan',1,NULL,NULL,-5.22850000,119.51680000,1,'2026-10-12 03:39:19','2026-10-12 03:39:19'),(5,'SAT-005','MAKO KOPASSUS','Cijantung, Kec. Ps. Rebo, Kota Jakarta Timur, DKI Jakarta',1,NULL,NULL,-6.31680000,106.85960000,1,'2026-10-12 03:39:19','2026-10-12 03:39:19'),(6,'SAT-006','GRUP 1 KOPASSUS','Markas Grup 1 Kopassus, Indonesia',1,NULL,NULL,-6.10370000,106.11580000,1,'2026-10-12 03:39:19','2026-10-12 03:39:19'),(7,'SAT-007','GRUP 2 KOPASSUS','Markas Grup 2 Kopassus, Indonesia',1,NULL,NULL,-7.54890000,110.74100000,1,'2026-10-12 03:39:19','2026-10-12 03:39:19'),(8,'SAT-008','PUSDIKLATPASSUS','Markas Pusdiklatpassus, Indonesia',1,NULL,NULL,-6.92480000,107.49120000,1,'2026-10-12 03:39:19','2026-10-12 03:39:19'),(9,'SAT-009','MAKO MARINIR','Jl. Medan Merdeka, Jakarta Pusat, DKI Jakarta',1,NULL,NULL,-6.17790000,106.83780000,1,'2026-10-12 03:39:19','2026-10-12 03:39:19'),(10,'SAT-010','PASMAR 1','Markas Pasmar 1, Indonesia',1,NULL,NULL,-6.10390000,106.94550000,1,'2026-10-12 03:39:19','2026-10-12 03:39:19'),(11,'SAT-011','PASMAR 2','Markas Pasmar 2, Indonesia',1,NULL,NULL,-7.39160000,112.72460000,1,'2026-10-12 03:39:19','2026-10-12 03:39:19'),(12,'SAT-012','PASMAR 3','Markas Pasmar 3, Indonesia',1,NULL,NULL,-0.89310000,131.31290000,1,'2026-10-12 03:39:20','2026-10-12 03:39:20'),(13,'SAT-013','LANTAMAL III','Markas Lantamal Iii, Indonesia',1,NULL,NULL,-6.13050000,106.82670000,1,'2026-10-12 03:39:20','2026-10-12 03:39:20'),(14,'SAT-014','LANTAMAL V','Markas Lantamal V, Indonesia',1,NULL,NULL,-7.20230000,112.73810000,1,'2026-10-12 03:39:20','2026-10-12 03:39:20'),(15,'SAT-015','MAKO KOPASGAT','Markas Mako Kopasgat, Indonesia',1,NULL,NULL,-6.97490000,107.54480000,1,'2026-10-12 03:39:20','2026-10-12 03:39:20'),(16,'SAT-016','LANUD HALIM PERDANAKUSUMA','Markas Lanud Halim Perdanakusuma, Indonesia',1,NULL,NULL,-6.26550000,106.88560000,1,'2026-10-12 03:39:20','2026-10-12 03:39:20'),(17,'SAT-017','LANUD ISWAHJUDI','Markas Lanud Iswahjudi, Indonesia',1,NULL,NULL,-7.61630000,111.43610000,1,'2026-10-12 03:39:20','2026-10-12 03:39:20'),(18,'SAT-018','LANUD ROESMIN NURJADIN','Markas Lanud Roesmin Nurjadin, Indonesia',1,NULL,NULL,-0.46080000,101.44750000,1,'2026-10-12 03:39:20','2026-10-12 03:39:20'),(19,'SAT-019','LANUD SULTAN HASANUDDIN','Markas Lanud Sultan Hasanuddin, Indonesia',1,NULL,NULL,-5.06160000,119.55400000,1,'2026-10-12 03:39:20','2026-10-12 03:39:20'),(20,'SAT-020','LANUD SUPADIO','Markas Lanud Supadio, Indonesia',1,NULL,NULL,-0.14480000,109.40420000,1,'2026-10-12 03:39:20','2026-10-12 03:39:20'),(21,'SAT-021','BENGPUSKOMLEKAD','Markas Bengpuskomlekad, Indonesia',1,NULL,NULL,-6.91470000,107.60980000,1,'2026-10-12 03:39:20','2026-10-12 03:39:20'),(22,'SAT-022','KODAM JAYA','Markas Kodam Jaya, Indonesia',1,NULL,NULL,-6.25500000,106.87700000,1,'2026-10-12 03:39:20','2026-10-12 03:39:20'),(23,'SAT-023','KODAM III/SILIWANGI','Kota Bandung, Jawa Barat',1,NULL,NULL,-6.91470000,107.60980000,1,'2026-10-12 03:39:20','2026-10-12 03:39:20'),(24,'SAT-024','KODAM IV/DIPONEGORO','Markas Kodam Iv/diponegoro, Indonesia',1,NULL,NULL,-7.04800000,110.40900000,1,'2026-10-12 03:39:20','2026-10-12 03:39:20'),(25,'SAT-025','KODAM V/BRAWIJAYA','Markas Kodam V/brawijaya, Indonesia',1,NULL,NULL,-7.28900000,112.72100000,1,'2026-10-12 03:39:20','2026-10-12 03:39:20'),(26,'SAT-026','KODAM I/BUKIT BARISAN','Markas Kodam I/bukit Barisan, Indonesia',1,NULL,NULL,3.59500000,98.67200000,1,'2026-10-12 03:39:20','2026-10-12 03:39:20'),(27,'SAT-027','KODAM XIV/HASANUDDIN','Markas Kodam Xiv/hasanuddin, Indonesia',1,NULL,NULL,-5.14700000,119.43200000,1,'2026-10-12 03:39:20','2026-10-12 03:39:20'),(28,'SAT-028','KODAM XVII/CENDERAWASIH','Markas Kodam Xvii/cenderawasih, Indonesia',1,NULL,NULL,-2.59100000,140.66900000,1,'2026-10-12 03:39:20','2026-10-12 03:39:20'),(29,'SAT-029','KODAM VI/MULAWARMAN','Markas Kodam Vi/mulawarman, Indonesia',1,NULL,NULL,-1.24200000,116.85200000,1,'2026-10-12 03:39:20','2026-10-12 03:39:20'),(30,'SAT-030','KODAM IX/UDAYANA','Markas Kodam Ix/udayana, Indonesia',1,NULL,NULL,-8.67000000,115.21200000,1,'2026-10-12 03:39:20','2026-10-12 03:39:20'),(31,'SAT-031','AKMIL','Jl. Gatot Subroto, Magelang Tengah, Kota Magelang, Jawa Tengah',1,NULL,NULL,-7.47890000,110.21700000,1,'2026-10-12 03:39:20','2026-10-12 03:39:20'),(32,'SAT-032','YONIF RAIDER 303/SSM','Markas Yonif Raider 303/ssm, Indonesia',1,NULL,NULL,-7.22860000,107.90890000,1,'2026-10-12 03:39:20','2026-10-12 03:39:20'),(33,'SAT-033','YONIF 315/GARUDA','Markas Yonif 315/garuda, Indonesia',1,NULL,NULL,-6.59500000,106.81660000,1,'2026-10-12 03:39:20','2026-10-12 03:39:20'),(34,'SAT-034','PUSDIKIF PUSSENIF','Markas Pusdikif Pussenif, Indonesia',1,NULL,NULL,-6.83750000,107.46670000,1,'2026-10-12 03:39:20','2026-10-12 03:39:20'),(35,'SAT-035','SATUAN RADAR 211','Markas Satuan Radar 211, Indonesia',1,NULL,NULL,-6.10390000,106.94550000,1,'2026-10-12 03:39:20','2026-10-12 03:39:20'),(36,'SAT-036','YONIF PARA RAIDER 501','Markas Yonif Para Raider 501, Indonesia',1,NULL,NULL,-7.61980000,111.53090000,1,'2026-10-12 03:39:20','2026-10-12 03:39:20'),(37,'SAT-037','YONIF RAIDER 509','Markas Yonif Raider 509, Indonesia',1,NULL,NULL,-8.17410000,113.71980000,1,'2026-10-12 03:39:20','2026-10-12 03:39:20'),(38,'SAT-038','YONIF RAIDER 328','Markas Yonif Raider 328, Indonesia',1,NULL,NULL,-6.44390000,106.83330000,1,'2026-10-12 03:39:20','2026-10-12 03:39:20'),(39,'SAT-039','YONIF RAIDER 300','Markas Yonif Raider 300, Indonesia',1,NULL,NULL,-6.81150000,107.15280000,1,'2026-10-12 03:39:20','2026-10-12 03:39:20'),(40,'SAT-040','YON ARMED 9','Markas Yon Armed 9, Indonesia',1,NULL,NULL,-6.56250000,107.44750000,1,'2026-10-12 03:39:20','2026-10-12 03:39:20'),(41,'SAT-041','YON KAV 4','Markas Yon Kav 4, Indonesia',1,NULL,NULL,-6.92340000,107.62580000,1,'2026-10-12 03:39:20','2026-10-12 03:39:20'),(42,'SAT-042','YONIF 310','Markas Yonif 310, Indonesia',1,NULL,NULL,-6.94580000,106.91280000,1,'2026-10-12 03:39:20','2026-10-12 03:39:20'),(43,'SAT-043','YONIF RAIDER 323','Markas Yonif Raider 323, Indonesia',1,NULL,NULL,-7.37580000,108.56670000,1,'2026-10-12 03:39:20','2026-10-12 03:39:20'),(44,'SAT-044','YON ARHANUD 3','Markas Yon Arhanud 3, Indonesia',1,NULL,NULL,-6.90690000,107.63690000,1,'2026-10-12 03:39:20','2026-10-12 03:39:20'),(45,'SAT-045','YONIF 320','Markas Yonif 320, Indonesia',1,NULL,NULL,-6.31280000,105.85280000,1,'2026-10-12 03:39:20','2026-10-12 03:39:20'),(46,'SAT-046','YON ARMED 4','Markas Yon Armed 4, Indonesia',1,NULL,NULL,-6.88580000,107.54580000,1,'2026-10-12 03:39:20','2026-10-12 03:39:20'),(47,'SAT-047','YON KAV 9','Markas Yon Kav 9, Indonesia',1,NULL,NULL,-6.27580000,106.66670000,1,'2026-10-12 03:39:20','2026-10-12 03:39:20'),(48,'SAT-048','YON ARHANUD 10','Markas Yon Arhanud 10, Indonesia',1,NULL,NULL,-6.25880000,106.82280000,1,'2026-10-12 03:39:20','2026-10-12 03:39:20');
/*!40000 ALTER TABLE `satuans` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sessions`
--

DROP TABLE IF EXISTS `sessions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sessions` (
  `id` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` bigint unsigned DEFAULT NULL,
  `ip_address` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `user_agent` text COLLATE utf8mb4_unicode_ci,
  `payload` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `last_activity` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `sessions_user_id_index` (`user_id`),
  KEY `sessions_last_activity_index` (`last_activity`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sessions`
--

LOCK TABLES `sessions` WRITE;
/*!40000 ALTER TABLE `sessions` DISABLE KEYS */;
INSERT INTO `sessions` VALUES ('4BwGAvkqUIfuFTYM3PBrX524WFPMLjipveJsTF2W',4,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36','eyJfdG9rZW4iOiJjbnJQak5od0hKMERERWlFbUtUdERVUmZSQ1N2c0dlUEZKOTh4NnNpIiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHA6XC9cLzEyNy4wLjAuMTo4MDAxXC9wZWxhcG9yIiwicm91dGUiOm51bGx9LCJfZmxhc2giOnsib2xkIjpbXSwibmV3IjpbXX0sImxvZ2luX3dlYl81OWJhMzZhZGRjMmIyZjk0MDE1ODBmMDE0YzdmNThlYTRlMzA5ODlkIjo0fQ==',1791803591);
/*!40000 ALTER TABLE `sessions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `system_logs`
--

DROP TABLE IF EXISTS `system_logs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `system_logs` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `level` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` bigint unsigned DEFAULT NULL,
  `activity_payload` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `system_logs_user_id_foreign` (`user_id`),
  CONSTRAINT `system_logs_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `system_logs`
--

LOCK TABLES `system_logs` WRITE;
/*!40000 ALTER TABLE `system_logs` DISABLE KEYS */;
INSERT INTO `system_logs` VALUES (1,'WARN',4,'Mengirimkan laporan kerusakan baru di lokasi: AKMIL','2026-10-12 10:31:37','2026-10-12 10:31:37'),(2,'WARN',4,'Mengirimkan laporan kerusakan baru di lokasi: AKMIL','2026-10-12 10:34:28','2026-10-12 10:34:28'),(3,'WARN',4,'Mengirimkan laporan kerusakan baru di lokasi: AKMIL','2026-10-12 10:59:47','2026-10-12 10:59:47');
/*!40000 ALTER TABLE `system_logs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `unit_mutations`
--

DROP TABLE IF EXISTS `unit_mutations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `unit_mutations` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `unit_id` bigint unsigned DEFAULT NULL,
  `type` enum('request_add','request_delete','approved_add','approved_delete','rejected_add','rejected_delete','restore') COLLATE utf8mb4_unicode_ci NOT NULL,
  `reason` text COLLATE utf8mb4_unicode_ci,
  `document_path` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `requested_by` bigint unsigned NOT NULL,
  `approved_by` bigint unsigned DEFAULT NULL,
  `status` enum('pending','approved','rejected') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'pending',
  `admin_notes` text COLLATE utf8mb4_unicode_ci,
  `unit_data` json DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `unit_mutations_unit_id_foreign` (`unit_id`),
  KEY `unit_mutations_requested_by_foreign` (`requested_by`),
  KEY `unit_mutations_approved_by_foreign` (`approved_by`),
  CONSTRAINT `unit_mutations_approved_by_foreign` FOREIGN KEY (`approved_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `unit_mutations_requested_by_foreign` FOREIGN KEY (`requested_by`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `unit_mutations_unit_id_foreign` FOREIGN KEY (`unit_id`) REFERENCES `units` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `unit_mutations`
--

LOCK TABLES `unit_mutations` WRITE;
/*!40000 ALTER TABLE `unit_mutations` DISABLE KEYS */;
/*!40000 ALTER TABLE `unit_mutations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `units`
--

DROP TABLE IF EXISTS `units`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `units` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `nomor_seri` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `jenis` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `asal_satuan` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `satuan_id` bigint unsigned DEFAULT NULL,
  `status_unit` enum('Beroperasi','Rusak','Perbaikan','Nonaktif') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'Beroperasi',
  `deleted_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `units_nomor_seri_unique` (`nomor_seri`),
  KEY `units_satuan_id_foreign` (`satuan_id`),
  CONSTRAINT `units_satuan_id_foreign` FOREIGN KEY (`satuan_id`) REFERENCES `satuans` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=43 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `units`
--

LOCK TABLES `units` WRITE;
/*!40000 ALTER TABLE `units` DISABLE KEYS */;
INSERT INTO `units` VALUES (1,'PU - 42 - 001 - 2025','DART Pop Up','AKMIL',31,'Beroperasi',NULL,'2026-10-12 03:39:22','2026-10-12 03:39:22'),(2,'PU - 42 - 002 - 2025','DART Pop Up','AKMIL',31,'Rusak',NULL,'2026-10-12 03:39:22','2026-10-12 10:59:47'),(3,'FL - 42 - 001 - 2025','DART Flip','YONIF RAIDER 303/SSM',32,'Rusak',NULL,'2026-10-12 03:39:22','2026-10-12 03:39:22'),(4,'PU - 42 - 003 - 2025','DART Pop Up','YONIF RAIDER 303/SSM',32,'Rusak',NULL,'2026-10-12 03:39:22','2026-10-12 03:39:22'),(5,'SW - 42 - 001 - 2025','DART Swing','YONIF 315/GARUDA',33,'Beroperasi',NULL,'2026-10-12 03:39:22','2026-10-12 03:39:22'),(6,'MV - 42 - 001 - 2025','Moving Target','YONIF 315/GARUDA',33,'Beroperasi',NULL,'2026-10-12 03:39:22','2026-10-12 03:39:22'),(7,'FL - 42 - 002 - 2025','DART Flip','PUSDIKIF PUSSENIF',34,'Rusak',NULL,'2026-10-12 03:39:22','2026-10-12 10:31:37'),(8,'PU - 42 - 004 - 2025','DART Pop Up','PUSDIKIF PUSSENIF',34,'Nonaktif',NULL,'2026-10-12 03:39:22','2026-10-12 03:39:22'),(9,'SW - 42 - 002 - 2025','DART Swing','BENGPUSKOMLEKAD',21,'Beroperasi',NULL,'2026-10-12 03:39:22','2026-10-12 03:39:22'),(10,'MV - 42 - 002 - 2025','Moving Target','BENGPUSKOMLEKAD',21,'Beroperasi',NULL,'2026-10-12 03:39:22','2026-10-12 03:39:22'),(11,'PU - 42 - 005 - 2025','DART Pop Up','GRUP 1 KOPASSUS',6,'Beroperasi',NULL,'2026-10-12 03:39:22','2026-10-12 03:39:22'),(12,'PU - 42 - 006 - 2025','DART Pop Up','GRUP 1 KOPASSUS',6,'Rusak',NULL,'2026-10-12 03:39:22','2026-10-12 03:39:22'),(13,'SW - 42 - 003 - 2025','DART Swing','GRUP 2 KOPASSUS',7,'Beroperasi',NULL,'2026-10-12 03:39:22','2026-10-12 03:39:22'),(14,'FL - 42 - 003 - 2025','DART Flip','GRUP 2 KOPASSUS',7,'Beroperasi',NULL,'2026-10-12 03:39:22','2026-10-12 03:39:22'),(15,'MV - 42 - 003 - 2025','Moving Target','YONIF PARA RAIDER 501',36,'Perbaikan',NULL,'2026-10-12 03:39:22','2026-10-12 03:39:22'),(16,'PU - 42 - 007 - 2025','DART Pop Up','YONIF PARA RAIDER 501',36,'Beroperasi',NULL,'2026-10-12 03:39:22','2026-10-12 03:39:22'),(17,'FL - 42 - 004 - 2025','DART Flip','YONIF RAIDER 509',37,'Beroperasi',NULL,'2026-10-12 03:39:22','2026-10-12 03:39:22'),(18,'SW - 42 - 004 - 2025','DART Swing','YONIF RAIDER 509',37,'Nonaktif',NULL,'2026-10-12 03:39:22','2026-10-12 03:39:22'),(19,'PU - 42 - 008 - 2025','DART Pop Up','YONIF RAIDER 328',38,'Beroperasi',NULL,'2026-10-12 03:39:22','2026-10-12 03:39:22'),(20,'MV - 42 - 004 - 2025','Moving Target','YONIF RAIDER 328',38,'Beroperasi',NULL,'2026-10-12 03:39:22','2026-10-12 03:39:22'),(21,'PU - 42 - 009 - 2025','DART Pop Up','YONIF RAIDER 300',39,'Beroperasi',NULL,'2026-10-12 03:39:22','2026-10-12 03:39:22'),(22,'FL - 42 - 005 - 2025','DART Flip','YONIF RAIDER 300',39,'Beroperasi',NULL,'2026-10-12 03:39:22','2026-10-12 03:39:22'),(23,'PU - 42 - 010 - 2025','DART Pop Up','YON ARMED 9',40,'Beroperasi',NULL,'2026-10-12 03:39:22','2026-10-12 03:39:22'),(24,'SW - 42 - 005 - 2025','DART Swing','YON ARMED 9',40,'Beroperasi',NULL,'2026-10-12 03:39:22','2026-10-12 03:39:22'),(25,'MV - 42 - 005 - 2025','Moving Target','YON KAV 4',41,'Beroperasi',NULL,'2026-10-12 03:39:22','2026-10-12 03:39:22'),(26,'PU - 42 - 011 - 2025','DART Pop Up','YON KAV 4',41,'Beroperasi',NULL,'2026-10-12 03:39:22','2026-10-12 03:39:22'),(27,'SW - 42 - 006 - 2025','DART Swing','YONIF 310',42,'Beroperasi',NULL,'2026-10-12 03:39:22','2026-10-12 03:39:22'),(28,'MV - 42 - 006 - 2025','Moving Target','YONIF 310',42,'Beroperasi',NULL,'2026-10-12 03:39:22','2026-10-12 03:39:22'),(29,'PU - 42 - 012 - 2025','DART Pop Up','YONIF RAIDER 323',43,'Beroperasi',NULL,'2026-10-12 03:39:22','2026-10-12 03:39:22'),(30,'FL - 42 - 006 - 2025','DART Flip','YONIF RAIDER 323',43,'Beroperasi',NULL,'2026-10-12 03:39:22','2026-10-12 03:39:22'),(31,'SW - 42 - 007 - 2025','DART Swing','YON ARHANUD 3',44,'Beroperasi',NULL,'2026-10-12 03:39:22','2026-10-12 03:39:22'),(32,'FL - 42 - 007 - 2025','DART Flip','YON ARHANUD 3',44,'Beroperasi',NULL,'2026-10-12 03:39:22','2026-10-12 03:39:22'),(33,'MV - 42 - 007 - 2025','Moving Target','SATUAN RADAR 211',35,'Beroperasi',NULL,'2026-10-12 03:39:22','2026-10-12 03:39:22'),(34,'PU - 42 - 013 - 2025','DART Pop Up','SATUAN RADAR 211',35,'Nonaktif',NULL,'2026-10-12 03:39:22','2026-10-12 03:39:22'),(35,'FL - 42 - 008 - 2025','DART Flip','YONIF 320',45,'Beroperasi',NULL,'2026-10-12 03:39:22','2026-10-12 03:39:22'),(36,'MV - 42 - 008 - 2025','Moving Target','YONIF 320',45,'Beroperasi',NULL,'2026-10-12 03:39:22','2026-10-12 03:39:22'),(37,'PU - 42 - 014 - 2025','DART Pop Up','YON ARMED 4',46,'Beroperasi',NULL,'2026-10-12 03:39:22','2026-10-12 03:39:22'),(38,'FL - 42 - 009 - 2025','DART Flip','YON ARMED 4',46,'Beroperasi',NULL,'2026-10-12 03:39:22','2026-10-12 03:39:22'),(39,'SW - 42 - 008 - 2025','DART Swing','YON KAV 9',47,'Beroperasi',NULL,'2026-10-12 03:39:22','2026-10-12 03:39:22'),(40,'PU - 42 - 015 - 2025','DART Pop Up','YON KAV 9',47,'Beroperasi',NULL,'2026-10-12 03:39:22','2026-10-12 03:39:22'),(41,'SW - 42 - 009 - 2025','DART Swing','YON ARHANUD 10',48,'Beroperasi',NULL,'2026-10-12 03:39:22','2026-10-12 03:39:22'),(42,'MV - 42 - 009 - 2025','Moving Target','YON ARHANUD 10',48,'Beroperasi',NULL,'2026-10-12 03:39:22','2026-10-12 03:39:22');
/*!40000 ALTER TABLE `units` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_mutations`
--

DROP TABLE IF EXISTS `user_mutations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_mutations` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `target_user_id` bigint unsigned DEFAULT NULL,
  `type` enum('request_add','request_edit','request_delete','approved_add','approved_edit','approved_delete','rejected_add','rejected_edit','rejected_delete') COLLATE utf8mb4_unicode_ci NOT NULL,
  `reason` text COLLATE utf8mb4_unicode_ci,
  `requested_by` bigint unsigned NOT NULL,
  `approved_by` bigint unsigned DEFAULT NULL,
  `status` enum('pending','approved','rejected') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'pending',
  `admin_notes` text COLLATE utf8mb4_unicode_ci,
  `user_data` json DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `user_mutations_target_user_id_foreign` (`target_user_id`),
  KEY `user_mutations_requested_by_foreign` (`requested_by`),
  KEY `user_mutations_approved_by_foreign` (`approved_by`),
  CONSTRAINT `user_mutations_approved_by_foreign` FOREIGN KEY (`approved_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `user_mutations_requested_by_foreign` FOREIGN KEY (`requested_by`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `user_mutations_target_user_id_foreign` FOREIGN KEY (`target_user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_mutations`
--

LOCK TABLES `user_mutations` WRITE;
/*!40000 ALTER TABLE `user_mutations` DISABLE KEYS */;
/*!40000 ALTER TABLE `user_mutations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `username` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `nama_lengkap` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `nrp_nip` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `asal_satuan` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `satuan_id` bigint unsigned DEFAULT NULL,
  `no_wa` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `spesialisasi` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `is_approved` tinyint(1) NOT NULL DEFAULT '0',
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `remember_token` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `locked_until` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_username_unique` (`username`),
  UNIQUE KEY `users_nrp_nip_unique` (`nrp_nip`),
  UNIQUE KEY `users_email_unique` (`email`),
  KEY `users_satuan_id_foreign` (`satuan_id`),
  CONSTRAINT `users_satuan_id_foreign` FOREIGN KEY (`satuan_id`) REFERENCES `satuans` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'admin','admin@pusat.mil.id','$2y$12$t4t9DIZXNZbmFZzSoa3kee/VD/nToaMoMutYPs8MwPAMf2p/UyLLG','Komandan Pusat','1100223344',NULL,NULL,'081234567890',NULL,1,1,NULL,'2026-10-12 03:39:21','2026-10-12 03:39:21',NULL,NULL),(2,'staf1','staf1@komando.mil.id','$2y$12$WGTsA9M6yFiHsKoYw/iMQeGzK/aSAXn7V9n7G.3eLuIsvGjIkZcc.','Staf Komando 01','2200334455',NULL,NULL,'082345678901',NULL,1,1,NULL,'2026-10-12 03:39:21','2026-10-12 03:39:21',NULL,NULL),(3,'teknisi1','teknisi1@bengpus.mil.id','$2y$12$7gcq0wIhj5Fu9TqJtuC2g.1IeWC5euaJ/coHteJJObW26VLKCZx4G','Teknisi Alfa','3300445566',NULL,NULL,'083456789012','Mekanik, Elektronik & Jaringan Komunikasi',1,1,NULL,'2026-10-12 03:39:22','2026-10-12 03:39:22',NULL,NULL),(4,'pelapor1','operator@akmil.ac.id','$2y$12$0Fwc8SVVmU4XtYhUohlrruQ/d9YQPLv0vczciydcRA/ZOp2Zz.diS','Operator Satkai AKMIL','4400556677','AKMIL',31,'084567890123',NULL,1,1,NULL,'2026-10-12 03:39:22','2026-10-12 03:39:22',NULL,NULL);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-10-12 18:52:08
