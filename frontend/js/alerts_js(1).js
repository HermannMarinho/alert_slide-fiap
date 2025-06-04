        if (alertsPerPageSelect) alertsPerPageSelect.value = this.settings.alertsPerPage;
        if (showLowPriorityCheckbox) showLowPriorityCheckbox.checked = this.settings.showLowPriority;
        if (highlightHighCheckbox) highlightHighCheckbox.checked = this.settings.highlightHigh;
        
        this.alertsPerPage = this.settings.alertsPerPage;
    }
    
    setupEventListeners() {
        // View switching
        document.querySelectorAll('.view-btn').forEach(btn => {
            btn.addEventListener('click', () => this.switchView(btn.dataset.view));
        });
        
        // Filter controls
        document.getElementById('applyFilters')?.addEventListener('click', () => this.applyFilters());
        document.getElementById('clearFilters')?.addEventListener('click', () => this.clearFilters());
        
        // Quick actions
        document.getElementById('refreshBtn')?.addEventListener('click', () => this.refreshAlerts());
        document.getElementById('exportBtn')?.addEventListener('click', () => this.exportAlerts());
        document.getElementById('reportBtn')?.addEventListener('click', () => this.showManualReportModal());
        document.getElementById('settingsBtn')?.addEventListener('click', () => this.showSettingsModal());
        
        // Pagination
        document.getElementById('prevPage')?.addEventListener('click', () => this.previousPage());
        document.getElementById('nextPage')?.addEventListener('click', () => this.nextPage());
        
        // Modal controls
        this.setupModalControls();
        
        // Form submissions
        document.getElementById('manualReportForm')?.addEventListener('submit', (e) => this.handleManualReport(e));
        document.getElementById('emergencyForm')?.addEventListener('submit', (e) => this.handleEmergencyReport(e));
        document.getElementById('saveSettings')?.addEventListener('click', () => this.handleSaveSettings());
        
        // Real-time filter changes
        document.getElementById('riskLevelFilter')?.addEventListener('change', () => this.applyFilters());
        document.getElementById('areaFilter')?.addEventListener('change', () => this.applyFilters());
        document.getElementById('dateFromFilter')?.addEventListener('change', () => this.applyFilters());
        document.getElementById('dateToFilter')?.addEventListener('change', () => this.applyFilters());
        
        // Report area selection
        document.getElementById('reportArea')?.addEventListener('change', (e) => {
            const customAreaGroup = document.getElementById('customAreaGroup');
            if (customAreaGroup) {
                customAreaGroup.style.display = e.target.value === 'Outro' ? 'block' : 'none';
            }
        });
        
        // Severity slider
        document.getElementById('reportSeverity')?.addEventListener('input', (e) => {
            const severityValue = document.getElementById('severityValue');
            if (severityValue) {
                severityValue.textContent = e.target.value;
            }
        });
        
        // Emergency button
        document.getElementById('emergencyBtn')?.addEventListener('click', () => this.showEmergencyModal());
        
        // Auto-refresh setting change
        document.getElementById('autoRefresh')?.addEventListener('change', (e) => {
            this.settings.autoRefresh = parseInt(e.target.value);
            this.setupAutoRefresh();
        });
        
        // Alerts per page change
        document.getElementById('alertsPerPage')?.addEventListener('change', (e) => {
            this.settings.alertsPerPage = parseInt(e.target.value);
            this.alertsPerPage = this.settings.alertsPerPage;
            this.currentPage = 1;
            this.renderAlerts();
        });
    }
    
    setupModalControls() {
        // Close buttons
        document.querySelectorAll('.modal .close').forEach(closeBtn => {
            closeBtn.addEventListener('click', () => {
                closeBtn.closest('.modal').style.display = 'none';
            });
        });
        
        // Backdrop clicks
        document.querySelectorAll('.modal').forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    modal.style.display = 'none';
                }
            });
        });
        
        // Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                document.querySelectorAll('.modal').forEach(modal => {
                    modal.style.display = 'none';
                });
            }
        });
    }
    
    setDefaultDateFilters() {
        const today = new Date();
        const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
        
        const dateFromInput = document.getElementById('dateFromFilter');
        const dateToInput = document.getElementById('dateToFilter');
        
        if (dateFromInput) {
            dateFromInput.value = weekAgo.toISOString().split('T')[0];
        }
        if (dateToInput) {
            dateToInput.value = today.toISOString().split('T')[0];
        }
    }
    
    loadAlerts() {
        const { alerts } = window.AlertSlideData;
        this.allAlerts = [...alerts].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        this.applyFilters();
    }
    
    applyFilters() {
        const { DataService } = window.AlertSlideData;
        
        const riskLevel = document.getElementById('riskLevelFilter')?.value;
        const area = document.getElementById('areaFilter')?.value;
        const dateFrom = document.getElementById('dateFromFilter')?.value;
        const dateTo = document.getElementById('dateToFilter')?.value;
        
        const filters = {
            riskLevel: riskLevel || undefined,
            areaName: area || undefined,
            dateFrom: dateFrom ? new Date(dateFrom) : undefined,
            dateTo: dateTo ? new Date(dateTo + 'T23:59:59') : undefined
        };
        
        this.filteredAlerts = DataService.getAlerts(filters);
        
        // Apply priority filter if setting is disabled
        if (!this.settings.showLowPriority) {
            this.filteredAlerts = this.filteredAlerts.filter(alert => alert.riskLevel !== 'BAIXO');
        }
        
        this.currentPage = 1;
        this.renderAlerts();
        this.updatePagination();
    }
    
    clearFilters() {
        document.getElementById('riskLevelFilter').value = '';
        document.getElementById('areaFilter').value = '';
        document.getElementById('dateFromFilter').value = '';
        document.getElementById('dateToFilter').value = '';
        
        this.setDefaultDateFilters();
        this.applyFilters();
    }
    
    switchView(view) {
        this.currentView = view;
        
        // Update active button
        document.querySelectorAll('.view-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.view === view);
        });
        
        this.renderAlerts();
    }
    
    renderAlerts() {
        const container = document.getElementById('alertsList');
        if (!container) return;
        
        const startIndex = (this.currentPage - 1) * this.alertsPerPage;
        const endIndex = startIndex + this.alertsPerPage;
        const alertsToShow = this.filteredAlerts.slice(startIndex, endIndex);
        
        if (alertsToShow.length === 0) {
            container.innerHTML = this.renderEmptyState();
            return;
        }
        
        // Set container class based on view
        container.className = `alerts-${this.currentView}`;
        
        switch (this.currentView) {
            case 'list':
                container.innerHTML = alertsToShow.map(alert => this.renderAlertCard(alert)).join('');
                break;
            case 'grid':
                container.innerHTML = alertsToShow.map(alert => this.renderAlertCard(alert, true)).join('');
                break;
            case 'timeline':
                container.innerHTML = alertsToShow.map(alert => this.renderTimelineItem(alert)).join('');
                break;
        }
        
        // Add click handlers
        this.addAlertClickHandlers();
    }
    
    renderAlertCard(alert, isGrid = false) {
        const { DataService } = window.AlertSlideData;
        const timeAgo = DataService.formatTimestamp(new Date(alert.timestamp));
        const riskClass = alert.riskLevel.toLowerCase();
        const isHighPriority = alert.riskLevel === 'ALTO' && this.settings.highlightHigh;
        
        return `
            <div class="alert-card ${riskClass} ${isHighPriority ? 'high-priority' : ''}" data-alert-id="${alert.id}">
                <div class="alert-header">
                    <div class="alert-info">
                        <div class="alert-title">
                            ${this.getRiskIcon(alert.riskLevel)}
                            Alerta #${alert.id}
                        </div>
                        <div class="alert-area">${alert.areaName}</div>
                        <div class="alert-timestamp">${timeAgo}</div>
                    </div>
                    <div class="alert-risk-badge ${riskClass}">${alert.riskLevel}</div>
                </div>
                <div class="alert-message">${alert.message}</div>
                ${!isGrid ? `
                    <div class="alert-actions">
                        <button class="alert-action-btn" onclick="alertsManager.viewAlertDetails(${alert.id})">
                            <i class="fas fa-eye"></i> Detalhes
                        </button>
                        <button class="alert-action-btn" onclick="alertsManager.viewOnMap('${alert.areaName}')">
                            <i class="fas fa-map-marker-alt"></i> Ver no Mapa
                        </button>
                        <button class="alert-action-btn" onclick="alertsManager.shareAlert(${alert.id})">
                            <i class="fas fa-share"></i> Compartilhar
                        </button>
                    </div>
                ` : ''}
            </div>
        `;
    }
    
    renderTimelineItem(alert) {
        const { DataService } = window.AlertSlideData;
        const timeAgo = DataService.formatTimestamp(new Date(alert.timestamp));
        const riskClass = alert.riskLevel.toLowerCase();
        
        return `
            <div class="timeline-item ${riskClass}" data-alert-id="${alert.id}">
                <div class="alert-card ${riskClass}">
                    <div class="alert-header">
                        <div class="alert-info">
                            <div class="alert-title">
                                ${this.getRiskIcon(alert.riskLevel)}
                                ${alert.areaName} - Alerta #${alert.id}
                            </div>
                            <div class="alert-timestamp">${new Date(alert.timestamp).toLocaleString('pt-BR')}</div>
                        </div>
                        <div class="alert-risk-badge ${riskClass}">${alert.riskLevel}</div>
                    </div>
                    <div class="alert-message">${alert.message}</div>
                </div>
            </div>
        `;
    }
    
    renderEmptyState() {
        return `
            <div class="empty-state">
                <i class="fas fa-bell-slash"></i>
                <h3>Nenhum alerta encontrado</h3>
                <p>Não há alertas que correspondam aos filtros selecionados.</p>
                <button class="btn-filter" onclick="alertsManager.clearFilters()">
                    <i class="fas fa-refresh"></i> Limpar Filtros
                </button>
            </div>
        `;
    }
    
    getRiskIcon(riskLevel) {
        const icons = {
            'ALTO': '<i class="fas fa-exclamation-triangle" style="color: #e74c3c;"></i>',
            'MODERADO': '<i class="fas fa-exclamation-circle" style="color: #f39c12;"></i>',
            'BAIXO': '<i class="fas fa-info-circle" style="color: #27ae60;"></i>'
        };
        return icons[riskLevel] || icons['BAIXO'];
    }
    
    addAlertClickHandlers() {
        document.querySelectorAll('.alert-card').forEach(card => {
            card.addEventListener('click', (e) => {
                // Don't trigger if clicking on action buttons
                if (e.target.closest('.alert-action-btn')) return;
                
                const alertId = parseInt(card.dataset.alertId);
                this.viewAlertDetails(alertId);
            });
        });
    }
    
    updatePagination() {
        const totalPages = Math.ceil(this.filteredAlerts.length / this.alertsPerPage);
        const prevBtn = document.getElementById('prevPage');
        const nextBtn = document.getElementById('nextPage');
        const pageInfo = document.getElementById('pageInfo');
        
        if (prevBtn) {
            prevBtn.disabled = this.currentPage <= 1;
        }
        
        if (nextBtn) {
            nextBtn.disabled = this.currentPage >= totalPages;
        }
        
        if (pageInfo) {
            pageInfo.textContent = `Página ${this.currentPage} de ${totalPages || 1}`;
        }
    }
    
    previousPage() {
        if (this.currentPage > 1) {
            this.currentPage--;
            this.renderAlerts();
            this.updatePagination();
        }
    }
    
    nextPage() {
        const totalPages = Math.ceil(this.filteredAlerts.length / this.alertsPerPage);
        if (this.currentPage < totalPages) {
            this.currentPage++;
            this.renderAlerts();
            this.updatePagination();
        }
    }
    
    updateStatistics() {
        const { DataService } = window.AlertSlideData;
        const stats = DataService.getStatistics();
        
        const totalAlertsElement = document.getElementById('totalAlerts');
        const activeAlertsElement = document.getElementById('activeAlerts');
        const highRiskAlertsElement = document.getElementById('highRiskAlerts');
        
        if (totalAlertsElement) {
            this.animateCounter(totalAlertsElement, this.allAlerts.length);
        }
        
        if (activeAlertsElement) {
            const activeAlerts = this.allAlerts.filter(alert => {
                const hourAgo = new Date(Date.now() - 3600000);
                return new Date(alert.timestamp) > hourAgo;
            }).length;
            this.animateCounter(activeAlertsElement, activeAlerts);
        }
        
        if (highRiskAlertsElement) {
            const highRiskAlerts = this.allAlerts.filter(alert => alert.riskLevel === 'ALTO').length;
            this.animateCounter(highRiskAlertsElement, highRiskAlerts);
        }
    }
    
    animateCounter(element, targetValue) {
        const currentValue = parseInt(element.textContent) || 0;
        const increment = targetValue > currentValue ? 1 : -1;
        const duration = 1000;
        const steps = Math.abs(targetValue - currentValue);
        
        if (steps === 0) return;
        
        const stepTime = duration / steps;
        let current = currentValue;
        
        const timer = setInterval(() => {
            current += increment;
            element.textContent = current;
            
            if (current === targetValue) {
                clearInterval(timer);
            }
        }, stepTime);
    }
    
    refreshAlerts() {
        const refreshBtn = document.getElementById('refreshBtn');
        if (refreshBtn) {
            refreshBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Atualizando...';
            refreshBtn.disabled = true;
        }
        
        setTimeout(() => {
            this.loadAlerts();
            this.updateStatistics();
            
            if (refreshBtn) {
                refreshBtn.innerHTML = '<i class="fas fa-sync-alt"></i> Atualizar';
                refreshBtn.disabled = false;
            }
            
            if (window.notificationManager) {
                window.notificationManager.show({
                    type: 'success',
                    title: 'Dados Atualizados',
                    message: 'Lista de alertas atualizada com sucesso.',
                    duration: 3000
                });
            }
        }, 1500);
    }
    
    exportAlerts() {
        const dataToExport = this.filteredAlerts.map(alert => ({
            ID: alert.id,
            'Data/Hora': new Date(alert.timestamp).toLocaleString('pt-BR'),
            'Área': alert.areaName,
            'Nível de Risco': alert.riskLevel,
            'Mensagem': alert.message
        }));
        
        const csv = this.convertToCSV(dataToExport);
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        
        link.setAttribute('href', url);
        link.setAttribute('download', `alertas_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        if (window.notificationManager) {
            window.notificationManager.show({
                type: 'success',
                title: 'Exportação Concluída',
                message: 'Arquivo CSV baixado com sucesso.',
                duration: 4000
            });
        }
    }
    
    convertToCSV(data) {
        if (!data.length) return '';
        
        const headers = Object.keys(data[0]);
        const csvHeaders = headers.join(',');
        
        const csvRows = data.map(row => {
            return headers.map(header => {
                const value = row[header];
                return typeof value === 'string' && value.includes(',') ? `"${value}"` : value;
            }).join(',');
        });
        
        return [csvHeaders, ...csvRows].join('\n');
    }
    
    viewAlertDetails(alertId) {
        const alert = this.allAlerts.find(a => a.id === alertId);
        if (!alert) return;
        
        const modal = document.getElementById('alertDetailsModal');
        const content = document.getElementById('alertDetailsContent');
        
        if (!modal || !content) return;
        
        content.innerHTML = `
            <h2><i class="fas fa-bell"></i> Detalhes do Alerta #${alert.id}</h2>
            <div class="alert-details">
                <div class="detail-row">
                    <strong>Área:</strong>
                    <span>${alert.areaName}</span>
                </div>
                <div class="detail-row">
                    <strong>Nível de Risco:</strong>
                    <span class="alert-risk-badge ${alert.riskLevel.toLowerCase()}">${alert.riskLevel}</span>
                </div>
                <div class="detail-row">
                    <strong>Data/Hora:</strong>
                    <span>${new Date(alert.timestamp).toLocaleString('pt-BR')}</span>
                </div>
                <div class="detail-row">
                    <strong>Mensagem:</strong>
                    <span>${alert.message}</span>
                </div>
                <div class="detail-row">
                    <strong>Status:</strong>
                    <span class="status-active">Ativo</span>
                </div>
            </div>
            <div class="modal-actions">
                <button class="btn-action" onclick="alertsManager.viewOnMap('${alert.areaName}')">
                    <i class="fas fa-map-marker-alt"></i> Ver no Mapa
                </button>
                <button class="btn-action" onclick="alertsManager.shareAlert(${alert.id})">
                    <i class="fas fa-share"></i> Compartilhar
                </button>
                <button class="btn-action" onclick="alertsManager.acknowledgeAlert(${alert.id})">
                    <i class="fas fa-check"></i> Reconhecer
                </button>
            </div>
        `;
        
        modal.style.display = 'block';
    }
    
    viewOnMap(areaName) {
        // Close any open modals
        document.querySelectorAll('.modal').forEach(modal => {
            modal.style.display = 'none';
        });
        
        // Navigate to main page with area focused
        if (window.location.pathname.includes('alertas.html')) {
            window.location.href = `index.html?focus=${encodeURIComponent(areaName)}`;
        } else if (window.mapManager) {
            // If already on main page
            const { riskAreas } = window.AlertSlideData;
            const area = riskAreas.find(a => a.nome === areaName);
            if (area) {
                window.mapManager.centerOnArea(area.id);
            }
        }
    }
    
    shareAlert(alertId) {
        const alert = this.allAlerts.find(a => a.id === alertId);
        if (!alert) return;
        
        const shareText = `🚨 Alerta AlertSlide #${alert.id}\nÁrea: ${alert.areaName}\nRisco: ${alert.riskLevel}\n${alert.message}\n\nVia AlertSlide Sistema`;
        
        if (navigator.share) {
            navigator.share({
                title: `Alerta AlertSlide #${alert.id}`,
                text: shareText,
                url: window.location.href
            }).catch(err => console.log('Error sharing:', err));
        } else {
            // Fallback to clipboard
            navigator.clipboard.writeText(shareText).then(() => {
                if (window.notificationManager) {
                    window.notificationManager.show({
                        type: 'success',
                        title: 'Copiado!',
                        message: 'Alerta copiado para a área de transferência.',
                        duration: 3000
                    });
                }
            }).catch(err => {
                console.log('Error copying to clipboard:', err);
            });
        }
    }
    
    acknowledgeAlert(alertId) {
        // In a real system, this would mark the alert as acknowledged
        if (window.notificationManager) {
            window.notificationManager.show({
                type: 'success',
                title: 'Alerta Reconhecido',
                message: `Alerta #${alertId} foi marcado como reconhecido.`,
                duration: 4000
            });
        }
        
        // Close the modal
        document.getElementById('alertDetailsModal').style.display = 'none';
    }
    
    showManualReportModal() {
        const modal = document.getElementById('manualReportModal');
        if (modal) {
            modal.style.display = 'block';
            
            // Focus first input
            const firstInput = modal.querySelector('select, input');
            if (firstInput) {
                setTimeout(() => firstInput.focus(), 100);
            }
        }
    }
    
    showSettingsModal() {
        const modal = document.getElementById('settingsModal');
        if (modal) {
            modal.style.display = 'block';
        }
    }
    
    showEmergencyModal() {
        const modal = document.getElementById('emergencyModal');
        if (modal) {
            modal.style.display = 'block';
        }
    }
    
    handleManualReport(event) {
        event.preventDefault();
        
        const formData = new FormData(event.target);
        const reportData = {
            area: formData.get('reportArea') || document.getElementById('reportArea').value,
            customArea: document.getElementById('customArea')?.value,
            riskLevel: formData.get('reportRiskLevel') || document.getElementById('reportRiskLevel').value,
            type: formData.get('reportType') || document.getElementById('reportType').value,
            description: formData.get('reportDescription') || document.getElementById('reportDescription').value,
            location: formData.get('reportLocation') || document.getElementById('reportLocation').value,
            severity: document.getElementById('reportSeverity')?.value,
            urgent: document.getElementById('reportUrgent')?.checked,
            timestamp: new Date()
        };
        
        // Use custom area if specified
        if (reportData.area === 'Outro' && reportData.customArea) {
            reportData.area = reportData.customArea;
        }
        
        // Validate required fields
        if (!reportData.area || !reportData.riskLevel || !reportData.type || !reportData.description || !reportData.location) {
            if (window.notificationManager) {
                window.notificationManager.show({
                    type: 'error',
                    title: 'Campos Obrigatórios',
                    message: 'Por favor, preencha todos os campos obrigatórios.'
                });
            }
            return;
        }
        
        // Submit report
        this.submitManualReport(reportData);
    }
    
    submitManualReport(reportData) {
        const submitBtn = document.querySelector('#manualReportForm .btn-submit');
        if (submitBtn) {
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
            submitBtn.disabled = true;
        }
        
        // Simulate API call
        setTimeout(() => {
            const success = Math.random() > 0.1; // 90% success rate
            
            if (success) {
                // Generate new alert from report
                const { DataService } = window.AlertSlideData;
                DataService.generateAlert(reportData.area, reportData.riskLevel);
                
                // Close modal and reset form
                document.getElementById('manualReportModal').style.display = 'none';
                document.getElementById('manualReportForm').reset();
                
                // Refresh alerts list
                this.loadAlerts();
                this.updateStatistics();
                
                if (window.notificationManager) {
                    window.notificationManager.show({
                        type: 'success',
                        title: 'Relatório Enviado',
                        message: 'Relatório manual processado e alerta gerado com sucesso.',
                        duration: 5000
                    });
                }
            } else {
                if (window.notificationManager) {
                    window.notificationManager.show({
                        type: 'error',
                        title: 'Erro no Envio',
                        message: 'Erro ao processar relatório. Tente novamente.',
                        duration: 5000
                    });
                }
            }
            
            // Reset button
            if (submitBtn) {
                submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Enviar Relatório';
                submitBtn.disabled = false;
            }
        }, 2000);
    }
    
    handleEmergencyReport(event) {
        event.preventDefault();
        
        const formData = new FormData(event.target);
        const emergencyData = {
            type: formData.get('emergencyType') || document.getElementById('emergencyType').value,
            location: formData.get('emergencyLocation') || document.getElementById('emergencyLocation').value,
            description: formData.get('emergencyDescription') || document.getElementById('emergencyDescription').value,
            timestamp: new Date()
        };
        
        // Validate
        if (!emergencyData.type || !emergencyData.location || !emergencyData.description) {
            if (window.notificationManager) {
                window.notificationManager.show({
                    type: 'error',
                    title: 'Campos Obrigatórios',
                    message: 'Por favor, preencha todos os campos.'
                });
            }
            return;
        }
        
        // Process emergency (reuse logic from main.js if available)
        if (window.alertSlideApp) {
            window.alertSlideApp.submitEmergencyReport(emergencyData);
        } else {
            // Fallback processing
            document.getElementById('emergencyModal').style.display = 'none';
            if (window.notificationManager) {
                window.notificationManager.showEmergencyReport(true);
            }
        }
    }
    
    handleSaveSettings() {
        // Collect settings from form
        this.settings = {
            enableSound: document.getElementById('enableSound')?.checked ?? this.settings.enableSound,
            enableBrowser: document.getElementById('enableBrowser')?.checked ?? this.settings.enableBrowser,
            enableEmail: document.getElementById('enableEmail')?.checked ?? this.settings.enableEmail,
            autoRefresh: parseInt(document.getElementById('autoRefresh')?.value) || this.settings.autoRefresh,
            alertsPerPage: parseInt(document.getElementById('alertsPerPage')?.value) || this.settings.alertsPerPage,
            showLowPriority: document.getElementById('showLowPriority')?.checked ?? this.settings.showLowPriority,
            highlightHigh: document.getElementById('highlightHigh')?.checked ?? this.settings.highlightHigh
        };
        
        this.saveSettings();
        this.applySettings();
        this.setupAutoRefresh();
        
        // Close modal
        document.getElementById('settingsModal').style.display = 'none';
        
        if (window.notificationManager) {
            window.notificationManager.show({
                type: 'success',
                title: 'Configurações Salvas',
                message: 'Suas preferências foram salvas com sucesso.',
                duration: 3000
            });
        }
    }
    
    setupAutoRefresh() {
        // Clear existing interval
        if (this.autoRefreshInterval) {
            clearInterval(this.autoRefreshInterval);
            this.autoRefreshInterval = null;
        }
        
        // Set new interval if enabled
        if (this.settings.autoRefresh > 0) {
            this.autoRefreshInterval = setInterval(() => {
                this.loadAlerts();
                this.updateStatistics();
            }, this.settings.autoRefresh * 1000);
        }
    }
    
    // Cleanup method
    destroy() {
        if (this.autoRefreshInterval) {
            clearInterval(this.autoRefreshInterval);
        }
    }
}

