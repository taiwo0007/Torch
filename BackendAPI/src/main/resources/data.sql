-- use torchdb;
-- use freedb_torchdb;
DELETE FROM host_review;

DELETE FROM users_roles;
DELETE from scooter_review;
DELETE FROM trip;
DELETE FROM user;
DELETE FROM escooter;
DELETE FROM make;

DELETE FROM host;

ALTER TABLE escooter MODIFY about VARCHAR(1000);



INSERT INTO make(id, name, image) VALUES (2, "Pure Air", "/images/website/Make/pureelectric.png");

INSERT INTO make(id, name,image) VALUES (1, "Xioami", "/images/website/Make/xiaomi.png");

INSERT INTO make(id, name, image) VALUES (3, "Avovo", "/images/website/Make/avovo.png");

INSERT INTO make(id, name, image) VALUES (4, "Segway", "/images/website/Make/segway.png");

INSERT INTO make(id, name, image) VALUES (6, "Edisson", "/images/website/Make/segway.png");
INSERT INTO host(id, total_ad_days) VALUES (920386034, 9);
INSERT INTO host(id) VALUES (333);
INSERT INTO host(id) VALUES (444);

INSERT INTO user (latitude, longitude, country, is_Torch_Trusted, rating, location, about, joined, id, email, password, first_name, last_name, profile_picture, host_id, is_host,
                  phone_number)
VALUES (-6.308530354714592,53.358888300000004,'ireland', true, 5.0, 'Dalymount Park, Connaught Street, Phibsborough, Dublin, Ireland',
        'Lorem Ipsum is simply dummy text','2000-01-01',1,
        'x00167646@mytudublin.ie', '$2a$10$Gr.nVo2F4RAjUDNyHO86T.PxaUVhBcrz/Dx6bQiFb122mBqDAI1Gm', 'Layla', 'Obadre',
        'https://storage.googleapis.com/torch-gcp-bucket/pic4.jpeg', 333, true, 843568932);

INSERT INTO user (latitude, longitude, country, is_Torch_Trusted, rating, location,
                  about, joined, id, email, password, first_name, last_name, profile_picture, host_id, is_host,
                  phone_number)
VALUES (-6.308530354714592,53.358888300000004, 'ireland', true, 5.0, 'Dalymount Park, Connaught Street, Phibsborough, Dublin, Ireland',
        'Lorem Ipsum is simply dummy text of the
        ','2000-01-01',10,
        '00167646@mytudublin.ie', '$2a$10$Gr.nVo2F4RAjUDNyHO86T.PxaUVhBcrz/Dx6bQiFb122mBqDAI1Gm', 'Tori', 'Cardon',
        'https://cdn-ajggd.nitrocdn.com/kMoOFpDlsOVtlYJLrnSRNCQXaUFHZPTY/assets/images/optimized/rev-208c8fc/wp-content/uploads/bb-plugin/cache/cool-profile-pic-matheus-ferrero-landscape.jpeg', 444, true, 843568932);
--


-- INSERT INTO user (country, is_verified, id, email, password, first_name, last_name, host_id, profile_picture, phone_number, is_host) VALUES ("Ireland", true, 9, "taiwo.obadareee@gmail.com", "$2a$10$Gr.nVo2F4RAjUDNyHO86T.PxaUVhBcrz/Dx6bQiFb122mBqDAI1Gm", "Taiwo", "Obadre", 920386034, "/images/uploads/profile.jpg", 08764532, true);


INSERT INTO user ( account_type, latitude, longitude, is_Torch_Trusted, rating, location, about, joined, country, is_verified,
                  id, email, password, first_name, last_name, host_id, profile_picture, phone_number, is_host)
VALUES ('Pro', -6.308530354714592,53.358888300000004, true, 5.0, 'Dalymount Park, Connaught Street, Phibsborough, Dublin, Ireland',
        'Lorem Ipsum is simply dummy text of the printing and ','2000-01-01',
        "Ireland", true, 2, "taiwo.obadare@gmail.com", "$2a$10$Gr.nVo2F4RAjUDNyHO86T.PxaUVhBcrz/Dx6bQiFb122mBqDAI1Gm", "Taiwo", "Obadre", 920386034, "https://storage.googleapis.com/torch-gcp-bucket/pic1.jpeg", 08764532, true);
