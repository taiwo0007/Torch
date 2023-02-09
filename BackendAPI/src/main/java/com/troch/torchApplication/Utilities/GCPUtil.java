package com.troch.torchApplication.Utilities;
import com.google.api.services.storage.StorageScopes;
import com.google.auth.oauth2.GoogleCredentials;
import com.google.cloud.storage.BlobId;
import com.google.cloud.storage.BlobInfo;
import com.google.cloud.storage.Storage;
import com.google.cloud.storage.StorageOptions;
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


@Component
public class GCPUtil {

    @Autowired
    FileUploadUtil fileUploadUtil;


    static Logger logger = LoggerFactory.getLogger(GCPUtil.class);

    public void uploadObject(MultipartFile file) throws IOException {






        GoogleCredentials credentials = GoogleCredentials.fromStream(new FileInputStream("src/main/resources/static/credentials/application_default_credentials.json"))
                .createScoped(StorageScopes.all());

        Path filePath = fileUploadUtil.saveFile(file);

        String projectId = "school-376315";
        String bucketName = "torch-gcp-bucket";
        String objectName = file.getName().toLowerCase();
        Storage storage = StorageOptions.newBuilder().setCredentials(credentials).setProjectId(projectId).build().getService();
        BlobId blobId = BlobId.of(bucketName, objectName);
        BlobInfo blobInfo = BlobInfo.newBuilder(blobId).build();

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

        logger.info(
                "File " + file + " uploaded to bucket " + bucketName + " as " + objectName);
    }
}