// Additional CSS for alerts page specific styles
const alertsPageStyles = `
    .high-priority {
        animation: pulse 2s infinite;
        border: 2px solid var(--high-risk-color) !important;
    }
    
    .status-active {
        color: var(--safe-color);
        font-weight: 600;
    }
    
    .btn-action {
        background: var(--secondary-color);
        color: var(--white);
        border: none;
        padding: 8px 16px;
        border-radius: 6px;
        cursor: pointer;
        transition: var(--transition-base);
        display: flex;
        align-items: center;
        gap: 6px;
        font-size: 14px;
        margin: 4px;
    }
    
    .btn-action:hover {
        background: var(--primary-color);
        transform: translateY(-2px);
        box-shadow: var(--shadow-md);
    }
    
    .modal-actions {
        display: flex;
        gap: 12px;
        justify-content: center;
        margin-top: 20px;
        flex-wrap: wrap;
    }
    
    .detail-row {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 12px 0;
        border-bottom: 1px solid #eee;
    }
    
    .detail-row:last-child {
        border-bottom: none;
    }
    
    .alert-details {
        margin: 20px 0;
    }
`;

// Inject styles
const alertsStyleSheet = document.createElement('style');
alertsStyleSheet.textContent = alertsPageStyles;
document.head.appendChild(alertsStyleSheet);

