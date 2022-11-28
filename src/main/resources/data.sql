
-- DELETE FROM scooter_review;
-- DELETE FROM users_roles;
-- DELETE from host_review;
-- DELETE FROM make;
--
-- DELETE FROM user;
--
-- DELETE FROM escooter;
-- DELETE from host;


DELETE FROM role;

DELETE FROM trip;




INSERT INTO user (id, email, password, first_name, last_name) VALUES (1, "x00167646@mytudublin.ie", "$2a$10$Gr.nVo2F4RAjUDNyHO86T.PxaUVhBcrz/Dx6bQiFb122mBqDAI1Gm", "Taiwo", "Obadre");

INSERT INTO make(id, name, image) VALUES (2, "Pure Air", "/images/website/Make/pureelectric.png");

INSERT INTO make(id, name,image) VALUES (1, "Xioami", "/images/website/Make/xiaomi.png");

INSERT INTO make(id, name, image) VALUES (3, "Avovo", "/images/website/Make/avovo.png");

INSERT INTO make(id, name, image) VALUES (4, "Segway", "/images/website/Make/segway.png");

INSERT INTO make(id, name, image) VALUES (6, "Edisson", "/images/website/Make/segway.png");
INSERT INTO host(id) VALUES (920386034);

INSERT INTO user (country, is_verified, id, email, password, first_name, last_name, host_id, profile_picture, phone_number) VALUES ("Ireland", true, 2, "taiwo.obadare@gmail.com", "$2a$10$Gr.nVo2F4RAjUDNyHO86T.PxaUVhBcrz/Dx6bQiFb122mBqDAI1Gm", "Taiwo", "Obadre", 920386034, "/images/uploads/profile.jpg", 08764532);
INSERT INTO escooter (county, longitude, latitude, address,country,trip_end, trip_start, scooter_weight, motor_power, max_weight, max_speed,max_range, imageurl, cost, id, about, scooter_host_id, model_name, make_id) VALUES ("Dublin",-6.308530354714592,53.358888300000004, "Starbucks, Federal Highway, Glenmarie, 40150 Shah Alam, Selangor, Malaysia","Ireland", '2000-01-01','2200-01-01' , 71.0, 41.0, 31.0, 41.0, 14.0, "/images/uploads/1.png" ,23.00, 2, "about", 920386034,"Xiaomi Ultrol 40 pro",2);
INSERT INTO escooter (county,longitude, latitude,address,country,trip_end, trip_start, scooter_weight, motor_power, max_weight, max_speed,max_range, imageurl, cost, id, about, scooter_host_id, model_name, make_id) VALUES ("Dublin",-6.257509754873317,53.356601299999994,"Dalymount Park, Connaught Street, Phibsborough, Dublin, Ireland","Ireland", '2000-01-01','2200-01-01', 61.0, 31.0, 21.0, 51.0, 14.0, "/images/uploads/2.png" ,34.65, 3, "about", 920386034,"Segway Rider blad runner",1);
INSERT INTO escooter (county,longitude, latitude,address,country,trip_end, trip_start, scooter_weight, motor_power, max_weight, max_speed,max_range, imageurl, cost, id, about, scooter_host_id, model_name, make_id) VALUES ("Dublin",-6.2705497,53.3284532,"Starbucks, Federal Highway, Glenmarie, 40150 Shah Alam, Selangor, Malaysia","Ireland", '2000-01-01','2200-01-01', 31.0, 41.0, 61.0, 16.0, 17.0, "/images/uploads/3.png" ,89.99, 4, "about", 920386034,"Readme xeon pro",1);
INSERT INTO escooter (county,longitude, latitude,address,country,trip_end, trip_start, scooter_weight, motor_power, max_weight, max_speed,max_range, imageurl, cost, id, about, scooter_host_id, model_name, make_id, trips) VALUES ("Dublin",-6.274931400000001,53.3618599,"Starbucks, Federal Highway, Glenmarie, 40150 Shah Alam, Selangor, Malaysia","Ireland", '2000-01-01','2200-01-01', 21.0, 51.0, 11.0, 19.0, 14.0, "/images/uploads/4.png" ,34.65, 5, "about", 920386034,"Readme 11 horseshot",2, 3);


