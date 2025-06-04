// js/notifications.js - Notification system for push notifications and alerts

class NotificationManager {
    constructor() {
        this.container = null;
        this.notifications = [];
        this.maxNotifications = 5;
        this.defaultDuration = 5000;
        this.init();
    }
    
    init() {
        this.createContainer();
        this.requestPermission();
        this.setupServiceWorker();
    }
    
    createContainer() {
        this.container = document.getElementById('notificationContainer');
        if (!this.container) {
            this.container = document.createElement('div');
            this.container.id = 'notificationContainer';
            this.container.className = 'notification-container';
            document.body.appendChild(this.container);
        }
    }
    
    async requestPermission() {
        if ('Notification' in window && Notification.permission === 'default') {
            try {
                const permission = await Notification.requestPermission();
                if (permission === 'granted') {
                    this.show({
                        type: 'success',
                        title: 'Notificações Ativadas',
                        message: 'Você receberá alertas em tempo real sobre emergências.'
                    });
                }
            } catch (error) {
                console.warn('Error requesting notification permission:', error);
            }
        }
    }
    
    setupServiceWorker() {
        // Register service worker for background notifications
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('/sw.js').then(registration => {
                console.log('Service Worker registered:', registration);
            }).catch(error => {
                console.warn('Service Worker registration failed:', error);
            });
        }
    }
    
    show(options = {}) {
        const notification = this.createNotification(options);
        this.addNotification(notification);
        
        // Also show browser notification for important alerts
        if (options.type === 'error' || options.priority === 'high') {
            this.showBrowserNotification(options);
        }
        
        return notification;
    }
    
    createNotification(options) {
        const {
            type = 'info',
            title = 'Notificação',
            message = '',
            duration = this.defaultDuration,
            persistent = false,
            actions = []
        } = options;
        
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.setAttribute('data-type', type);
        
        const timestamp = new Date().toLocaleTimeString('pt-BR', {
            hour: '2-digit',
            minute: '2-digit'
        });
        
        notification.innerHTML = `
            <div class="notification-header">
                <div class="notification-icon">${this.getIcon(type)}</div>
                <div class="notification-title">${title}</div>
                <div class="notification-time">${timestamp}</div>
                <button class="notification-close" onclick="notificationManager.remove(this.closest('.notification'))">
                    ×
                </button>
            </div>
            <div class="notification-message">${message}</div>
            ${actions.length > 0 ? `
                <div class="notification-actions">
                    ${actions.map(action => `
                        <button class="notification-action" onclick="${action.callback}">
                            ${action.label}
                        </button>
                    `).join('')}
                </div>
            ` : ''}
        `;
        
        // Auto-remove notification if not persistent
        if (!persistent && duration > 0) {
            setTimeout(() => {
                this.remove(notification);
            }, duration);
        }
        
        // Add progress bar for timed notifications
        if (!persistent && duration > 0) {
            this.addProgressBar(notification, duration);
        }
        
        return notification;
    }
    
    addProgressBar(notification, duration) {
        const progressBar = document.createElement('div');
        progressBar.className = 'notification-progress';
        progressBar.style.cssText = `
            position: absolute;
            bottom: 0;
            left: 0;
            height: 3px;
            background: linear-gradient(90deg, #3498db, #2980b9);
            width: 100%;
            animation: progressShrink ${duration}ms linear;
        `;
        
        notification.style.position = 'relative';
        notification.appendChild(progressBar);
    }
    
    getIcon(type) {
        const icons = {
            success: '✅',
            error: '🚨',
            warning: '⚠️',
            info: 'ℹ️',
            emergency: '🆘'
        };
        return icons[type] || icons.info;
    }
    
    addNotification(notification) {
        this.notifications.unshift(notification);
        this.container.appendChild(notification);
        
        // Remove oldest notifications if exceeding max
        while (this.notifications.length > this.maxNotifications) {
            const oldest = this.notifications.pop();
            this.remove(oldest, false);
        }
        
        // Add entrance animation
        requestAnimationFrame(() => {
            notification.style.animation = 'slideInRight 0.3s ease-out';
        });
    }
    
    remove(notification, fromArray = true) {
        if (!notification || !notification.parentNode) return;
        
        // Add exit animation
        notification.style.animation = 'slideOutRight 0.3s ease-in';
        
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
            
            if (fromArray) {
                const index = this.notifications.indexOf(notification);
                if (index > -1) {
                    this.notifications.splice(index, 1);
                }
            }
        }, 300);
    }
    
    showBrowserNotification(options) {
        if ('Notification' in window && Notification.permission === 'granted') {
            const browserNotification = new Notification(options.title, {
                body: options.message,
                icon: '/icons/alert-icon.png',
                badge: '/icons/badge-icon.png',
                tag: options.type,
                requireInteraction: options.type === 'error',
                actions: options.actions ? options.actions.map(action => ({
                    action: action.callback,
                    title: action.label
                })) : []
            });
            
            browserNotification.onclick = () => {
                window.focus();
                browserNotification.close();
            };
            
            // Auto-close after 10 seconds for non-error notifications
            if (options.type !== 'error') {
                setTimeout(() => {
                    browserNotification.close();
                }, 10000);
            }
        }
    }
    
    clear() {
        this.notifications.forEach(notification => {
            this.remove(notification, false);
        });
        this.notifications = [];
    }
    
    // Predefined notification types for common scenarios
    showAlert(riskLevel, areaName, message) {
        const types = {
            'ALTO': 'error',
            'MODERADO': 'warning',
            'BAIXO': 'info'
        };
        
        const titles = {
            'ALTO': '🚨 ALERTA CRÍTICO',
            'MODERADO': '⚠️ ALERTA MODERADO',
            'BAIXO': '✅ SITUAÇÃO ESTÁVEL'
        };
        
        this.show({
            type: types[riskLevel] || 'info',
            title: titles[riskLevel] || 'Alerta',
            message: `${areaName}: ${message}`,
            duration: riskLevel === 'ALTO' ? 0 : 7000, // High risk alerts stay until manually closed
            persistent: riskLevel === 'ALTO',
            priority: riskLevel === 'ALTO' ? 'high' : 'normal',
            actions: riskLevel === 'ALTO' ? [
                {
                    label: 'Ver Detalhes',
                    callback: `window.mapManager.centerOnArea('${areaName}')`
                },
                {
                    label: 'Buscar Abrigo',
                    callback: `window.mapManager.showNearestShelter('${areaName}')`
                }
            ] : []
        });
    }
    
    showEvacuationAlert(areaName) {
        this.show({
            type: 'emergency',
            title: '🆘 EVACUAÇÃO IMEDIATA',
            message: `Evacuação iniciada em ${areaName}. Dirija-se ao abrigo mais próximo imediatamente.`,
            persistent: true,
            priority: 'high',
            actions: [
                {
                    label: 'Encontrar Abrigo',
                    callback: `window.mapManager.showNearestShelter('${areaName}')`
                },
                {
                    label: 'Chamar Emergência',
                    callback: 'window.open("tel:193")'
                }
            ]
        });
    }
    
    showSensorAlert(sensorName, value, type) {
        const units = {
            'umidade': '%',
            'pressão': ' hPa',
            'inclinação': '°'
        };
        
        this.show({
            type: 'warning',
            title: '📡 Alerta de Sensor',
            message: `${sensorName}: ${value}${units[type] || ''} - Valores anômalos detectados`,
            duration: 6000
        });
    }
    
    showShelterUpdate(shelterName, status) {
        const messages = {
            'full': `${shelterName} atingiu capacidade máxima`,
            'available': `${shelterName} tem vagas disponíveis`,
            'emergency': `${shelterName} ativado para emergência`
        };
        
        const types = {
            'full': 'warning',
            'available': 'success',
            'emergency': 'info'
        };
        
        this.show({
            type: types[status] || 'info',
            title: '🏠 Atualização de Abrigo',
            message: messages[status] || `Atualização do ${shelterName}`,
            duration: 5000
        });
    }
    
    showSystemStatus(message, type = 'info') {
        this.show({
            type: type,
            title: '⚙️ Sistema AlertSlide',
            message: message,
            duration: 4000
        });
    }
    
    showEmergencyReport(success = true) {
        this.show({
            type: success ? 'success' : 'error',
            title: success ? '✅ Relatório Enviado' : '❌ Erro no Envio',
            message: success 
                ? 'Seu relatório de emergência foi enviado com sucesso. As autoridades foram notificadas.'
                : 'Erro ao enviar relatório. Tente novamente ou ligue para 193.',
            duration: success ? 6000 : 8000,
            actions: !success ? [
                {
                    label: 'Tentar Novamente',
                    callback: 'document.getElementById("emergencyBtn").click()'
                },
                {
                    label: 'Ligar 193',
                    callback: 'window.open("tel:193")'
                }
            ] : []
        });
    }
    
    // Push notification simulation
    simulatePushNotifications() {
        const scenarios = [
            {
                delay: 10000,
                notification: {
                    type: 'warning',
                    title: '⚠️ Chuvas Intensas',
                    message: 'Chuvas intensas previstas para as próximas 2 horas. Mantenha-se em local seguro.'
                }
            },
            {
                delay: 30000,
                notification: {
                    type: 'info',
                    title: '📡 Atualização de Sensores',
                    message: 'Todos os sensores foram atualizados e estão funcionando normalmente.'
                }
            },
            {
                delay: 60000,
                notification: {
                    type: 'success',
                    title: '🚑 Equipe Disponível',
                    message: 'Nova equipe de emergência está disponível na região central.'
                }
            }
        ];
        
        scenarios.forEach(scenario => {
            setTimeout(() => {
                this.show(scenario.notification);
            }, scenario.delay);
        });
    }
    
    // Real-time notification based on data changes
    setupDataListeners() {
        // Listen for custom events from data service
        window.addEventListener('alertGenerated', (event) => {
            const alert = event.detail;
            this.showAlert(alert.riskLevel, alert.areaName, alert.message);
        });
        
        window.addEventListener('sensorCritical', (event) => {
            const sensor = event.detail;
            this.showSensorAlert(sensor.nome, sensor.currentValue, sensor.type);
        });
        
        window.addEventListener('shelterStatusChanged', (event) => {
            const { shelter, status } = event.detail;
            this.showShelterUpdate(shelter.nome, status);
        });
        
        window.addEventListener('evacuationTriggered', (event) => {
            const areaName = event.detail.areaName;
            this.showEvacuationAlert(areaName);
        });
    }
    
    // Notification sound management
    playNotificationSound(type) {
        if (!this.soundEnabled) return;
        
        try {
            const audio = new Audio();
            const sounds = {
                'error': '/sounds/emergency-alert.mp3',
                'warning': '/sounds/warning.mp3',
                'success': '/sounds/success.mp3',
                'info': '/sounds/notification.mp3'
            };
            
            audio.src = sounds[type] || sounds.info;
            audio.volume = 0.5;
            audio.play().catch(e => console.warn('Could not play notification sound:', e));
        } catch (error) {
            console.warn('Error playing notification sound:', error);
        }
    }
    
    // Settings management
    updateSettings(settings) {
        this.soundEnabled = settings.soundEnabled !== false;
        this.maxNotifications = settings.maxNotifications || 5;
        this.defaultDuration = settings.defaultDuration || 5000;
        
        // Save to localStorage for persistence
        try {
            localStorage.setItem('alertslide_notification_settings', JSON.stringify(settings));
        } catch (error) {
            console.warn('Could not save notification settings:', error);
        }
    }
    
    loadSettings() {
        try {
            const saved = localStorage.getItem('alertslide_notification_settings');
            if (saved) {
                const settings = JSON.parse(saved);
                this.updateSettings(settings);
            }
        } catch (error) {
            console.warn('Could not load notification settings:', error);
        }
    }
    
    // Batch notifications for multiple events
    showBatch(notifications) {
        notifications.forEach((notification, index) => {
            setTimeout(() => {
                this.show(notification);
            }, index * 500); // Stagger notifications by 500ms
        });
    }
    
    // Emergency broadcast
    broadcastEmergency(areaName, message) {
        // Clear all existing notifications
        this.clear();
        
        // Show critical emergency notification
        this.show({
            type: 'emergency',
            title: '🆘 EMERGÊNCIA CRÍTICA',
            message: `${areaName}: ${message}`,
            persistent: true,
            priority: 'high',
            actions: [
                {
                    label: 'Evacuar Agora',
                    callback: `window.mapManager.showNearestShelter('${areaName}')`
                },
                {
                    label: 'Ligar 193',
                    callback: 'window.open("tel:193")'
                },
                {
                    label: 'Ver Mapa',
                    callback: `window.mapManager.centerOnArea('${areaName}')`
                }
            ]
        });
        
        // Also trigger browser notification
        this.showBrowserNotification({
            type: 'emergency',
            title: '🆘 EMERGÊNCIA CRÍTICA',
            message: `${areaName}: ${message}`,
            priority: 'high'
        });
        
        // Flash the page to get attention
        this.flashPage();
    }
    
    flashPage() {
        const overlay = document.createElement('div');
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(231, 76, 60, 0.1);
            z-index: 9999;
            pointer-events: none;
            animation: flash 0.5s ease-in-out 3;
        `;
        
        document.body.appendChild(overlay);
        
        setTimeout(() => {
            if (overlay.parentNode) {
                overlay.parentNode.removeChild(overlay);
            }
        }, 1500);
    }
    
    // Get notification history for debugging
    getHistory() {
        return this.notifications.map(notification => ({
            type: notification.getAttribute('data-type'),
            title: notification.querySelector('.notification-title').textContent,
            message: notification.querySelector('.notification-message').textContent,
            time: notification.querySelector('.notification-time').textContent
        }));
    }
}

// CSS animations and styles for notifications
const notificationStyles = `
    @keyframes slideInRight {
        from {
            opacity: 0;
            transform: translateX(100%);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
    
    @keyframes slideOutRight {
        from {
            opacity: 1;
            transform: translateX(0);
        }
        to {
            opacity: 0;
            transform: translateX(100%);
        }
    }
    
    @keyframes progressShrink {
        from { width: 100%; }
        to { width: 0%; }
    }
    
    @keyframes flash {
        0%, 100% { opacity: 0; }
        50% { opacity: 1; }
    }
    
    .notification {
        margin-bottom: 12px;
        border-radius: 12px;
        overflow: hidden;
        box-shadow: 0 8px 25px rgba(0,0,0,0.15);
        backdrop-filter: blur(10px);
        border: 1px solid rgba(255,255,255,0.2);
        font-family: inherit;
        transition: transform 0.2s ease;
        max-width: 400px;
    }
    
    .notification:hover {
        transform: translateX(-5px);
    }
    
    .notification-header {
        display: flex;
        align-items: center;
        padding: 12px 15px 8px 15px;
        background: rgba(255,255,255,0.95);
        gap: 10px;
    }
    
    .notification-icon {
        font-size: 18px;
        flex-shrink: 0;
    }
    
    .notification-title {
        font-weight: 600;
        color: #2c3e50;
        flex-grow: 1;
        font-size: 14px;
    }
    
    .notification-time {
        font-size: 11px;
        color: #7f8c8d;
        flex-shrink: 0;
    }
    
    .notification-close {
        background: none;
        border: none;
        font-size: 18px;
        cursor: pointer;
        color: #7f8c8d;
        padding: 0;
        width: 20px;
        height: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        transition: background-color 0.2s;
        flex-shrink: 0;
    }
    
    .notification-close:hover {
        background-color: rgba(0,0,0,0.1);
    }
    
    .notification-message {
        padding: 0 15px 12px 15px;
        color: #5a6c7d;
        font-size: 13px;
        line-height: 1.4;
        background: rgba(255,255,255,0.95);
    }
    
    .notification-actions {
        padding: 8px 15px 12px 15px;
        display: flex;
        gap: 8px;
        background: rgba(255,255,255,0.95);
        border-top: 1px solid rgba(0,0,0,0.05);
    }
    
    .notification-action {
        background: #3498db;
        color: white;
        border: none;
        padding: 6px 12px;
        border-radius: 6px;
        font-size: 12px;
        cursor: pointer;
        transition: background-color 0.2s;
        flex: 1;
    }
    
    .notification-action:hover {
        background: #2980b9;
    }
    
    .notification-progress {
        background: linear-gradient(90deg, #3498db, #2980b9) !important;
    }
    
    /* Type-specific styles */
    .notification.success .notification-header {
        background: linear-gradient(135deg, #27ae60, #2ecc71);
        color: white;
    }
    
    .notification.success .notification-title,
    .notification.success .notification-time,
    .notification.success .notification-close {
        color: white;
    }
    
    .notification.error .notification-header,
    .notification.emergency .notification-header {
        background: linear-gradient(135deg, #e74c3c, #c0392b);
        color: white;
        animation: pulse 2s infinite;
    }
    
    .notification.error .notification-title,
    .notification.error .notification-time,
    .notification.error .notification-close,
    .notification.emergency .notification-title,
    .notification.emergency .notification-time,
    .notification.emergency .notification-close {
        color: white;
    }
    
    .notification.warning .notification-header {
        background: linear-gradient(135deg, #f39c12, #e67e22);
        color: white;
    }
    
    .notification.warning .notification-title,
    .notification.warning .notification-time,
    .notification.warning .notification-close {
        color: white;
    }
    
    .notification.info .notification-header {
        background: linear-gradient(135deg, #3498db, #2980b9);
        color: white;
    }
    
    .notification.info .notification-title,
    .notification.info .notification-time,
    .notification.info .notification-close {
        color: white;
    }
`;

// Inject notification styles
const notificationStyleSheet = document.createElement('style');
notificationStyleSheet.textContent = notificationStyles;
document.head.appendChild(notificationStyleSheet);

// Initialize notification manager
document.addEventListener('DOMContentLoaded', () => {
    window.notificationManager = new NotificationManager();
    window.notificationManager.loadSettings();
    window.notificationManager.setupDataListeners();
    
    // Show welcome notification
    setTimeout(() => {
        window.notificationManager.showSystemStatus('Sistema AlertSlide iniciado com sucesso', 'success');
    }, 1000);
    
    // Start push notification simulation in demo mode
    if (window.location.search.includes('demo=true')) {
        window.notificationManager.simulatePushNotifications();
    }
});