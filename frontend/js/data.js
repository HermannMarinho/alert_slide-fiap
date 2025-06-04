// js/data.js - Simulates backend data based on Java entities

// Simulated data arrays matching the Java backend structure
const alertsData = [
    {
        id: 1,
        timestamp: new Date('2025-06-04T08:30:00'),
        riskLevel: 'ALTO',
        areaName: 'Morro Azul',
        message: 'Níveis críticos de umidade detectados. Risco iminente de deslizamento.'
    },
    {
        id: 2,
        timestamp: new Date('2025-06-04T07:15:00'),
        riskLevel: 'MODERADO',
        areaName: 'Vila Nova',
        message: 'Monitoramento contínuo necessário devido ao aumento da pressão atmosférica.'
    },
    {
        id: 3,
        timestamp: new Date('2025-06-04T06:45:00'),
        riskLevel: 'BAIXO',
        areaName: 'Centro',
        message: 'Condições estáveis. Sensores operando normalmente.'
    },
    {
        id: 4,
        timestamp: new Date('2025-06-03T23:20:00'),
        riskLevel: 'ALTO',
        areaName: 'Encosta Verde',
        message: 'Inclinação do terreno alterada. Evacuação preventiva recomendada.'
    },
    {
        id: 5,
        timestamp: new Date('2025-06-03T20:10:00'),
        riskLevel: 'MODERADO',
        areaName: 'Bairro Alto',
        message: 'Chuvas intensas detectadas. Atenção redobrada necessária.'
    }
];

const sensorsData = [
    {
        id: 1,
        nome: 'Sensor Umidade MA-01',
        type: 'umidade',
        currentValue: 87.5,
        riskAreaId: 1,
        status: 'critical'
    },
    {
        id: 2,
        nome: 'Sensor Pressão MA-02',
        type: 'pressão',
        currentValue: 945.2,
        riskAreaId: 1,
        status: 'warning'
    },
    {
        id: 3,
        nome: 'Sensor Inclinação MA-03',
        type: 'inclinação',
        currentValue: 48.7,
        riskAreaId: 1,
        status: 'critical'
    },
    {
        id: 4,
        nome: 'Sensor Umidade VN-01',
        type: 'umidade',
        currentValue: 65.3,
        riskAreaId: 2,
        status: 'normal'
    },
    {
        id: 5,
        nome: 'Sensor Pressão CT-01',
        type: 'pressão',
        currentValue: 1013.2,
        riskAreaId: 3,
        status: 'normal'
    },
    {
        id: 6,
        nome: 'Sensor Inclinação EV-01',
        type: 'inclinação',
        currentValue: 52.1,
        riskAreaId: 4,
        status: 'critical'
    }
];

const sheltersData = [
    {
        id: 1,
        nome: 'Escola Municipal Santos Dumont',
        location: 'Rua das Flores, 123 - Centro',
        capacity: 150,
        currentOccupancy: 0,
        active: true,
        coordinates: { lat: -20.315, lng: -40.312 }
    },
    {
        id: 2,
        nome: 'Centro Comunitário Vila Nova',
        location: 'Av. Principal, 456 - Vila Nova',
        capacity: 80,
        currentOccupancy: 25,
        active: true,
        coordinates: { lat: -20.325, lng: -40.322 }
    },
    {
        id: 3,
        nome: 'Ginásio Municipal',
        location: 'Rua do Esporte, 789 - Bairro Alto',
        capacity: 300,
        currentOccupancy: 300,
        active: true,
        coordinates: { lat: -20.305, lng: -40.332 }
    },
    {
        id: 4,
        nome: 'Igreja São José',
        location: 'Praça Central, s/n - Centro',
        capacity: 100,
        currentOccupancy: 0,
        active: false,
        coordinates: { lat: -20.318, lng: -40.315 }
    }
];

