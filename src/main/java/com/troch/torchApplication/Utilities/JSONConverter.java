package com.troch.torchApplication.Utilities;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.json.JSONObject;
import org.springframework.stereotype.Component;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;

@Component
public class JSONConverter {


    public JsonNode getJson(URL url) throws IOException {
        ObjectMapper mapper = new ObjectMapper();
        return mapper.readTree(url);
    }


    public JSONObject getJSON(HttpURLConnection conn) throws IOException {
        JSONObject job = null;//  w w w .j  av a2s.  com
        // write it out yo
        OutputStream os = conn.getOutputStream();
        conn.connect();
        //   OutputStreamWriter out = new OutputStreamWriter(os);
        //   out.flush();

        // out.write(jsonObject.toString());
        //   out.close();

        BufferedReader in = new BufferedReader(new InputStreamReader(conn.getInputStream()));

        StringBuffer sb = new StringBuffer();
        String s = "";
        while ((s = in.readLine()) != null) {
            sb.append(s);
        }
        System.out.println("\nREST Service Invoked Successfully..");
        in.close();

        // os.write(job.toString().getBytes("UTF-8"));
        os.close();
        return job;
    }
}
