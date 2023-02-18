use torchdb;

DELETE FROM users_roles;
DELETE from scooter_review;
DELETE FROM trip;
DELETE FROM user;
DELETE FROM Escooter;
DELETE FROM make;
DELETE FROM host;


INSERT INTO user (location, about, joined, id, email, password, first_name, last_name) VALUES ('Dalymount Park, Connaught Street, Phibsborough, Dublin, Ireland','Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry''s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially','2000-01-01',1, 'x00167646@mytudublin.ie', '$2a$10$Gr.nVo2F4RAjUDNyHO86T.PxaUVhBcrz/Dx6bQiFb122mBqDAI1Gm', 'Taiwo', 'Obadre');
--
INSERT INTO make(id, name, image) VALUES (2, "Pure Air", "/images/website/Make/pureelectric.png");

INSERT INTO make(id, name,image) VALUES (1, "Xioami", "/images/website/Make/xiaomi.png");

INSERT INTO make(id, name, image) VALUES (3, "Avovo", "/images/website/Make/avovo.png");

INSERT INTO make(id, name, image) VALUES (4, "Segway", "/images/website/Make/segway.png");

INSERT INTO make(id, name, image) VALUES (6, "Edisson", "/images/website/Make/segway.png");
INSERT INTO host(id) VALUES (920386034);

-- INSERT INTO user (country, is_verified, id, email, password, first_name, last_name, host_id, profile_picture, phone_number, is_host) VALUES ("Ireland", true, 9, "taiwo.obadareee@gmail.com", "$2a$10$Gr.nVo2F4RAjUDNyHO86T.PxaUVhBcrz/Dx6bQiFb122mBqDAI1Gm", "Taiwo", "Obadre", 920386034, "/images/uploads/profile.jpg", 08764532, true);


INSERT INTO user (location, about, joined, country, is_verified, id, email, password, first_name, last_name, host_id, profile_picture, phone_number, is_host) VALUES ('Dalymount Park, Connaught Street, Phibsborough, Dublin, Ireland','Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry''s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially','2000-01-01', "Ireland", true, 2, "taiwo.obadare@gmail.com", "$2a$10$Gr.nVo2F4RAjUDNyHO86T.PxaUVhBcrz/Dx6bQiFb122mBqDAI1Gm", "Taiwo", "Obadre", 920386034, "/images/uploads/profile.jpg", 08764532, true);
INSERT INTO escooter (county, longitude, latitude, address,country,trip_end, trip_start, scooter_weight, motor_power, max_weight, max_speed,max_range, imageurl, cost, id, about, model_name,scooter_host_id) VALUES ("Dublin",-6.308530354714592,53.358888300000004, "Starbucks, Federal Highway, Glenmarie, 40150 Shah Alam, Selangor, Malaysia","Ireland", '2000-01-01','2200-01-01' , 71.0, 41.0, 31.0, 41.0, 14.0, "https://storage.cloud.google.com/torch-gcp-bucket/1.png" ,23.00, 2, "about","Xiaomi Ultrol 40 pro",920386034);
INSERT INTO escooter (county,longitude, latitude,address,country,trip_end, trip_start, scooter_weight, motor_power, max_weight, max_speed,max_range, imageurl, cost, id, about, scooter_host_id, model_name, make_id) VALUES ("Dublin",-6.257509754873317,53.356601299999994,"Dalymount Park, Connaught Street, Phibsborough, Dublin, Ireland","Ireland", '2000-01-01','2200-01-01', 61.0, 31.0, 21.0, 51.0, 14.0, "https://storage.cloud.google.com/torch-gcp-bucket/2.png" ,34.65, 3, "about", 920386034,"Segway Rider blad runner",1);
INSERT INTO escooter (county,longitude, latitude,address,country,trip_end, trip_start, scooter_weight, motor_power, max_weight, max_speed,max_range, imageurl, cost, id, about, scooter_host_id, model_name, make_id) VALUES ("Dublin",-6.2705497,53.3284532,"Starbucks, Federal Highway, Glenmarie, 40150 Shah Alam, Selangor, Malaysia","Ireland", '2000-01-01','2200-01-01', 31.0, 41.0, 61.0, 16.0, 17.0, "https://storage.cloud.google.com/torch-gcp-bucket/3.png" ,89.99, 4, "about", 920386034,"Readme xeon pro",1);
INSERT INTO escooter (county,longitude, latitude,address,country,trip_end, trip_start, scooter_weight, motor_power, max_weight, max_speed,max_range, imageurl, cost, id, about, scooter_host_id, model_name, make_id, trips) VALUES ("Dublin",-6.274931400000001,53.3618599,"Starbucks, Federal Highway, Glenmarie, 40150 Shah Alam, Selangor, Malaysia","Ireland", '2000-01-01','2200-01-01', 21.0, 51.0, 11.0, 19.0, 14.0, "https://storage.cloud.google.com/torch-gcp-bucket/4.png" ,34.65, 5, "about", 920386034,"Readme 11 horseshot",2, 3);
INSERT INTO escooter (county,longitude, latitude, address,country,trip_end, trip_start, scooter_weight, motor_power, max_weight, max_speed,max_range, imageurl, cost, id, about, scooter_host_id, model_name, make_id) VALUES ("Dublin",-6.272079460031218,53.37234705, "Starbucks, Federal Highway, Glenmarie, 40150 Shah Alam, Selangor, Malaysia","Ireland", '2000-01-01','2200-01-01', 31.0, 17.0, 67.0, 25.0, 23.0, "https://storage.cloud.google.com/torch-gcp-bucket/electric1.jpeg" ,23.70, 6, "This scooter is an amaxing scooter trust me", 920386034,"Xiaomi Bever we pro",2);
INSERT INTO escooter (county,longitude, latitude, address,country,trip_end, trip_start, scooter_weight, motor_power, max_weight, max_speed,max_range, imageurl, cost, id, about, scooter_host_id, model_name, make_id) VALUES ("Dublin",-6.332905492347467,53.32483445, "Starbucks, Federal Highway, Glenmarie, 40150 Shah Alam, Selangor, Malaysia","Ireland", '2000-01-01','2200-01-01', 15.0, 51.0, 43.0, 25.0, 65.0, "https://storage.cloud.google.com/torch-gcp-bucket/electric7.jpeg" ,54.65, 7, "about", 920386034,"Vovo plexer blad runner",1);
INSERT INTO escooter (county,longitude, latitude, address,country,trip_end, trip_start, scooter_weight, motor_power, max_weight, max_speed,max_range, imageurl, cost, id, about, scooter_host_id, model_name, make_id) VALUES ("Dublin",-6.330710473854637,53.3589378, "Starbucks, Federal Highway, Glenmarie, 40150 Shah Alam, Selangor, Malaysia","Ireland", '2000-01-01','2200-01-01', 31.0, 31.0, 34.0, 19.0, 23.0, "https://storage.cloud.google.com/torch-gcp-bucket/electric9.jpeg" ,56.99, 8, "about", 920386034,"Viltron xeon pro",1);
INSERT INTO escooter (county,longitude, latitude,address, country,trip_end, trip_start , scooter_weight, motor_power, max_weight, max_speed,max_range, imageurl, cost, id, about, scooter_host_id, model_name, make_id, trips) VALUES ("Dublin",-6.271484416353246,53.339504649999995, "Starbucks, Federal Highway, Glenmarie, 40150 Shah Alam, Selangor, Malaysia", "Ireland", '2000-01-01','2200-01-01', 19.0, 28.0, 19.0, 45.0, 48.0, "https://storage.cloud.google.com/torch-gcp-bucket/electric8.jpeg" ,34.65, 9, "about", 920386034,"Biner 11 34",2, 3);
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

