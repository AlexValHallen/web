-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='TRADITIONAL,ALLOW_INVALID_DATES';

-- -----------------------------------------------------
-- Schema smol2019_july
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema smol2019_july
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `smol2019_july` DEFAULT CHARACTER SET utf8 ;
USE `smol2019_july` ;

-- -----------------------------------------------------
-- Table `smol2019_july`.`MinerStat`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `smol2019_july`.`MinerStat` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `updatedAt` DATETIME NOT NULL,
  `IpAddr` VARCHAR(60) NOT NULL,
  `Hostname` VARCHAR(60) NOT NULL,
  `Type` VARCHAR(60) NOT NULL,
  `Uptime` VARCHAR(60) NOT NULL,
  `MacAddr` VARCHAR(60) NOT NULL,
  `HardwareVer` VARCHAR(100) NOT NULL,
  `KernelVer` VARCHAR(100) NOT NULL,
  `FsVer` VARCHAR(100) NOT NULL,
  `LogicVer` VARCHAR(45) NOT NULL DEFAULT '?',
  `createdAt` DATETIME NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `IpAddr_UNIQUE` (`IpAddr` ASC))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `smol2019_july`.`MinerChains`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `smol2019_july`.`MinerChains` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `updatedAt` DATETIME NOT NULL,
  `IpAddr` VARCHAR(45) NOT NULL,
  `ChainNum` INT NOT NULL,
  `AsicNum` INT NOT NULL,
  `HRateIl` FLOAT NOT NULL,
  `HRateRt` FLOAT NOT NULL,
  `Freq` FLOAT NOT NULL,
  `HWErr` INT NOT NULL,
  `Temperature` INT NOT NULL,
  `AsicStat` VARCHAR(255) NOT NULL,
  `createdAt` DATETIME NOT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `smol2019_july`.`MinerConfig`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `smol2019_july`.`MinerConfig` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `updatedAt` DATETIME NOT NULL,
  `IpAddr` VARCHAR(60) NOT NULL,
  `Pool1` VARCHAR(60) NULL,
  `Wallet1` VARCHAR(60) NULL,
  `Pool2` VARCHAR(60) NULL,
  `Wallet2` VARCHAR(60) NULL,
  `Pool3` VARCHAR(60) NULL,
  `Wallet3` VARCHAR(60) NULL,
  `createdAt` DATETIME NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `IpAddr_UNIQUE` (`IpAddr` ASC))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `smol2019_july`.`OtherInfo`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `smol2019_july`.`OtherInfo` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `updatedAt` DATETIME NOT NULL,
  `IpAddr` VARCHAR(45) NOT NULL,
  `Uptime` INT NOT NULL,
  `RtHashrate` FLOAT NOT NULL,
  `AvgHashrate` FLOAT NOT NULL,
  `ActiveFans` INT NOT NULL,
  `AvgTemperature` INT NOT NULL,
  `AliveChains` INT NOT NULL,
  `User` VARCHAR(255) NOT NULL,
  `LsTime` INT NOT NULL,
  `AsicStatus` VARCHAR(45) NOT NULL,
  `createdAt` DATETIME NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `IpAddr_UNIQUE` (`IpAddr` ASC))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `smol2019_july`.`OnlineMiners`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `smol2019_july`.`OnlineMiners` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `updatedAt` DATETIME NOT NULL,
  `IpAddr` VARCHAR(45) NOT NULL,
  `OnlineStatus` TINYINT NOT NULL,
  `createdAt` DATETIME NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `IpAddr_UNIQUE` (`IpAddr` ASC))
ENGINE = InnoDB;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
