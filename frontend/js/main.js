// js/main.js - Main application controller

class AlertSlideApp {
    constructor() {
        this.isOnline = navigator.onLine;
        this.updateInterval = null;
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.loadInitialData();
        this.startRealTimeUpdates();
        this.setupOfflineSupport();
        this.populateInterface();
    }
    
    setupEventListeners() {
        // Emergency button
        const emergencyBtn = document.getElementById('emergencyBtn');
        if (emergencyBtn) {
            emergencyBtn.addEventListener('click', () => this.showEmergencyModal());
        }
        
        // Emergency form
        const emergencyForm = document.getElementById('emergencyForm');
        if (emergencyForm) {
            emergencyForm.addEventListener('submit', (e) => this.handleEmergencySubmit(e));
        }
        
        // Modal close events
        const modal = document.getElementById('emergencyModal');
        const closeBtn = modal?.querySelector('.close');
        
        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.hideEmergencyModal());
        }
        
        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.hideEmergencyModal();
                }
            });
        }
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.hideEmergencyModal();
            }
            if (e.ctrlKey && e.key === 'e') {
                e.preventDefault();
                this.showEmergencyModal();
            }
        });
        
        // Online/offline detection
        window.addEventListener('online', () => this.handleOnlineStatus(true));
        window.addEventListener('offline', () => this.handleOnlineStatus(false));
        
        // Visibility change (for battery optimization)
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.pauseUpdates();
            } else {
                this.resumeUpdates();
            }
        });
        
        // Custom events from other modules
        window.addEventListener('areaSelected', (e) => this.handleAreaSelection(e.detail));
        window.addEventListener('shelterSelected', (e) => this.handleShelterSelection(e.detail));
    }
    
    loadInitialData() {
        const { OfflineStorage } = window.AlertSlideData;
        
        // Try to load cached data first
        OfflineStorage.loadAllData();
        
        // Show loading indicator
        this.showLoadingState();
        
        // Simulate API call delay
        setTimeout(() => {
            this.hideLoadingState();
            this.populateInterface();
        }, 1000);
    }
    
    populateInterface() {
        this.updateStatistics();
        this.populateRecentAlerts();
        this.populateSensorsGrid();
        this.populateSheltersGrid();
    }
    
    updateStatistics() {
        const { DataService } = window.AlertSlideData;
        const stats = DataService.getStatistics();
        
        // Update status cards
        const safeAreasElement = document.getElementById('safeAreas');
        const moderateAreasElement = document.getElementById('moderateAreas');
        const highRiskAreasElement = document.getElementById('highRiskAreas');
        
        if (safeAreasElement) {
            this.animateCounter(safeAreasElement, stats.areas.safe);
        }
        if (moderateAreasElement) {
            this.animateCounter(moderateAreasElement, stats.areas.moderate);
        }
        if (highRiskAreasElement) {
            this.animateCounter(highRiskAreasElement, stats.areas.high);
        }
    }
    
    animateCounter(element, targetValue) {
        const currentValue = parseInt(element.textContent) || 0;
        const increment = targetValue > currentValue ? 1 : -1;
        const duration = 1000;
        const steps = Math.abs(targetValue - currentValue);
        const stepTime = duration / steps;
        
        if (steps === 0) return;
        
        let current = currentValue;
        const timer = setInterval(() => {
            current += increment;
            element.textContent = current;
            
            if (current === targetValue) {
                clearInterval(timer);
            }
        }, stepTime);
    }
    
    populateRecentAlerts() {
        const { DataService } = window.AlertSlideData;
        const recentAlerts = DataService.getRecentAlerts();
        const container = document.getElementById('recentAlerts');
        
        if (!container) return;
        
        if (recentAlerts.length === 0) {
            container.innerHTML = '<p class="no-alerts">Nenhum alerta recente</p>';
            return;
        }
        
        container.innerHTML = recentAlerts.map(alert => `
            <div class="alert-item ${alert.riskLevel.toLowerCase()}" data-alert-id="${alert.id}">
                <div class="alert-time">${DataService.formatTimestamp(alert.timestamp)}</div>
                <div class="alert-message">
                    <strong>${alert.areaName}</strong> - ${alert.message}
                </div>
            </div>
        `).join('');
        
        // Add click handlers for alert items
        container.querySelectorAll('.alert-item').forEach(item => {
            item.addEventListener('click', () => {
                const alertId = parseInt(item.getAttribute('data-alert-id'));
                this.showAlertDetails(alertId);
            });
        });
    }
    
    populateSensorsGrid() {
        const { sensors } = window.AlertSlideData;
        const container = document.getElementById('sensorsGrid');
        
        if (!container) return;
        
        container.innerHTML = sensors.map(sensor => `
            <div class="sensor-card" data-sensor-id="${sensor.id}">
                <div class="sensor-header">
                    <span class="sensor-name">${sensor.nome}</span>
                    <span class="sensor-status ${sensor.status}">${this.getStatusText(sensor.status)}</span>
                </div>
                <div class="sensor-value">${sensor.currentValue.toFixed(1)}</div>
                <div class="sensor-type">${this.getSensorTypeText(sensor.type)}</div>
                <div class="sensor-chart">
                    ${this.createMiniChart(sensor)}
                </div>
            </div>
        `).join('');
        
        // Add click handlers for sensor cards
        container.querySelectorAll('.sensor-card').forEach(card => {
            card.addEventListener('click', () => {
                const sensorId = parseInt(card.getAttribute('data-sensor-id'));
                this.showSensorDetails(sensorId);
            });
        });
    }
    
    populateSheltersGrid() {
        const { shelters, DataService } = window.AlertSlideData;
        const container = document.getElementById('sheltersGrid');
        
        if (!container) return;
        
        container.innerHTML = shelters.filter(shelter => shelter.active).map(shelter => {
            const status = DataService.getShelterStatus(shelter);
            const occupancyPercent = Math.round((shelter.currentOccupancy / shelter.capacity) * 100);
            
            return `
                <div class="shelter-card" data-shelter-id="${shelter.id}">
                    <div class="shelter-header">
                        <span class="shelter-name">${shelter.nome}</span>
                        <span class="shelter-status ${status}">${this.getShelterStatusText(status)}</span>
                    </div>
                    <div class="shelter-info">
                        <div class="shelter-capacity">
                            ${shelter.currentOccupancy}/${shelter.capacity} pessoas
                        </div>
                        <div class="shelter-location">${shelter.location}</div>
                    </div>
                    <div class="occupancy-bar">
                        <div class="occupancy-fill" style="width: ${occupancyPercent}%; background-color: ${this.getOccupancyColor(occupancyPercent)}"></div>
                    </div>
                </div>
            `;
        }).join('');
        
        // Add click handlers for shelter cards
        container.querySelectorAll('.shelter-card').forEach(card => {
            card.addEventListener('click', () => {
                const shelterId = parseInt(card.getAttribute('data-shelter-id'));
                this.showShelterDetails(shelterId);
            });
        });
    }
    
    createMiniChart(sensor) {
        // Create a simple SVG mini chart showing recent values
        const values = this.generateMockHistoricalData(sensor);
        const max = Math.max(...values);
        const min = Math.min(...values);
        const range = max - min || 1;
        
        const points = values.map((value, index) => {
            const x = (index / (values.length - 1)) * 100;
            const y = 100 - ((value - min) / range) * 100;
            return `${x},${y}`;
        }).join(' ');
        
        return `
            <svg width="100%" height="30" viewBox="0 0 100 100" preserveAspectRatio="none">
                <polyline points="${points}" fill="none" stroke="${this.getSensorColor(sensor.status)}" stroke-width="2" />
            </svg>
        `;
    }
    
    generateMockHistoricalData(sensor) {
        // Generate 10 data points around current value
        const values = [];
        const current = sensor.currentValue;
        const variance = current * 0.1; // 10% variance
        
        for (let i = 0; i < 10; i++) {
            const variation = (Math.random() - 0.5) * 2 * variance;
            values.push(Math.max(0, current + variation));
        }
        
        return values;
    }
    
    getSensorColor(status) {
        const colors = {
            normal: '#27ae60',
            warning: '#f39c12',
            critical: '#e74c3c'
        };
        return colors[status] || colors.normal;
    }
    
    getOccupancyColor(percentage) {
        if (percentage < 50) return '#27ae60';
        if (percentage < 80) return '#f39c12';
        return '#e74c3c';
    }
    
    getStatusText(status) {
        const statusTexts = {
            normal: 'Normal',
            warning: 'Atenção',
            critical: 'Crítico',
            offline: 'Offline'
        };
        return statusTexts[status] || 'Desconhecido';
    }
    
    getSensorTypeText(type) {
        const types = {
            'umidade': 'Umidade do Solo (%)',
            'pressão': 'Pressão Atmosférica (hPa)',
            'inclinação': 'Inclinação do Terreno (°)'
        };
        return types[type] || type;
    }
    
    getShelterStatusText(status) {
        const statusTexts = {
            active: 'Ativo',
            full: 'Lotado',
            inactive: 'Inativo'
        };
        return statusTexts[status] || 'Desconhecido';
    }
    
    startRealTimeUpdates() {
        const { DataService } = window.AlertSlideData;
        
        // Start data simulation
        DataService.startSimulation();
        
        // Update interface every 5 seconds
        this.updateInterval = setInterval(() => {
            this.updateStatistics();
            this.populateRecentAlerts();
            this.populateSensorsGrid();
            this.populateSheltersGrid();
            this.saveDataOffline();
        }, 5000);
    }
    
    pauseUpdates() {
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
            this.updateInterval = null;
        }
    }
    
    resumeUpdates() {
        if (!this.updateInterval) {
            this.startRealTimeUpdates();
        }
    }
    
    setupOfflineSupport() {
        const { OfflineStorage } = window.AlertSlideData;
        
        // Save data periodically
        setInterval(() => {
            this.saveDataOffline();
        }, 30000); // Every 30 seconds
        
        // Save before page unload
        window.addEventListener('beforeunload', () => {
            this.saveDataOffline();
        });
    }
    
    saveDataOffline() {
        if (!this.isOnline) {
            const { OfflineStorage } = window.AlertSlideData;
            OfflineStorage.saveAllData();
        }
    }
    
    handleOnlineStatus(isOnline) {
        this.isOnline = isOnline;
        
        if (window.notificationManager) {
            window.notificationManager.showSystemStatus(
                isOnline ? 'Conexão restaurada' : 'Modo offline ativado',
                isOnline ? 'success' : 'warning'
            );
        }
        
        // Show offline indicator
        this.updateConnectionStatus(isOnline);
        
        if (isOnline) {
            // Sync data when back online
            this.syncOfflineData();
        }
    }
    
    updateConnectionStatus(isOnline) {
        let indicator = document.getElementById('connectionStatus');
        
        if (!indicator) {
            indicator = document.createElement('div');
            indicator.id = 'connectionStatus';
            indicator.style.cssText = `
                position: fixed;
                top: 10px;
                left: 10px;
                padding: 8px 12px;
                border-radius: 6px;
                font-size: 12px;
                font-weight: 600;
                z-index: 1000;
                transition: all 0.3s ease;
            `;
            document.body.appendChild(indicator);
        }
        
        if (isOnline) {
            indicator.style.background = '#27ae60';
            indicator.style.color = 'white';
            indicator.textContent = '🌐 Online';
            
            // Hide after 3 seconds
            setTimeout(() => {
                indicator.style.opacity = '0';
            }, 3000);
        } else {
            indicator.style.background = '#e74c3c';
            indicator.style.color = 'white';
            indicator.textContent = '📡 Offline';
            indicator.style.opacity = '1';
        }
    }
    
    syncOfflineData() {
        // In a real app, this would sync with the server
        console.log('Syncing offline data...');
        
        if (window.notificationManager) {
            window.notificationManager.showSystemStatus('Dados sincronizados com sucesso', 'success');
        }
    }
    
    showEmergencyModal() {
        const modal = document.getElementById('emergencyModal');
        if (modal) {
            modal.style.display = 'block';
            
            // Focus on first input
            const firstInput = modal.querySelector('input, select, textarea');
            if (firstInput) {
                setTimeout(() => firstInput.focus(), 100);
            }
        }
    }
    
    hideEmergencyModal() {
        const modal = document.getElementById('emergencyModal');
        if (modal) {
            modal.style.display = 'none';
            
            // Reset form
            const form = modal.querySelector('form');
            if (form) {
                form.reset();
            }
        }
    }
    
    handleEmergencySubmit(event) {
        event.preventDefault();
        
        const formData = new FormData(event.target);
        const emergencyData = {
            type: formData.get('emergencyType') || document.getElementById('emergencyType').value,
            location: formData.get('emergencyLocation') || document.getElementById('emergencyLocation').value,
            description: formData.get('emergencyDescription') || document.getElementById('emergencyDescription').value,
            timestamp: new Date(),
            reportedBy: 'Usuário Anônimo', // In real app, would get from user session
            coordinates: this.getCurrentLocation()
        };
        
        // Validate form
        if (!emergencyData.type || !emergencyData.location || !emergencyData.description) {
            if (window.notificationManager) {
                window.notificationManager.show({
                    type: 'error',
                    title: 'Campos Obrigatórios',
                    message: 'Por favor, preencha todos os campos obrigatórios.'
                });
            }
            return;
        }
        
        // Simulate emergency report submission
        this.submitEmergencyReport(emergencyData);
    }
    
    submitEmergencyReport(emergencyData) {
        // Show loading state
        const submitBtn = document.querySelector('#emergencyForm .submit-btn');
        if (submitBtn) {
            submitBtn.textContent = 'Enviando...';
            submitBtn.disabled = true;
        }
        
        // Simulate API call
        setTimeout(() => {
            const success = Math.random() > 0.1; // 90% success rate
            
            if (success) {
                this.handleEmergencySuccess(emergencyData);
            } else {
                this.handleEmergencyError();
            }
            
            // Reset button
            if (submitBtn) {
                submitBtn.textContent = 'Enviar Alerta';
                submitBtn.disabled = false;
            }
        }, 2000);
    }
    
    handleEmergencySuccess(emergencyData) {
        // Hide modal
        this.hideEmergencyModal();
        
        // Generate alert
        const { DataService } = window.AlertSlideData;
        const newAlert = DataService.generateAlert(
            emergencyData.location,
            emergencyData.type === 'deslizamento' ? 'ALTO' : 'MODERADO'
        );
        
        // Show success notification
        if (window.notificationManager) {
            window.notificationManager.showEmergencyReport(true);
        }
        
        // Update interface
        this.populateRecentAlerts();
        
        // Dispatch event for other modules
        window.dispatchEvent(new CustomEvent('emergencyReported', { 
            detail: emergencyData 
        }));
        
        // If it's a high-risk emergency, trigger evacuation procedures
        if (emergencyData.type === 'deslizamento') {
            setTimeout(() => {
                this.triggerEvacuation(emergencyData.location);
            }, 3000);
        }
    }
    
    handleEmergencyError() {
        if (window.notificationManager) {
            window.notificationManager.showEmergencyReport(false);
        }
    }
    
    getCurrentLocation() {
        // In a real app, would use geolocation API
        // For demo, return coordinates near Natal, RN
        return {
            lat: -5.795 + (Math.random() - 0.5) * 0.1,
            lng: -35.207 + (Math.random() - 0.5) * 0.1
        };
    }
    
    triggerEvacuation(areaName) {
        if (window.notificationManager) {
            window.notificationManager.showEvacuationAlert(areaName);
        }
        
        // Dispatch evacuation event
        window.dispatchEvent(new CustomEvent('evacuationTriggered', {
            detail: { areaName }
        }));
        
        // Update emergency teams
        this.dispatchEmergencyTeams(areaName);
    }
    
    dispatchEmergencyTeams(areaName) {
        const { emergencyTeams } = window.AlertSlideData;
        const availableTeams = emergencyTeams.filter(team => team.available);
        
        if (availableTeams.length > 0) {
            // Mark teams as dispatched
            availableTeams.forEach(team => {
                team.available = false;
                team.location = `Em atendimento - ${areaName}`;
            });
            
            if (window.notificationManager) {
                window.notificationManager.show({
                    type: 'info',
                    title: '🚑 Equipes Despachadas',
                    message: `${availableTeams.length} equipe(s) enviada(s) para ${areaName}`,
                    duration: 6000
                });
            }
        }
    }
    
    showAlertDetails(alertId) {
        const { alerts } = window.AlertSlideData;
        const alert = alerts.find(a => a.id === alertId);
        
        if (!alert) return;
        
        const modal = this.createDetailsModal();
        modal.innerHTML = `
            <div class="modal-content">
                <span class="close" onclick="this.closest('.modal').remove()">&times;</span>
                <h2><i class="fas fa-bell"></i> Detalhes do Alerta</h2>
                <div class="alert-details">
                    <div class="detail-row">
                        <strong>ID:</strong> #${alert.id}
                    </div>
                    <div class="detail-row">
                        <strong>Área:</strong> ${alert.areaName}
                    </div>
                    <div class="detail-row">
                        <strong>Nível de Risco:</strong> 
                        <span class="risk-badge ${alert.riskLevel.toLowerCase()}">${alert.riskLevel}</span>
                    </div>
                    <div class="detail-row">
                        <strong>Data/Hora:</strong> ${alert.timestamp.toLocaleString('pt-BR')}
                    </div>
                    <div class="detail-row">
                        <strong>Mensagem:</strong> ${alert.message}
                    </div>
                </div>
                <div class="modal-actions">
                    <button class="btn-action" onclick="window.mapManager?.centerOnArea('${alert.areaName}')">
                        <i class="fas fa-map-marker-alt"></i> Ver no Mapa
                    </button>
                    <button class="btn-action" onclick="window.mapManager?.showNearestShelter('${alert.areaName}')">
                        <i class="fas fa-home"></i> Abrigo Mais Próximo
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
    }
    
    showSensorDetails(sensorId) {
        const { sensors, riskAreas } = window.AlertSlideData;
        const sensor = sensors.find(s => s.id === sensorId);
        
        if (!sensor) return;
        
        const area = riskAreas.find(a => a.sensors && a.sensors.includes(sensorId));
        const historicalData = this.generateMockHistoricalData(sensor);
        
        const modal = this.createDetailsModal();
        modal.innerHTML = `
            <div class="modal-content">
                <span class="close" onclick="this.closest('.modal').remove()">&times;</span>
                <h2><i class="fas fa-thermometer-half"></i> Detalhes do Sensor</h2>
                <div class="sensor-details">
                    <div class="detail-row">
                        <strong>Nome:</strong> ${sensor.nome}
                    </div>
                    <div class="detail-row">
                        <strong>Tipo:</strong> ${this.getSensorTypeText(sensor.type)}
                    </div>
                    <div class="detail-row">
                        <strong>Valor Atual:</strong> 
                        <span class="sensor-value ${sensor.status}">
                            ${sensor.currentValue.toFixed(1)}${this.getSensorUnit(sensor.type)}
                        </span>
                    </div>
                    <div class="detail-row">
                        <strong>Status:</strong> 
                        <span class="sensor-status ${sensor.status}">${this.getStatusText(sensor.status)}</span>
                    </div>
                    ${area ? `
                        <div class="detail-row">
                            <strong>Área:</strong> ${area.nome}
                        </div>
                    ` : ''}
                    <div class="chart-container">
                        <h3>Histórico (Últimas 24h)</h3>
                        <div class="sensor-chart-large">
                            ${this.createLargeChart(sensor, historicalData)}
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
    }
    
    showShelterDetails(shelterId) {
        const { shelters, DataService } = window.AlertSlideData;
        const shelter = shelters.find(s => s.id === shelterId);
        
        if (!shelter) return;
        
        const status = DataService.getShelterStatus(shelter);
        const occupancyPercent = Math.round((shelter.currentOccupancy / shelter.capacity) * 100);
        
        const modal = this.createDetailsModal();
        modal.innerHTML = `
            <div class="modal-content">
                <span class="close" onclick="this.closest('.modal').remove()">&times;</span>
                <h2><i class="fas fa-home"></i> Detalhes do Abrigo</h2>
                <div class="shelter-details">
                    <div class="detail-row">
                        <strong>Nome:</strong> ${shelter.nome}
                    </div>
                    <div class="detail-row">
                        <strong>Localização:</strong> ${shelter.location}
                    </div>
                    <div class="detail-row">
                        <strong>Status:</strong> 
                        <span class="status-badge ${status}">${this.getShelterStatusText(status)}</span>
                    </div>
                    <div class="detail-row">
                        <strong>Capacidade:</strong> ${shelter.capacity} pessoas
                    </div>
                    <div class="detail-row">
                        <strong>Ocupação Atual:</strong> ${shelter.currentOccupancy} pessoas (${occupancyPercent}%)
                    </div>
                    <div class="capacity-visual">
                        <div class="capacity-bar">
                            <div class="capacity-fill" style="width: ${occupancyPercent}%; background-color: ${this.getOccupancyColor(occupancyPercent)}"></div>
                        </div>
                    </div>
                </div>
                <div class="modal-actions">
                    <button class="btn-action" onclick="window.mapManager?.selectShelter(${JSON.stringify(shelter).replace(/"/g, '&quot;')})">
                        <i class="fas fa-map-marker-alt"></i> Ver no Mapa
                    </button>
                    ${status === 'active' ? `
                        <button class="btn-action" onclick="window.mapManager?.requestShelter(${shelter.id})">
                            <i class="fas fa-plus"></i> Solicitar Vaga
                        </button>
                    ` : ''}
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
    }
    
    createDetailsModal() {
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.style.display = 'block';
        
        // Close on backdrop click
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });
        
        return modal;
    }
    
    createLargeChart(sensor, historicalData) {
        const max = Math.max(...historicalData);
        const min = Math.min(...historicalData);
        const range = max - min || 1;
        
        const points = historicalData.map((value, index) => {
            const x = (index / (historicalData.length - 1)) * 100;
            const y = 100 - ((value - min) / range) * 100;
            return `${x},${y}`;
        }).join(' ');
        
        return `
            <svg width="100%" height="150" viewBox="0 0 100 100" preserveAspectRatio="none" style="border: 1px solid #ddd; border-radius: 4px; background: #f8f9fa;">
                <defs>
                    <linearGradient id="gradient-${sensor.id}" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" style="stop-color:${this.getSensorColor(sensor.status)};stop-opacity:0.3" />
                        <stop offset="100%" style="stop-color:${this.getSensorColor(sensor.status)};stop-opacity:0.1" />
                    </linearGradient>
                </defs>
                <polygon points="0,100 ${points} 100,100" fill="url(#gradient-${sensor.id})" />
                <polyline points="${points}" fill="none" stroke="${this.getSensorColor(sensor.status)}" stroke-width="1" />
            </svg>
        `;
    }
    
    getSensorUnit(type) {
        const units = {
            'umidade': '%',
            'pressão': ' hPa',
            'inclinação': '°'
        };
        return units[type] || '';
    }
    
    handleAreaSelection(area) {
        console.log('Area selected:', area);
        // Could trigger additional actions when area is selected
    }
    
    handleShelterSelection(shelter) {
        console.log('Shelter selected:', shelter);
        // Could trigger additional actions when shelter is selected
    }
    
    showLoadingState() {
        const containers = [
            'recentAlerts',
            'sensorsGrid',
            'sheltersGrid'
        ];
        
        containers.forEach(containerId => {
            const container = document.getElementById(containerId);
            if (container) {
                container.innerHTML = `
                    <div class="loading-placeholder">
                        <div class="spinner"></div>
                        <p>Carregando dados...</p>
                    </div>
                `;
            }
        });
    }
    
    hideLoadingState() {
        // Loading states will be replaced by actual content
        // when populateInterface() is called
    }
    
    // Utility method for testing
    simulateEmergency(areaName = 'Área de Teste') {
        const emergencyData = {
            type: 'deslizamento',
            location: areaName,
            description: 'Simulação de emergência para teste do sistema',
            timestamp: new Date(),
            reportedBy: 'Sistema de Teste'
        };
        
        this.handleEmergencySuccess(emergencyData);
    }
    
    // Debug methods
    getSystemStatus() {
        return {
            isOnline: this.isOnline,
            updateInterval: !!this.updateInterval,
            notificationManager: !!window.notificationManager,
            mapManager: !!window.mapManager,
            dataLoaded: !!window.AlertSlideData
        };
    }
}

// Additional CSS for new components
const additionalStyles = `
    .loading-placeholder {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 40px;
        color: #7f8c8d;
    }
    
    .spinner {
        width: 40px;
        height: 40px;
        border: 4px solid #ecf0f1;
        border-top: 4px solid #3498db;
        border-radius: 50%;
        animation: spin 1s linear infinite;
        margin-bottom: 15px;
    }
    
    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
    
    .no-alerts {
        text-align: center;
        color: #7f8c8d;
        font-style: italic;
        padding: 20px;
    }
    
    .alert-details,
    .sensor-details,
    .shelter-details {
        padding: 20px 0;
    }
    
    .detail-row {
        display: flex;
        justify-content: space-between;
        margin-bottom: 15px;
        padding-bottom: 10px;
        border-bottom: 1px solid #ecf0f1;
    }
    
    .detail-row:last-child {
        border-bottom: none;
        margin-bottom: 0;
    }
    
    .chart-container {
        margin-top: 20px;
        padding-top: 20px;
        border-top: 2px solid #ecf0f1;
    }
    
    .chart-container h3 {
        margin-bottom: 15px;
        color: #2c3e50;
        font-size: 16px;
    }
    
    .sensor-chart-large {
        margin-top: 10px;
    }
    
    .capacity-visual {
        margin-top: 15px;
    }
    
    .modal-actions {
        margin-top: 20px;
        display: flex;
        gap: 10px;
        justify-content: center;
    }
    
    .occupancy-bar {
        width: 100%;
        height: 10px;
        background: #ecf0f1;
        border-radius: 5px;
        overflow: hidden;
        margin-top: 10px;
    }
    
    .occupancy-fill {
        height: 100%;
        transition: width 0.3s ease;
        border-radius: 5px;
    }
`;

// Inject additional styles
const additionalStyleSheet = document.createElement('style');
additionalStyleSheet.textContent = additionalStyles;
document.head.appendChild(additionalStyleSheet);

// Initialize application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.alertSlideApp = new AlertSlideApp();
    
    // Expose some methods for console debugging
    window.AlertSlide = {
        app: window.alertSlideApp,
        simulateEmergency: (area) => window.alertSlideApp.simulateEmergency(area),
        getStatus: () => window.alertSlideApp.getSystemStatus(),
        map: () => window.mapManager,
        notifications: () => window.notificationManager,
        data: () => window.AlertSlideData
    };
    
    console.log('🚨 AlertSlide System Initialized');
    console.log('💡 Use AlertSlide.simulateEmergency("Test Area") to test emergency features');
    console.log('📊 Use AlertSlide.getStatus() to check system status');
});