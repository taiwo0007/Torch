--  use torchdb;
-- use freedb_torchdb;
DELETE FROM host_review;

DELETE FROM users_roles;
DELETE from scooter_review;
DELETE FROM trip;
DELETE FROM escooter;
DELETE FROM make;

ALTER TABLE escooter MODIFY about VARCHAR(1000);
SELECT * FROM escooter;
DELETE FROM user;
DELETE FROM host;
DELETE FROM insurance;

INSERT INTO insurance (id, cost, name) VALUES (1, 34.99, 'Axa Insurance');
INSERT INTO insurance (id, cost, name) VALUES (2, 99.99, 'Liberty Insurance');
INSERT INTO insurance (id, cost, name) VALUES (3, 49.99, 'KPC Insurance');
INSERT INTO insurance (id, cost, name) VALUES (4, 89.99, 'Beseaus Insurance');
INSERT INTO insurance (id, cost, name) VALUES (5, 9.99, 'Torch Insurance');
INSERT INTO insurance (id, cost, name) VALUES (6, 9.99, 'Electro Insurance');






INSERT INTO make(id, name, image) VALUES (2, "Pure Air", "/images/website/Make/pureelectric.png");

INSERT INTO make(id, name,image) VALUES (1, "Xioami", "/images/website/Make/xiaomi.png");

INSERT INTO make(id, name, image) VALUES (3, "Avovo", "/images/website/Make/avovo.png");

INSERT INTO make(id, name, image) VALUES (4, "Segway", "/images/website/Make/segway.png");

INSERT INTO make(id, name, image) VALUES (6, "Edisson", "/images/website/Make/segway.png");
INSERT INTO host(id, total_ad_days, insurance_id) VALUES (920386034, 9,3);
INSERT INTO host(id, total_ad_days, insurance_id) VALUES (333,9,1);
INSERT INTO host(id, total_ad_days, insurance_id) VALUES (444,9,1);
INSERT INTO host(id, total_ad_days, insurance_id) VALUES (5555, 9,2);
INSERT INTO host(id, total_ad_days, insurance_id) VALUES (6666,9,2);
INSERT INTO host(id, total_ad_days, insurance_id) VALUES (7777,1,3);
INSERT INTO host(id, total_ad_days, insurance_id) VALUES (8888, 1,2);
INSERT INTO host(id, total_ad_days, insurance_id) VALUES (9999,9,3);
INSERT INTO host(id, total_ad_days, insurance_id) VALUES (10000,9, 2);

INSERT INTO user (latitude, longitude, country, is_Torch_Trusted,
                  location, about, joined, id, email, password, first_name, last_name, profile_picture,
                  phone_number)
VALUES (-6.308530354714592,53.358888300000004,'ireland', true, 'Dalymount Park, Connaught Street, Phibsborough, Dublin, Ireland',
        'Lorem Ipsum is simply dummy text','2000-01-01',11111,
        '11111@gmail.com', '$2a$10$Gr.nVo2F4RAjUDNyHO86T.PxaUVhBcrz/Dx6bQiFb122mBqDAI1Gm', 'Bobby', 'Bricks',
        'https://images.pexels.com/photos/5082976/pexels-photo-5082976.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', 843568932);

INSERT INTO user (latitude, longitude, country, is_Torch_Trusted,
                  location, about, joined, id, email, password, first_name, last_name, profile_picture, host_id, is_host,
                  phone_number)
VALUES (-6.308530354714592,53.358888300000004,'ireland', true, 'Dalymount Park, Connaught Street, Phibsborough, Dublin, Ireland',
        'Lorem Ipsum is simply dummy text','2000-01-01',10000,
        '10000@gmail.com', '$2a$10$Gr.nVo2F4RAjUDNyHO86T.PxaUVhBcrz/Dx6bQiFb122mBqDAI1Gm', 'Laura', 'Winters',
        'https://images.pexels.com/photos/3811717/pexels-photo-3811717.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', 10000, true, 843568932);

INSERT INTO user (latitude, longitude, country, is_Torch_Trusted,
                  location, about, joined, id, email, password, first_name, last_name, profile_picture, host_id, is_host,
                  phone_number)
VALUES (-6.308530354714592,53.358888300000004,'ireland', true, 'Dalymount Park, Connaught Street, Phibsborough, Dublin, Ireland',
        'Lorem Ipsum is simply dummy text','2000-01-01',9999,
        '9999@gmail.com', '$2a$10$Gr.nVo2F4RAjUDNyHO86T.PxaUVhBcrz/Dx6bQiFb122mBqDAI1Gm', 'Emily', 'Paul',
        'https://images.pexels.com/photos/5325840/pexels-photo-5325840.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', 9999, true, 843568932);

INSERT INTO user (latitude, longitude, country, is_Torch_Trusted,
                  location, about, joined, id, email, password, first_name, last_name, profile_picture, host_id, is_host,
                  phone_number)
VALUES (-6.308530354714592,53.358888300000004,'ireland', true, 'Dalymount Park, Connaught Street, Phibsborough, Dublin, Ireland',
        'Lorem Ipsum is simply dummy text','2000-01-01',8888,
        '8888@gmail.com', '$2a$10$Gr.nVo2F4RAjUDNyHO86T.PxaUVhBcrz/Dx6bQiFb122mBqDAI1Gm', 'Sophie', 'Dylan',
        'https://images.pexels.com/photos/3812720/pexels-photo-3812720.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', 8888, true, 843568932);

INSERT INTO user (latitude, longitude, country, is_Torch_Trusted,
                  location, about, joined, id, email, password, first_name, last_name, profile_picture, host_id, is_host,
                  phone_number)
VALUES (-6.308530354714592,53.358888300000004,'ireland', true, 'Dalymount Park, Connaught Street, Phibsborough, Dublin, Ireland',
        'Lorem Ipsum is simply dummy text','2000-01-01',7777,
        '7777@gmail.com', '$2a$10$Gr.nVo2F4RAjUDNyHO86T.PxaUVhBcrz/Dx6bQiFb122mBqDAI1Gm', 'Lisa', 'Eiuger',
        'https://images.pexels.com/photos/3786525/pexels-photo-3786525.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', 7777, true, 843568932);

INSERT INTO user (latitude, longitude, country, is_Torch_Trusted,
                  location, about, joined, id, email, password, first_name, last_name, profile_picture, host_id, is_host,
                  phone_number)
VALUES (-6.308530354714592,53.358888300000004,'ireland', true, 'Dalymount Park, Connaught Street, Phibsborough, Dublin, Ireland',
        'Lorem Ipsum is simply dummy text','2000-01-01',6666,
        '6666@gmail.com', '$2a$10$Gr.nVo2F4RAjUDNyHO86T.PxaUVhBcrz/Dx6bQiFb122mBqDAI1Gm', 'Robert', 'Junior',
        'https://images.pexels.com/photos/762020/pexels-photo-762020.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', 6666, true, 843568932);

