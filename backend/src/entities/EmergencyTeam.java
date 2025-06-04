package entities;

public class EmergencyTeam extends Entity {
    private String role;
    private boolean available;

    public EmergencyTeam(int id, String name, String role, boolean available) {
        super(id, name);
        this.role = role;
        this.available = available;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public boolean isAvailable() {
        return available;
    }

    public void setAvailable(boolean available) {
        this.available = available;
    }

    @Override
    public String toString() {
        return super.toString() +
                ", Role: " + role +
                ", Available: " + available;
    }
}