INSERT INTO escooter ( county, longitude, latitude, address,country,trip_end, trip_start, scooter_weight, motor_power, max_weight, max_speed,
                      max_range, imageurl, cost, id, about, model_name,scooter_host_id, trips, rating, make_id)
VALUES ("Dublin",-6.308530354714592,53.358888300000004, "Starbucks, Federal Highway, Glenmarie, 40150 Shah Alam, Selangor, Malaysia","Ireland", '2000-01-01','2200-01-01' , 71.0, 41.0, 31.0, 41.0, 14.0, "https://storage.cloud.google.com/torch-gcp-bucket/15.jpeg" ,23.00, 2, "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry''s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has su","Xiaomi Ultrol 40 pro",333, 39,2, 1);
INSERT INTO escooter (county, longitude, latitude, address,country,trip_end, trip_start, scooter_weight, motor_power, max_weight, max_speed,max_range, imageurl, cost, id, about, model_name,scooter_host_id, trips, rating, make_id)
VALUES ("Dublin",-6.259398,53.326007, "Starbucks, Federal Highway, Glenmarie, 40150 Shah Alam, Selangor, Malaysia","Ireland", '2000-01-01','2200-01-01' , 71.0, 41.0, 141.0, 41.0, 14.0, "https://storage.cloud.google.com/torch-gcp-bucket/12.jpeg" ,23.00, 10, "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry''s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has su","Vector H48G Model 4",920386034,12,5,2);
INSERT INTO escooter (county, longitude, latitude, address,country,trip_end, trip_start, scooter_weight, motor_power, max_weight, max_speed,max_range, imageurl, cost, id, about, model_name,scooter_host_id, trips, rating, make_id)
VALUES ("Dublin", -6.357966,53.338961, "Starbucks, Federal Highway, Glenmarie, 40150 Shah Alam, Selangor, Malaysia","Ireland", '2000-01-01','2200-01-01' , 71.0, 41.0, 51.0, 41.0, 14.0, "https://storage.cloud.google.com/torch-gcp-bucket/13.webp" ,23.00, 11, "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry''s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has su","Vultor 9R5NT",444, 102,5,6);
INSERT INTO escooter (county, longitude, latitude, address,country,trip_end, trip_start, scooter_weight, motor_power, max_weight, max_speed,max_range, imageurl, cost, id, about, model_name,scooter_host_id, trips, rating, make_id)
VALUES ("Dublin", -6.267456,53.367980, "Starbucks, Federal Highway, Glenmarie, 40150 Shah Alam, Selangor, Malaysia","Ireland", '2000-01-01','2200-01-01' , 71.0, 41.0, 91.0, 41.0, 14.0, "https://storage.cloud.google.com/torch-gcp-bucket/14.jpeg" ,23.00, 12, "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry''s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has su","Vultor v2 BFJJF",333, 91,3,3);
INSERT INTO escooter (county, longitude, latitude, address,country,trip_end, trip_start, scooter_weight, motor_power, max_weight, max_speed,max_range, imageurl, cost, id, about, model_name,scooter_host_id, trips, rating, make_id)
VALUES ("Dublin", -6.283628,53.353929, "Starbucks, Federal Highway, Glenmarie, 40150 Shah Alam, Selangor, Malaysia","Ireland", '2000-01-01','2200-01-01' , 71.0, 41.0, 61.0, 41.0, 14.0, "https://storage.cloud.google.com/torch-gcp-bucket/15.jpeg" ,23.00, 13, "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry''s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has su","Pure v2 NVJF",444, 49,3,4);

