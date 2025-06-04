package entities;

public class Shelter extends Entity {
    private String location;
    private int capacity;
    private boolean active;

    public Shelter(int id, String name, String location, int capacity, boolean active) {
        super(id, name);
        this.location = location;
        this.capacity = capacity;
        this.active = active;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public int getCapacity() {
        return capacity;
    }

    public void setCapacity(int capacity) {
        this.capacity = capacity;
    }

    public boolean isActive() {
        return active;
    }

    public void setActive(boolean active) {
        this.active = active;
    }

    @Override
    public String toString() {
        return super.toString() +
                ", Location: " + location +
                ", Capacity: " + capacity +
                ", Active: " + active;
    }
}
