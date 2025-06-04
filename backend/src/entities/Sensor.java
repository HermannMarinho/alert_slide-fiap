package entities;

public class Sensor extends Entity {
    private String type;
    private double currentValue;
    private int riskAreaId;

    public Sensor(int id, String name, String type, double currentValue, int riskAreaId) {
        super(id, name);
        this.type = type;
        this.currentValue = currentValue;
        this.riskAreaId = riskAreaId;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public double getCurrentValue() {
        return currentValue;
    }

    public void setCurrentValue(double currentValue) {
        this.currentValue = currentValue;
    }

    public int getRiskAreaId() {
        return riskAreaId;
    }

    public void setRiskAreaId(int riskAreaId) {
        this.riskAreaId = riskAreaId;
    }

    @Override
    public String toString() {
        return super.toString() +
                ", Type: " + type +
                ", Current Value: " + currentValue +
                ", Risk Area ID: " + riskAreaId;
    }
}
