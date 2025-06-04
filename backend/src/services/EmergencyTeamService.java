package services;

import entities.EmergencyTeam;
import java.util.ArrayList;
import java.util.Scanner;

public class EmergencyTeamService {
    private final ArrayList<EmergencyTeam> teams = new ArrayList<>();
    private int proximoId = 1;

    public void cadastrar(Scanner scanner) {
        System.out.print("Nome da equipe: ");
        String name = scanner.nextLine();

        System.out.print("Função (ex: Bombeiros, Defesa Civil): ");
        String role = scanner.nextLine();

        System.out.print("Está disponível? (true/false): ");
        boolean available = scanner.nextBoolean();
        scanner.nextLine();

        EmergencyTeam team = new EmergencyTeam(proximoId++, name, role, available);
        teams.add(team);
        System.out.println("✔ Equipe cadastrada com sucesso: " + team + "\n");
    }

    public void listar() {
        if (teams.isEmpty()) {
            System.out.println("❌ Nenhuma equipe cadastrada.\n");
            return;
        }

        System.out.println("🚨 Lista de equipes de emergência:");
        for (EmergencyTeam t : teams) {
            System.out.println(t);
        }
    }

    public void buscar(Scanner scanner) {
        System.out.print("Digite o ID da equipe: ");
        int id = scanner.nextInt();
        scanner.nextLine();

        EmergencyTeam team = encontrarPorId(id);
        if (team != null) {
            System.out.println("🔍 Equipe encontrada: " + team);
        } else {
            System.out.println("❌ Equipe não encontrada.\n");
        }
    }

    public void atualizar(Scanner scanner) {
        System.out.print("Digite o ID da equipe: ");
        int id = scanner.nextInt();
        scanner.nextLine();

        EmergencyTeam team = encontrarPorId(id);
        if (team != null) {
            System.out.print("Novo nome: ");
            team.setNome(scanner.nextLine());

            System.out.print("Nova função: ");
            team.setRole(scanner.nextLine());

            System.out.print("Está disponível? (true/false): ");
            team.setAvailable(scanner.nextBoolean());
            scanner.nextLine();

            System.out.println("✔ Equipe atualizada com sucesso.\n");
        } else {
            System.out.println("❌ Equipe não encontrada.\n");
        }
    }

    public void excluir(Scanner scanner) {
        System.out.print("Digite o ID da equipe a ser removida: ");
        int id = scanner.nextInt();
        scanner.nextLine();

        EmergencyTeam team = encontrarPorId(id);
        if (team != null) {
            teams.remove(team);
            System.out.println("✔ Equipe removida com sucesso.\n");
        } else {
            System.out.println("❌ Equipe não encontrada.\n");
        }
    }

    private EmergencyTeam encontrarPorId(int id) {
        for (EmergencyTeam t : teams) {
            if (t.getId() == id) return t;
        }
        return null;
    }

    public ArrayList<EmergencyTeam> getTeams() {
        return teams;
    }
}
