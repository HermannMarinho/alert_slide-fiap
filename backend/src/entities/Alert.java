package entities;

import java.time.LocalDateTime;

public class Alert {
    private int id;
    private LocalDateTime timestamp;
    private String riskLevel;
    private String areaName;
    private String message;

    public Alert(int id, LocalDateTime timestamp, String riskLevel, String areaName, String message) {
        this.id = id;
        this.timestamp = timestamp;
        this.riskLevel = riskLevel;
        this.areaName = areaName;
        this.message = message;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }

    public String getRiskLevel() {
        return riskLevel;
    }

    public void setRiskLevel(String riskLevel) {
        this.riskLevel = riskLevel;
    }

    public String getAreaName() {
        return areaName;
    }

    public void setAreaName(String areaName) {
        this.areaName = areaName;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    @Override
    public String toString() {
        return "Alert{" +
                "id=" + id +
                ", timestamp=" + timestamp +
                ", riskLevel='" + riskLevel + '\'' +
                ", areaName='" + areaName + '\'' +
                ", message='" + message + '\'' +
                '}';
    }
}
