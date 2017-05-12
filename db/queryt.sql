-- DATAN TYHJENNYS

SET FOREIGN_KEY_CHECKS = 0; -- disable a foreign keys check
SET AUTOCOMMIT = 0; -- disable autocommit
START TRANSACTION; -- begin transaction

DELETE FROM User;
ALTER TABLE User AUTO_INCREMENT = 1;

DELETE FROM Booking;
ALTER TABLE Booking AUTO_INCREMENT = 1;

DELETE FROM Screening;
ALTER TABLE Screening AUTO_INCREMENT = 1;

DELETE FROM Movie;
ALTER TABLE Movie AUTO_INCREMENT = 1;

DELETE FROM Seat;
ALTER TABLE Seat AUTO_INCREMENT = 1;

DELETE FROM Theater;
ALTER TABLE Theater AUTO_INCREMENT = 1;

DELETE FROM Auditorium;
ALTER TABLE auditorium AUTO_INCREMENT = 1;

SET FOREIGN_KEY_CHECKS = 1; -- enable a foreign keys check
COMMIT;  -- make a commit
SET AUTOCOMMIT = 1 ;

-- DATAN LUONTI

-- Leffat
INSERT INTO Movie(title, imageurl) 
VALUES("Guardians of the Galaxy Vol. 2", "https://images-na.ssl-images-amazon.com/images/M/MV5BMTg2MzI1MTg3OF5BMl5BanBnXkFtZTgwNTU3NDA2MTI@._V1_UX182_CR0,0,182,268_AL_.jpg");

INSERT INTO Movie(title, imageurl)
VALUES("The Fate of the Furious","https://images-na.ssl-images-amazon.com/images/M/MV5BMjMxODI2NDM5Nl5BMl5BanBnXkFtZTgwNjgzOTk1MTI@._V1_UX182_CR0,0,182,268_AL_.jpg");

INSERT INTO Movie(title, imageurl)
VALUES("The Boss Baby","https://images-na.ssl-images-amazon.com/images/M/MV5BMTk2NjI5NzgwNl5BMl5BanBnXkFtZTgwNDc4NTA1OTE@._V1_UY268_CR36,0,182,268_AL_.jpg");

INSERT INTO Movie(title, imageurl)
VALUES("How to Be a Latin Lover","https://images-na.ssl-images-amazon.com/images/M/MV5BYTAwZDk5NzItM2U0MS00NDUxLTgwMDAtNzVmZDMxMzMxMWYxXkEyXkFqcGdeQXVyNTAwODk1NzY@._V1_UX182_CR0,0,182,268_AL_.jpg");

INSERT INTO Movie(title, imageurl)
VALUES("Beauty and the Beast","https://images-na.ssl-images-amazon.com/images/M/MV5BMTUwNjUxMTM4NV5BMl5BanBnXkFtZTgwODExMDQzMTI@._V1_UX182_CR0,0,182,268_AL_.jpg");

INSERT INTO Movie(title, imageurl)
VALUES("King Arthur: Legend of the Sword","https://images-na.ssl-images-amazon.com/images/M/MV5BMjM3ODY3Njc5Ml5BMl5BanBnXkFtZTgwMjQ5NjM5MTI@._V1_UX182_CR0,0,182,268_AL_.jpg");

-- Teatterit
INSERT INTO Theater(name) VALUES("Kinopalatsi");
INSERT INTO Theater(name) VALUES("Julia");
INSERT INTO Theater(name) VALUES("Bio X");

-- Salit
INSERT INTO Auditorium(idTheater) SELECT idTheater FROM Theater WHERE name = "Kinopalatsi";
INSERT INTO Auditorium(idTheater) SELECT idTheater FROM Theater WHERE name = "Kinopalatsi";
INSERT INTO Auditorium(idTheater) SELECT idTheater FROM Theater WHERE name = "Kinopalatsi";
INSERT INTO Auditorium(idTheater) SELECT idTheater FROM Theater WHERE name = "Kinopalatsi";

INSERT INTO Auditorium(idTheater) SELECT idTheater FROM Theater WHERE name = "Julia";
INSERT INTO Auditorium(idTheater) SELECT idTheater FROM Theater WHERE name = "Julia";
INSERT INTO Auditorium(idTheater) SELECT idTheater FROM Theater WHERE name = "Julia";

