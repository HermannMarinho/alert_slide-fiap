package services;

import entities.Shelter;

import java.util.ArrayList;
import java.util.Scanner;

public class ShelterService {
    private final ArrayList<Shelter> shelters = new ArrayList<>();
    private int proximoId = 1;

    public void cadastrar(Scanner scanner) {
        System.out.print("Nome: ");
        String name = scanner.nextLine();

        System.out.print("Localização: ");
        String location = scanner.nextLine();

        System.out.print("Capacidade: ");
        int capacity = scanner.nextInt();
        scanner.nextLine();

        System.out.print("Está ativo? (true/false): ");
        boolean active = scanner.nextBoolean();
        scanner.nextLine();

        Shelter shelter = new Shelter(proximoId++, name, location, capacity, active);
        shelters.add(shelter);
        System.out.println("✔ Abrigo cadastrado com sucesso: " + shelter + "\n");
    }

    public void listar() {
        if (shelters.isEmpty()) {
            System.out.println("❌ Nenhum abrigo cadastrado.\n");
            return;
        }
        System.out.println("📍 Lista de abrigos:");
        for (Shelter s : shelters) {
            System.out.println(s);
        }
    }

    public void buscar(Scanner scanner) {
        System.out.print("Digite o ID do abrigo: ");
        int id = scanner.nextInt();
        scanner.nextLine();

        Shelter shelter = encontrarPorId(id);
        if (shelter != null) {
            System.out.println("🔍 Abrigo encontrado: " + shelter);
        } else {
            System.out.println("❌ Abrigo não encontrado.\n");
        }
    }

    public void atualizar(Scanner scanner) {
        System.out.print("Digite o ID do abrigo: ");
        int id = scanner.nextInt();
        scanner.nextLine();

        Shelter shelter = encontrarPorId(id);
        if (shelter != null) {
            System.out.print("Novo nome: ");
            shelter.setNome(scanner.nextLine());

            System.out.print("Novo local: ");
            shelter.setLocation(scanner.nextLine());

            System.out.print("Nova capacidade: ");
            shelter.setCapacity(scanner.nextInt());

            System.out.print("Está ativo? (true/false): ");
            shelter.setActive(scanner.nextBoolean());
            scanner.nextLine();

            System.out.println("✔ Abrigo atualizado com sucesso.\n");
        } else {
            System.out.println("❌ Abrigo não encontrado.\n");
        }
    }

    public void excluir(Scanner scanner) {
        System.out.print("Digite o ID do abrigo a ser removido: ");
        int id = scanner.nextInt();
        scanner.nextLine();

        Shelter shelter = encontrarPorId(id);
        if (shelter != null) {
            shelters.remove(shelter);
            System.out.println("✔ Abrigo removido com sucesso.\n");
        } else {
            System.out.println("❌ Abrigo não encontrado.\n");
        }
    }

    private Shelter encontrarPorId(int id) {
        for (Shelter s : shelters) {
            if (s.getId() == id) return s;
        }
        return null;
    }

    public ArrayList<Shelter> getShelters() {
        return shelters;
    }
}