INSERT INTO user (latitude, longitude, country, is_Torch_Trusted,
                  location, about, joined, id, email, password, first_name, last_name, profile_picture, host_id, is_host,
                  phone_number)
VALUES (-6.308530354714592,53.358888300000004,'ireland', true, 'Dalymount Park, Connaught Street, Phibsborough, Dublin, Ireland',
        'Lorem Ipsum is simply dummy text','2000-01-01',5555,
        '5555@gmail.com', '$2a$10$Gr.nVo2F4RAjUDNyHO86T.PxaUVhBcrz/Dx6bQiFb122mBqDAI1Gm', 'Peter', 'Collings',
        'https://images.pexels.com/photos/3777943/pexels-photo-3777943.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', 5555, true, 843568932);

INSERT INTO user (account_type, latitude, longitude, country, is_Torch_Trusted, location, about, joined, id, email, password, first_name, last_name, profile_picture, host_id, is_host,
                  phone_number)
VALUES ('Basic',-6.308530354714592,53.358888300000004,'ireland', true, 'Dalymount Park, Connaught Street, Phibsborough, Dublin, Ireland',
        'Lorem Ipsum is simply dummy text','2000-01-01',1,
        'x00167646@mytudublin.ie', '$2a$10$Gr.nVo2F4RAjUDNyHO86T.PxaUVhBcrz/Dx6bQiFb122mBqDAI1Gm', 'Layla', 'Checkers',
        'https://storage.googleapis.com/torch-gcp-bucket/pic4.jpeg', 333, true, 843568932);

INSERT INTO user (account_type, latitude, longitude, country, is_Torch_Trusted, location,
                  about, joined, id, email, password, first_name, last_name, profile_picture, host_id, is_host,
                  phone_number)
VALUES ('Advanced',-6.308530354714592,53.358888300000004, 'ireland', true,'Dalymount Park, Connaught Street, Phibsborough, Dublin, Ireland',
        'Lorem Ipsum is simply dummy text of the
        ','2000-01-01',10,
        '00167646@mytudublin.ie', '$2a$10$Gr.nVo2F4RAjUDNyHO86T.PxaUVhBcrz/Dx6bQiFb122mBqDAI1Gm', 'Tori', 'Cardon',
        'https://images.pexels.com/photos/3768689/pexels-photo-3768689.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', 444, true, 843568932);



-- INSERT INTO user (country, is_verified, id, email, password, first_name, last_name, host_id, profile_picture, phone_number, is_host) VALUES ("Ireland", true, 9, "taiwo.obadareee@gmail.com", "$2a$10$Gr.nVo2F4RAjUDNyHO86T.PxaUVhBcrz/Dx6bQiFb122mBqDAI1Gm", "Taiwo", "Obadre", 920386034, "/images/uploads/profile.jpg", 08764532, true);


INSERT INTO user ( account_type, latitude, longitude, is_Torch_Trusted, location, about, joined, country, is_verified,
                  id, email, password, first_name, last_name, host_id, profile_picture, phone_number, is_host)
VALUES ('Pro', -6.308530354714592,53.358888300000004, true, 'Dalymount Park, Connaught Street, Phibsborough, Dublin, Ireland',
        'Lorem Ipsum is simply dummy text of the printing and ','2000-01-01',
        "Ireland", true, 2, "taiwo.obadare@gmail.com", "$2a$10$Gr.nVo2F4RAjUDNyHO86T.PxaUVhBcrz/Dx6bQiFb122mBqDAI1Gm", "Taiwo", "Obadre", 920386034, "https://storage.googleapis.com/torch-gcp-bucket/t1.png", 08764532, true);
INSERT INTO escooter (escooter_ad_days, county, longitude, latitude, address,country,trip_start, trip_end, scooter_weight, motor_power, max_weight, max_speed,
                      max_range, imageurl, cost, id, about, model_name,scooter_host_id, trips, rating, make_id)
VALUES (0,"Dublin",-6.308530354714592,53.358888300000004, "Starbucks, Federal Highway, Glenmarie, 40150 Shah Alam, Selangor, Malaysia","Ireland", DATE(NOW()),'2023-05-19', 71.0, 41.0, 31.0, 41.0, 14.0, "https://storage.cloud.google.com/torch-gcp-bucket/15.jpeg" ,23.00, 2, "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry''s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has su","Xiaomi Ultrol 40 pro",333, 39,2, 1);
INSERT INTO escooter (escooter_ad_days, county, longitude, latitude, address,country,trip_start, trip_end, scooter_weight, motor_power, max_weight, max_speed,max_range, imageurl, cost, id, about, model_name,scooter_host_id, trips, rating, make_id, ad_date)
VALUES (3, "Dublin",-6.259398,53.326007, "Starbucks, Federal Highway, Glenmarie, 40150 Shah Alam, Selangor, Malaysia","Ireland", DATE(NOW()),'2023-05-19', 71.0, 41.0, 141.0, 41.0, 14.0, "https://storage.cloud.google.com/torch-gcp-bucket/12.jpeg" ,23.00, 10, "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry''s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has su","Vector H48G Model 4",920386034,12,5,2, curdate());
INSERT INTO escooter (escooter_ad_days,county, longitude, latitude, address,country,trip_start, trip_end, scooter_weight, motor_power, max_weight, max_speed,max_range, imageurl, cost, id, about, model_name,scooter_host_id, trips, rating, make_id)
VALUES (0,"Dublin", -6.357966,53.338961, "Starbucks, Federal Highway, Glenmarie, 40150 Shah Alam, Selangor, Malaysia","Ireland", DATE(NOW()),'2023-05-19',71.0, 41.0, 51.0, 41.0, 14.0, "https://storage.cloud.google.com/torch-gcp-bucket/13.webp" ,23.00, 11, "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry''s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has su","Vultor 9R5NT",444, 102,5,6);
INSERT INTO escooter (escooter_ad_days,county, longitude, latitude, address,country,trip_start, trip_end, scooter_weight, motor_power, max_weight, max_speed,max_range, imageurl, cost, id, about, model_name,scooter_host_id, trips, rating, make_id)
VALUES (0,"Dublin", -6.267456,53.367980, "Starbucks, Federal Highway, Glenmarie, 40150 Shah Alam, Selangor, Malaysia","Ireland", DATE(NOW()),'2023-05-19', 71.0, 41.0, 91.0, 41.0, 14.0, "https://storage.cloud.google.com/torch-gcp-bucket/14.jpeg" ,23.00, 12, "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry''s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has su","Vultor v2 BFJJF",333, 91,3,3);
INSERT INTO escooter (escooter_ad_days,county, longitude, latitude, address,country,trip_start, trip_end, scooter_weight, motor_power, max_weight, max_speed,max_range, imageurl, cost, id, about, model_name,scooter_host_id, trips, rating, make_id)
VALUES (0,"Dublin", -6.283628,53.353929, "Starbucks, Federal Highway, Glenmarie, 40150 Shah Alam, Selangor, Malaysia","Ireland", DATE(NOW()),'2023-05-19', 71.0, 41.0, 61.0, 41.0, 14.0, "https://storage.cloud.google.com/torch-gcp-bucket/15.jpeg" ,23.00, 13, "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry''s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has su","Pure v2 NVJF",444, 49,3,4);

