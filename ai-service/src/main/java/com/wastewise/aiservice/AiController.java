package com.wastewise.aiservice;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestClient;
import org.springframework.web.multipart.MultipartFile;

import java.util.Base64;
import java.util.List;
import java.util.Map;

@RestController
public class AiController {

    private final RestClient restClient;
    private final ObjectMapper objectMapper;
    private final String geminiApiKey;

    public AiController(RestClient.Builder restClientBuilder, 
                        ObjectMapper objectMapper,
                        @Value("${GEMINI_API_KEY:}") String geminiApiKey) {
        this.restClient = restClientBuilder.baseUrl("https://generativelanguage.googleapis.com/v1beta").build();
        this.objectMapper = objectMapper;
        this.geminiApiKey = geminiApiKey;
    }

    @GetMapping("/health")
    public Map<String, String> healthCheck() {
        return Map.of("status", "ok", "service", "WasteWise AI Service (Gemini)");
    }

    @PostMapping("/analyze")
    public ScanResult analyzeImage(@RequestParam("file") MultipartFile file) {
        try {
            if (geminiApiKey == null || geminiApiKey.isBlank()) {
                throw new IllegalStateException("GEMINI_API_KEY is not set.");
            }

            byte[] contents = file.getBytes();
            String base64Image = Base64.getEncoder().encodeToString(contents);
            String mimeType = file.getContentType() != null ? file.getContentType() : "image/jpeg";

            String promptText = "Analyze this image of a product or food item. Identify the product name, its general category, and assess any potential risks (e.g., spoilage, expiring soon, dangerous storage conditions). Determine the risk level as LOW, MEDIUM, HIGH, or CRITICAL. Provide a confidence score between 0.0 and 1.0. List any warnings about the product. Return strictly in JSON format with keys: productName (string), category (string), riskLevel (string), confidence (number), warnings (array of strings).";

            Map<String, Object> requestBody = Map.of(
                "contents", List.of(
                    Map.of(
                        "parts", List.of(
                            Map.of("text", promptText),
                            Map.of("inlineData", Map.of(
                                "mimeType", mimeType,
                                "data", base64Image
                            ))
                        )
                    )
                ),
                "generationConfig", Map.of(
                    "responseMimeType", "application/json"
                )
            );

            String response = restClient.post()
                    .uri("/models/gemini-3.7-flash:generateContent?key=" + geminiApiKey)
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(requestBody)
                    .retrieve()
                    .body(String.class);

            JsonNode root = objectMapper.readTree(response);
            String content = root.path("candidates").path(0).path("content").path("parts").path(0).path("text").asText();

            // Clean the response (sometimes it includes conversational text)
            int jsonStart = content.indexOf('{');
            int jsonEnd = content.lastIndexOf('}');
            if (jsonStart != -1 && jsonEnd != -1) {
                content = content.substring(jsonStart, jsonEnd + 1);
            }

            return objectMapper.readValue(content, ScanResult.class);
        } catch (Exception e) {
            System.err.println("Error during analysis: " + e.getMessage());
            return new ScanResult("Error processing image", "Unknown", "HIGH", 0.0, List.of(e.getMessage() != null ? e.getMessage() : "Unknown error"));
        }
    }
}
