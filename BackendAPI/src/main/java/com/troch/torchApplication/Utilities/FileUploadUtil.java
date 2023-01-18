package com.troch.torchApplication.Utilities;

import java.io.*;
import java.nio.file.*;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public class FileUploadUtil {

    public static String UPLOAD_DIRECTORY = System.getProperty("user.dir") +"/src/main/resources/static/images/uploads/";

    public void saveFile(MultipartFile file) throws IOException {


        StringBuilder fileNames = new StringBuilder();
        Path fileNameAndPath = Paths.get(UPLOAD_DIRECTORY, file.getOriginalFilename());
        fileNames.append(file.getOriginalFilename());
        Files.write(fileNameAndPath, file.getBytes());

    }
    }