const riskAreasData = [
    {
        id: 1,
        nome: 'Morro Azul',
        coordinates: { lat: -20.320, lng: -40.318 },
        riskLevel: 'ALTO',
        sensors: [1, 2, 3]
    },
    {
        id: 2,
        nome: 'Vila Nova',
        coordinates: { lat: -20.325, lng: -40.322 },
        riskLevel: 'MODERADO',
        sensors: [4]
    },
    {
        id: 3,
        nome: 'Centro',
        coordinates: { lat: -20.315, lng: -40.312 },
        riskLevel: 'BAIXO',
        sensors: [5]
    },
    {
        id: 4,
        nome: 'Encosta Verde',
        coordinates: { lat: -20.308, lng: -40.328 },
        riskLevel: 'ALTO',
        sensors: [6]
    },
    {
        id: 5,
        nome: 'Bairro Alto',
        coordinates: { lat: -20.305, lng: -40.332 },
        riskLevel: 'MODERADO',
        sensors: []
    }
];

const emergencyTeamsData = [
    {
        id: 1,
        nome: 'Equipe Alpha',
        role: 'Bombeiros',
        available: true,
        location: 'Quartel Central'
    },
    {
        id: 2,
        nome: 'Equipe Beta',
        role: 'Defesa Civil',
        available: true,
        location: 'Base Vila Nova'
    },
    {
        id: 3,
        nome: 'Equipe Gamma',
        role: 'Resgate',
        available: false,
        location: 'Em atendimento - Morro Azul'
    },
    {
        id: 4,
        nome: 'Equipe Delta',
        role: 'Medicina',
        available: true,
        location: 'Hospital Municipal'
    }
];

const usersData = [
    {
        id: 1,
        nome: 'João Silva',
        cpf: '123.456.789-00',
        phone: '(27) 99999-0001',
        address: 'Rua A, 123 - Morro Azul'
    },
    {
        id: 2,
        nome: 'Maria Santos',
        cpf: '234.567.890-11',
        phone: '(27) 99999-0002',
        address: 'Rua B, 456 - Vila Nova'
    },
    {
        id: 3,
        nome: 'Pedro Oliveira',
        cpf: '345.678.901-22',
        phone: '(27) 99999-0003',
        address: 'Rua C, 789 - Centro'
    }
];

// Utility functions for data manipulation
class DataService {
    // Risk Analysis Service simulation
    static calculateRiskLevel(humidity, pressure, inclination) {
        let score = 0;
        
        if (humidity > 80) score += 1;
        if (pressure < 950) score += 1;
        if (inclination > 45) score += 2;
        
        if (score >= 3) return 'ALTO';
        else if (score === 2) return 'MODERADO';
        else return 'BAIXO';
    }
    
    // Sensor Service simulation
    static generateSensorReading() {
        return {
            humidity: 30 + (Math.random() * 70), // 30% to 100%
            pressure: 800 + (Math.random() * 300), // 800 hPa to 1100 hPa
            inclination: Math.random() * 90 // 0° to 90°
        };
    }
    
    // Update sensor values with realistic simulation
    static updateSensorValues() {
        sensorsData.forEach(sensor => {
            switch (sensor.type) {
                case 'umidade':
                    // Simulate humidity changes
                    const humidityChange = (Math.random() - 0.5) * 10;
                    sensor.currentValue = Math.max(0, Math.min(100, sensor.currentValue + humidityChange));
                    
                    if (sensor.currentValue > 80) sensor.status = 'critical';
                    else if (sensor.currentValue > 60) sensor.status = 'warning';
                    else sensor.status = 'normal';
                    break;
                    
                case 'pressão':
                    // Simulate pressure changes
                    const pressureChange = (Math.random() - 0.5) * 20;
                    sensor.currentValue = Math.max(800, Math.min(1100, sensor.currentValue + pressureChange));
                    
                    if (sensor.currentValue < 950) sensor.status = 'critical';
                    else if (sensor.currentValue < 980) sensor.status = 'warning';
                    else sensor.status = 'normal';
                    break;
                    
                case 'inclinação':
                    // Simulate inclination changes
                    const inclinationChange = (Math.random() - 0.5) * 5;
                    sensor.currentValue = Math.max(0, Math.min(90, sensor.currentValue + inclinationChange));
                    
                    if (sensor.currentValue > 45) sensor.status = 'critical';
                    else if (sensor.currentValue > 30) sensor.status = 'warning';
                    else sensor.status = 'normal';
                    break;
            }
        });
    }
    
