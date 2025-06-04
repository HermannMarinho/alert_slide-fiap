package services;

import entities.User;
import java.util.ArrayList;
import java.util.Scanner;

public class UserService {
    private ArrayList<User> usuarios = new ArrayList<>();
    private int proximoId = 1;

    public void cadastrar(Scanner scanner) {
        System.out.print("Nome do usuário: ");
        String nome = scanner.nextLine();

        System.out.print("CPF: ");
        String cpf = scanner.nextLine();

        System.out.print("Telefone: ");
        String phone = scanner.nextLine();

        System.out.print("Endereço: ");
        String address = scanner.nextLine();

        User user = new User(proximoId++, nome, cpf, phone, address);
        usuarios.add(user);
        System.out.println("✅ Usuário cadastrado com sucesso: " + user);
    }

    public void listar() {
        if (usuarios.isEmpty()) {
            System.out.println("Nenhum usuário cadastrado.");
        } else {
            System.out.println("\n📋 Lista de usuários:");
            for (User u : usuarios) {
                System.out.println(u);
            }
        }
    }

    public void buscar(Scanner scanner) {
        System.out.print("ID do usuário a buscar: ");
        int id = scanner.nextInt();
        scanner.nextLine();

        for (User u : usuarios) {
            if (u.getId() == id) {
                System.out.println("🔍 Usuário encontrado: " + u);
                return;
            }
        }

        System.out.println("Usuário não encontrado.");
    }

    public void atualizar(Scanner scanner) {
        System.out.print("ID do usuário a atualizar: ");
        int id = scanner.nextInt();
        scanner.nextLine();

        for (User u : usuarios) {
            if (u.getId() == id) {
                System.out.print("Novo nome: ");
                String nome = scanner.nextLine();

                System.out.print("Novo CPF: ");
                String cpf = scanner.nextLine();

                System.out.print("Novo telefone: ");
                String phone = scanner.nextLine();

                System.out.print("Novo endereço: ");
                String address = scanner.nextLine();

                u.setNome(nome);
                u.setCpf(cpf);
                u.setPhone(phone);
                u.setAddress(address);

                System.out.println("✏️ Usuário atualizado: " + u);
                return;
            }
        }

        System.out.println("Usuário não encontrado.");
    }

    public void excluir(Scanner scanner) {
        System.out.print("ID do usuário a remover: ");
        int id = scanner.nextInt();
        scanner.nextLine();

        for (User u : usuarios) {
            if (u.getId() == id) {
                usuarios.remove(u);
                System.out.println("🗑️ Usuário removido com sucesso.");
                return;
            }
        }

        System.out.println("Usuário não encontrado.");
    }
}