INSERT INTO escooter (county,longitude, latitude,address,country,trip_end, trip_start, scooter_weight, motor_power, max_weight, max_speed,max_range, imageurl, cost, id, about, scooter_host_id, model_name, make_id, trips, rating)
VALUES ("Dublin",-6.257509754873317,53.356601299999994,"Dalymount Park, Connaught Street, Phibsborough, Dublin, Ireland","Ireland", '2000-01-01','2200-01-01', 61.0, 31.0, 161.0, 51.0, 14.0, "https://storage.cloud.google.com/torch-gcp-bucket/2.png" ,4.65, 3, "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry''s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has su", 444,"Segway Rider blad runner",1,23, 4);
INSERT INTO escooter (county,longitude, latitude,address,country,trip_end, trip_start, scooter_weight, motor_power, max_weight, max_speed,max_range, imageurl, cost, id, about, scooter_host_id, model_name, make_id, trips)
VALUES ("Dublin",-6.2705497,53.3284532,"Starbucks, Federal Highway, Glenmarie, 40150 Shah Alam, Selangor, Malaysia","Ireland", '2000-01-01','2200-01-01', 31.0, 41.0, 31.0, 16.0, 17.0, "https://storage.cloud.google.com/torch-gcp-bucket/3.png" ,19.99, 4, "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry''s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has su", 333,"Readme xeon pro",1,36);
INSERT INTO escooter (county,longitude, latitude,address,country,trip_end, trip_start, scooter_weight, motor_power, max_weight, max_speed,max_range, imageurl, cost, id, about, scooter_host_id, model_name, make_id, trips)
VALUES ("Dublin",-6.274931400000001,53.3618599,"Starbucks, Federal Highway, Glenmarie, 40150 Shah Alam, Selangor, Malaysia","Ireland", '2000-01-01','2200-01-01', 21.0, 51.0, 11.0, 19.0, 14.0, "https://storage.cloud.google.com/torch-gcp-bucket/5.png" ,34.65, 5, "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry''s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has su", 444,"Readme 11 horseshot",2, 53);
INSERT INTO escooter (county,longitude, latitude, address,country,trip_end, trip_start, scooter_weight, motor_power, max_weight, max_speed,max_range, imageurl, cost, id, about, scooter_host_id, model_name, make_id, trips)
VALUES ("Dublin",-6.272079460031218,53.37234705, "Starbucks, Federal Highway, Glenmarie, 40150 Shah Alam, Selangor, Malaysia","Ireland", '2000-01-01','2200-01-01', 31.0, 117.0, 67.0, 25.0, 23.0, "https://storage.cloud.google.com/torch-gcp-bucket/electric1.jpeg" ,23.70, 6, "This scooter is an amaxing scooter trust me", 444,"Xiaomi Bever we pro",2,29);
INSERT INTO escooter (county,longitude, latitude, address,country,trip_end, trip_start, scooter_weight, motor_power, max_weight, max_speed,max_range, imageurl, cost, id, about, scooter_host_id, model_name, make_id, trips)
VALUES ("Dublin",-6.332905492347467,53.32483445, "Starbucks, Federal Highway, Glenmarie, 40150 Shah Alam, Selangor, Malaysia","Ireland", '2000-01-01','2200-01-01', 15.0, 151.0, 43.0, 25.0, 65.0, "https://storage.cloud.google.com/torch-gcp-bucket/electric7.jpeg" ,14.65, 7, "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry''s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has su", 920386034,"Vovo plexer blad runner",1,26);
INSERT INTO escooter (county,longitude, latitude, address,country,trip_end, trip_start, scooter_weight, motor_power, max_weight, max_speed,max_range, imageurl, cost, id, about, scooter_host_id, model_name, make_id, trips)
VALUES ("Dublin",-6.330710473854637,53.3589378, "Starbucks, Federal Highway, Glenmarie, 40150 Shah Alam, Selangor, Malaysia","Ireland", '2000-01-01','2200-01-01', 31.0, 131.0, 34.0, 19.0, 23.0, "https://storage.cloud.google.com/torch-gcp-bucket/electric9.jpeg" ,16.99, 8, "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry''s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has su", 333,"Viltron xeon pro",1,45);
INSERT INTO escooter (county,longitude, latitude,address, country,trip_end, trip_start , scooter_weight, motor_power, max_weight, max_speed,max_range, imageurl, cost, id, about, scooter_host_id, model_name, make_id, trips) VALUES ("Dublin",-6.271484416353246,53.339504649999995, "Starbucks, Federal Highway, Glenmarie, 40150 Shah Alam, Selangor, Malaysia", "Ireland", '2000-01-01','2200-01-01', 19.0, 28.0, 19.0, 45.0, 48.0, "https://storage.cloud.google.com/torch-gcp-bucket/electric8.jpeg" ,34.65, 9, "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry''s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has su", 333,"Biner 11 34",2, 33);
INSERT INTO escooter (county,longitude, latitude,address, country,trip_end, trip_start , scooter_weight, motor_power, max_weight, max_speed,max_range, imageurl, cost, id, about, scooter_host_id, model_name, make_id, trips) VALUES ("Dublin",-6.293674,53.335449 , "Starbucks, Federal Highway, Glenmarie, 40150 Shah Alam, Selangor, Malaysia", "Ireland", '2000-01-01','2200-01-01', 19.0, 28.0, 19.0, 45.0, 48.0, "https://storage.cloud.google.com/torch-gcp-bucket/18.avif" ,34.65, 14, "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry''s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has su", 920386034,"Speed 5GETG 34",2, 33);