INSERT INTO escooter (escooter_ad_days,county,longitude, latitude,address,country,trip_start, trip_end, scooter_weight, motor_power, max_weight, max_speed,max_range, imageurl, cost, id, about, scooter_host_id, model_name, make_id, trips, rating)
VALUES (0,"Dublin",-6.257509754873317,53.356601299999994,"Dalymount Park, Connaught Street, Phibsborough, Dublin, Ireland","Ireland", DATE(NOW()),'2023-05-19', 61.0, 31.0, 161.0, 51.0, 14.0, "https://storage.cloud.google.com/torch-gcp-bucket/2.png" ,4.65, 3, "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry''s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has su", 444,"Segway Rider blad runner",1,23, 4);
INSERT INTO escooter (escooter_ad_days,county,longitude, latitude,address,country,trip_start, trip_end, scooter_weight, motor_power, max_weight, max_speed,max_range, imageurl, cost, id, about, scooter_host_id, model_name, make_id, trips)
VALUES (0,"Dublin",-6.2705497,53.3284532,"Starbucks, Federal Highway, Glenmarie, 40150 Shah Alam, Selangor, Malaysia","Ireland", DATE(NOW()),'2023-05-19', 31.0, 41.0, 31.0, 16.0, 17.0, "https://storage.cloud.google.com/torch-gcp-bucket/3.png" ,19.99, 4, "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry''s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has su", 333,"Readme xeon pro",1,36);
INSERT INTO escooter (escooter_ad_days,county,longitude, latitude,address,country,trip_start, trip_end, scooter_weight, motor_power, max_weight, max_speed,max_range, imageurl, cost, id, about, scooter_host_id, model_name, make_id, trips)
VALUES (0,"Dublin",-6.274931400000001,53.3618599,"Starbucks, Federal Highway, Glenmarie, 40150 Shah Alam, Selangor, Malaysia","Ireland", DATE(NOW()),'2023-05-19', 21.0, 51.0, 11.0, 19.0, 14.0, "https://storage.cloud.google.com/torch-gcp-bucket/escooter5.png" ,34.65, 5, "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry''s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has su", 444,"Readme 11 horseshot",2, 53);
INSERT INTO escooter (escooter_ad_days,county,longitude, latitude, address,country,trip_start, trip_end, scooter_weight, motor_power, max_weight, max_speed,max_range, imageurl, cost, id, about, scooter_host_id, model_name, make_id, trips)
VALUES (0,"Dublin",-6.272079460031218,53.37234705, "Starbucks, Federal Highway, Glenmarie, 40150 Shah Alam, Selangor, Malaysia","Ireland", DATE(NOW()),'2023-05-19', 31.0, 117.0, 67.0, 25.0, 23.0, "https://storage.cloud.google.com/torch-gcp-bucket/electric1.jpeg" ,23.70, 6, "This scooter is an amaxing scooter trust me", 444,"Xiaomi Bever we pro",2,29);
INSERT INTO escooter (escooter_ad_days,county,longitude, latitude, address,country,trip_start, trip_end, scooter_weight, motor_power, max_weight, max_speed,max_range, imageurl, cost, id, about, scooter_host_id, model_name, make_id, trips, ad_date)
VALUES (10,"Dublin",-6.332905492347467,53.32483445, "Starbucks, Federal Highway, Glenmarie, 40150 Shah Alam, Selangor, Malaysia","Ireland", DATE(NOW()),'2023-05-19', 15.0, 151.0, 43.0, 25.0, 65.0, "https://storage.cloud.google.com/torch-gcp-bucket/electric7.jpeg" ,14.65, 7, "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry''s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has su", 920386034,"Vovo plexer blad runner",1,26, curdate());
INSERT INTO escooter (escooter_ad_days,county,longitude, latitude, address,country,trip_start, trip_end, scooter_weight, motor_power, max_weight, max_speed,max_range, imageurl, cost, id, about, scooter_host_id, model_name, make_id, trips)
VALUES (0,"Dublin",-6.330710473854637,53.3589378, "Starbucks, Federal Highway, Glenmarie, 40150 Shah Alam, Selangor, Malaysia","Ireland", DATE(DATE(NOW())),'2023-05-19',31.0, 131.0, 34.0, 19.0, 23.0, "https://storage.cloud.google.com/torch-gcp-bucket/electric9.jpeg" ,16.99, 8, "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry''s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has su", 333,"Viltron xeon pro",1,45);
INSERT INTO escooter (escooter_ad_days,county,longitude, latitude,address, country,trip_start, trip_end, scooter_weight, motor_power, max_weight, max_speed,max_range, imageurl, cost, id, about, scooter_host_id, model_name, make_id, trips) VALUES (0,"Dublin",-6.271484416353246,53.339504649999995, "Starbucks, Federal Highway, Glenmarie, 40150 Shah Alam, Selangor, Malaysia", "Ireland", DATE(NOW()),'2023-05-19', 19.0, 28.0, 19.0, 45.0, 48.0, "https://storage.cloud.google.com/torch-gcp-bucket/electric8.jpeg" ,34.65, 9, "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry''s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has su", 333,"Biner 11 34",2, 33);
INSERT INTO escooter (escooter_ad_days,county,longitude, latitude,address, country,trip_start, trip_end, scooter_weight, motor_power, max_weight, max_speed,max_range, imageurl, cost, id, about, scooter_host_id, model_name, make_id, trips) VALUES (0,"Dublin",-6.293674,53.335449 , "Starbucks, Federal Highway, Glenmarie, 40150 Shah Alam, Selangor, Malaysia", "Ireland", DATE(NOW()),'2023-05-19', 19.0, 28.0, 19.0, 45.0, 48.0, "https://storage.cloud.google.com/torch-gcp-bucket/18.avif" ,34.65, 14, "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry''s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has su", 920386034,"Speed 5GETG 34",2, 33);



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
VALUES(2, 1, "ACTIVE", 23.00, '2022-12-21 00:00:00', "06LB-D27N-49M3", '2022-12-17 00:00:00', 7,333, 1);



