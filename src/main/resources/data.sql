-- INSERT INTO User (id, first_name, last_name, rating, user_trips) VALUES (2, "Ben", "Alek", 3, 129);
INSERT INTO make(id, name) VALUES (2, "Pure Air");

INSERT INTO make(id, name) VALUES (1, "Xioami");


-- INSERT INTO Escooter (id, user_id, model_name, make_id, imageURL) VALUES (1,2,"Xiaomi",2, "/images/uploads/1.png");
INSERT INTO User (id, email, password, first_name, last_name) VALUES (1, "x00167646@mytudublin.ie", "$2a$10$Gr.nVo2F4RAjUDNyHO86T.PxaUVhBcrz/Dx6bQiFb122mBqDAI1Gm", "Taiwo", "Obadre");
-- INSERT INTO User (id, first_name, last_name, rating, user_trips) VALUES (3, "Nora", "Alek", 3 ,89);
INSERT INTO make(id, name) VALUES (3, "Avovo");
-- INSERT INTO Escooter (id, user_id, model_name, make_id, imageURL) VALUES (2,3,"Xiaomi",3, "/images/uploads/2.png");
--
-- INSERT INTO User (id, first_name, last_name, rating, user_trips) VALUES (4, "Stephen", "Alek", 3, 56);
INSERT INTO make(id, name) VALUES (4, "Segway");
-- INSERT INTO Escooter (id, user_id, model_name, make_id, imageURL) VALUES (4,4,"Pure Air",4, "/images/uploads/3.png");
--
-- INSERT INTO User (id, first_name, last_name, rating, user_trips) VALUES (5, "Stephen", "Alek", 4, 56);
-- INSERT INTO make(id, name) VALUES (5, "Kugoo");
-- INSERT INTO Escooter (id, user_id, model_name, make_id, imageURL) VALUES (5,5,"Pure Air",5, "/images/uploads/3.png");
--
-- INSERT INTO User (id, first_name, last_name, rating, user_trips) VALUES (6, "Stephen", "Alek", 5, 56);
INSERT INTO make(id, name) VALUES (6, "Edisson");
INSERT INTO HOST(id) VALUES (920386034);

-- INSERT INTO User (id, email, password, first_name, last_name) VALUES (1, "x00167646@mytudublin.ie", "$2a$10$Gr.nVo2F4RAjUDNyHO86T.PxaUVhBcrz/Dx6bQiFb122mBqDAI1Gm", "Taiwo", "Obadre");
INSERT INTO User (id, email, password, first_name, last_name, host_id, profile_picture) VALUES (2, "taiwo.obadare@gmail.com", "$2a$10$Gr.nVo2F4RAjUDNyHO86T.PxaUVhBcrz/Dx6bQiFb122mBqDAI1Gm", "Taiwo", "Obadre", 920386034, "/images/uploads/profile.jpg");
INSERT INTO Escooter (country,trip_end, trip_start, water_resistant, scooter_weight, motor_power, max_weight, max_speed,max_range, imageurl, cost, id, about, scooter_host_id, model_name, make_id) VALUES ("Ireland", '2000-01-01','2200-01-01', 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, "/images/uploads/1.png" ,23,2, "about", 920386034,"Xiaomi Ultrol 40 pro",2);
INSERT INTO Escooter (country,trip_end, trip_start, water_resistant, scooter_weight, motor_power, max_weight, max_speed,max_range, imageurl, cost, id, about, scooter_host_id, model_name, make_id) VALUES ("Ireland", '2000-01-01','2200-01-01', 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, "/images/uploads/2.png" ,34,3, "about", 920386034,"Segway Rider blad runner",1);
INSERT INTO Escooter (country,trip_end, trip_start, water_resistant, scooter_weight, motor_power, max_weight, max_speed,max_range, imageurl, cost, id, about, scooter_host_id, model_name, make_id) VALUES ("Ireland", '2000-01-01','2200-01-01', 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, "/images/uploads/3.png" ,89,4, "about", 920386034,"Readme xeon pro",1);
INSERT INTO Escooter (country,trip_end, trip_start, water_resistant, scooter_weight, motor_power, max_weight, max_speed,max_range, imageurl, cost, id, about, scooter_host_id, model_name, make_id, trips) VALUES ("Ireland", '2000-01-01','2200-01-01', 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, "/images/uploads/4.png" ,34,5, "about", 920386034,"Readme 11 horseshot",2, 3);

--
--
--
--
--
--