INSERT INTO trip (id, status, trip_cost, trip_end, trip_id, trip_start, escooter_id, host_id, user_renter_id)
VALUES(1, "ACTIVE", 23.00, '2022-12-21 00:00:00', "06LB-D2FN-H9M3", '2022-12-17 00:00:00', 7,920386034, 2);



INSERT INTO trip (id, status, trip_cost, trip_end, trip_id, trip_start, escooter_id, host_id, user_renter_id)
VALUES(2, "CANCELLED", 23.00, '2022-12-21 00:00:00', "06LB-NNNN-H9M3", '2022-12-17 00:00:00', 2,920386034, 2);

INSERT INTO trip (id, status, trip_cost, trip_end, trip_id, trip_start, escooter_id, host_id, user_renter_id)
VALUES(3, "INACTIVE", 243.00, '2022-12-21 00:00:00', "06LB-JJJJ-H9M3", '2022-12-17 00:00:00', 3,920386034, 2);






INSERT INTO trip (id, status, trip_cost, trip_end, trip_id, trip_start, escooter_id, host_id, user_renter_id)
VALUES(4, "COMPLETED", 233.00, '2022-12-21 00:00:00', "06LB-7777-H9M3", '2022-12-17 00:00:00', 5,920386034, 2);


INSERT INTO trip (id, status, trip_cost, trip_end, trip_id, trip_start, escooter_id, host_id, user_renter_id)
VALUES(5, "COMPLETED", 283.00, '2022-12-21 00:00:00', "06LB-NNNN-H9M3", '2022-12-17 00:00:00', 8,920386034, 2);


INSERT INTO trip (id, status, trip_cost, trip_end, trip_id, trip_start, escooter_id, host_id, user_renter_id)
VALUES(6, "COMPLETED", 143.00, '2022-12-21 00:00:00', "06LB-6666-H9M3", '2022-12-17 00:00:00', 9,920386034, 2);

INSERT INTO trip (id, status, trip_cost, trip_end, trip_id, trip_start, escooter_id, host_id, user_renter_id)
VALUES(7, "COMPLETED", 443.00, '2022-12-19 00:00:00', "06LB-FFFF-H9M3", '2022-12-01 00:00:00', 4,920386034, 2);


SELECT * FROM user;