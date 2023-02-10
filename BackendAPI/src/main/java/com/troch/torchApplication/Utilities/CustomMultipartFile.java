package com.troch.torchApplication.Utilities;

import lombok.AllArgsConstructor;
import org.springframework.web.multipart.MultipartFile;

import java.io.*;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;

import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.web.multipart.MultipartFile;

public class CustomMultipartFile implements MultipartFile {

    private byte[] input;
    private String fileName;

    private String contentType;

    public CustomMultipartFile(byte[] input, String fileName, String contentType){

        if (input == null) {
            throw new IllegalArgumentException("The input byte array cannot be null.");
        }
        if (fileName == null || fileName.isEmpty()) {
            throw new IllegalArgumentException("The file name cannot be null or empty.");
        }
        if (contentType == null || contentType.isEmpty()) {
            throw new IllegalArgumentException("The content type cannot be null or empty.");
        }

        this.input = input;
        this.fileName = fileName;
        this.contentType = contentType;
    }

    @Override
    public String getName() {
        return this.fileName;
    }

    @Override
    public String getOriginalFilename() {
        return this.fileName;
    }

    @Override
    public String getContentType() {
        return this.contentType;
    }

    public void setContentType(String contentType){
        if (contentType == null || contentType.isEmpty()) {
            throw new IllegalArgumentException("The content type cannot be null or empty.");
        }
        this.contentType = contentType;
    }

    //previous methods
    @Override
    public boolean isEmpty() {
        return input == null || input.length == 0;
    }

    @Override
    public long getSize() {
        return input.length;
    }

    @Override
    public byte[] getBytes() throws IOException {
        return input;
    }

    @Override
    public InputStream getInputStream() throws IOException {
        return new ByteArrayInputStream(input);
    }

    @Override
    public void transferTo(File destination) throws IOException, IllegalStateException {
        if (destination == null) {
            throw new IllegalArgumentException("The destination file cannot be null.");
        }
        try(FileOutputStream fos = new FileOutputStream(destination)) {
            fos.write(input);
        }
    }
}

