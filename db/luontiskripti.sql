-- MySQL Script generated by MySQL Workbench
-- 05/05/17 15:30:16
-- Model: New Model    Version: 1.0
-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='TRADITIONAL,ALLOW_INVALID_DATES';

-- -----------------------------------------------------
-- Schema mydb
-- -----------------------------------------------------
DROP SCHEMA IF EXISTS `mydb` ;

-- -----------------------------------------------------
-- Schema mydb
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `mydb` DEFAULT CHARACTER SET utf8 ;
USE `mydb` ;

-- -----------------------------------------------------
-- Table `mydb`.`Movie`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `mydb`.`Movie` ;

CREATE TABLE IF NOT EXISTS `mydb`.`Movie` (
  `idMovie` INT NOT NULL AUTO_INCREMENT,
  `title` VARCHAR(255) NULL,
  PRIMARY KEY (`idMovie`))
ENGINE = InnoDB
COMMENT = 'Elokuva, tiedot';


-- -----------------------------------------------------
-- Table `mydb`.`Theater`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `mydb`.`Theater` ;

CREATE TABLE IF NOT EXISTS `mydb`.`Theater` (
  `idTheater` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(255) NOT NULL,
  PRIMARY KEY (`idTheater`))
ENGINE = InnoDB
COMMENT = 'Elokuvateatteri, tiedot';


-- -----------------------------------------------------
-- Table `mydb`.`Auditorium`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `mydb`.`Auditorium` ;

CREATE TABLE IF NOT EXISTS `mydb`.`Auditorium` (
  `idAuditorium` INT NOT NULL AUTO_INCREMENT,
  `idTheater` INT NOT NULL,
  PRIMARY KEY (`idAuditorium`),
  INDEX `fk_theater_idx` (`idTheater` ASC),
  CONSTRAINT `fk_theater`
    FOREIGN KEY (`idTheater`)
    REFERENCES `mydb`.`Theater` (`idTheater`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB
COMMENT = 'Sali, liittyy yhteen teatteriin';


-- -----------------------------------------------------
-- Table `mydb`.`Screening`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `mydb`.`Screening` ;

CREATE TABLE IF NOT EXISTS `mydb`.`Screening` (
  `idScreening` INT NOT NULL AUTO_INCREMENT,
  `idMovie` INT NOT NULL,
  `time` DATETIME NOT NULL,
  `idAuditorium` INT NOT NULL,
  PRIMARY KEY (`idScreening`),
  INDEX `fk_auditorium_idx` (`idAuditorium` ASC),
  INDEX `fk_movie_idx` (`idMovie` ASC),
  CONSTRAINT `fk_auditorium`
    FOREIGN KEY (`idAuditorium`)
    REFERENCES `mydb`.`Auditorium` (`idAuditorium`)
    ON DELETE RESTRICT
    ON UPDATE CASCADE,
  CONSTRAINT `fk_movie`
    FOREIGN KEY (`idMovie`)
    REFERENCES `mydb`.`Movie` (`idMovie`)
    ON DELETE RESTRICT
    ON UPDATE CASCADE)
ENGINE = InnoDB
COMMENT = 'Esitys';


-- -----------------------------------------------------
-- Table `mydb`.`Seat`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `mydb`.`Seat` ;

CREATE TABLE IF NOT EXISTS `mydb`.`Seat` (
  `idSeat` INT NOT NULL AUTO_INCREMENT,
  `row` INT NOT NULL,
  `number` INT NOT NULL,
  `idAuditorium` INT NOT NULL,
  PRIMARY KEY (`idSeat`),
  INDEX `fk_auditorium_idx` (`idAuditorium` ASC),
  CONSTRAINT `fk_auditorium`
    FOREIGN KEY (`idAuditorium`)
    REFERENCES `mydb`.`Auditorium` (`idAuditorium`)
    ON DELETE RESTRICT
    ON UPDATE CASCADE)
ENGINE = InnoDB
COMMENT = 'Paikka, paikan numero sekä salin ID määrittää';


-- -----------------------------------------------------
-- Table `mydb`.`User`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `mydb`.`User` ;

CREATE TABLE IF NOT EXISTS `mydb`.`User` (
  `idUser` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(45) NOT NULL,
  `email` VARCHAR(255) NOT NULL,
  `password` VARCHAR(255) NOT NULL,
  PRIMARY KEY (`idUser`))
ENGINE = InnoDB
COMMENT = 'Järjestelmän käyttäjä/teattereiden asiakas. Voi varata paikkoja näytökseen.';


-- -----------------------------------------------------
-- Table `mydb`.`Booking`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `mydb`.`Booking` ;

CREATE TABLE IF NOT EXISTS `mydb`.`Booking` (
  `idBooking` INT NOT NULL AUTO_INCREMENT,
  `idUser` INT NOT NULL,
  `idScreening` INT NOT NULL,
  `idSeat` INT NOT NULL,
  PRIMARY KEY (`idBooking`),
  INDEX `fk_user_idx` (`idUser` ASC),
  INDEX `fk_screening_idx` (`idScreening` ASC),
  INDEX `fk_seat_idx` (`idSeat` ASC),
  CONSTRAINT `fk_user`
    FOREIGN KEY (`idUser`)
    REFERENCES `mydb`.`User` (`idUser`)
    ON DELETE RESTRICT
    ON UPDATE CASCADE,
  CONSTRAINT `fk_screening`
    FOREIGN KEY (`idScreening`)
    REFERENCES `mydb`.`Screening` (`idScreening`)
    ON DELETE RESTRICT
    ON UPDATE CASCADE,
  CONSTRAINT `fk_seat`
    FOREIGN KEY (`idSeat`)
    REFERENCES `mydb`.`Seat` (`idSeat`)
    ON DELETE RESTRICT
    ON UPDATE CASCADE)
ENGINE = InnoDB
COMMENT = 'Varaus, liittää näytöksen, käyttäjän ja paikan';

SET SQL_MODE = '';
GRANT USAGE ON *.* TO admin;
 DROP USER admin;
SET SQL_MODE='TRADITIONAL,ALLOW_INVALID_DATES';
CREATE USER 'admin' IDENTIFIED BY 'sinapketsup';

GRANT ALL ON `mydb`.* TO 'admin';
SET SQL_MODE = '';
GRANT USAGE ON *.* TO webuser;
 DROP USER webuser;
SET SQL_MODE='TRADITIONAL,ALLOW_INVALID_DATES';
CREATE USER 'webuser' IDENTIFIED BY 'rullakkebab';

GRANT SELECT ON TABLE `mydb`.* TO 'webuser';
GRANT SELECT, INSERT, TRIGGER ON TABLE `mydb`.* TO 'webuser';

SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;