INSERT INTO scooter_review(id, comment, review_date, star_rating, scooter_id, scooter_reviewer_id)
VALUES (1, "This electric scooter was amazing and i had the best time using it, would recommend, This electric scooter was amazing and i had the best time using it, would recommend", '2000-01-01', 4, 2, 1);

INSERT INTO scooter_review(id, comment, review_date, star_rating, scooter_id, scooter_reviewer_id)
VALUES (2, "This electric scooter was amazing and i had the best time using it, would recommend, This electric scooter was amazing and i had the best time using it, would recommend", '2000-01-11', 5, 2, 10);

INSERT INTO scooter_review(id, comment, review_date, star_rating, scooter_id, scooter_reviewer_id)
VALUES (3, "This electric scooter was amazing and i had the best time using it, would recommend, This electric scooter was amazing and i had the best time using it, would recommend", '2000-01-11', 3, 2, 1);

INSERT INTO scooter_review(id, comment, review_date, star_rating, scooter_id, scooter_reviewer_id)
VALUES (4, "This electric scooter was amazing and i had the best time using it, would recommend, This electric scooter was amazing and i had the best time using it, would recommend", '2000-01-01', 4, 3, 10);

INSERT INTO scooter_review(id, comment, review_date, star_rating, scooter_id, scooter_reviewer_id)
VALUES (5, "This electric scooter was amazing and i had the best time using it, would recommend, This electric scooter was amazing and i had the best time using it, would recommend", '2000-01-11', 5, 3, 2);

INSERT INTO scooter_review(id, comment, review_date, star_rating, scooter_id, scooter_reviewer_id)
VALUES (6, "This electric scooter was amazing and i had the best time using it, would recommend, This electric scooter was amazing and i had the best time using it, would recommend", '2000-01-11', 3, 4, 1);

INSERT INTO scooter_review(id, comment, review_date, star_rating, scooter_id, scooter_reviewer_id)
VALUES (7, "This electric scooter was amazing and i had the best time using it, would recommend, This electric scooter was amazing and i had the best time using it, would recommend", '2000-01-01', 4, 4, 1);

INSERT INTO scooter_review(id, comment, review_date, star_rating, scooter_id, scooter_reviewer_id)
VALUES (8, "This electric scooter was amazing and i had the best time using it, would recommend, This electric scooter was amazing and i had the best time using it, would recommend", '2000-01-11', 5, 5, 2);

INSERT INTO scooter_review(id, comment, review_date, star_rating, scooter_id, scooter_reviewer_id)
VALUES (9, "This electric scooter was amazing and i had the best time using it, would recommend, This electric scooter was amazing and i had the best time using it, would recommend", '2000-01-11', 3, 5, 2);

INSERT INTO scooter_review(id, comment, review_date, star_rating, scooter_id, scooter_reviewer_id)
VALUES (10, "This electric scooter was amazing and i had the best time using it, would recommend, This electric scooter was amazing and i had the best time using it, would recommend", '2000-01-11', 3, 13, 2);

INSERT INTO scooter_review(id, comment, review_date, star_rating, scooter_id, scooter_reviewer_id)
VALUES (11, "This electric scooter was amazing and i had the best time using it, would recommend, This electric scooter was amazing and i had the best time using it, would recommend", '2000-01-11', 3, 12, 2);

INSERT INTO scooter_review(id, comment, review_date, star_rating, scooter_id, scooter_reviewer_id)
VALUES (12, "This electric scooter was amazing and i had the best time using it, would recommend, This electric scooter was amazing and i had the best time using it, would recommend", '2000-01-11', 3, 11, 2);

