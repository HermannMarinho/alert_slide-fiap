package services;

public class RiskAnalysisService {

    private final SensorService sensorService = new SensorService(); // usado para simulação de sensores

    public String calcularNivelRisco(double umidade, double pressao, double inclinacao) {
        double score = 0;

        if (umidade > 80) score += 1;
        if (pressao < 950) score += 1;
        if (inclinacao > 45) score += 2;

        if (score >= 3) return "ALTO";
        else if (score == 2) return "MODERADO";
        else return "BAIXO";
    }

    public String gerarRelatorioRisco(double umidade, double pressao, double inclinacao) {
        String nivel = calcularNivelRisco(umidade, pressao, inclinacao);
        return "Risco: " + nivel + " (U: " + String.format("%.2f", umidade) +
                "% | P: " + String.format("%.2f", pressao) + " hPa | I: " +
                String.format("%.2f", inclinacao) + "°)";
    }

    public void analisarSensores() {
        System.out.println("\n🔍 Iniciando análise de risco com dados simulados...");
        double[] leitura = sensorService.simularLeituraSensores();
        String relatorio = gerarRelatorioRisco(leitura[0], leitura[1], leitura[2]);
        System.out.println("📊 " + relatorio + "\n");
    }
}
