package com.example.controllers;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.client.RestTemplate;

import java.util.Base64;
import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

@Controller
public class VisionController {

    private String visionKey = "AIzaSyDWwsoKTEUuKBfMNlEOf_udWJHAf6Ph5fQ"; // Inyecta la clave API desde tus propiedades de aplicación

    private final RestTemplate restTemplate;

    public VisionController(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }


    @PostMapping("/analyze-image")
    public ResponseEntity<?> analyzeImage(@RequestParam("file") MultipartFile file) {
        try {
            String base64Image = Base64.getEncoder().encodeToString(file.getBytes());
            String url = "https://vision.googleapis.com/v1/images:annotate?key=" + visionKey;

            // Crear el cuerpo de la solicitud
            /*
            String jsonBody = "{"
                    + "\"requests\":["
                    + "{"
                    + "\"image\":{"
                    + "\"content\":\"" + base64Image + "\""
                    + "},"
                    + "\"features\":["
                    + "{"
                    + "\"type\":\"LABEL_DETECTION\""
                    + "}"
                    + "]"
                    + "}"
                    + "]"
                    + "}";
            */
            String jsonBody = "{"
                    + "\"requests\":["
                    + "{"
                    + "\"image\":{"
                    + "\"content\":\"" + base64Image + "\""
                    + "},"
                    + "\"features\":["
                    + "{"
                    + "\"type\":\"FACE_DETECTION\""
                    + "},"
                    + "{"
                    + "\"type\":\"SAFE_SEARCH_DETECTION\""
                    + "}"
                    + "]"
                    + "}"
                    + "]"
                    + "}";

            // Establecer headers
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.setAccept(Collections.singletonList(MediaType.APPLICATION_JSON));

            // Crear la entidad de la solicitud
            HttpEntity<String> entity = new HttpEntity<>(jsonBody, headers);

            // Enviar la solicitud
            ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.POST, entity, String.class);

            // Aquí puedes procesar la respuesta
            return ResponseEntity.ok(response.getBody());

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body("Error analyzing the image: " + e.getMessage());
        }
    }
}