INSERT INTO trip (days,id, status, trip_cost, trip_end, trip_id, trip_start, escooter_id, host_id, user_renter_id)
VALUES(2,2, "ACTIVE", 23.00, '2022-12-21 00:00:00', "06LB-N4NN-H9M3", '2022-12-17 00:00:00', 2,920386034, 10);

INSERT INTO trip (days,id, status, trip_cost, trip_end, trip_id, trip_start, escooter_id, host_id, user_renter_id)
VALUES(2,3, "ACTIVE", 243.00, '2022-12-21 00:00:00', "064B-JJJJ-H9M3", '2022-12-17 00:00:00', 3,444, 2);


INSERT INTO trip (days,id, status, trip_cost, trip_end, trip_id, trip_start, escooter_id, host_id, user_renter_id)
VALUES(2,4, "ACTIVE", 233.00, '2022-12-21 00:00:00', "06LB-7777-H9M3", '2022-12-17 00:00:00', 5,333, 2);


INSERT INTO trip (days,id, status, trip_cost, trip_end, trip_id, trip_start, escooter_id, host_id, user_renter_id)
VALUES(2,5, "COMPLETED", 283.00, '2022-12-21 00:00:00', "066B-NNNN-H9M3", '2022-12-17 00:00:00', 8,920386034, 10);


INSERT INTO trip (days,id, status, trip_cost, trip_end, trip_id, trip_start, escooter_id, host_id, user_renter_id)
VALUES(2,6, "ACTIVE", 143.00, '2023-04-25 00:00:00', "06LB-6966-H9M3", DATE(NOW()), 2,333, 2);

INSERT INTO trip (days,id, status, trip_cost, trip_end, trip_id, trip_start, escooter_id, host_id, user_renter_id)
VALUES(2,7, "ACTIVE", 443.00, '2022-12-19 00:00:00', "06LB-FFFF-H8M3", '2022-12-01 00:00:00', 4,444, 10);


INSERT INTO host_review (`id`, `comment`, `review_date`, `star_rating`, `host_id`, user_reviewer_id) VALUES (17, 'Excellent renter and followed instructions very well. scooter kept very clean also. Thx! ', '2020-10-10', 3, 920386034, 5555);
INSERT INTO host_review (`id`, `comment`, `review_date`, `star_rating`, `host_id`, user_reviewer_id) VALUES (18, 'Host is top notch! Highly recommended and down to Earth thx! ', '2020-10-10', 5, 920386034, 10);
INSERT INTO host_review (`id`, `comment`, `review_date`, `star_rating`, `host_id`, user_reviewer_id) VALUES (19, 'Good guy. It’s was as if it never left! ', '2020-10-10', 2, 920386034, 6666);
INSERT INTO host_review (`id`, `comment`, `review_date`, `star_rating`, `host_id`, user_reviewer_id) VALUES (110, 'Very clean, very honest, and very nice. ', '2020-10-10', 4, 920386034, 7777);
INSERT INTO host_review (`id`, `comment`, `review_date`, `star_rating`, `host_id`, user_reviewer_id) VALUES (111, 'Excellent renter and followed instructions very well. scooter kept very clean also. Thx! I subscribe to this host', '2020-10-10', 4, 444, 8888);

INSERT INTO host_review (`id`, `comment`, `review_date`, `star_rating`, `host_id`, user_reviewer_id) VALUES (20, 'Excellent renter and followed instructions very well. scooter kept very clean also. Thx! ', '2020-10-10', 3, 333, 5555);
INSERT INTO host_review (`id`, `comment`, `review_date`, `star_rating`, `host_id`, user_reviewer_id) VALUES (28, 'Host is top notch! Highly recommended and down to Earth thx! ', '2020-10-10', 5, 333, 10);
INSERT INTO host_review (`id`, `comment`, `review_date`, `star_rating`, `host_id`, user_reviewer_id) VALUES (29, 'Good guy. It’s was as if it never left! ', '2020-10-10', 2, 333, 6666);
INSERT INTO host_review (`id`, `comment`, `review_date`, `star_rating`, `host_id`, user_reviewer_id) VALUES (120, 'Very clean, very honest, and very nice. ', '2020-10-10', 4, 333, 7777);
INSERT INTO host_review (`id`, `comment`, `review_date`, `star_rating`, `host_id`, user_reviewer_id) VALUES (121, 'Excellent renter and followed instructions very well. scooter kept very clean also. Thx!, Great experience. The way it should be. Thanks  ', '2020-10-10', 4, 333, 8888);



INSERT INTO host_review (`id`, `comment`, `review_date`, `star_rating`, `host_id`, user_reviewer_id) VALUES (1, 'This is a good host and has a very good relationship with the reviewwer, i subscribe to this host. ', '2020-10-10', 3, 920386034, 1);
INSERT INTO host_review (`id`, `comment`, `review_date`, `star_rating`, `host_id`, user_reviewer_id) VALUES (2, 'This is a good host and has a very good relationship with the reviewwer, i subscribe to this host. ', '2020-10-10', 5, 920386034, 2);
INSERT INTO host_review (`id`, `comment`, `review_date`, `star_rating`, `host_id`, user_reviewer_id) VALUES (3, 'This is a good host and has a very good relationship with the reviewwer, i subscribe to this host. ', '2020-10-10', 2, 333, 10);
INSERT INTO host_review (`id`, `comment`, `review_date`, `star_rating`, `host_id`, user_reviewer_id) VALUES (4, 'This is a good host and has a very good relationship with the reviewwer, i subscribe to this host. ', '2020-10-10', 4, 333, 1);
INSERT INTO host_review (`id`, `comment`, `review_date`, `star_rating`, `host_id`, user_reviewer_id) VALUES (5, 'This is a good host and has a very good relationship with the reviewwer, i subscribe to this host. ', '2020-10-10', 4, 333, 1);
INSERT INTO host_review (`id`, `comment`, `review_date`, `star_rating`, `host_id`, user_reviewer_id) VALUES (6, 'This is a good host and has a very good relationship with the reviewwer, i subscribe to this host. ', '2020-10-10', 4, 333, 1);







INSERT INTO escooter
    (rating,escooter_ad_days,county,longitude, latitude,address, country,trip_start, trip_end, scooter_weight, motor_power, max_weight, max_speed,max_range, imageurl, cost,
     id, about, scooter_host_id, model_name, make_id, trips)