    // Update risk areas based on sensor data
    static updateRiskAreas() {
        riskAreasData.forEach(area => {
            const areaSensors = sensorsData.filter(sensor => area.sensors.includes(sensor.id));
            
            if (areaSensors.length === 0) {
                area.riskLevel = 'BAIXO';
                return;
            }
            
            const criticalSensors = areaSensors.filter(sensor => sensor.status === 'critical').length;
            const warningSensors = areaSensors.filter(sensor => sensor.status === 'warning').length;
            
            if (criticalSensors > 0) {
                area.riskLevel = 'ALTO';
            } else if (warningSensors > 0) {
                area.riskLevel = 'MODERADO';
            } else {
                area.riskLevel = 'BAIXO';
            }
        });
    }
    
    // Generate new alert based on current conditions
    static generateAlert(areaName, riskLevel) {
        const messages = {
            'ALTO': [
                'Níveis críticos detectados. Risco iminente de deslizamento.',
                'Evacuação preventiva recomendada imediatamente.',
                'Condições extremamente perigosas identificadas.'
            ],
            'MODERADO': [
                'Monitoramento contínuo necessário.',
                'Atenção redobrada devido às condições climáticas.',
                'Níveis de alerta elevados detectados.'
            ],
            'BAIXO': [
                'Condições estáveis. Sensores operando normalmente.',
                'Situação sob controle.',
                'Níveis dentro dos parâmetros normais.'
            ]
        };
        
        const messageArray = messages[riskLevel] || messages['BAIXO'];
        const randomMessage = messageArray[Math.floor(Math.random() * messageArray.length)];
        
        const newAlert = {
            id: alertsData.length + 1,
            timestamp: new Date(),
            riskLevel: riskLevel,
            areaName: areaName,
            message: randomMessage
        };
        
        alertsData.unshift(newAlert); // Add to beginning of array
        
        // Keep only last 20 alerts
        if (alertsData.length > 20) {
            alertsData.splice(20);
        }
        
        return newAlert;
    }
    
    // Get shelter status
    static getShelterStatus(shelter) {
        if (!shelter.active) return 'inactive';
        if (shelter.currentOccupancy >= shelter.capacity) return 'full';
        return 'active';
    }
    
    // Find nearest shelter to coordinates
    static findNearestShelter(lat, lng) {
        let nearestShelter = null;
        let minDistance = Infinity;
        
        sheltersData.forEach(shelter => {
            if (shelter.active && shelter.currentOccupancy < shelter.capacity) {
                const distance = this.calculateDistance(lat, lng, shelter.coordinates.lat, shelter.coordinates.lng);
                if (distance < minDistance) {
                    minDistance = distance;
                    nearestShelter = shelter;
                }
            }
        });
        
        return nearestShelter;
    }
    
    // Calculate distance between two coordinates (Haversine formula)
    static calculateDistance(lat1, lng1, lat2, lng2) {
        const R = 6371; // Earth's radius in km
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLng = (lng2 - lng1) * Math.PI / 180;
        const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
                Math.sin(dLng/2) * Math.sin(dLng/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        return R * c;
    }
    
    // Format timestamp for display
    static formatTimestamp(timestamp) {
        const now = new Date();
        const diff = now - timestamp;
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);
        
        if (minutes < 1) return 'Agora mesmo';
        if (minutes < 60) return `${minutes} min atrás`;
        if (hours < 24) return `${hours}h atrás`;
        return `${days} dia(s) atrás`;
    }
    
    // Get recent alerts (last 5)
    static getRecentAlerts() {
        return alertsData.slice(0, 5);
    }
    
    // Get all alerts with filters
    static getAlerts(filters = {}) {
        let filtered = [...alertsData];
        
        if (filters.riskLevel) {
            filtered = filtered.filter(alert => alert.riskLevel === filters.riskLevel);
        }
        
        if (filters.areaName) {
            filtered = filtered.filter(alert => 
                alert.areaName.toLowerCase().includes(filters.areaName.toLowerCase())
            );
        }
        
        if (filters.dateFrom) {
            filtered = filtered.filter(alert => alert.timestamp >= filters.dateFrom);
        }
        
        if (filters.dateTo) {
            filtered = filtered.filter(alert => alert.timestamp <= filters.dateTo);
        }
        
        return filtered;
    }
    