INSERT INTO Auditorium(idTheater) SELECT idTheater FROM Theater WHERE name = "Bio X";
INSERT INTO Auditorium(idTheater) SELECT idTheater FROM Theater WHERE name = "Bio X";
INSERT INTO Auditorium(idTheater) SELECT idTheater FROM Theater WHERE name = "Bio X";

-- Paikat
INSERT INTO Seat(row, number, idAuditorium)
SELECT 1, 1, idAuditorium FROM Auditorium WHERE
idTheater IN (SELECT idTheater FROM Theater);

INSERT INTO Seat(row, number, idAuditorium)
SELECT 1, 2, idAuditorium FROM Auditorium WHERE
idTheater IN (SELECT idTheater FROM Theater);

INSERT INTO Seat(row, number, idAuditorium)
SELECT 1, 3, idAuditorium FROM Auditorium WHERE
idTheater IN (SELECT idTheater FROM Theater);

INSERT INTO Seat(row, number, idAuditorium)
SELECT 1, 4, idAuditorium FROM Auditorium WHERE
idTheater IN (SELECT idTheater FROM Theater);

INSERT INTO Seat(row, number, idAuditorium)
SELECT 1, 5, idAuditorium FROM Auditorium WHERE
idTheater IN (SELECT idTheater FROM Theater);

INSERT INTO Seat(row, number, idAuditorium)
SELECT 1, 6, idAuditorium FROM Auditorium WHERE
idTheater IN (SELECT idTheater FROM Theater);

INSERT INTO Seat(row, number, idAuditorium)
SELECT 2, 1, idAuditorium FROM Auditorium WHERE
idTheater IN (SELECT idTheater FROM Theater);

INSERT INTO Seat(row, number, idAuditorium)
SELECT 2, 2, idAuditorium FROM Auditorium WHERE
idTheater IN (SELECT idTheater FROM Theater);

INSERT INTO Seat(row, number, idAuditorium)
SELECT 2, 3, idAuditorium FROM Auditorium WHERE
idTheater IN (SELECT idTheater FROM Theater);

INSERT INTO Seat(row, number, idAuditorium)
SELECT 2, 4, idAuditorium FROM Auditorium WHERE
idTheater IN (SELECT idTheater FROM Theater);

INSERT INTO Seat(row, number, idAuditorium)
SELECT 2, 5, idAuditorium FROM Auditorium WHERE
idTheater IN (SELECT idTheater FROM Theater);

INSERT INTO Seat(row, number, idAuditorium)
SELECT 2, 6, idAuditorium FROM Auditorium WHERE
idTheater IN (SELECT idTheater FROM Theater);

INSERT INTO Seat(row, number, idAuditorium)
SELECT 3, 1, idAuditorium FROM Auditorium WHERE
idTheater IN (SELECT idTheater FROM Theater);

INSERT INTO Seat(row, number, idAuditorium)
SELECT 3, 2, idAuditorium FROM Auditorium WHERE
idTheater IN (SELECT idTheater FROM Theater);

INSERT INTO Seat(row, number, idAuditorium)
SELECT 3, 3, idAuditorium FROM Auditorium WHERE
idTheater IN (SELECT idTheater FROM Theater);

INSERT INTO Seat(row, number, idAuditorium)
SELECT 3, 4, idAuditorium FROM Auditorium WHERE
idTheater IN (SELECT idTheater FROM Theater);

INSERT INTO Seat(row, number, idAuditorium)
SELECT 3, 5, idAuditorium FROM Auditorium WHERE
idTheater IN (SELECT idTheater FROM Theater);

INSERT INTO Seat(row, number, idAuditorium)
SELECT 3, 6, idAuditorium FROM Auditorium WHERE
idTheater IN (SELECT idTheater FROM Theater);

INSERT INTO Seat(row, number, idAuditorium)
SELECT 4, 1, idAuditorium FROM Auditorium WHERE
idTheater IN (SELECT idTheater FROM Theater);

INSERT INTO Seat(row, number, idAuditorium)
SELECT 4, 2, idAuditorium FROM Auditorium WHERE
idTheater IN (SELECT idTheater FROM Theater);

INSERT INTO Seat(row, number, idAuditorium)
SELECT 4, 3, idAuditorium FROM Auditorium WHERE
idTheater IN (SELECT idTheater FROM Theater);

INSERT INTO Seat(row, number, idAuditorium)
SELECT 4, 4, idAuditorium FROM Auditorium WHERE
idTheater IN (SELECT idTheater FROM Theater);

INSERT INTO Seat(row, number, idAuditorium)
SELECT 4, 5, idAuditorium FROM Auditorium WHERE
idTheater IN (SELECT idTheater FROM Theater);