VALUES  (4.0, 0,"Dublin",-6.302885, 53.387816, "Starbucks, Federal Highway, Glenmarie, 40150 Shah Alam, Selangor, Malaysia", "Ireland",
         DATE(NOW()),'2023-05-19', 19.0, 28.0, 19.0, 45.0, 48.0, "https://storage.cloud.google.com/torch-gcp-bucket/escooter1.png" ,12.99,
         15,
         "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry''s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has su",
         920386034,"Xiamoi Bubble Blaze",3, 63);

INSERT INTO escooter
(rating,escooter_ad_days,county,longitude, latitude,address, country,trip_start, trip_end, scooter_weight, motor_power, max_weight, max_speed,max_range, imageurl, cost,
 id, about, scooter_host_id, model_name, make_id, trips)
VALUES  (4.0, 0,"Dublin",-6.303572, 53.313219, "Starbucks, Federal Highway, Glenmarie, 40150 Shah Alam, Selangor, Malaysia", "Ireland",
         DATE(NOW()),'2023-05-19', 19.0, 28.0, 19.0, 45.0, 48.0, "https://storage.cloud.google.com/torch-gcp-bucket/escooter2.png" ,56.99,
         16,
         "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry''s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has su",
         920386034,"Red Blazer 45T",1, 76);

INSERT INTO escooter
(rating,escooter_ad_days,county,longitude, latitude,address, country,trip_start, trip_end, scooter_weight, motor_power, max_weight, max_speed,max_range, imageurl, cost,
 id, about, scooter_host_id, model_name, make_id, trips)
VALUES  (4.0, 0,"Dublin",-6.328278, 53.511675, "Starbucks, Federal Highway, Glenmarie, 40150 Shah Alam, Selangor, Malaysia", "Ireland",
         DATE(NOW()),'2023-05-19', 19.0, 28.0, 19.0, 45.0, 48.0, "https://storage.cloud.google.com/torch-gcp-bucket/escooter3.png" ,41.99,
         17,
         "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry''s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has su",
         920386034,"Test Avivo Edge 5Y",2, 13);

INSERT INTO escooter
(rating,escooter_ad_days,county,longitude, latitude,address, country,trip_start, trip_end, scooter_weight, motor_power, max_weight, max_speed,max_range, imageurl, cost,
 id, about, scooter_host_id, model_name, make_id, trips)
VALUES  (4.0, 0,"Dublin",-6.280081, 53.328599, "Starbucks, Federal Highway, Glenmarie, 40150 Shah Alam, Selangor, Malaysia", "Ireland",
         DATE(NOW()),'2023-05-19', 19.0, 28.0, 19.0, 45.0, 48.0, "https://storage.cloud.google.com/torch-gcp-bucket/escooter4.png" ,38.99,
         18,
         "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry''s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has su",
         920386034,"Pure Air Smart",4, 56);

INSERT INTO escooter
(rating,escooter_ad_days,county,longitude, latitude,address, country,trip_start, trip_end, scooter_weight, motor_power, max_weight, max_speed,max_range, imageurl, cost,
 id, about, scooter_host_id, model_name, make_id, trips)
VALUES  (4.0, 0,"Dublin",-6.271081, 53.329731, "Starbucks, Federal Highway, Glenmarie, 40150 Shah Alam, Selangor, Malaysia", "Ireland",
         DATE(NOW()),'2023-05-19', 19.0, 28.0, 19.0, 45.0, 48.0, "https://storage.cloud.google.com/torch-gcp-bucket/escooter5.png" ,12.99,
         19,
         "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry''s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has su",
         920386034,"Princeton Electric EVO 76",3, 39);

INSERT INTO escooter
(rating,escooter_ad_days,county,longitude, latitude,address, country,trip_start, trip_end, scooter_weight, motor_power, max_weight, max_speed,max_range, imageurl, cost,
 id, about, scooter_host_id, model_name, make_id, trips)
VALUES  (4.0, 0,"Dublin",-6.287186, 53.375111, "Starbucks, Federal Highway, Glenmarie, 40150 Shah Alam, Selangor, Malaysia", "Ireland",
         DATE(NOW()),'2023-05-19', 19.0, 28.0, 19.0, 45.0, 48.0, "https://storage.cloud.google.com/torch-gcp-bucket/escooter6.png" ,149.99,
         20,
         "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry''s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has su",
         920386034,"Voltron 6E",4, 120);

INSERT INTO escooter
(rating,escooter_ad_days,county,longitude, latitude,address, country,trip_start, trip_end, scooter_weight, motor_power, max_weight, max_speed,max_range, imageurl, cost,
 id, about, scooter_host_id, model_name, make_id, trips)
VALUES  (4.0, 0,"Dublin",-6.287186, 53.375111, "Starbucks, Federal Highway, Glenmarie, 40150 Shah Alam, Selangor, Malaysia", "Ireland",
         DATE(NOW()),'2023-05-19', 19.0, 28.0, 19.0, 45.0, 48.0, "https://storage.cloud.google.com/torch-gcp-bucket/escooter6.png" ,149.99,
         28,
         "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry''s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has su",
         920386034,"Voltron 6E",4, 120);

INSERT INTO escooter
(rating,escooter_ad_days,county,longitude, latitude,address, country,trip_start, trip_end, scooter_weight, motor_power, max_weight, max_speed,max_range, imageurl, cost,
 id, about, scooter_host_id, model_name, make_id, trips)
VALUES  (4.0, 0,"Dublin",-6.290502, 53.313603, "Starbucks, Federal Highway, Glenmarie, 40150 Shah Alam, Selangor, Malaysia", "Ireland",
         DATE(NOW()),'2023-05-19', 19.0, 28.0, 19.0, 45.0, 48.0, "https://storage.cloud.google.com/torch-gcp-bucket/escooter7.png" ,98.99,
         21,
         "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry''s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has su",
         9999,"Voltron Blade 78",1, 29);

INSERT INTO escooter
(rating,escooter_ad_days,county,longitude, latitude,address, country,trip_start, trip_end, scooter_weight, motor_power, max_weight, max_speed,max_range, imageurl, cost,
 id, about, scooter_host_id, model_name, make_id, trips)
VALUES  (4.0, 0,"Dublin",-6.323187, 53.343873, "Starbucks, Federal Highway, Glenmarie, 40150 Shah Alam, Selangor, Malaysia", "Ireland",
         DATE(NOW()),'2023-05-19', 19.0, 28.0, 19.0, 45.0, 48.0, "https://storage.cloud.google.com/torch-gcp-bucket/escooter8.png" ,98.99,
         22,
         "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry''s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has su",
         8888,"Bravo Yin Blade 32",2, 99);

INSERT INTO escooter
(rating,escooter_ad_days,county,longitude, latitude,address, country,trip_start, trip_end, scooter_weight, motor_power, max_weight, max_speed,max_range, imageurl, cost,
 id, about, scooter_host_id, model_name, make_id, trips)
