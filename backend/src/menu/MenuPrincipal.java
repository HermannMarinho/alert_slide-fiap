package menu;

import services.UserService;
import services.SensorService;
import services.ShelterService;
import services.EmergencyTeamService;
import services.RiskAreaService;
import services.RiskAnalysisService;
import services.AlertService;
import services.EvacuationService;

import java.util.InputMismatchException;
import java.util.Scanner;

public class MenuPrincipal {

    private final Scanner scanner = new Scanner(System.in);

    // Instâncias de todos os Services necessários
    private final UserService userService = new UserService();
    private final SensorService sensorService = new SensorService();
    private final ShelterService shelterService = new ShelterService();
    private final EmergencyTeamService emergencyTeamService = new EmergencyTeamService();
    private final RiskAreaService riskAreaService = new RiskAreaService();
    private final RiskAnalysisService riskAnalysisService = new RiskAnalysisService();
    private final AlertService alertService = new AlertService();
    private final EvacuationService evacuationService = new EvacuationService();

    /**
     * Exibe o menu principal em loop, até que o usuário escolha 0 (Sair).
     */
    public void exibirMenu() {
        int opcao;
        do {
            limparConsole();
            System.out.println("\n===== ALERTSLIDE - MENU PRINCIPAL =====");
            System.out.println("1. Gerenciar Usuários");
            System.out.println("2. Gerenciar Sensores");
            System.out.println("3. Gerenciar Abrigos");
            System.out.println("4. Gerenciar Equipes de Emergência");
            System.out.println("5. Gerenciar Áreas de Risco");
            System.out.println("6. Iniciar Simulação de Risco");
            System.out.println("0. Sair");
            System.out.print("Escolha uma opção: ");

            try {
                opcao = scanner.nextInt();
                scanner.nextLine();
            } catch (InputMismatchException e) {
                System.out.println("Entrada inválida. Digite apenas números.");
                scanner.nextLine();
                opcao = -1;
            }

            switch (opcao) {
                case 1 -> menuUsuarios();
                case 2 -> menuSensores();
                case 3 -> menuAbrigos();
                case 4 -> menuEquipes();
                case 5 -> menuAreasDeRisco();
                case 6 -> iniciarSimulacao();
                case 0 -> System.out.println("Encerrando o sistema...");
                default -> {
                    System.out.println("Opção inválida.");
                    aguardarEnter();
                }
            }
        } while (opcao != 0);
    }

    /**
     * Submenu para CRUD de Usuários.
     */
    private void menuUsuarios() {
        int opcao;
        do {
            limparConsole();
            System.out.println("\n--- Gerenciar Usuários ---");
            System.out.println("1. Cadastrar");
            System.out.println("2. Listar");
            System.out.println("3. Buscar por ID");
            System.out.println("4. Atualizar");
            System.out.println("5. Excluir");
            System.out.println("0. Voltar");
            System.out.print("Escolha: ");

            try {
                opcao = scanner.nextInt();
                scanner.nextLine();
            } catch (InputMismatchException e) {
                System.out.println("Entrada inválida.");
                scanner.nextLine();
                opcao = -1;
            }

            switch (opcao) {
                case 1 -> {
                    userService.cadastrar(scanner);
                    aguardarEnter();
                }
                case 2 -> {
                    userService.listar();
                    aguardarEnter();
                }
                case 3 -> {
                    userService.buscar(scanner);
                    aguardarEnter();
                }
                case 4 -> {
                    userService.atualizar(scanner);
                    aguardarEnter();
                }
                case 5 -> {
                    userService.excluir(scanner);
                    aguardarEnter();
                }
                case 0 -> {
                    // retorna ao menu anterior
                }
                default -> {
                    System.out.println("Opção inválida.");
                    aguardarEnter();
                }
            }
        } while (opcao != 0);
    }

    /**
     * Submenu para CRUD de Sensores.
     */
    private void menuSensores() {
        int opcao;
        do {
            limparConsole();
            System.out.println("\n--- Gerenciar Sensores ---");
            System.out.println("1. Cadastrar");
            System.out.println("2. Listar");
            System.out.println("3. Buscar por ID");
            System.out.println("4. Atualizar");
            System.out.println("5. Excluir");
            System.out.println("0. Voltar");
            System.out.print("Escolha: ");

            try {
                opcao = scanner.nextInt();
                scanner.nextLine();
            } catch (InputMismatchException e) {
                System.out.println("Entrada inválida.");
                scanner.nextLine();
                opcao = -1;
            }

            switch (opcao) {
                case 1 -> {
                    sensorService.cadastrar(scanner);
                    aguardarEnter();
                }
                case 2 -> {
                    sensorService.listar();
                    aguardarEnter();
                }
                case 3 -> {
                    sensorService.buscar(scanner);
                    aguardarEnter();
                }
                case 4 -> {
                    sensorService.atualizar(scanner);
                    aguardarEnter();
                }
                case 5 -> {
                    sensorService.excluir(scanner);
                    aguardarEnter();
                }
                case 0 -> {
                    // volta para o menu anterior
                }
                default -> {
                    System.out.println("Opção inválida.");
                    aguardarEnter();
                }
            }
        } while (opcao != 0);
    }