// Initialize alerts manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.alertsManager = new AlertsManager();
    
    // Handle URL parameters (e.g., from navigation with focused area)
    const urlParams = new URLSearchParams(window.location.search);
    const focusArea = urlParams.get('focus');
    if (focusArea) {
        // Set area filter and apply
        const areaFilter = document.getElementById('areaFilter');
        if (areaFilter) {
            areaFilter.value = focusArea;
            window.alertsManager.applyFilters();
        }
    }
    
    // Expose for console debugging
    window.AlertsPage = {
        manager: window.alertsManager,
        simulateReport: (area, risk) => {
            const reportData = {
                area: area || 'Test Area',
                riskLevel: risk || 'MODERADO',
                type: 'deslizamento',
                description: 'Relatório de teste gerado via console',
                location: 'Localização de teste',
                severity: 5,
                urgent: false,
                timestamp: new Date()
            };
            window.alertsManager.submitManualReport(reportData);
        }
    };
    
    console.log('📋 Alerts Page Initialized');
    console.log('💡 Use AlertsPage.simulateReport("Area Name", "ALTO") to test reports');
});// js/alerts.js - Alerts page functionality

class AlertsManager {
    constructor() {
        this.currentView = 'list';
        this.currentPage = 1;
        this.alertsPerPage = 10;
        this.filteredAlerts = [];
        this.allAlerts = [];
        this.autoRefreshInterval = null;
        this.settings = {
            enableSound: true,
            enableBrowser: true,
            enableEmail: false,
            autoRefresh: 5,
            alertsPerPage: 10,
            showLowPriority: true,
            highlightHigh: true
        };
        
        this.init();
    }
    
