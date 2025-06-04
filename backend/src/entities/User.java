package entities;

public class User extends Entity {
    private String cpf;
    private String phone;
    private String address;

    public User(int id, String name, String cpf, String phone, String address) {
        super(id, name);
        this.cpf = cpf;
        this.phone = phone;
        this.address = address;
    }

    public String getCpf() {
        return cpf;
    }

    public void setCpf(String cpf) {
        this.cpf = cpf;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    @Override
    public String toString() {
        return super.toString() +
                ", CPF: " + cpf +
                ", Phone: " + phone +
                ", Address: " + address;
    }
}