    /**
     * Submenu para CRUD de Abrigos.
     */
    private void menuAbrigos() {
        int opcao;
        do {
            limparConsole();
            System.out.println("\n--- Gerenciar Abrigos ---");
            System.out.println("1. Cadastrar");
            System.out.println("2. Listar");
            System.out.println("3. Buscar por ID");
            System.out.println("4. Atualizar");
            System.out.println("5. Excluir");
            System.out.println("0. Voltar");
            System.out.print("Escolha: ");

            try {
                opcao = scanner.nextInt();
                scanner.nextLine();
            } catch (InputMismatchException e) {
                System.out.println("Entrada inválida.");
                scanner.nextLine();
                opcao = -1;
            }

            switch (opcao) {
                case 1 -> {
                    shelterService.cadastrar(scanner);
                    aguardarEnter();
                }
                case 2 -> {
                    shelterService.listar();
                    aguardarEnter();
                }
                case 3 -> {
                    shelterService.buscar(scanner);
                    aguardarEnter();
                }
                case 4 -> {
                    shelterService.atualizar(scanner);
                    aguardarEnter();
                }
                case 5 -> {
                    shelterService.excluir(scanner);
                    aguardarEnter();
                }
                case 0 -> {
                    // volta para o menu anterior
                }
                default -> {
                    System.out.println("Opção inválida.");
                    aguardarEnter();
                }
            }
        } while (opcao != 0);
    }

    /**
     * Submenu para CRUD de Equipes de Emergência.
     */
    private void menuEquipes() {
        int opcao;
        do {
            limparConsole();
            System.out.println("\n--- Gerenciar Equipes de Emergência ---");
            System.out.println("1. Cadastrar");
            System.out.println("2. Listar");
            System.out.println("3. Buscar por ID");
            System.out.println("4. Atualizar");
            System.out.println("5. Excluir");
            System.out.println("0. Voltar");
            System.out.print("Escolha: ");

            try {
                opcao = scanner.nextInt();
                scanner.nextLine();
            } catch (InputMismatchException e) {
                System.out.println("Entrada inválida.");
                scanner.nextLine();
                opcao = -1;
            }

            switch (opcao) {
                case 1 -> {
                    emergencyTeamService.cadastrar(scanner);
                    aguardarEnter();
                }
                case 2 -> {
                    emergencyTeamService.listar();
                    aguardarEnter();
                }
                case 3 -> {
                    emergencyTeamService.buscar(scanner);
                    aguardarEnter();
                }
                case 4 -> {
                    emergencyTeamService.atualizar(scanner);
                    aguardarEnter();
                }
                case 5 -> {
                    emergencyTeamService.excluir(scanner);
                    aguardarEnter();
                }
                case 0 -> {
                    // volta para o menu anterior
                }
                default -> {
                    System.out.println("Opção inválida.");
                    aguardarEnter();
                }
            }
        } while (opcao != 0);
    }

    /**
     * Submenu para CRUD de Áreas de Risco.
     */
    private void menuAreasDeRisco() {
        int opcao;
        do {
            limparConsole();
            System.out.println("\n--- Gerenciar Áreas de Risco ---");
            System.out.println("1. Cadastrar");
            System.out.println("2. Listar");
            System.out.println("3. Buscar por ID");
            System.out.println("4. Atualizar");
            System.out.println("5. Excluir");
            System.out.println("0. Voltar");
            System.out.print("Escolha: ");

            try {
                opcao = scanner.nextInt();
                scanner.nextLine();
            } catch (InputMismatchException e) {
                System.out.println("Entrada inválida.");
                scanner.nextLine();
                opcao = -1;
            }

            switch (opcao) {
                case 1 -> {
                    // Antes: riskAreaService.cadastrar(scanner);
                    riskAreaService.create(scanner);
                    aguardarEnter();
                }
                case 2 -> {
                    // Antes: riskAreaService.listar();
                    riskAreaService.readAll();
                    aguardarEnter();
                }
                case 3 -> {
                    // Antes: riskAreaService.buscar(scanner);
                    riskAreaService.readById(scanner);
                    aguardarEnter();
                }
                case 4 -> {
                    // Antes: riskAreaService.atualizar(scanner);
                    riskAreaService.update(scanner);
                    aguardarEnter();
                }
                case 5 -> {
                    // Antes: riskAreaService.excluir(scanner);
                    riskAreaService.delete(scanner);
                    aguardarEnter();
                }
                case 0 -> {
                    // Volta para o menu anterior
                }
                default -> {
                    System.out.println("Opção inválida.");
                    aguardarEnter();
                }
            }
        } while (opcao != 0);
    }

    /**
     * Inicia a simulação de risco em 5 ciclos, chamando os métodos de análise, alerta e evacuação.
     */
    private void iniciarSimulacao() {
        limparConsole();
        System.out.println("\n>>> Iniciando simulação de risco...");

        int ciclos = 5;
        for (int i = 1; i <= ciclos; i++) {
            System.out.println("\n--- CICLO " + i + " ---");

            // Exemplo: analisando sensores e emitindo alertas/evacuação
            riskAnalysisService.analisarSensores();
            alertService.verificarENotificar();
            evacuationService.evacuacaoEmergencial();

            try {
                Thread.sleep(2000);
            } catch (InterruptedException e) {
                System.out.println("Simulação interrompida.");
            }
        }

        System.out.println("\n>>> Simulação finalizada.");
        aguardarEnter();
    }

    /**
     * Tenta limpar o console (Windows: cls; Linux/Mac: ANSI escape codes).
     */
    private void limparConsole() {
        try {
            if (System.getProperty("os.name").toLowerCase().contains("windows")) {
                new ProcessBuilder("cmd", "/c", "cls").inheritIO().start().waitFor();
            } else {
                System.out.print("\033[H\033[2J");
                System.out.flush();
            }
        } catch (Exception e) {
            System.out.println("Não foi possível limpar o console.");
        }
    }

    /**
     * Exibe a mensagem “Pressione ENTER para continuar...” e aguarda um ENTER do usuário.
     */
    private void aguardarEnter() {
        System.out.println("\nPressione ENTER para continuar...");
        scanner.nextLine();
    }
}