INSERT INTO Seat(row, number, idAuditorium)
SELECT 4, 6, idAuditorium FROM Auditorium WHERE
idTheater IN (SELECT idTheater FROM Theater);

INSERT INTO Seat(row, number, idAuditorium)
SELECT 5, 1, idAuditorium FROM Auditorium WHERE
idTheater IN (SELECT idTheater FROM Theater);

INSERT INTO Seat(row, number, idAuditorium)
SELECT 5, 2, idAuditorium FROM Auditorium WHERE
idTheater IN (SELECT idTheater FROM Theater);

INSERT INTO Seat(row, number, idAuditorium)
SELECT 5, 3, idAuditorium FROM Auditorium WHERE
idTheater IN (SELECT idTheater FROM Theater);

INSERT INTO Seat(row, number, idAuditorium)
SELECT 5, 4, idAuditorium FROM Auditorium WHERE
idTheater IN (SELECT idTheater FROM Theater);

INSERT INTO Seat(row, number, idAuditorium)
SELECT 5, 5, idAuditorium FROM Auditorium WHERE
idTheater IN (SELECT idTheater FROM Theater);

INSERT INTO Seat(row, number, idAuditorium)
SELECT 5, 6, idAuditorium FROM Auditorium WHERE
idTheater IN (SELECT idTheater FROM Theater);

-- Naytokset

INSERT INTO Screening(idMovie, time, idAuditorium)
VALUES(2,TIMESTAMP('2017-05-15'),2);

INSERT INTO Screening(idMovie, time, idAuditorium)
VALUES(2,TIMESTAMP('2017-05-16'),2);

INSERT INTO Screening(idMovie, time, idAuditorium)
VALUES(2,TIMESTAMP('2017-05-17'),2);

INSERT INTO Screening(idMovie, time, idAuditorium)
VALUES(2,TIMESTAMP('2017-05-18'),2);

INSERT INTO Screening(idMovie, time, idAuditorium)
VALUES(2,TIMESTAMP('2017-05-19'),2);


INSERT INTO Screening(idMovie, time, idAuditorium)
VALUES(2,TIMESTAMP('2017-05-15'),42);

INSERT INTO Screening(idMovie, time, idAuditorium)
VALUES(2,TIMESTAMP('2017-05-16'),42);

INSERT INTO Screening(idMovie, time, idAuditorium)
VALUES(2,TIMESTAMP('2017-05-17'),42);

INSERT INTO Screening(idMovie, time, idAuditorium)
VALUES(2,TIMESTAMP('2017-05-18'),42);

INSERT INTO Screening(idMovie, time, idAuditorium)
VALUES(2,TIMESTAMP('2017-05-19'),42);



INSERT INTO Screening(idMovie, time, idAuditorium)
VALUES(2,TIMESTAMP('2017-05-15'),92);

INSERT INTO Screening(idMovie, time, idAuditorium)
VALUES(2,TIMESTAMP('2017-05-16'),92);

INSERT INTO Screening(idMovie, time, idAuditorium)
VALUES(2,TIMESTAMP('2017-05-17'),92);

INSERT INTO Screening(idMovie, time, idAuditorium)
VALUES(2,TIMESTAMP('2017-05-18'),92);

INSERT INTO Screening(idMovie, time, idAuditorium)
VALUES(2,TIMESTAMP('2017-05-19'),92);



INSERT INTO Screening(idMovie, time, idAuditorium)
VALUES(12,TIMESTAMP('2017-05-15'),2);

INSERT INTO Screening(idMovie, time, idAuditorium)
VALUES(12,TIMESTAMP('2017-05-16'),2);

INSERT INTO Screening(idMovie, time, idAuditorium)
VALUES(12,TIMESTAMP('2017-05-17'),2);

INSERT INTO Screening(idMovie, time, idAuditorium)
VALUES(12,TIMESTAMP('2017-05-18'),2);

INSERT INTO Screening(idMovie, time, idAuditorium)
VALUES(12,TIMESTAMP('2017-05-19'),2);


INSERT INTO Screening(idMovie, time, idAuditorium)
VALUES(12,TIMESTAMP('2017-05-15'),42);

INSERT INTO Screening(idMovie, time, idAuditorium)
VALUES(12,TIMESTAMP('2017-05-16'),42);

INSERT INTO Screening(idMovie, time, idAuditorium)
VALUES(12,TIMESTAMP('2017-05-17'),42);

