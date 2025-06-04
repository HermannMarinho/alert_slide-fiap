package services;

import entities.Sensor;
import java.util.ArrayList;
import java.util.Random;
import java.util.Scanner;

public class SensorService {
    private final ArrayList<Sensor> sensores = new ArrayList<>();
    private int proximoId = 1;
    private final Random random = new Random();

    public void cadastrar(Scanner scanner) {
        System.out.print("Nome do sensor: ");
        String nome = scanner.nextLine();

        System.out.print("Tipo do sensor (umidade, pressão, inclinação): ");
        String tipo = scanner.nextLine();

        System.out.print("Valor atual (double): ");
        double valorAtual = scanner.nextDouble();
        scanner.nextLine();

        System.out.print("ID da área de risco (int): ");
        int riskAreaId = scanner.nextInt();
        scanner.nextLine();

        Sensor sensor = new Sensor(proximoId++, nome, tipo, valorAtual, riskAreaId);
        sensores.add(sensor);
        System.out.println("✅ Sensor cadastrado: " + sensor);
    }

    public void listar() {
        if (sensores.isEmpty()) {
            System.out.println("Nenhum sensor cadastrado.");
        } else {
            System.out.println("\n📋 Lista de sensores:");
            for (Sensor s : sensores) {
                System.out.println(s);
            }
        }
    }

    public void buscar(Scanner scanner) {
        System.out.print("ID do sensor: ");
        int id = scanner.nextInt();
        scanner.nextLine();

        for (Sensor s : sensores) {
            if (s.getId() == id) {
                System.out.println("🔍 Sensor encontrado: " + s);
                return;
            }
        }

        System.out.println("Sensor não encontrado.");
    }

    public void atualizar(Scanner scanner) {
        System.out.print("ID do sensor: ");
        int id = scanner.nextInt();
        scanner.nextLine();

        for (Sensor s : sensores) {
            if (s.getId() == id) {
                System.out.print("Novo nome: ");
                String nome = scanner.nextLine();

                System.out.print("Novo tipo: ");
                String tipo = scanner.nextLine();

                System.out.print("Novo valor atual: ");
                double valorAtual = scanner.nextDouble();
                scanner.nextLine();

                System.out.print("Novo ID da área de risco: ");
                int riskAreaId = scanner.nextInt();
                scanner.nextLine();

                s.setNome(nome);
                s.setType(tipo);
                s.setCurrentValue(valorAtual);
                s.setRiskAreaId(riskAreaId);

                System.out.println("✏️ Sensor atualizado: " + s);
                return;
            }
        }

        System.out.println("Sensor não encontrado.");
    }

    public void excluir(Scanner scanner) {
        System.out.print("ID do sensor: ");
        int id = scanner.nextInt();
        scanner.nextLine();

        for (Sensor s : sensores) {
            if (s.getId() == id) {
                sensores.remove(s);
                System.out.println("🗑️ Sensor removido.");
                return;
            }
        }

        System.out.println("Sensor não encontrado.");
    }

    // Funções extras para simulação
    public double gerarUmidade() {
        return 30 + (random.nextDouble() * 70); // 30% a 100%
    }

    public double gerarPressao() {
        return 800 + (random.nextDouble() * 300); // 800 hPa a 1100 hPa
    }

    public double gerarInclinacao() {
        return 0 + (random.nextDouble() * 90); // 0° a 90°
    }

    public double[] simularLeituraSensores() {
        double umidade = gerarUmidade();
        double pressao = gerarPressao();
        double inclinacao = gerarInclinacao();

        System.out.println("\n📡 Leituras simuladas dos sensores:");
        System.out.printf("- Umidade: %.2f %%\n", umidade);
        System.out.printf("- Pressão: %.2f hPa\n", pressao);
        System.out.printf("- Inclinação: %.2f °\n", inclinacao);

        return new double[] { umidade, pressao, inclinacao };
    }
}
