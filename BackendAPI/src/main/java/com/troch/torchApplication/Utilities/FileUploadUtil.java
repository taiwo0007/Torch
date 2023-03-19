package com.troch.torchApplication.Utilities;

import java.awt.*;
import java.io.*;
import java.nio.file.*;
import java.util.Base64;

import com.troch.torchApplication.controllers.EScooterController;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.ServletContext;

@Service
public class FileUploadUtil {

    @Autowired
    ServletContext servletContext;

    Logger logger = LoggerFactory.getLogger(FileUploadUtil.class);


    public static String UPLOAD_DIRECTORY = System.getProperty("java.io.tmpdir");

    public Path saveFile(MultipartFile file) throws IOException {



        logger.info("yeeea");
        StringBuilder fileNames = new StringBuilder();
        Path fileNameAndPath = Paths.get(UPLOAD_DIRECTORY, file.getOriginalFilename());
        logger.info("fileNameAndPath"+fileNameAndPath);
        fileNames.append(file.getOriginalFilename());
        logger.info("file.getBytes())"+file.getBytes());


        Files.write(fileNameAndPath, file.getBytes());

        return fileNameAndPath;

    }

    public Path writeBase64FileToSystem(String base64EncodedImageUrl, String fileName) throws IOException {

        int commanIndex = base64EncodedImageUrl.indexOf(",");
        String base64EncodedString = base64EncodedImageUrl.substring(commanIndex +1);


        byte[] decodedImg = Base64.getMimeDecoder()
                .decode(base64EncodedString);
        Path destinationFile = Paths.get(System.getProperty("java.io.tmpdir"), fileName);
        Files.write(destinationFile, decodedImg);



        return destinationFile;
    }



}

