package services;

public class EvacuationService {

    public void acionarAbrigoMaisProximo(String area) {
        System.out.println("📦 Abrigo mais próximo da área " + area + " foi ativado.");
    }

    public void acionarEquipesEmergencia(String area) {
        System.out.println("🚑 Equipes de emergência enviadas para a área " + area + ".");
    }

    public void iniciarEvacuacao(String area) {
        System.out.println("🏃‍♂️ Iniciando evacuação da área " + area + "!");
        acionarAbrigoMaisProximo(area);
        acionarEquipesEmergencia(area);
    }

    public void evacuacaoEmergencial() {
        String areaSimulada = "Morro Azul";
        System.out.println("\n⚠️ Evacuação emergencial iniciada na área de risco: " + areaSimulada);
        iniciarEvacuacao(areaSimulada);
    }
}