    init() {
        this.loadSettings();
        this.setupEventListeners();
        this.loadAlerts();
        this.updateStatistics();
        this.setupAutoRefresh();
        this.setDefaultDateFilters();
    }
    
    loadSettings() {
        try {
            const saved = localStorage.getItem('alertslide_alerts_settings');
            if (saved) {
                this.settings = { ...this.settings, ...JSON.parse(saved) };
                this.applySettings();
            }
        } catch (error) {
            console.warn('Could not load alerts settings:', error);
        }
    }
    
    saveSettings() {
        try {
            localStorage.setItem('alertslide_alerts_settings', JSON.stringify(this.settings));
        } catch (error) {
            console.warn('Could not save alerts settings:', error);
        }
    }
    
    applySettings() {
        const enableSoundCheckbox = document.getElementById('enableSound');
        const enableBrowserCheckbox = document.getElementById('enableBrowser');
        const enableEmailCheckbox = document.getElementById('enableEmail');
        const autoRefreshSelect = document.getElementById('autoRefresh');
        const alertsPerPageSelect = document.getElementById('alertsPerPage');
        const showLowPriorityCheckbox = document.getElementById('showLowPriority');
        const highlightHighCheckbox = document.getElementById('highlightHigh');
        
        if (enableSoundCheckbox) enableSoundCheckbox.checked = this.settings.enableSound;
        if (enableBrowserCheckbox) enableBrowserCheckbox.checked = this.settings.enableBrowser;
        if (enableEmailCheckbox) enableEmailCheckbox.checked = this.settings.enableEmail;
        if (autoRefreshSelect) autoRefreshSelect.value = this.settings.autoRefresh;
        if (