INSERT INTO escooter (county,longitude, latitude,country,trip_end, trip_start, scooter_weight, motor_power, max_weight, max_speed,max_range, imageurl, cost, id, about, scooter_host_id, model_name, make_id) VALUES ("Dublin",-6.272079460031218,53.37234705,"Ireland", '2000-01-01','2200-01-01', 31.0, 17.0, 67.0, 25.0, 23.0, "/images/uploads/electric1.jpeg" ,23.70, 6, "This scooter is an amaxing scooter trust me", 920386034,"Xiaomi Bever we pro",2);
INSERT INTO escooter (county,longitude, latitude,country,trip_end, trip_start, scooter_weight, motor_power, max_weight, max_speed,max_range, imageurl, cost, id, about, scooter_host_id, model_name, make_id) VALUES ("Dublin",-6.332905492347467,53.32483445, "Ireland", '2000-01-01','2200-01-01', 15.0, 51.0, 43.0, 25.0, 65.0, "/images/uploads/electric7.jpeg" ,54.65, 7, "about", 920386034,"Vovo plexer blad runner",1);
INSERT INTO escooter (county,longitude, latitude,country,trip_end, trip_start, scooter_weight, motor_power, max_weight, max_speed,max_range, imageurl, cost, id, about, scooter_host_id, model_name, make_id) VALUES ("Dublin",-6.330710473854637,53.3589378,"Ireland", '2000-01-01','2200-01-01', 31.0, 31.0, 34.0, 19.0, 23.0, "/images/uploads/electric9.jpeg" ,56.99, 8, "about", 920386034,"Viltron xeon pro",1);
INSERT INTO escooter (county,longitude, latitude,country,trip_end, trip_start , scooter_weight, motor_power, max_weight, max_speed,max_range, imageurl, cost, id, about, scooter_host_id, model_name, make_id, trips) VALUES ("Dublin",-6.271484416353246,53.339504649999995,"Ireland", '2000-01-01','2200-01-01', 19.0, 28.0, 19.0, 45.0, 48.0, "/images/uploads/electric8.jpeg" ,34.65, 9, "about", 920386034,"Biner 11 34",2, 3);
INSERT INTO scooter_review(id, comment, review_date, star_rating, scooter_id, scooter_reviewer_id)
VALUES (1, "This electric scooter was amazing and i had the best time using it, would recommend, This electric scooter was amazing and i had the best time using it, would recommend", '2000-01-01', 4, 2, 2);

INSERT INTO scooter_review(id, comment, review_date, star_rating, scooter_id, scooter_reviewer_id)
VALUES (2, "This electric scooter was amazing and i had the best time using it, would recommend, This electric scooter was amazing and i had the best time using it, would recommend", '2000-01-11', 5, 2, 2);

INSERT INTO scooter_review(id, comment, review_date, star_rating, scooter_id, scooter_reviewer_id)
VALUES (3, "This electric scooter was amazing and i had the best time using it, would recommend, This electric scooter was amazing and i had the best time using it, would recommend", '2000-01-11', 3, 2, 2);

INSERT INTO scooter_review(id, comment, review_date, star_rating, scooter_id, scooter_reviewer_id)
VALUES (4, "This electric scooter was amazing and i had the best time using it, would recommend, This electric scooter was amazing and i had the best time using it, would recommend", '2000-01-01', 4, 3, 2);

INSERT INTO scooter_review(id, comment, review_date, star_rating, scooter_id, scooter_reviewer_id)
VALUES (5, "This electric scooter was amazing and i had the best time using it, would recommend, This electric scooter was amazing and i had the best time using it, would recommend", '2000-01-11', 5, 3, 2);

INSERT INTO scooter_review(id, comment, review_date, star_rating, scooter_id, scooter_reviewer_id)
VALUES (6, "This electric scooter was amazing and i had the best time using it, would recommend, This electric scooter was amazing and i had the best time using it, would recommend", '2000-01-11', 3, 4, 2);

INSERT INTO scooter_review(id, comment, review_date, star_rating, scooter_id, scooter_reviewer_id)
VALUES (7, "This electric scooter was amazing and i had the best time using it, would recommend, This electric scooter was amazing and i had the best time using it, would recommend", '2000-01-01', 4, 4, 2);

INSERT INTO scooter_review(id, comment, review_date, star_rating, scooter_id, scooter_reviewer_id)
VALUES (8, "This electric scooter was amazing and i had the best time using it, would recommend, This electric scooter was amazing and i had the best time using it, would recommend", '2000-01-11', 5, 5, 2);

INSERT INTO scooter_review(id, comment, review_date, star_rating, scooter_id, scooter_reviewer_id)
VALUES (9, "This electric scooter was amazing and i had the best time using it, would recommend, This electric scooter was amazing and i had the best time using it, would recommend", '2000-01-11', 3, 5, 2);

