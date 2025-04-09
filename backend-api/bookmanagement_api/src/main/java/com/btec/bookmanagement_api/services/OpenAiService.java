package com.btec.bookmanagement_api.services;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Map;

@Service
public class OpenAiService {

    @Value("${openai.api.key}")
    private String apiKey;

    @Value("${openai.api.url}")
    private String apiUrl;

    private final RestTemplate restTemplate = new RestTemplate();

    public String getRecommendation(String prompt) {
        try {
            // Tạo header với API Key
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.setBearerAuth(apiKey); // tương đương "Authorization: Bearer <apiKey>"

            // Tạo request body
            Map<String, Object> requestBody = Map.of(
                    "model", "mistralai/Mixtral-8x7B-Instruct-v0.1",
                    "messages", List.of(
                            Map.of("role", "user", "content", prompt)
                    ),
                    "max_tokens", 100
            );

            HttpEntity<Map<String, Object>> request = new HttpEntity<>(requestBody, headers);

            // Gửi request POST
            ResponseEntity<Map> response = restTemplate.exchange(
                    apiUrl,
                    HttpMethod.POST,
                    request,
                    Map.class
            );

            if (response.getStatusCode() == HttpStatus.OK && response.getBody() != null) {
                List<Map<String, Object>> choices = (List<Map<String, Object>>) response.getBody().get("choices");
                if (choices != null && !choices.isEmpty()) {
                    Map<String, Object> firstChoice = choices.get(0);
                    Map<String, Object> message = (Map<String, Object>) firstChoice.get("message");
                    return (String) message.get("content");
                } else {
                    return "No recommendation found.";
                }
            } else {
                return "Error: " + response.getStatusCode();
            }
        } catch (Exception e) {
            e.printStackTrace();
            return "Exception occurred while getting recommendation: " + e.getMessage();
        }
    }
}