INSERT INTO Screening(idMovie, time, idAuditorium)
VALUES(12,TIMESTAMP('2017-05-18'),42);

INSERT INTO Screening(idMovie, time, idAuditorium)
VALUES(12,TIMESTAMP('2017-05-19'),42);



INSERT INTO Screening(idMovie, time, idAuditorium)
VALUES(12,TIMESTAMP('2017-05-15'),92);

INSERT INTO Screening(idMovie, time, idAuditorium)
VALUES(12,TIMESTAMP('2017-05-16'),92);

INSERT INTO Screening(idMovie, time, idAuditorium)
VALUES(12,TIMESTAMP('2017-05-17'),92);

INSERT INTO Screening(idMovie, time, idAuditorium)
VALUES(12,TIMESTAMP('2017-05-18'),92);

INSERT INTO Screening(idMovie, time, idAuditorium)
VALUES(12,TIMESTAMP('2017-05-19'),92);



INSERT INTO Screening(idMovie, time, idAuditorium)
VALUES(22,TIMESTAMP('2017-05-15'),2);

INSERT INTO Screening(idMovie, time, idAuditorium)
VALUES(22,TIMESTAMP('2017-05-16'),2);

INSERT INTO Screening(idMovie, time, idAuditorium)
VALUES(22,TIMESTAMP('2017-05-17'),2);

INSERT INTO Screening(idMovie, time, idAuditorium)
VALUES(22,TIMESTAMP('2017-05-18'),2);

INSERT INTO Screening(idMovie, time, idAuditorium)
VALUES(22,TIMESTAMP('2017-05-19'),2);


INSERT INTO Screening(idMovie, time, idAuditorium)
VALUES(22,TIMESTAMP('2017-05-15'),42);

INSERT INTO Screening(idMovie, time, idAuditorium)
VALUES(22,TIMESTAMP('2017-05-16'),42);

INSERT INTO Screening(idMovie, time, idAuditorium)
VALUES(22,TIMESTAMP('2017-05-17'),42);

INSERT INTO Screening(idMovie, time, idAuditorium)
VALUES(22,TIMESTAMP('2017-05-18'),42);

INSERT INTO Screening(idMovie, time, idAuditorium)
VALUES(22,TIMESTAMP('2017-05-19'),42);



INSERT INTO Screening(idMovie, time, idAuditorium)
VALUES(22,TIMESTAMP('2017-05-15'),92);

INSERT INTO Screening(idMovie, time, idAuditorium)
VALUES(22,TIMESTAMP('2017-05-16'),92);

INSERT INTO Screening(idMovie, time, idAuditorium)
VALUES(22,TIMESTAMP('2017-05-17'),92);

INSERT INTO Screening(idMovie, time, idAuditorium)
VALUES(22,TIMESTAMP('2017-05-18'),92);

INSERT INTO Screening(idMovie, time, idAuditorium)
VALUES(22,TIMESTAMP('2017-05-19'),92);





INSERT INTO Screening(idMovie, time, idAuditorium)
VALUES(32,TIMESTAMP('2017-05-15'),2);

INSERT INTO Screening(idMovie, time, idAuditorium)
VALUES(32,TIMESTAMP('2017-05-16'),2);

INSERT INTO Screening(idMovie, time, idAuditorium)
VALUES(32,TIMESTAMP('2017-05-17'),2);

INSERT INTO Screening(idMovie, time, idAuditorium)
VALUES(32,TIMESTAMP('2017-05-18'),2);

INSERT INTO Screening(idMovie, time, idAuditorium)
VALUES(32,TIMESTAMP('2017-05-19'),2);


INSERT INTO Screening(idMovie, time, idAuditorium)
VALUES(32,TIMESTAMP('2017-05-15'),42);

INSERT INTO Screening(idMovie, time, idAuditorium)
VALUES(32,TIMESTAMP('2017-05-16'),42);

INSERT INTO Screening(idMovie, time, idAuditorium)
VALUES(32,TIMESTAMP('2017-05-17'),42);

INSERT INTO Screening(idMovie, time, idAuditorium)
VALUES(32,TIMESTAMP('2017-05-18'),42);

INSERT INTO Screening(idMovie, time, idAuditorium)
VALUES(32,TIMESTAMP('2017-05-19'),42);



INSERT INTO Screening(idMovie, time, idAuditorium)
VALUES(32,TIMESTAMP('2017-05-15'),92);