INSERT INTO scooter_review(id, comment, review_date, star_rating, scooter_id, scooter_reviewer_id)
VALUES (133, "This electric scooter was amazing and i had the best time using it, would recommend, This electric scooter was amazing and i had the best time using it, would recommend", '2000-01-11', 3, 10, 2);



INSERT INTO trip (days, id, status, trip_cost, trip_end, trip_id, trip_start, escooter_id, host_id, user_renter_id)
VALUES(2, 1, "ACTIVE", 23.00, '2022-12-21 00:00:00', "06LB-D2FN-H9M3", '2022-12-17 00:00:00', 7,333, 1);



INSERT INTO trip (days,id, status, trip_cost, trip_end, trip_id, trip_start, escooter_id, host_id, user_renter_id)
VALUES(2,2, "ACTIVE", 23.00, '2022-12-21 00:00:00', "06LB-NNNN-H9M3", '2022-12-17 00:00:00', 2,920386034, 10);

INSERT INTO trip (days,id, status, trip_cost, trip_end, trip_id, trip_start, escooter_id, host_id, user_renter_id)
VALUES(2,3, "ACTIVE", 243.00, '2022-12-21 00:00:00', "06LB-JJJJ-H9M3", '2022-12-17 00:00:00', 3,444, 2);


INSERT INTO trip (days,id, status, trip_cost, trip_end, trip_id, trip_start, escooter_id, host_id, user_renter_id)
VALUES(2,4, "ACTIVE", 233.00, '2022-12-21 00:00:00', "06LB-7777-H9M3", '2022-12-17 00:00:00', 5,333, 2);


INSERT INTO trip (days,id, status, trip_cost, trip_end, trip_id, trip_start, escooter_id, host_id, user_renter_id)
VALUES(2,5, "COMPLETED", 283.00, '2022-12-21 00:00:00', "06LB-NNNN-H9M3", '2022-12-17 00:00:00', 8,920386034, 10);


INSERT INTO trip (days,id, status, trip_cost, trip_end, trip_id, trip_start, escooter_id, host_id, user_renter_id)
VALUES(2,6, "ACTIVE", 143.00, '2022-12-21 00:00:00', "06LB-6666-H9M3", '2022-12-17 00:00:00', 9,333, 2);

INSERT INTO trip (days,id, status, trip_cost, trip_end, trip_id, trip_start, escooter_id, host_id, user_renter_id)
VALUES(2,7, "ACTIVE", 443.00, '2022-12-19 00:00:00', "06LB-FFFF-H9M3", '2022-12-01 00:00:00', 4,444, 10);



INSERT INTO host_review (`id`, `comment`, `review_date`, `star_rating`, `host_id`, user_reviewer_id) VALUES (1, 'This is a good host and has a very good relationship with the reviewwer, i subscribe to this host. ', '2020-10-10', 3, 920386034, 1);
INSERT INTO host_review (`id`, `comment`, `review_date`, `star_rating`, `host_id`, user_reviewer_id) VALUES (2, 'This is a good host and has a very good relationship with the reviewwer, i subscribe to this host. ', '2020-10-10', 5, 920386034, 2);
INSERT INTO host_review (`id`, `comment`, `review_date`, `star_rating`, `host_id`, user_reviewer_id) VALUES (3, 'This is a good host and has a very good relationship with the reviewwer, i subscribe to this host. ', '2020-10-10', 2, 333, 10);
INSERT INTO host_review (`id`, `comment`, `review_date`, `star_rating`, `host_id`, user_reviewer_id) VALUES (4, 'This is a good host and has a very good relationship with the reviewwer, i subscribe to this host. ', '2020-10-10', 4, 333, 1);
INSERT INTO host_review (`id`, `comment`, `review_date`, `star_rating`, `host_id`, user_reviewer_id) VALUES (5, 'This is a good host and has a very good relationship with the reviewwer, i subscribe to this host. ', '2020-10-10', 4, 444, 1);
INSERT INTO host_review (`id`, `comment`, `review_date`, `star_rating`, `host_id`, user_reviewer_id) VALUES (6, 'This is a good host and has a very good relationship with the reviewwer, i subscribe to this host. ', '2020-10-10', 4, 444, 1);

