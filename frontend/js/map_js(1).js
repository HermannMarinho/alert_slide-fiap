// js/map.js - Interactive map functionality

class MapManager {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.riskAreas = [];
        this.shelters = [];
        this.selectedArea = null;
        this.init();
    }
    
    init() {
        if (!this.container) return;
        
        this.setupMapContainer();
        this.addRiskAreas();
        this.addShelters();
        this.addEventListeners();
        this.startUpdateLoop();
    }
    
    setupMapContainer() {
        this.container.style.position = 'relative';
        this.container.style.background = 'linear-gradient(135deg, #74b9ff, #0984e3)';
        this.container.style.overflow = 'hidden';
        
        // Add a subtle grid pattern
        this.container.innerHTML = `
            <div class="map-grid" style="
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-image: 
                    linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                    linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px);
                background-size: 20px 20px;
                pointer-events: none;
            "></div>
            <div class="map-overlay" style="
                position: absolute;
                top: 10px;
                left: 10px;
                background: rgba(255,255,255,0.9);
                padding: 10px;
                border-radius: 8px;
                font-size: 12px;
                backdrop-filter: blur(10px);
                z-index: 10;
            ">
                <strong>Natal, RN</strong><br>
                Monitoramento em Tempo Real
            </div>
        `;
    }
    
    addRiskAreas() {
        const { riskAreas } = window.AlertSlideData;
        
        riskAreas.forEach((area, index) => {
            const areaElement = this.createRiskAreaElement(area, index);
            this.container.appendChild(areaElement);
            this.riskAreas.push({
                element: areaElement,
                data: area
            });
        });
    }
    
    createRiskAreaElement(area, index) {
        const element = document.createElement('div');
        element.className = `risk-area ${area.riskLevel.toLowerCase()}`;
        element.setAttribute('data-area-id', area.id);
        element.setAttribute('data-area-name', area.nome);
        element.setAttribute('data-risk-level', area.riskLevel);
        
        // Position based on a simulated coordinate system
        const position = this.normalizeCoordinates(area.coordinates);
        element.style.left = position.x + '%';
        element.style.top = position.y + '%';
        
        // Add pulsing effect for high risk areas
        if (area.riskLevel === 'ALTO') {
            element.style.animation = 'pulse 1.5s infinite, float 3s ease-in-out infinite';
        }
        
        // Create tooltip
        const tooltip = this.createTooltip(area);
        element.appendChild(tooltip);
        
        return element;
    }
    
    addShelters() {
        const { shelters } = window.AlertSlideData;
        
        shelters.forEach((shelter, index) => {
            if (shelter.active) {
                const shelterElement = this.createShelterElement(shelter, index);
                this.container.appendChild(shelterElement);
                this.shelters.push({
                    element: shelterElement,
                    data: shelter
                });
            }
        });
    }
    
    createShelterElement(shelter, index) {
        const element = document.createElement('div');
        element.className = 'shelter-marker';
        element.setAttribute('data-shelter-id', shelter.id);
        element.setAttribute('data-shelter-name', shelter.nome);
        
        const position = this.normalizeCoordinates(shelter.coordinates);
        element.style.left = position.x + '%';
        element.style.top = position.y + '%';
        element.style.position = 'absolute';
        element.style.width = '24px';
        element.style.height = '24px';
        element.style.backgroundColor = this.getShelterColor(shelter);
        element.style.borderRadius = '4px';
        element.style.border = '2px solid white';
        element.style.cursor = 'pointer';
        element.style.transition = 'all 0.3s ease';
        element.style.zIndex = '5';
        element.style.display = 'flex';
        element.style.alignItems = 'center';
        element.style.justifyContent = 'center';
        element.style.fontSize = '12px';
        element.style.color = 'white';
        element.style.fontWeight = 'bold';
        element.innerHTML = '🏠';
        
        // Create shelter tooltip
        const tooltip = this.createShelterTooltip(shelter);
        element.appendChild(tooltip);
        
        return element;
    }
    
    getShelterColor(shelter) {
        const { DataService } = window.AlertSlideData;
        const status = DataService.getShelterStatus(shelter);
        
        switch (status) {
            case 'active': return '#27ae60';
            case 'full': return '#f39c12';
            case 'inactive': return '#95a5a6';
            default: return '#27ae60';
        }
    }
    
    createTooltip(area) {
        const tooltip = document.createElement('div');
        tooltip.className = 'map-tooltip';
        tooltip.style.cssText = `
            position: absolute;
            bottom: 25px;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(0,0,0,0.9);
            color: white;
            padding: 8px 12px;
            border-radius: 6px;
            font-size: 12px;
            white-space: nowrap;
            pointer-events: none;
            opacity: 0;
            transition: opacity 0.3s ease;
            z-index: 1000;
            backdrop-filter: blur(10px);
        `;
        
        const sensorCount = area.sensors ? area.sensors.length : 0;
        tooltip.innerHTML = `
            <strong>${area.nome}</strong><br>
            Risco: ${area.riskLevel}<br>
            Sensores: ${sensorCount}
        `;
        
        return tooltip;
    }
    
    createShelterTooltip(shelter) {
        const tooltip = document.createElement('div');
        tooltip.className = 'shelter-tooltip';
        tooltip.style.cssText = `
            position: absolute;
            bottom: 30px;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(0,0,0,0.9);
            color: white;
            padding: 8px 12px;
            border-radius: 6px;
            font-size: 12px;
            white-space: nowrap;
            pointer-events: none;
            opacity: 0;
            transition: opacity 0.3s ease;
            z-index: 1000;
            min-width: 150px;
            text-align: center;
        `;
        
        const occupancyPercent = Math.round((shelter.currentOccupancy / shelter.capacity) * 100);
        tooltip.innerHTML = `
            <strong>${shelter.nome}</strong><br>
            Capacidade: ${shelter.capacity}<br>
            Ocupação: ${shelter.currentOccupancy} (${occupancyPercent}%)
        `;
        
        return tooltip;
    }
    
    normalizeCoordinates(coords) {
        // Convert lat/lng to percentage position on the map
        // This is a simplified projection for the demo
        // In a real application, you would use proper map projection
        
        const bounds = {
            minLat: -20.340,
            maxLat: -20.300,
            minLng: -40.340,
            maxLng: -40.300
        };
        
        const x = ((coords.lng - bounds.minLng) / (bounds.maxLng - bounds.minLng)) * 100;
        const y = ((bounds.maxLat - coords.lat) / (bounds.maxLat - bounds.minLat)) * 100;
        
        // Ensure coordinates are within bounds
        return {
            x: Math.max(5, Math.min(95, x)),
            y: Math.max(5, Math.min(95, y))
        };
    }
    
    addEventListeners() {
        // Risk area hover events
        this.riskAreas.forEach(({ element, data }) => {
            element.addEventListener('mouseenter', () => {
                const tooltip = element.querySelector('.map-tooltip');
                if (tooltip) tooltip.style.opacity = '1';
                element.style.transform = 'scale(1.5)';
                element.style.zIndex = '100';
            });
            
            element.addEventListener('mouseleave', () => {
                const tooltip = element.querySelector('.map-tooltip');
                if (tooltip) tooltip.style.opacity = '0';
                element.style.transform = 'scale(1)';
                element.style.zIndex = '1';
            });
            
            element.addEventListener('click', () => {
                this.selectArea(data);
            });
        });
        
        // Shelter hover events
        this.shelters.forEach(({ element, data }) => {
            element.addEventListener('mouseenter', () => {
                const tooltip = element.querySelector('.shelter-tooltip');
                if (tooltip) tooltip.style.opacity = '1';
                element.style.transform = 'scale(1.3)';
                element.style.zIndex = '100';
            });
            
            element.addEventListener('mouseleave', () => {
                const tooltip = element.querySelector('.shelter-tooltip');
                if (tooltip) tooltip.style.opacity = '0';
                element.style.transform = 'scale(1)';
                element.style.zIndex = '5';
            });
            
            element.addEventListener('click', () => {
                this.selectShelter(data);
            });
        });
        
        // Map click events
        this.container.addEventListener('click', (e) => {
            if (e.target === this.container || e.target.className === 'map-grid') {
                this.deselectAll();
            }
        });
    }
    
    selectArea(area) {
        this.deselectAll();
        this.selectedArea = area;
        
        // Highlight selected area
        const areaElement = this.container.querySelector(`[data-area-id="${area.id}"]`);
        if (areaElement) {
            areaElement.style.boxShadow = '0 0 20px rgba(255, 255, 255, 0.8)';
            areaElement.style.zIndex = '200';
        }
        
        // Show area details
        this.showAreaDetails(area);
        
        // Dispatch custom event
        window.dispatchEvent(new CustomEvent('areaSelected', { detail: area }));
    }
    
    selectShelter(shelter) {
        this.deselectAll();
        
        // Highlight selected shelter
        const shelterElement = this.container.querySelector(`[data-shelter-id="${shelter.id}"]`);
        if (shelterElement) {
            shelterElement.style.boxShadow = '0 0 20px rgba(255, 255, 255, 0.8)';
            shelterElement.style.zIndex = '200';
        }
        
        // Show shelter details
        this.showShelterDetails(shelter);
        
        // Dispatch custom event
        window.dispatchEvent(new CustomEvent('shelterSelected', { detail: shelter }));
    }
    
    deselectAll() {
        this.selectedArea = null;
        
        // Remove highlights from all areas
        this.riskAreas.forEach(({ element }) => {
            element.style.boxShadow = '';
            element.style.zIndex = '1';
        });
        
        // Remove highlights from all shelters
        this.shelters.forEach(({ element }) => {
            element.style.boxShadow = '';
            element.style.zIndex = '5';
        });
        
        // Hide details panel
        this.hideDetailsPanel();
    }
    
    showAreaDetails(area) {
        const { sensors } = window.AlertSlideData;
        const areaSensors = sensors.filter(sensor => area.sensors && area.sensors.includes(sensor.id));
        
        const detailsPanel = this.createDetailsPanel();
        detailsPanel.innerHTML = `
            <div class="details-header">
                <h3><i class="fas fa-map-marker-alt"></i> ${area.nome}</h3>
                <button class="close-details" onclick="window.mapManager.hideDetailsPanel()">×</button>
            </div>
            <div class="details-content">
                <div class="detail-item">
                    <strong>Nível de Risco:</strong>
                    <span class="risk-badge ${area.riskLevel.toLowerCase()}">${area.riskLevel}</span>
                </div>
                <div class="detail-item">
                    <strong>Coordenadas:</strong>
                    <span>${area.coordinates.lat.toFixed(3)}, ${area.coordinates.lng.toFixed(3)}</span>
                </div>
                <div class="detail-item">
                    <strong>Sensores Ativos:</strong>
                    <span>${areaSensors.length}</span>
                </div>
                ${areaSensors.length > 0 ? `
                    <div class="sensors-list">
                        <h4>Leituras dos Sensores:</h4>
                        ${areaSensors.map(sensor => `
                            <div class="sensor-reading">
                                <span class="sensor-name">${sensor.nome}</span>
                                <span class="sensor-value ${sensor.status}">
                                    ${sensor.currentValue.toFixed(1)}
                                    ${this.getSensorUnit(sensor.type)}
                                </span>
                            </div>
                        `).join('')}
                    </div>
                ` : '<p>Nenhum sensor ativo nesta área.</p>'}
                <div class="action-buttons">
                    <button class="btn-action" onclick="window.mapManager.showNearestShelter('${area.nome}')">
                        <i class="fas fa-home"></i> Abrigo Mais Próximo
                    </button>
                    <button class="btn-action" onclick="window.mapManager.reportIncident('${area.nome}')">
                        <i class="fas fa-exclamation-triangle"></i> Reportar Ocorrência
                    </button>
                </div>
            </div>
        `;
        
        this.container.appendChild(detailsPanel);
    }
    
    showShelterDetails(shelter) {
        const { DataService } = window.AlertSlideData;
        const status = DataService.getShelterStatus(shelter);
        const occupancyPercent = Math.round((shelter.currentOccupancy / shelter.capacity) * 100);
        
        const detailsPanel = this.createDetailsPanel();
        detailsPanel.innerHTML = `
            <div class="details-header">
                <h3><i class="fas fa-home"></i> ${shelter.nome}</h3>
                <button class="close-details" onclick="window.mapManager.hideDetailsPanel()">×</button>
            </div>
            <div class="details-content">
                <div class="detail-item">
                    <strong>Status:</strong>
                    <span class="status-badge ${status}">${this.getStatusText(status)}</span>
                </div>
                <div class="detail-item">
                    <strong>Localização:</strong>
                    <span>${shelter.location}</span>
                </div>
                <div class="detail-item">
                    <strong>Capacidade Total:</strong>
                    <span>${shelter.capacity} pessoas</span>
                </div>
                <div class="detail-item">
                    <strong>Ocupação Atual:</strong>
                    <span>${shelter.currentOccupancy} pessoas (${occupancyPercent}%)</span>
                </div>
                <div class="capacity-bar">
                    <div class="capacity-fill" style="width: ${occupancyPercent}%; background-color: ${this.getCapacityColor(occupancyPercent)}"></div>
                </div>
                <div class="action-buttons">
                    <button class="btn-action" onclick="window.mapManager.getDirections('${shelter.nome}')">
                        <i class="fas fa-route"></i> Como Chegar
                    </button>
                    ${status === 'active' ? `
                        <button class="btn-action" onclick="window.mapManager.requestShelter(${shelter.id})">
                            <i class="fas fa-plus"></i> Solicitar Vaga
                        </button>
                    ` : ''}
                </div>
            </div>
        `;
        
        this.container.appendChild(detailsPanel);
    }
    
    createDetailsPanel() {
        // Remove existing panel
        this.hideDetailsPanel();
        
        const panel = document.createElement('div');
        panel.className = 'map-details-panel';
        panel.style.cssText = `
            position: absolute;
            top: 50px;
            right: 10px;
            width: 300px;
            max-height: 400px;
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(10px);
            border-radius: 12px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.2);
            z-index: 1000;
            overflow: hidden;
            animation: slideInRight 0.3s ease-out;
        `;
        
        return panel;
    }
    
    hideDetailsPanel() {
        const existingPanel = this.container.querySelector('.map-details-panel');
        if (existingPanel) {
            existingPanel.remove();
        }
    }
    
    getSensorUnit(type) {
        switch (type) {
            case 'umidade': return '%';
            case 'pressão': return ' hPa';
            case 'inclinação': return '°';
            default: return '';
        }
    }
    
    getStatusText(status) {
        switch (status) {
            case 'active': return 'Ativo';
            case 'full': return 'Lotado';
            case 'inactive': return 'Inativo';
            default: return 'Desconhecido';
        }
    }
    
    getCapacityColor(percentage) {
        if (percentage < 50) return '#27ae60';
        if (percentage < 80) return '#f39c12';
        return '#e74c3c';
    }
    
    showNearestShelter(areaName) {
        const { riskAreas, DataService } = window.AlertSlideData;
        const area = riskAreas.find(a => a.nome === areaName);
        
        if (area) {
            const nearestShelter = DataService.findNearestShelter(area.coordinates.lat, area.coordinates.lng);
            
            if (nearestShelter) {
                this.selectShelter(nearestShelter);
                
                // Show notification
                if (window.notificationManager) {
                    window.notificationManager.show({
                        type: 'info',
                        title: 'Abrigo Mais Próximo',
                        message: `${nearestShelter.nome} - ${nearestShelter.location}`
                    });
                }
            } else {
                if (window.notificationManager) {
                    window.notificationManager.show({
                        type: 'warning',
                        title: 'Nenhum Abrigo Disponível',
                        message: 'Não há abrigos disponíveis no momento.'
                    });
                }
            }
        }
    }
    
    reportIncident(areaName) {
        // Trigger emergency form with pre-filled location
        const emergencyBtn = document.getElementById('emergencyBtn');
        if (emergencyBtn) {
            emergencyBtn.click();
            
            // Pre-fill location after a short delay
            setTimeout(() => {
                const locationInput = document.getElementById('emergencyLocation');
                if (locationInput) {
                    locationInput.value = areaName;
                }
            }, 100);
        }
    }
    
    getDirections(shelterName) {
        if (window.notificationManager) {
            window.notificationManager.show({
                type: 'info',
                title: 'Direções',
                message: `Direções para ${shelterName} seriam exibidas em um app de mapas real.`
            });
        }
    }
    
    requestShelter(shelterId) {
        const { shelters } = window.AlertSlideData;
        const shelter = shelters.find(s => s.id === shelterId);
        
        if (shelter && shelter.currentOccupancy < shelter.capacity) {
            shelter.currentOccupancy++;
            
            if (window.notificationManager) {
                window.notificationManager.show({
                    type: 'success',
                    title: 'Vaga Solicitada',
                    message: `Vaga reservada no ${shelter.nome}. Dirija-se ao local o mais rápido possível.`
                });
            }
            
            // Update shelter display
            this.updateShelterDisplay(shelter);
        }
    }
    
    updateShelterDisplay(shelter) {
        const shelterElement = this.container.querySelector(`[data-shelter-id="${shelter.id}"]`);
        if (shelterElement) {
            shelterElement.style.backgroundColor = this.getShelterColor(shelter);
            
            // Update tooltip if visible
            const tooltip = shelterElement.querySelector('.shelter-tooltip');
            if (tooltip) {
                const occupancyPercent = Math.round((shelter.currentOccupancy / shelter.capacity) * 100);
                tooltip.innerHTML = `
                    <strong>${shelter.nome}</strong><br>
                    Capacidade: ${shelter.capacity}<br>
                    Ocupação: ${shelter.currentOccupancy} (${occupancyPercent}%)
                `;
            }
        }
    }
    
    updateRiskAreas() {
        const { riskAreas } = window.AlertSlideData;
        
        this.riskAreas.forEach(({ element, data }) => {
            const updatedArea = riskAreas.find(area => area.id === data.id);
            if (updatedArea && updatedArea.riskLevel !== data.riskLevel) {
                // Update visual appearance
                element.className = `risk-area ${updatedArea.riskLevel.toLowerCase()}`;
                element.setAttribute('data-risk-level', updatedArea.riskLevel);
                
                // Update animation for high risk areas
                if (updatedArea.riskLevel === 'ALTO') {
                    element.style.animation = 'pulse 1.5s infinite, float 3s ease-in-out infinite';
                } else {
                    element.style.animation = 'float 3s ease-in-out infinite';
                }
                
                // Update data reference
                data.riskLevel = updatedArea.riskLevel;
                
                // Update tooltip
                const tooltip = element.querySelector('.map-tooltip');
                if (tooltip) {
                    const sensorCount = updatedArea.sensors ? updatedArea.sensors.length : 0;
                    tooltip.innerHTML = `
                        <strong>${updatedArea.nome}</strong><br>
                        Risco: ${updatedArea.riskLevel}<br>
                        Sensores: ${sensorCount}
                    `;
                }
            }
        });
    }
    
    startUpdateLoop() {
        // Update map every 5 seconds
        setInterval(() => {
            this.updateRiskAreas();
            
            // Update shelter displays
            this.shelters.forEach(({ element, data }) => {
                this.updateShelterDisplay(data);
            });
        }, 5000);
    }
    
    addCustomMarker(coordinates, type, data) {
        const marker = document.createElement('div');
        marker.className = `custom-marker ${type}`;
        
        const position = this.normalizeCoordinates(coordinates);
        marker.style.left = position.x + '%';
        marker.style.top = position.y + '%';
        marker.style.position = 'absolute';
        marker.style.zIndex = '10';
        
        // Style based on type
        switch (type) {
            case 'emergency':
                marker.innerHTML = '🚨';
                marker.style.fontSize = '20px';
                marker.style.animation = 'pulse 1s infinite';
                break;
            case 'team':
                marker.innerHTML = '🚑';
                marker.style.fontSize = '18px';
                break;
            case 'user':
                marker.innerHTML = '📍';
                marker.style.fontSize = '16px';
                break;
        }
        
        this.container.appendChild(marker);
        return marker;
    }
    
    removeCustomMarker(marker) {
        if (marker && marker.parentNode) {
            marker.parentNode.removeChild(marker);
        }
    }
    
    centerOnArea(areaId) {
        const areaElement = this.container.querySelector(`[data-area-id="${areaId}"]`);
        if (areaElement) {
            areaElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
            this.selectArea(window.AlertSlideData.riskAreas.find(area => area.id === areaId));
        }
    }
    
    highlightRoute(from, to) {
        // Simple route visualization
        const route = document.createElement('div');
        route.className = 'route-line';
        route.style.cssText = `
            position: absolute;
            height: 3px;
            background: linear-gradient(90deg, #e74c3c, #f39c12);
            z-index: 2;
            border-radius: 2px;
            animation: dash 2s linear infinite;
        `;
        
        const fromPos = this.normalizeCoordinates(from);
        const toPos = this.normalizeCoordinates(to);
        
        const length = Math.sqrt(Math.pow(toPos.x - fromPos.x, 2) + Math.pow(toPos.y - fromPos.y, 2));
        const angle = Math.atan2(toPos.y - fromPos.y, toPos.x - fromPos.x) * 180 / Math.PI;
        
        route.style.width = length + '%';
        route.style.left = fromPos.x + '%';
        route.style.top = fromPos.y + '%';
        route.style.transform = `rotate(${angle}deg)`;
        route.style.transformOrigin = '0 50%';
        
        this.container.appendChild(route);
        
        // Remove after 5 seconds
        setTimeout(() => {
            if (route.parentNode) {
                route.parentNode.removeChild(route);
            }
        }, 5000);
    }
}

