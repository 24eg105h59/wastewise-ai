package com.wastewise.aiservice;

import java.util.List;

public class ScanResult {
    private String productName;
    private String category;
    private String riskLevel;
    private double confidence;
    private List<String> warnings;

    public ScanResult() {}

    public ScanResult(String productName, String category, String riskLevel, double confidence, List<String> warnings) {
        this.productName = productName;
        this.category = category;
        this.riskLevel = riskLevel;
        this.confidence = confidence;
        this.warnings = warnings;
    }

    public String getProductName() {
        return productName;
    }

    public void setProductName(String productName) {
        this.productName = productName;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getRiskLevel() {
        return riskLevel;
    }

    public void setRiskLevel(String riskLevel) {
        this.riskLevel = riskLevel;
    }

    public double getConfidence() {
        return confidence;
    }

    public void setConfidence(double confidence) {
        this.confidence = confidence;
    }

    public List<String> getWarnings() {
        return warnings;
    }

    public void setWarnings(List<String> warnings) {
        this.warnings = warnings;
    }
}
