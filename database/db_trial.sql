/*
SQLyog Community v13.2.1 (64 bit)
MySQL - 10.4.32-MariaDB : Database - db_trial
*********************************************************************
*/

/*!40101 SET NAMES utf8 */;

/*!40101 SET SQL_MODE=''*/;

/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
CREATE DATABASE /*!32312 IF NOT EXISTS*/`db_trial` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci */;

USE `db_trial`;

/*Table structure for table `assignments` */

DROP TABLE IF EXISTS `assignments`;

CREATE TABLE `assignments` (
  `id_assignment` int(11) NOT NULL AUTO_INCREMENT,
  `courseId` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` varchar(255) NOT NULL,
  `deadline` datetime NOT NULL,
  `created_at` datetime NOT NULL,
  `file_url` longblob DEFAULT NULL,
  `file_type` varchar(100) DEFAULT NULL,
  `deleted_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id_assignment`),
  KEY `courseee` (`courseId`),
  CONSTRAINT `courseee` FOREIGN KEY (`courseId`) REFERENCES `course` (`id_course`)
) ENGINE=InnoDB AUTO_INCREMENT=38 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

/*Data for the table `assignments` */


/*Table structure for table `course` */

DROP TABLE IF EXISTS `course`;

CREATE TABLE `course` (
  `id_course` int(11) NOT NULL AUTO_INCREMENT,
  `adminId` int(11) NOT NULL,
  `lecturerId` int(11) NOT NULL,
  `majorId` int(11) NOT NULL,
  `semester` varchar(255) NOT NULL,
  `name_course` varchar(255) NOT NULL,
  `description` varchar(255) NOT NULL,
  `sks` int(11) DEFAULT NULL,
  `day` varchar(20) DEFAULT NULL,
  `start_time` varchar(100) DEFAULT NULL,
  `end_time` varchar(100) DEFAULT NULL,
  `deleted_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id_course`),
  KEY `adminnn` (`adminId`),
  KEY `prodiii` (`majorId`),
  KEY `dosennnn` (`lecturerId`),
  CONSTRAINT `adminnn` FOREIGN KEY (`adminId`) REFERENCES `user` (`id_user`),
  CONSTRAINT `dosennnn` FOREIGN KEY (`lecturerId`) REFERENCES `user` (`id_user`),
  CONSTRAINT `prodiii` FOREIGN KEY (`majorId`) REFERENCES `major` (`id_major`)
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

/*Data for the table `course` */


/*Table structure for table `faculty` */

DROP TABLE IF EXISTS `faculty`;

CREATE TABLE `faculty` (
  `id_faculty` int(11) NOT NULL AUTO_INCREMENT,
  `name_faculty` varchar(255) NOT NULL,
  PRIMARY KEY (`id_faculty`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

/*Data for the table `faculty` */

insert  into `faculty`(`id_faculty`,`name_faculty`) values 
(1,'Teknik dan Informatika'),
(2,'Hukum'),
(3,'Ekonomi dan Bisnis'),
(4,'Ilmu Sosial dan Humaniora');

/*Table structure for table `major` */

DROP TABLE IF EXISTS `major`;

CREATE TABLE `major` (
  `id_major` int(11) NOT NULL AUTO_INCREMENT,
  `facultyId` int(11) NOT NULL,
  `name_major` varchar(255) NOT NULL,
  PRIMARY KEY (`id_major`),
  KEY `jurusannn` (`facultyId`),
  CONSTRAINT `jurusannn` FOREIGN KEY (`facultyId`) REFERENCES `faculty` (`id_faculty`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

/*Data for the table `major` */

insert  into `major`(`id_major`,`facultyId`,`name_major`) values 
(1,1,'Teknologi Informasi'),
(2,2,'Hukum'),
(3,3,'Akutansi'),
(4,4,'Ilmu Komunikasi');

/*Table structure for table `material` */

DROP TABLE IF EXISTS `material`;

CREATE TABLE `material` (
  `id_material` int(11) NOT NULL AUTO_INCREMENT,
  `courseId` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `file_url` longblob DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `file_type` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id_material`),
  KEY `course` (`courseId`),
  CONSTRAINT `course` FOREIGN KEY (`courseId`) REFERENCES `course` (`id_course`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

/*Data for the table `material` */

/*Table structure for table `role` */

DROP TABLE IF EXISTS `role`;

CREATE TABLE `role` (
  `id_role` int(11) NOT NULL,
  `name_role` varchar(255) NOT NULL,
  PRIMARY KEY (`id_role`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

/*Data for the table `role` */

insert  into `role`(`id_role`,`name_role`) values 
(1,'admin'),
(2,'lecturer'),
(3,'student');

/*Table structure for table `submissions` */

DROP TABLE IF EXISTS `submissions`;

CREATE TABLE `submissions` (
  `id_submission` int(11) NOT NULL AUTO_INCREMENT,
  `assignmentId` int(11) NOT NULL,
  `studentId` int(11) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `submitted_at` datetime NOT NULL,
  `file_url` longblob DEFAULT NULL,
  `file_name` varchar(100) DEFAULT NULL,
  `file_type` varchar(100) DEFAULT NULL,
  `status` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`id_submission`),
  KEY `assignment` (`assignmentId`),
  KEY `mahasiswa` (`studentId`),
  CONSTRAINT `assignment` FOREIGN KEY (`assignmentId`) REFERENCES `assignments` (`id_assignment`),
  CONSTRAINT `mahasiswa` FOREIGN KEY (`studentId`) REFERENCES `user` (`id_user`)
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

/*Data for the table `submissions` */

/*Table structure for table `user` */

DROP TABLE IF EXISTS `user`;

CREATE TABLE `user` (
  `id_user` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `semester` int(11) NOT NULL,
  `roleId` int(11) NOT NULL,
  `facultyId` int(11) DEFAULT NULL,
  `majorId` int(11) DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id_user`),
  KEY `roless` (`roleId`),
  KEY `jurusann` (`facultyId`),
  KEY `prodii` (`majorId`),
  CONSTRAINT `jurusann` FOREIGN KEY (`facultyId`) REFERENCES `faculty` (`id_faculty`),
  CONSTRAINT `prodii` FOREIGN KEY (`majorId`) REFERENCES `major` (`id_major`),
  CONSTRAINT `roless` FOREIGN KEY (`roleId`) REFERENCES `role` (`id_role`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

/*Data for the table `user` */

insert  into `user`(`id_user`,`name`,`email`,`password`,`semester`,`roleId`,`facultyId`,`majorId`,`created_at`) values 
(1,'Admin Satu','admin@gmail.com','$2a$12$NvlGJlK20N1BoCMVlVNYjONm/Kh.JBU5dq1W1uitgl7ay.8CKoS.i',0,1,1,1,'2025-10-24 00:43:17');


/*Table structure for table `user_pending` */

DROP TABLE IF EXISTS `user_pending`;

CREATE TABLE `user_pending` (
  `id_pending` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `roleId` int(11) NOT NULL,
  `facultyId` int(11) NOT NULL,
  `majorId` int(11) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id_pending`),
  KEY `jurusan` (`facultyId`),
  KEY `roles` (`roleId`),
  KEY `prodi` (`majorId`),
  CONSTRAINT `jurusan` FOREIGN KEY (`facultyId`) REFERENCES `faculty` (`id_faculty`),
  CONSTRAINT `prodi` FOREIGN KEY (`majorId`) REFERENCES `major` (`id_major`),
  CONSTRAINT `roles` FOREIGN KEY (`roleId`) REFERENCES `role` (`id_role`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

/*Data for the table `user_pending` */

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
