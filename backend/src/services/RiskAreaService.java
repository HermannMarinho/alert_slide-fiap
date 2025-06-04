package services;

import entities.RiskArea;
import entities.Sensor;

import java.util.ArrayList;
import java.util.List;
import java.util.Scanner;

public class RiskAreaService {

    // Lista em memória de todas as RiskArea
    private final ArrayList<RiskArea> areas = new ArrayList<>();
    private int proximoId = 1;

    /**
     * Cadastra uma nova área de risco, usando o construtor que espera 4 parâmetros.
     * Depois atribui a lista de sensores vazia via setter.
     */
    public void create(Scanner scanner) {
        System.out.print("Nome da área de risco: ");
        String name = scanner.nextLine();

        System.out.print("Coordenadas (ex: \"-20.315,-40.312\"): ");
        String coordinates = scanner.nextLine();

        System.out.print("Nível de risco inicial (ALTO/MODERADO/BAIXO): ");
        String riskLevel = scanner.nextLine().toUpperCase();

        // Construtor com 4 parâmetros (id, nome, coordenadas, nível de risco)
        RiskArea area = new RiskArea(proximoId++, name, coordinates, riskLevel);
        // Agora atribuímos a lista de sensores vazia via setter
        List<Sensor> sensoresVazios = new ArrayList<>();
        area.setSensors(sensoresVazios);

        areas.add(area);
        System.out.println("✅ Área de risco cadastrada com ID " + area.getId() + ".");
    }

    /**
     * Lista todas as áreas de risco cadastradas em memória
     */
    public void readAll() {
        if (areas.isEmpty()) {
            System.out.println("❌ Nenhuma área de risco cadastrada.\n");
            return;
        }

        System.out.println("\n📋 Áreas de Risco Cadastradas:");
        for (RiskArea a : areas) {
            System.out.println(a.toString());
        }
        System.out.println();
    }

    /**
     * Busca uma área de risco pelo ID e retorna o objeto, ou null se não encontrado
     */
    private RiskArea findById(int id) {
        for (RiskArea a : areas) {
            if (a.getId() == id) {
                return a;
            }
        }
        return null;
    }

    /**
     * Lê do console um ID e exibe os detalhes da área encontrada
     */
    public void readById(Scanner scanner) {
        System.out.print("Digite o ID da área de risco: ");
        int id = Integer.parseInt(scanner.nextLine());

        RiskArea area = findById(id);
        if (area == null) {
            System.out.println("❌ Área de risco não encontrada.");
        } else {
            System.out.println("🔎 Detalhes da Área:\n" + area.toString());
        }
    }

    /**
     * Atualiza os campos de uma área existente (nome, coordenadas e nível de risco)
     */
    public void update(Scanner scanner) {
        System.out.print("Digite o ID da área de risco a ser atualizada: ");
        int id = Integer.parseInt(scanner.nextLine());

        RiskArea area = findById(id);
        if (area == null) {
            System.out.println("❌ Área de risco não encontrada.");
            return;
        }

        System.out.println("🔄 Atualizando Área de Risco (ID " + id + ")");
        System.out.print("Novo nome [" + area.getNome() + "]: ");
        String newName = scanner.nextLine();
        if (!newName.isBlank()) {
            area.setNome(newName);
        }

        System.out.print("Novas coordenadas [" + area.getCoordinates() + "]: ");
        String newCoords = scanner.nextLine();
        if (!newCoords.isBlank()) {
            area.setCoordinates(newCoords);
        }

        System.out.print("Novo nível de risco [" + area.getRiskLevel() + "] (ALTO/MODERADO/BAIXO): ");
        String newLevel = scanner.nextLine();
        if (!newLevel.isBlank()) {
            area.setRiskLevel(newLevel.toUpperCase());
        }

        System.out.println("✅ Área de risco atualizada.");
    }

    /**
     * Exclui uma área de risco pelo ID
     */
    public void delete(Scanner scanner) {
        System.out.print("Digite o ID da área de risco a excluir: ");
        int id = Integer.parseInt(scanner.nextLine());

        RiskArea area = findById(id);
        if (area == null) {
            System.out.println("❌ Área de risco não encontrada.");
            return;
        }

        areas.remove(area);
        System.out.println("🗑️ Área de risco removida com sucesso.");
    }

    /**
     * Retorna a lista completa de RiskArea (para quem precisar consultar externamente)
     */
    public ArrayList<RiskArea> getAreas() {
        return areas;
    }
}