INSERT INTO Screening(idMovie, time, idAuditorium)
VALUES(32,TIMESTAMP('2017-05-16'),92);

INSERT INTO Screening(idMovie, time, idAuditorium)
VALUES(32,TIMESTAMP('2017-05-17'),92);

INSERT INTO Screening(idMovie, time, idAuditorium)
VALUES(32,TIMESTAMP('2017-05-18'),92);

INSERT INTO Screening(idMovie, time, idAuditorium)
VALUES(32,TIMESTAMP('2017-05-19'),92);




INSERT INTO Screening(idMovie, time, idAuditorium)
VALUES(42,TIMESTAMP('2017-05-15'),2);

INSERT INTO Screening(idMovie, time, idAuditorium)
VALUES(42,TIMESTAMP('2017-05-16'),2);

INSERT INTO Screening(idMovie, time, idAuditorium)
VALUES(42,TIMESTAMP('2017-05-17'),2);

INSERT INTO Screening(idMovie, time, idAuditorium)
VALUES(42,TIMESTAMP('2017-05-18'),2);

INSERT INTO Screening(idMovie, time, idAuditorium)
VALUES(42,TIMESTAMP('2017-05-19'),2);


INSERT INTO Screening(idMovie, time, idAuditorium)
VALUES(42,TIMESTAMP('2017-05-15'),42);

INSERT INTO Screening(idMovie, time, idAuditorium)
VALUES(42,TIMESTAMP('2017-05-16'),42);

INSERT INTO Screening(idMovie, time, idAuditorium)
VALUES(42,TIMESTAMP('2017-05-17'),42);

INSERT INTO Screening(idMovie, time, idAuditorium)
VALUES(42,TIMESTAMP('2017-05-18'),42);

INSERT INTO Screening(idMovie, time, idAuditorium)
VALUES(42,TIMESTAMP('2017-05-19'),42);



INSERT INTO Screening(idMovie, time, idAuditorium)
VALUES(42,TIMESTAMP('2017-05-15'),92);

INSERT INTO Screening(idMovie, time, idAuditorium)
VALUES(42,TIMESTAMP('2017-05-16'),92);

INSERT INTO Screening(idMovie, time, idAuditorium)
VALUES(42,TIMESTAMP('2017-05-17'),92);

INSERT INTO Screening(idMovie, time, idAuditorium)
VALUES(42,TIMESTAMP('2017-05-18'),92);

INSERT INTO Screening(idMovie, time, idAuditorium)
VALUES(42,TIMESTAMP('2017-05-19'),92);




INSERT INTO Screening(idMovie, time, idAuditorium)
VALUES(52,TIMESTAMP('2017-05-15'),2);

INSERT INTO Screening(idMovie, time, idAuditorium)
VALUES(52,TIMESTAMP('2017-05-16'),2);

INSERT INTO Screening(idMovie, time, idAuditorium)
VALUES(52,TIMESTAMP('2017-05-17'),2);

INSERT INTO Screening(idMovie, time, idAuditorium)
VALUES(52,TIMESTAMP('2017-05-18'),2);

INSERT INTO Screening(idMovie, time, idAuditorium)
VALUES(52,TIMESTAMP('2017-05-19'),2);


INSERT INTO Screening(idMovie, time, idAuditorium)
VALUES(52,TIMESTAMP('2017-05-15'),42);

INSERT INTO Screening(idMovie, time, idAuditorium)
VALUES(52,TIMESTAMP('2017-05-16'),42);

INSERT INTO Screening(idMovie, time, idAuditorium)
VALUES(52,TIMESTAMP('2017-05-17'),42);

INSERT INTO Screening(idMovie, time, idAuditorium)
VALUES(52,TIMESTAMP('2017-05-18'),42);

INSERT INTO Screening(idMovie, time, idAuditorium)
VALUES(52,TIMESTAMP('2017-05-19'),42);



INSERT INTO Screening(idMovie, time, idAuditorium)
VALUES(52,TIMESTAMP('2017-05-15'),92);

INSERT INTO Screening(idMovie, time, idAuditorium)
VALUES(52,TIMESTAMP('2017-05-16'),92);

INSERT INTO Screening(idMovie, time, idAuditorium)
VALUES(52,TIMESTAMP('2017-05-17'),92);

INSERT INTO Screening(idMovie, time, idAuditorium)
VALUES(52,TIMESTAMP('2017-05-18'),92);

INSERT INTO Screening(idMovie, time, idAuditorium)
VALUES(52,TIMESTAMP('2017-05-19'),92);