    // Get statistics for dashboard
    static getStatistics() {
        const safeAreas = riskAreasData.filter(area => area.riskLevel === 'BAIXO').length;
        const moderateAreas = riskAreasData.filter(area => area.riskLevel === 'MODERADO').length;
        const highRiskAreas = riskAreasData.filter(area => area.riskLevel === 'ALTO').length;
        
        const activeShelters = sheltersData.filter(shelter => shelter.active).length;
        const availableShelters = sheltersData.filter(shelter => 
            shelter.active && shelter.currentOccupancy < shelter.capacity
        ).length;
        
        const activeSensors = sensorsData.filter(sensor => sensor.status !== 'offline').length;
        const criticalSensors = sensorsData.filter(sensor => sensor.status === 'critical').length;
        
        return {
            areas: {
                safe: safeAreas,
                moderate: moderateAreas,
                high: highRiskAreas,
                total: riskAreasData.length
            },
            shelters: {
                active: activeShelters,
                available: availableShelters,
                total: sheltersData.length
            },
            sensors: {
                active: activeSensors,
                critical: criticalSensors,
                total: sensorsData.length
            },
            alerts: {
                total: alertsData.length,
                recent: alertsData.filter(alert => {
                    const hourAgo = new Date(Date.now() - 3600000);
                    return alert.timestamp > hourAgo;
                }).length
            }
        };
    }
    
    // Simulate real-time updates
    static startSimulation() {
        setInterval(() => {
            this.updateSensorValues();
            this.updateRiskAreas();
            
            // Randomly generate new alerts (10% chance every update)
            if (Math.random() < 0.1) {
                const randomArea = riskAreasData[Math.floor(Math.random() * riskAreasData.length)];
                this.generateAlert(randomArea.nome, randomArea.riskLevel);
            }
        }, 5000); // Update every 5 seconds
    }
}

// Offline storage support
class OfflineStorage {
    static save(key, data) {
        try {
            const serialized = JSON.stringify(data);
            localStorage.setItem(`alertslide_${key}`, serialized);
        } catch (error) {
            console.warn('Could not save to localStorage:', error);
        }
    }
    
    static load(key, defaultValue = null) {
        try {
            const serialized = localStorage.getItem(`alertslide_${key}`);
            return serialized ? JSON.parse(serialized) : defaultValue;
        } catch (error) {
            console.warn('Could not load from localStorage:', error);
            return defaultValue;
        }
    }
    
    static remove(key) {
        try {
            localStorage.removeItem(`alertslide_${key}`);
        } catch (error) {
            console.warn('Could not remove from localStorage:', error);
        }
    }
    
    static saveAllData() {
        this.save('alerts', alertsData);
        this.save('sensors', sensorsData);
        this.save('shelters', sheltersData);
        this.save('riskAreas', riskAreasData);
        this.save('emergencyTeams', emergencyTeamsData);
        this.save('users', usersData);
    }
    
    static loadAllData() {
        const savedAlerts = this.load('alerts');
        const savedSensors = this.load('sensors');
        const savedShelters = this.load('shelters');
        const savedRiskAreas = this.load('riskAreas');
        const savedEmergencyTeams = this.load('emergencyTeams');
        const savedUsers = this.load('users');
        
        if (savedAlerts) alertsData.splice(0, alertsData.length, ...savedAlerts);
        if (savedSensors) sensorsData.splice(0, sensorsData.length, ...savedSensors);
        if (savedShelters) sheltersData.splice(0, sheltersData.length, ...savedShelters);
        if (savedRiskAreas) riskAreasData.splice(0, riskAreasData.length, ...savedRiskAreas);
        if (savedEmergencyTeams) emergencyTeamsData.splice(0, emergencyTeamsData.length, ...savedEmergencyTeams);
        if (savedUsers) usersData.splice(0, usersData.length, ...savedUsers);
    }
}

// Export data and services for use in other modules
window.AlertSlideData = {
    alerts: alertsData,
    sensors: sensorsData,
    shelters: sheltersData,
    riskAreas: riskAreasData,
    emergencyTeams: emergencyTeamsData,
    users: usersData,
    DataService,
    OfflineStorage
};