package services;

public class AlertService {

    private final SensorService sensorService = new SensorService();
    private final RiskAnalysisService riskAnalysisService = new RiskAnalysisService();

    public void emitirAlerta(String nivelRisco) {
        switch (nivelRisco) {
            case "ALTO" -> System.out.println("🚨 ALERTA VERMELHO: Risco alto de deslizamento!");
            case "MODERADO" -> System.out.println("⚠️ ALERTA LARANJA: Monitoramento contínuo necessário.");
            case "BAIXO" -> System.out.println("✅ Alerta verde: Condições estáveis.");
            default -> System.out.println("Nível de risco desconhecido.");
        }
    }

    public void verificarENotificar() {
        System.out.println("\n🔔 Verificando condições de alerta...");

        double[] leitura = sensorService.simularLeituraSensores();
        String nivel = riskAnalysisService.calcularNivelRisco(leitura[0], leitura[1], leitura[2]);
        emitirAlerta(nivel);
    }
}