VALUES  (4.0, 0,"Dublin",-6.260423, 53.352780, "Starbucks, Federal Highway, Glenmarie, 40150 Shah Alam, Selangor, Malaysia", "Ireland",
         DATE(NOW()),'2023-05-19', 19.0, 28.0, 19.0, 45.0, 48.0, "https://storage.cloud.google.com/torch-gcp-bucket/escooter9.png" ,10.99,
         23,
         "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry''s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has su",
         7777,"Nugat Speed 45",3, 123);

INSERT INTO escooter
(rating,escooter_ad_days,county,longitude, latitude,address, country,trip_start, trip_end, scooter_weight, motor_power, max_weight, max_speed,max_range, imageurl, cost,
 id, about, scooter_host_id, model_name, make_id, trips)
VALUES  (4.0, 0,"Dublin",-6.311818, 53.339348, "Starbucks, Federal Highway, Glenmarie, 40150 Shah Alam, Selangor, Malaysia", "Ireland",
         DATE(NOW()),'2023-05-19', 19.0, 28.0, 19.0, 45.0, 48.0, "https://storage.cloud.google.com/torch-gcp-bucket/escooter10.png" ,45.99,
         24,
         "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry''s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has su",
         6666,"Nugat Eco 45ER",4, 78);


INSERT INTO escooter
(rating,escooter_ad_days,county,longitude, latitude,address, country,trip_start, trip_end, scooter_weight, motor_power, max_weight, max_speed,max_range, imageurl, cost,
 id, about, scooter_host_id, model_name, make_id, trips)
VALUES  (4.0, 0,"Dublin",-6.286712, 53.362393, "Starbucks, Federal Highway, Glenmarie, 40150 Shah Alam, Selangor, Malaysia", "Ireland",
         DATE(NOW()),'2023-05-19', 19.0, 28.0, 19.0, 45.0, 48.0, "https://storage.cloud.google.com/torch-gcp-bucket/escooter11.png" ,89.99,
         25,
         "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry''s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has su",
         5555,"Xiaomi Only Blade 4",2, 40);

INSERT INTO escooter
(ad_date, rating,escooter_ad_days,county,longitude, latitude,address, country,trip_start, trip_end, scooter_weight, motor_power, max_weight, max_speed,max_range, imageurl, cost,
 id, about, scooter_host_id, model_name, make_id, trips)
VALUES  (curdate(), 4.0, 10,"Dublin",-6.249528, 53.346842, "Starbucks, Federal Highway, Glenmarie, 40150 Shah Alam, Selangor, Malaysia", "Ireland",
         DATE(NOW()),'2023-05-19',19.0, 28.0, 19.0, 45.0, 48.0, "https://storage.cloud.google.com/torch-gcp-bucket/escooter12.png" ,54.99,
         26,
         "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry''s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has su",
         920386034,"Pure Eco Runner",1, 187);

INSERT INTO escooter
(ad_date, rating,escooter_ad_days,county,longitude, latitude,address, country,trip_start, trip_end, scooter_weight, motor_power, max_weight, max_speed,max_range, imageurl, cost,
 id, about, scooter_host_id, model_name, make_id, trips)
VALUES  (curdate(),4.0, 3,"Dublin",-6.293518, 53.322790, "Starbucks, Federal Highway, Glenmarie, 40150 Shah Alam, Selangor, Malaysia", "Ireland",
         DATE(NOW()),'2023-05-19',19.0, 28.0, 19.0, 45.0, 48.0, "https://storage.cloud.google.com/torch-gcp-bucket/escooter13.png" ,23.99,
         27,
         "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry''s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has su",
         920386034,"Pure Advanced Runner",4, 24);

INSERT INTO escooter
(ad_date, rating,escooter_ad_days,county,longitude, latitude,address, country,trip_start, trip_end, scooter_weight, motor_power, max_weight, max_speed,max_range, imageurl, cost,
 id, about, scooter_host_id, model_name, make_id, trips)
VALUES  (curdate(), 4.0, 3,"Dublin",-6.308215, 53.332243, "Starbucks, Federal Highway, Glenmarie, 40150 Shah Alam, Selangor, Malaysia", "Ireland",
         DATE(NOW()),'2023-05-19', 19.0, 28.0, 19.0, 45.0, 48.0, "https://storage.cloud.google.com/torch-gcp-bucket/escooter14.png" ,9.99,
         29,
         "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry''s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has su",
         333,"Pure Evolution Runner",1, 87);

INSERT INTO escooter
(ad_date, rating,escooter_ad_days,county,longitude, latitude,address, country,trip_start, trip_end, scooter_weight, motor_power, max_weight, max_speed,max_range, imageurl, cost,
 id, about, scooter_host_id, model_name, make_id, trips)
VALUES  (curdate(), 4.0, 3,"Dublin",-6.326085, 53.385637, "Starbucks, Federal Highway, Glenmarie, 40150 Shah Alam, Selangor, Malaysia", "Ireland",
         DATE(NOW()),'2023-05-19', 19.0, 28.0, 19.0, 45.0, 48.0, "https://images.pexels.com/photos/9463263/pexels-photo-9463263.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" ,99.99,
         30,
         "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry''s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has su",
         444,"Xiamoi Vultron 56 NB",6, 125);

INSERT INTO escooter
(rating,escooter_ad_days,county,longitude, latitude,address, country,trip_start, trip_end, scooter_weight, motor_power, max_weight, max_speed,max_range, imageurl, cost,
 id, about, scooter_host_id, model_name, make_id, trips)
VALUES  (4.0, 0,"Dublin",-6.326085, 53.380517, "Starbucks, Federal Highway, Glenmarie, 40150 Shah Alam, Selangor, Malaysia", "Ireland",
         DATE(NOW()),'2023-05-19', 19.0, 28.0, 19.0, 45.0, 48.0, "https://storage.cloud.google.com/torch-gcp-bucket/escooter15.png" ,7.99,
         31,
         "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry''s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has su",
         920386034,"Pure air advanced 2",6, 178);

INSERT INTO escooter
(rating,escooter_ad_days,county,longitude, latitude,address, country,trip_start, trip_end, scooter_weight, motor_power, max_weight, max_speed,max_range, imageurl, cost,
 id, about, scooter_host_id, model_name, make_id, trips)
VALUES  (4.0, 0,"Dublin",-6.340505, 53.387070, "Starbucks, Federal Highway, Glenmarie, 40150 Shah Alam, Selangor, Malaysia", "Ireland",
         DATE(NOW()),'2023-05-19', 19.0, 28.0, 19.0, 45.0, 48.0, "https://storage.cloud.google.com/torch-gcp-bucket/escooter17.png" ,8.99,
         32,
         "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry''s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has su",
         920386034,"Pure air advanced YE",6, 23);

