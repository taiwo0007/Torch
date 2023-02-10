package com.troch.torchApplication.Utilities;
import com.google.api.services.storage.StorageScopes;
import com.google.auth.oauth2.GoogleCredentials;
import com.google.cloud.storage.*;
import com.troch.torchApplication.controllers.HostController;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;
import org.thymeleaf.spring4.processor.SpringOptionFieldTagProcessor;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.Arrays;


@Component
public class GCPUtil {

    @Autowired
    FileUploadUtil fileUploadUtil;


    static Logger logger = LoggerFactory.getLogger(GCPUtil.class);

    public String uploadObject(Path filePath, String contentType) throws IOException {


        GoogleCredentials credentials = GoogleCredentials.fromStream(new FileInputStream("src/main/resources/static/credentials/application_default_credentials.json"))
                .createScoped(StorageScopes.all());


        String projectId = "school-376315";
        String bucketName = "torch-gcp-bucket";
        String objectName = filePath.getFileName().toString().toLowerCase();
        Storage storage = StorageOptions.newBuilder().setCredentials(credentials).setProjectId(projectId).build().getService();

        BlobId blobId = BlobId.of(bucketName, objectName);
        BlobInfo blobInfo = BlobInfo.newBuilder(blobId).setContentType(contentType).build();

        Storage.BlobWriteOption precondition;
        if (storage.get(bucketName, objectName) == null) {

            precondition = Storage.BlobWriteOption.doesNotExist();
        } else {

            precondition =
                    Storage.BlobWriteOption.generationMatch(
                            storage.get(bucketName, objectName).getGeneration());
        }
        logger.info("asdfasf");

        logger.info("iN here");
        storage.createFrom(blobInfo, Paths.get(filePath.toString()), precondition);

        Blob blob = storage.get(blobId);
        String publicUrl = blob.getMediaLink();
        logger.info(
                " uploaded to bucket " + bucketName + " as " + objectName +" public url " + publicUrl);

        return publicUrl;
    }
}