// CSS animations for map elements
const mapStyles = `
    @keyframes slideInRight {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes dash {
        to { background-position: 20px 0; }
    }
    
    .map-details-panel {
        font-family: inherit;
    }
    
    .details-header {
        background: linear-gradient(135deg, #667eea, #764ba2);
        color: white;
        padding: 15px;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    
    .details-header h3 {
        margin: 0;
        font-size: 16px;
        display: flex;
        align-items: center;
        gap: 8px;
    }
    
    .close-details {
        background: none;
        border: none;
        color: white;
        font-size: 20px;
        cursor: pointer;
        padding: 0;
        width: 24px;
        height: 24px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        transition: background-color 0.3s;
    }
    
    .close-details:hover {
        background-color: rgba(255, 255, 255, 0.2);
    }
    
    .details-content {
        padding: 15px;
        max-height: 320px;
        overflow-y: auto;
    }
    
    .detail-item {
        display: flex;
        justify-content: space-between;
        margin-bottom: 10px;
        font-size: 14px;
    }
    
    .risk-badge {
        padding: 2px 8px;
        border-radius: 12px;
        font-size: 12px;
        font-weight: bold;
        text-transform: uppercase;
    }
    
    .risk-badge.alto { background: #e74c3c; color: white; }
    .risk-badge.moderado { background: #f39c12; color: white; }
    .risk-badge.baixo { background: #27ae60; color: white; }
    
    .status-badge {
        padding: 2px 8px;
        border-radius: 12px;
        font-size: 12px;
        font-weight: bold;
        text-transform: uppercase;
    }
    
    .status-badge.active { background: #27ae60; color: white; }
    .status-badge.full { background: #f39c12; color: white; }
    .status-badge.inactive { background: #95a5a6; color: white; }
    
    .sensors-list {
        margin-top: 15px;
        padding-top: 15px;
        border-top: 1px solid #eee;
    }
    
    .sensors-list h4 {
        margin: 0 0 10px 0;
        font-size: 14px;
        color: #2c3e50;
    }
    
    .sensor-reading {
        display: flex;
        justify-content: space-between;
        margin-bottom: 8px;
        font-size: 13px;
    }
    
    .sensor-name {
        color: #666;
    }
    
    .sensor-value {
        font-weight: bold;
    }
    
    .sensor-value.normal { color: #27ae60; }
    .sensor-value.warning { color: #f39c12; }
    .sensor-value.critical { color: #e74c3c; }
    
    .capacity-bar {
        width: 100%;
        height: 8px;
        background: #ecf0f1;
        border-radius: 4px;
        overflow: hidden;
        margin: 10px 0;
    }
    
    .capacity-fill {
        height: 100%;
        transition: width 0.3s ease;
        border-radius: 4px;
    }
    
    .action-buttons {
        margin-top: 15px;
        display: flex;
        gap: 8px;
        flex-direction: column;
    }
    
    .btn-action {
        background: #3498db;
        color: white;
        border: none;
        padding: 8px 12px;
        border-radius: 6px;
        font-size: 12px;
        cursor: pointer;
        transition: background-color 0.3s;
        display: flex;
        align-items: center;
        gap: 6px;
        justify-content: center;
    }
    
    .btn-action:hover {
        background: #2980b9;
    }
`;

// Inject styles
const styleSheet = document.createElement('style');
styleSheet.textContent = mapStyles;
document.head.appendChild(styleSheet);

// Initialize map when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.mapManager = new MapManager('map');
});