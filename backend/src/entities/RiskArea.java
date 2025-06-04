package entities;

import java.util.List;

public class RiskArea extends Entity {
    private String coordinates;
    private String riskLevel; // Green, Yellow, Orange, Red
    private List<Sensor> sensors;

    public RiskArea(int id, String name, String coordinates, String riskLevel) {
        super(id, name);
        this.coordinates = coordinates;
        this.riskLevel = riskLevel;
    }

    public String getCoordinates() {
        return coordinates;
    }

    public void setCoordinates(String coordinates) {
        this.coordinates = coordinates;
    }

    public String getRiskLevel() {
        return riskLevel;
    }

    public void setRiskLevel(String riskLevel) {
        this.riskLevel = riskLevel;
    }
    public List<Sensor> getSensors() {
        return sensors;
    }

    public void setSensors(List<Sensor> sensors) {
        this.sensors = sensors;
    }


    @Override
    public String toString() {
        return super.toString() +
                ", Coordinates: " + coordinates +
                ", Risk Level: " + riskLevel;
    }
}