INSERT INTO escooter
(rating,escooter_ad_days,county,longitude, latitude,address, country,trip_start, trip_end, scooter_weight, motor_power, max_weight, max_speed,max_range, imageurl, cost,
 id, about, scooter_host_id, model_name, make_id, trips)
VALUES  (4.0, 0,"Dublin",-6.3588719, 53.367614, "Starbucks, Federal Highway, Glenmarie, 40150 Shah Alam, Selangor, Malaysia", "Ireland",
         DATE(NOW()),'2023-05-19', 19.0, 28.0, 19.0, 45.0, 48.0, "https://storage.cloud.google.com/torch-gcp-bucket/escooter16.png" ,9.99,
         33,
         "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry''s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has su",
         920386034,"Pure air advanced VR",1, 76);




INSERT INTO scooter_review(id, comment, review_date, star_rating, scooter_id, scooter_reviewer_id)
VALUES (134,
        "Very helpful and communicative…sciiter has super strong bad smell so I would try to clean that if you could…but other than that it ran great",
        '2023-01-11', 5, 15, 5555);

INSERT INTO scooter_review(id, comment, review_date, star_rating, scooter_id, scooter_reviewer_id)
VALUES (135,
        "Everything was so easy, and the communication was excellent. I had no questions and everything was taken care of for me. Awesome!",
        '2023-01-11', 3, 15, 6666);

INSERT INTO scooter_review(id, comment, review_date, star_rating, scooter_id, scooter_reviewer_id)
VALUES (136,
        "Always a pleasant experience with Tung Sang Tran! Repeat customer, will use again",
        '2023-01-11', 5, 15, 7777);

INSERT INTO scooter_review(id, comment, review_date, star_rating, scooter_id, scooter_reviewer_id)
VALUES (137,
        "Easy to deal with, very accomodating. Power Efficient`",
        '2023-01-11', 3, 15, 8888);

INSERT INTO scooter_review(id, comment, review_date, star_rating, scooter_id, scooter_reviewer_id)
VALUES (138,
        "Tung and his colleague Gorge are the absolute best.",
        '2023-01-11', 5, 15, 9999);

INSERT INTO scooter_review(id, comment, review_date, star_rating, scooter_id, scooter_reviewer_id)
VALUES (139,
        "Works as described. Good experience in pick and drop off, super easy and on time.",
        '2023-01-11', 4, 15, 10000);

INSERT INTO scooter_review(id, comment, review_date, star_rating, scooter_id, scooter_reviewer_id)
VALUES (140,
        "Would highly recommend!",
        '2023-01-11', 5, 15, 11111);


INSERT INTO scooter_review(id, comment, review_date, star_rating, scooter_id, scooter_reviewer_id)
VALUES (145,
        "Easy to deal with, very accomodating. Power Efficient`",
        '2023-01-11', 4, 16, 8888);

INSERT INTO scooter_review(id, comment, review_date, star_rating, scooter_id, scooter_reviewer_id)
VALUES (146,
        "Tung and his colleague Gorge are the absolute best.",
        '2023-01-11', 5, 16, 9999);

INSERT INTO scooter_review(id, comment, review_date, star_rating, scooter_id, scooter_reviewer_id)
VALUES (147,
        "Works as described. Good experience in pick and drop off, super easy and on time.",
        '2023-01-11', 4, 16, 10000);

INSERT INTO scooter_review(id, comment, review_date, star_rating, scooter_id, scooter_reviewer_id)
VALUES (148,
        "Would highly recommend!",
        '2023-01-11', 2, 16, 11111);


INSERT INTO scooter_review(id, comment, review_date, star_rating, scooter_id, scooter_reviewer_id)
VALUES (141,
        "Very helpful and communicative…sciiter has super strong bad smell so I would try to clean that if you could…but other than that it ran great",
        '2023-01-11', 4, 16, 5555);

INSERT INTO scooter_review(id, comment, review_date, star_rating, scooter_id, scooter_reviewer_id)
VALUES (142,
        "Everything was so easy, and the communication was excellent. I had no questions and everything was taken care of for me. Awesome!",
        '2023-01-11', 3, 16, 6666);

INSERT INTO scooter_review(id, comment, review_date, star_rating, scooter_id, scooter_reviewer_id)
VALUES (143,
        "Always a pleasant experience with Tung Sang Tran! Repeat customer, will use again",
        '2023-01-11', 5, 16, 7777);






INSERT INTO scooter_review(id, comment, review_date, star_rating, scooter_id, scooter_reviewer_id)
VALUES (149,
        "Easy to deal with, very accomodating. Power Efficient`",
        '2023-01-11', 4, 2, 8888);

INSERT INTO scooter_review(id, comment, review_date, star_rating, scooter_id, scooter_reviewer_id)
VALUES (150,
        "Tung and his colleague Gorge are the absolute best.",
        '2023-01-11', 3, 2, 9999);

INSERT INTO scooter_review(id, comment, review_date, star_rating, scooter_id, scooter_reviewer_id)
VALUES (151,
        "Works as described. Good experience in pick and drop off, super easy and on time.",
        '2023-01-11', 4, 2, 10000);

INSERT INTO scooter_review(id, comment, review_date, star_rating, scooter_id, scooter_reviewer_id)
VALUES (152,
        "Would highly recommend!",
        '2023-01-11', 2, 2, 11111);


INSERT INTO scooter_review(id, comment, review_date, star_rating, scooter_id, scooter_reviewer_id)
VALUES (153,
        "Very helpful and communicative…sciiter has super strong bad smell so I would try to clean that if you could…but other than that it ran great",
        '2023-01-11', 4, 2, 5555);

INSERT INTO scooter_review(id, comment, review_date, star_rating, scooter_id, scooter_reviewer_id)
VALUES (154,
        "Everything was so easy, and the communication was excellent. I had no questions and everything was taken care of for me. Awesome!",
        '2023-01-11', 3, 2, 6666);

INSERT INTO scooter_review(id, comment, review_date, star_rating, scooter_id, scooter_reviewer_id)
VALUES (155,
        "Always a pleasant experience with Tung Sang Tran! Repeat customer, will use again",
        '2023-01-11', 4, 2, 7777);






INSERT INTO scooter_review(id, comment, review_date, star_rating, scooter_id, scooter_reviewer_id)
VALUES (156,
        "Easy to deal with, very accomodating. Power Efficient`",
        '2023-01-11', 4, 2, 8888);

INSERT INTO scooter_review(id, comment, review_date, star_rating, scooter_id, scooter_reviewer_id)
VALUES (157,
        "Tung and his colleague Gorge are the absolute best.",
        '2023-01-11', 3, 2, 9999);

INSERT INTO scooter_review(id, comment, review_date, star_rating, scooter_id, scooter_reviewer_id)
VALUES (158,
        "Works as described. Good experience in pick and drop off, super easy and on time.",
        '2023-01-11', 4, 2, 10000);

INSERT INTO scooter_review(id, comment, review_date, star_rating, scooter_id, scooter_reviewer_id)
VALUES (159,
        "Would highly recommend!",
        '2023-01-11', 2, 30, 11111);


INSERT INTO scooter_review(id, comment, review_date, star_rating, scooter_id, scooter_reviewer_id)
VALUES (160,
        "Very helpful and communicative…sciiter has super strong bad smell so I would try to clean that if you could…but other than that it ran great",
        '2023-01-11', 4, 4, 5555);

INSERT INTO scooter_review(id, comment, review_date, star_rating, scooter_id, scooter_reviewer_id)
VALUES (161,
        "Everything was so easy, and the communication was excellent. I had no questions and everything was taken care of for me. Awesome!",
        DATE(NOW()), 3, 3, 6666);

INSERT INTO scooter_review(id, comment, review_date, star_rating, scooter_id, scooter_reviewer_id)
VALUES (162,
        "Always a pleasant experience with Tung Sang Tran! Repeat customer, will use again",
        '2023-01-11', 4, 29, 7777);

INSERT INTO scooter_review(id, comment, review_date, star_rating, scooter_id, scooter_reviewer_id)
VALUES (163,
        "Easy to deal with, very accomodating. Power Efficient`",
        '2023-01-11', 4, 5, 8888);

INSERT INTO scooter_review(id, comment, review_date, star_rating, scooter_id, scooter_reviewer_id)
VALUES (164,
        "Tung and his colleague Gorge are the absolute best.",
        '2023-01-11', 3, 4, 9999);

INSERT INTO scooter_review(id, comment, review_date, star_rating, scooter_id, scooter_reviewer_id)
VALUES (165,
        "Works as described. Good experience in pick and drop off, super easy and on time.",
        '2023-01-11', 4, 3, 10000);

INSERT INTO scooter_review(id, comment, review_date, star_rating, scooter_id, scooter_reviewer_id)
VALUES (166,
        "Would highly recommend!",
        '2023-01-11', 2, 6, 11111);


INSERT INTO scooter_review(id, comment, review_date, star_rating, scooter_id, scooter_reviewer_id)
VALUES (167,
        "Very helpful and communicative…sciiter has super strong bad smell so I would try to clean that if you could…but other than that it ran great",
        '2023-01-11', 4, 5, 5555);

INSERT INTO scooter_review(id, comment, review_date, star_rating, scooter_id, scooter_reviewer_id)
VALUES (168,
        "Everything was so easy, and the communication was excellent. I had no questions and everything was taken care of for me. Awesome!",
        '2023-01-11', 3, 4, 6666);

INSERT INTO scooter_review(id, comment, review_date, star_rating, scooter_id, scooter_reviewer_id)
VALUES (169,
        "Always a pleasant experience with Tung Sang Tran! Repeat customer, will use again",
        '2023-01-11', 4, 3, 7777);
















INSERT INTO scooter_review(id, comment, review_date, star_rating, scooter_id, scooter_reviewer_id)
VALUES (170,
        "Easy to deal with, very accomodating. Power Efficient`",
        '2023-01-11', 4, 28, 8888);

INSERT INTO scooter_review(id, comment, review_date, star_rating, scooter_id, scooter_reviewer_id)
VALUES (171,
        "Tung and his colleague Gorge are the absolute best.",
        '2023-01-11', 3, 27, 9999);

INSERT INTO scooter_review(id, comment, review_date, star_rating, scooter_id, scooter_reviewer_id)
VALUES (172,
        "Works as described. Good experience in pick and drop off, super easy and on time.",
        '2023-01-11', 4, 26, 10000);

INSERT INTO scooter_review(id, comment, review_date, star_rating, scooter_id, scooter_reviewer_id)
VALUES (173,
        "Would highly recommend!",
        '2023-01-11', 2, 25, 11111);


INSERT INTO scooter_review(id, comment, review_date, star_rating, scooter_id, scooter_reviewer_id)
VALUES (183,
        "Very helpful and communicative…sciiter has super strong bad smell so I would try to clean that if you could…but other than that it ran great",
        '2023-01-11', 4, 24, 5555);

INSERT INTO scooter_review(id, comment, review_date, star_rating, scooter_id, scooter_reviewer_id)
VALUES (174,
        "Everything was so easy, and the communication was excellent. I had no questions and everything was taken care of for me. Awesome!",
        DATE(NOW()), 3, 23, 6666);

INSERT INTO scooter_review(id, comment, review_date, star_rating, scooter_id, scooter_reviewer_id)
VALUES (175,
        "Always a pleasant experience with Tung Sang Tran! Repeat customer, will use again",
        '2023-01-11', 4, 22, 7777);

INSERT INTO scooter_review(id, comment, review_date, star_rating, scooter_id, scooter_reviewer_id)
VALUES (176,
        "Easy to deal with, very accomodating. Power Efficient`",
        '2023-01-11', 4, 21, 8888);

INSERT INTO scooter_review(id, comment, review_date, star_rating, scooter_id, scooter_reviewer_id)
VALUES (177,
        "Tung and his colleague Gorge are the absolute best.",
        '2023-01-11', 3, 20, 9999);

INSERT INTO scooter_review(id, comment, review_date, star_rating, scooter_id, scooter_reviewer_id)
VALUES (178,
        "Works as described. Good experience in pick and drop off, super easy and on time.",
        '2023-01-11', 4, 19, 10000);

INSERT INTO scooter_review(id, comment, review_date, star_rating, scooter_id, scooter_reviewer_id)
VALUES (179,
        "Would highly recommend!",
        '2023-01-11', 2, 18, 11111);


INSERT INTO scooter_review(id, comment, review_date, star_rating, scooter_id, scooter_reviewer_id)
VALUES (180,
        "Very helpful and communicative…sciiter has super strong bad smell so I would try to clean that if you could…but other than that it ran great",
        '2023-01-11', 4, 17, 5555);

INSERT INTO scooter_review(id, comment, review_date, star_rating, scooter_id, scooter_reviewer_id)
VALUES (181,
        "Everything was so easy, and the communication was excellent. I had no questions and everything was taken care of for me. Awesome!",
        '2023-01-11', 3, 16, 6666);

INSERT INTO scooter_review(id, comment, review_date, star_rating, scooter_id, scooter_reviewer_id)
VALUES (182,
        "Always a pleasant experience with Tung Sang Tran! Repeat customer, will use again",
        '2023-01-11', 4, 15, 7777);




