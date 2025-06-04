                <div class="shelter-actions">
                    <button class="shelter-action-btn" onclick="sheltersManager.viewShelterDetails(${shelter.id})">
                        <i class="fas fa-eye"></i> Detalhes
                    </button>
                    ${status === 'active' ? `
                        <button class="shelter-action-btn primary" onclick="sheltersManager.quickCheckIn(${shelter.id})">
                            <i class="fas fa-sign-in-alt"></i> Check-in
                        </button>
                    ` : `
                        <button class="shelter-action-btn" disabled>
                            <i class="fas fa-ban"></i> Indisponível
                        </button>
                    `}
                </div>
            </div>
        `;
    }
    
    renderShelterListItem(shelter) {
        const { DataService } = window.AlertSlideData;
        const status = DataService.getShelterStatus(shelter);
        const occupancyPercent = Math.round((shelter.currentOccupancy / shelter.capacity) * 100);
        const availableSpaces = shelter.capacity - shelter.currentOccupancy;
        
        return `
            <div class="shelter-list-item ${status}" data-shelter-id="${shelter.id}">
                <div class="shelter-list-info">
                    <div class="shelter-name">${shelter.nome}</div>
                    <div class="shelter-location">
                        <i class="fas fa-map-marker-alt"></i>
                        ${shelter.location}
                    </div>
                </div>
                
                <div class="shelter-list-stats">
                    <div class="stat-pill">
                        <div class="info-value">${shelter.capacity}</div>
                        <div class="info-label">Capacidade</div>
                    </div>
                    <div class="stat-pill">
                        <div class="info-value">${shelter.currentOccupancy}</div>
                        <div class="info-label">Ocupado</div>
                    </div>
                    <div class="stat-pill">
                        <div class="info-value">${availableSpaces}</div>
                        <div class="info-label">Disponível</div>
                    </div>
                    <div class="shelter-status ${status}">${this.getStatusText(status)}</div>
                </div>
            </div>
        `;
    }
    
    renderSheltersTable() {
        const { DataService } = window.AlertSlideData;
        
        const tableRows = this.filteredShelters.map(shelter => {
            const status = DataService.getShelterStatus(shelter);
            const occupancyPercent = Math.round((shelter.currentOccupancy / shelter.capacity) * 100);
            const availableSpaces = shelter.capacity - shelter.currentOccupancy;
            
            return `
                <tr data-shelter-id="${shelter.id}">
                    <td>${shelter.nome}</td>
                    <td>${shelter.location}</td>
                    <td>
                        <span class="shelter-status ${status}">${this.getStatusText(status)}</span>
                    </td>
                    <td>${shelter.capacity}</td>
                    <td>${shelter.currentOccupancy}</td>
                    <td>${availableSpaces}</td>
                    <td>
                        <div class="table-capacity">
                            <span>${occupancyPercent}%</span>
                            <div class="mini-capacity-bar">
                                <div class="mini-capacity-fill" style="width: ${occupancyPercent}%; background-color: ${this.getCapacityColor(occupancyPercent)}"></div>
                            </div>
                        </div>
                    </td>
                    <td>
                        <div class="table-actions">
                            <button class="table-action-btn" onclick="sheltersManager.viewShelterDetails(${shelter.id})">
                                <i class="fas fa-eye"></i>
                            </button>
                            ${status === 'active' ? `
                                <button class="table-action-btn" onclick="sheltersManager.quickCheckIn(${shelter.id})">
                                    <i class="fas fa-sign-in-alt"></i>
                                </button>
                            ` : ''}
                        </div>
                    </td>
                </tr>
            `;
        }).join('');
        
        return `
            <div class="shelters-table">
                <table>
                    <thead>
                        <tr>
                            <th>Nome</th>
                            <th>Localização</th>
                            <th>Status</th>
                            <th>Capacidade</th>
                            <th>Ocupado</th>
                            <th>Disponível</th>
                            <th>Ocupação</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${tableRows}
                    </tbody>
                </table>
            </div>
        `;
    }
    
    renderEmptyState() {
        return `
            <div class="empty-state">
                <i class="fas fa-home"></i>
                <h3>Nenhum abrigo encontrado</h3>
                <p>Não há abrigos que correspondam aos filtros selecionados.</p>
                <button class="btn-filter" onclick="sheltersManager.clearFilters()">
                    <i class="fas fa-refresh"></i> Limpar Filtros
                </button>
            </div>
        `;
    }
    
    getStatusText(status) {
        const statusTexts = {
            active: 'Ativo',
            full: 'Lotado',
            inactive: 'Inativo'
        };
        return statusTexts[status] || 'Desconhecido';
    }
    
    getCapacityColor(percentage) {
        if (percentage < 50) return '#27ae60';
        if (percentage < 80) return '#f39c12';
        return '#e74c3c';
    }
    
    addShelterClickHandlers() {
        document.querySelectorAll('.shelter-card, .shelter-list-item, .shelters-table tbody tr').forEach(element => {
            element.addEventListener('click', (e) => {
                // Don't trigger if clicking on action buttons
                if (e.target.closest('.shelter-action-btn, .table-action-btn')) return;
                
                const shelterId = parseInt(element.dataset.shelterId);
                this.viewShelterDetails(shelterId);
            });
        });
    }
    
    updateStatistics() {
        const totalShelters = this.allShelters.length;
        const activeShelters = this.allShelters.filter(s => s.active).length;
        const totalCapacity = this.allShelters.reduce((sum, s) => sum + s.capacity, 0);
        const currentOccupancy = this.allShelters.reduce((sum, s) => sum + s.currentOccupancy, 0);
        const availableCapacity = totalCapacity - currentOccupancy;
        
        this.animateCounter(document.getElementById('totalShelters'), totalShelters);
        this.animateCounter(document.getElementById('activeShelters'), activeShelters);
        this.animateCounter(document.getElementById('availableCapacity'), availableCapacity);
        this.animateCounter(document.getElementById('currentOccupancy'), currentOccupancy);
    }
    
    animateCounter(element, targetValue) {
        if (!element) return;
        
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
    
    initializeMap() {
        const mapContainer = document.getElementById('sheltersMap');
        if (!mapContainer) return;
        
        // Initialize simplified map
        mapContainer.style.position = 'relative';
        mapContainer.style.background = 'linear-gradient(135deg, #74b9ff, #0984e3)';
        mapContainer.style.overflow = 'hidden';
        mapContainer.style.height = '400px';
        
        // Add grid pattern
        mapContainer.innerHTML = `
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
                <strong>Abrigos - Natal, RN</strong><br>
                Localização em Tempo Real
            </div>
        `;
        
        this.updateMapMarkers();
    }
    
    updateMapMarkers() {
        const mapContainer = document.getElementById('sheltersMap');
        if (!mapContainer) return;
        
        // Remove existing markers
        mapContainer.querySelectorAll('.shelter-marker').forEach(marker => marker.remove());
        
        // Add shelter markers
        this.filteredShelters.forEach((shelter, index) => {
            if (shelter.coordinates) {
                const marker = this.createShelterMarker(shelter, index);
                mapContainer.appendChild(marker);
            }
        });
    }
    
    createShelterMarker(shelter, index) {
        const { DataService } = window.AlertSlideData;
        const status = DataService.getShelterStatus(shelter);
        
        const marker = document.createElement('div');
        marker.className = 'shelter-marker';
        marker.setAttribute('data-shelter-id', shelter.id);
        
        // Position based on coordinates
        const position = this.normalizeCoordinates(shelter.coordinates);
        marker.style.left = position.x + '%';
        marker.style.top = position.y + '%';
        marker.style.position = 'absolute';
        marker.style.width = '32px';
        marker.style.height = '32px';
        marker.style.backgroundColor = this.getStatusColor(status);
        marker.style.borderRadius = '50%';
        marker.style.border = '3px solid white';
        marker.style.cursor = 'pointer';
        marker.style.transition = 'all 0.3s ease';
        marker.style.zIndex = '5';
        marker.style.display = 'flex';
        marker.style.alignItems = 'center';
        marker.style.justifyContent = 'center';
        marker.style.fontSize = '14px';
        marker.style.color = 'white';
        marker.style.fontWeight = 'bold';
        marker.innerHTML = '🏠';
        
        // Add tooltip
        const tooltip = this.createMarkerTooltip(shelter);
        marker.appendChild(tooltip);
        
        // Add hover effects
        marker.addEventListener('mouseenter', () => {
            tooltip.style.opacity = '1';
            marker.style.transform = 'scale(1.2)';
            marker.style.zIndex = '100';
        });
        
        marker.addEventListener('mouseleave', () => {
            tooltip.style.opacity = '0';
            marker.style.transform = 'scale(1)';
            marker.style.zIndex = '5';
        });
        
        // Add click handler
        marker.addEventListener('click', () => {
            this.viewShelterDetails(shelter.id);
        });
        
        return marker;
    }
    
    createMarkerTooltip(shelter) {
        const { DataService } = window.AlertSlideData;
        const status = DataService.getShelterStatus(shelter);
        const occupancyPercent = Math.round((shelter.currentOccupancy / shelter.capacity) * 100);
        
        const tooltip = document.createElement('div');
        tooltip.className = 'marker-tooltip';
        tooltip.style.cssText = `
            position: absolute;
            bottom: 40px;
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
        
        tooltip.innerHTML = `
            <strong>${shelter.nome}</strong><br>
            Status: ${this.getStatusText(status)}<br>
            Ocupação: ${shelter.currentOccupancy}/${shelter.capacity} (${occupancyPercent}%)
        `;
        
        return tooltip;
    }
    
    normalizeCoordinates(coords) {
        // Convert lat/lng to percentage position (simplified projection)
        const bounds = {
            minLat: -5.850,
            maxLat: -5.750,
            minLng: -35.260,
            maxLng: -35.160
        };
        
        const x = ((coords.lng - bounds.minLng) / (bounds.maxLng - bounds.minLng)) * 100;
        const y = ((bounds.maxLat - coords.lat) / (bounds.maxLat - bounds.minLat)) * 100;
        
        return {
            x: Math.max(5, Math.min(95, x)),
            y: Math.max(5, Math.min(95, y))
        };
    }
    
    getStatusColor(status) {
        const colors = {
            active: '#27ae60',
            full: '#f39c12',
            inactive: '#95a5a6'
        };
        return colors[status] || colors.inactive;
    }
    
    refreshShelters() {
        const refreshBtn = document.getElementById('refreshBtn');
        if (refreshBtn) {
            refreshBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Atualizando...';
            refreshBtn.disabled = true;
        }
        
        setTimeout(() => {
            this.loadShelters();
            this.updateStatistics();
            this.updateMapMarkers();
            
            if (refreshBtn) {
                refreshBtn.innerHTML = '<i class="fas fa-sync-alt"></i> Atualizar';
                refreshBtn.disabled = false;
            }
            
            if (window.notificationManager) {
                window.notificationManager.show({
                    type: 'success',
                    title: 'Dados Atualizados',
                    message: 'Informações dos abrigos atualizadas com sucesso.',
                    duration: 3000
                });
            }
        }, 1500);
    }
    
    findNearestShelter() {
        if (!navigator.geolocation) {
            if (window.notificationManager) {
                window.notificationManager.show({
                    type: 'error',
                    title: 'Geolocalização Indisponível',
                    message: 'Seu navegador não suporta geolocalização.',
                    duration: 5000
                });
            }
            return;
        }
        
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const userLat = position.coords.latitude;
                const userLng = position.coords.longitude;
                
                const { DataService } = window.AlertSlideData;
                const nearestShelter = DataService.findNearestShelter(userLat, userLng);
                
                if (nearestShelter) {
                    this.viewShelterDetails(nearestShelter.id);
                    
                    if (window.notificationManager) {
                        window.notificationManager.show({
                            type: 'info',
                            title: 'Abrigo Mais Próximo',
                            message: `${nearestShelter.nome} encontrado próximo à sua localização.`,
                            duration: 5000
                        });
                    }
                } else {
                    if (window.notificationManager) {
                        window.notificationManager.show({
                            type: 'warning',
                            title: 'Nenhum Abrigo Disponível',
                            message: 'Não há abrigos disponíveis no momento.',
                            duration: 5000
                        });
                    }
                }
            },
            (error) => {
                if (window.notificationManager) {
                    window.notificationManager.show({
                        type: 'error',
                        title: 'Erro de Localização',
                        message: 'Não foi possível obter sua localização.',
                        duration: 5000
                    });
                }
            }
        );
    }
    
    showCheckInModal() {
        this.checkInOutMode = 'checkin';
        this.populateShelterSelect();
        
        const modal = document.getElementById('checkInOutModal');
        const title = document.getElementById('checkInOutTitle');
        const submitBtn = document.getElementById('checkInOutSubmit');
        const reasonGroup = document.getElementById('checkOutReasonGroup');
        
        if (title) title.innerHTML = '<i class="fas fa-sign-in-alt"></i> Check-in';
        if (submitBtn) submitBtn.innerHTML = '<i class="fas fa-sign-in-alt"></i> Confirmar Check-in';
        if (reasonGroup) reasonGroup.style.display = 'none';
        
        if (modal) modal.style.display = 'block';
    }
    
    showCheckOutModal() {
        this.checkInOutMode = 'checkout';
        this.populateShelterSelect();
        
        const modal = document.getElementById('checkInOutModal');
        const title = document.getElementById('checkInOutTitle');
        const submitBtn = document.getElementById('checkInOutSubmit');
        const reasonGroup = document.getElementById('checkOutReasonGroup');
        
        if (title) title.innerHTML = '<i class="fas fa-sign-out-alt"></i> Check-out';
        if (submitBtn) submitBtn.innerHTML = '<i class="fas fa-sign-out-alt"></i> Confirmar Check-out';
        if (reasonGroup) reasonGroup.style.display = 'block';
        
        if (modal) modal.style.display = 'block';
    }
    
    populateShelterSelect() {
        const select = document.getElementById('shelterSelect');
        if (!select) return;
        
        const availableShelters = this.checkInOutMode === 'checkin' 
            ? this.allShelters.filter(s => s.active && s.currentOccupancy < s.capacity)
            : this.allShelters.filter(s => s.active && s.currentOccupancy > 0);
        
        select.innerHTML = '<option value="">Selecione um abrigo...</option>' +
            availableShelters.map(shelter => 
                `<option value="${shelter.id}">${shelter.nome} - ${shelter.location}</option>`
            ).join('');
    }
    
    quickCheckIn(shelterId) {
        this.selectedShelter = this.allShelters.find(s => s.id === shelterId);
        this.showCheckInModal();
        
        // Pre-select the shelter
        const select = document.getElementById('shelterSelect');
        if (select) {
            select.value = shelterId;
        }
    }
    
    handleCheckInOut(event) {
        event.preventDefault();
        
        const formData = new FormData(event.target);
        const checkInOutData = {
            shelterId: parseInt(formData.get('shelterSelect') || document.getElementById('shelterSelect').value),
            personName: formData.get('personName') || document.getElementById('personName').value,
            personCPF: formData.get('personCPF') || document.getElementById('personCPF').value,
            personPhone: formData.get('personPhone') || document.getElementById('personPhone').value,
            emergencyContact: formData.get('emergencyContact') || document.getElementById('emergencyContact').value,
            specialNeeds: formData.get('specialNeeds') || document.getElementById('specialNeeds').value,
            checkOutReason: this.checkInOutMode === 'checkout' ? (formData.get('checkOutReason') || document.getElementById('checkOutReason').value) : null,
            timestamp: new Date(),
            mode: this.checkInOutMode
        };
        
        // Validate required fields
        if (!checkInOutData.shelterId || !checkInOutData.personName) {
            if (window.notificationManager) {
                window.notificationManager.show({
                    type: 'error',
                    title: 'Campos Obrigatórios',
                    message: 'Por favor, preencha os campos obrigatórios.',
                    duration: 4000
                });
            }
            return;
        }
        
        this.processCheckInOut(checkInOutData);
    }
    
    processCheckInOut(data) {
        const shelter = this.allShelters.find(s => s.id === data.shelterId);
        if (!shelter) return;
        
        const submitBtn = document.getElementById('checkInOutSubmit');
        if (submitBtn) {
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processando...';
            submitBtn.disabled = true;
        }
        
        setTimeout(() => {
            const success = Math.random() > 0.05; // 95% success rate
            
            if (success) {
                if (data.mode === 'checkin') {
                    if (shelter.currentOccupancy < shelter.capacity) {
                        shelter.currentOccupancy++;
                    }
                } else {
                    if (shelter.currentOccupancy > 0) {
                        shelter.currentOccupancy--;
                    }
                }
                
                // Close modal and reset form
                document.getElementById('checkInOutModal').style.display = 'none';
                document.getElementById('checkInOutForm').reset();
                
                // Update displays
                this.renderShelters();
                this.updateStatistics();
                this.updateMapMarkers();
                
                if (window.notificationManager) {
                    window.notificationManager.show({
                        type: 'success',
                        title: data.mode === 'checkin' ? 'Check-in Realizado' : 'Check-out Realizado',
                        message: `${data.personName} ${data.mode === 'checkin' ? 'registrado' : 'liberado'} com sucesso no ${shelter.nome}.`,
                        duration: 5000
                    });
                }
            } else {
                if (window.notificationManager) {
                    window.notificationManager.show({
                        type: 'error',
                        title: 'Erro no Processamento',
                        message: 'Erro ao processar a solicitação. Tente novamente.',
                        duration: 5000
                    });
                }
            }
            
            // Reset button
            if (submitBtn) {
                const icon = data.mode === 'checkin' ? 'sign-in-alt' : 'sign-out-alt';
                const text = data.mode === 'checkin' ? 'Confirmar Check-in' : 'Confirmar Check-out';
                submitBtn.innerHTML = `<i class="fas fa-${icon}"></i> ${text}`;
                submitBtn.disabled = false;
            }
        }, 2000);
    }
    
    viewShelterDetails(shelterId) {
        const shelter = this.allShelters.find(s => s.id === shelterId);
        if (!shelter) return;
        
        const { DataService } = window.AlertSlideData;
        const status = DataService.getShelterStatus(shelter);
        const occupancyPercent = Math.round((shelter.currentOccupancy / shelter.capacity) * 100);
        const availableSpaces = shelter.capacity - shelter.currentOccupancy;
        
        const modal = document.getElementById('shelterDetailsModal');
        const content = document.getElementById('shelterDetailsContent');
        
        if (!modal || !content) return;
        
        content.innerHTML = `
            <h2><i class="fas fa-home"></i> ${shelter.nome}</h2>
            <div class="shelter-details-grid">
                <div class="detail-section">
                    <h4><i class="fas fa-info-circle"></i> Informações Gerais</h4>
                    <div class="detail-row">
                        <strong>Status:</strong>
                        <span class="shelter-status ${status}">${this.getStatusText(status)}</span>
                    </div>
                    <div class="detail-row">
                        <strong>Localização:</strong>
                        <span>${shelter.location}</span>
                    </div>
                    <div class="detail-row">
                        <strong>Capacidade Total:</strong>
                        <span>${shelter.capacity} pessoas</span>
                    </div>
                    <div class="detail-row">
                        <strong>Ocupação Atual:</strong>
                        <span>${shelter.currentOccupancy} pessoas</span>
                    </div>
                    <div class="detail-row">
                        <strong>Vagas Disponíveis:</strong>
                        <span>${availableSpaces} pessoas</span>
                    </div>
                </div>
                
                <div class="detail-section">
                    <h4><i class="fas fa-chart-bar"></i> Ocupação</h4>
                    <div class="occupancy-visual">
                        <div class="capacity-bar">
                            <div class="capacity-fill" style="width: ${occupancyPercent}%; background-color: ${this.getCapacityColor(occupancyPercent)}"></div>
                        </div>
                        <p style="text-align: center; margin-top: 10px;">
                            <strong>${occupancyPercent}% ocupado</strong>
                        </p>
                    </div>
                    
                    <div class="occupancy-chart">
                        ${this.generateOccupancyChart(shelter)}
                    </div>
                </div>
            </div>
            
            <div class="modal-actions">
                <button class="btn-action" onclick="sheltersManager.getDirections(${shelter.id})">
                    <i class="fas fa-route"></i> Como Chegar
                </button>
                ${status === 'active' ? `
                    <button class="btn-action" onclick="sheltersManager.quickCheckIn(${shelter.id}); document.getElementById('shelterDetailsModal').style.display='none';">
                        <i class="fas fa-sign-in-alt"></i> Check-in Rápido
                    </button>
                ` : ''}
                <button class="btn-action" onclick="sheltersManager.shareShel$(shelter.id})">
                    <i class="fas fa-share"></i> Compartilhar
                </button>
                <button class="btn-action" onclick="sheltersManager.centerOnShelter(${shelter.id})">
                    <i class="fas fa-map-marker-alt"></i> Ver no Mapa
                </button>
            </div>
        `;
        
        modal.style.display = 'block';
    }
    
    generateOccupancyChart(shelter) {
        // Generate mock weekly occupancy data
        const days = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
        const currentDay = new Date().getDay();
        
        return days.map((day, index) => {
            const isCurrentDay = index === currentDay;
            const mockOccupancy = isCurrentDay ? shelter.currentOccupancy : 
                Math.floor(Math.random() * shelter.capacity);
            const height = (mockOccupancy / shelter.capacity) * 100;
            
            return `
                <div class="occupancy-bar-visual ${isCurrentDay ? 'current-week' : ''}" 
                     style="height: ${height}%;" 
                     title="${day}: ${mockOccupancy}/${shelter.capacity}">
                </div>
            `;
        }).join('');
    }
    
    getDirections(shelterId) {
        const shelter = this.allShelters.find(s => s.id === shelterId);
        if (!shelter) return;
        
        if (window.notificationManager) {
            window.notificationManager.show({
                type: 'info',
                title: 'Direções',
                message: `Abrindo direções para ${shelter.nome}...`,
                duration: 3000
            });
        }
        
        // In a real app, would integrate with maps API
        const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(shelter.location)}`;
        window.open(mapsUrl, '_blank');
    }
    
    shareShelter(shelterId) {
        const shelter = this.allShelters.find(s => s.id === shelterId);
        if (!shelter) return;
        
        const { DataService } = window.AlertSlideData;
        const status = DataService.getShelterStatus(shelter);
        const shareText = `🏠 Abrigo: ${shelter.nome}\n📍 ${shelter.location}\n📊 Status: ${this.getStatusText(status)}\n👥 Capacidade: ${shelter.currentOccupancy}/${shelter.capacity}\n\nVia AlertSlide Sistema`;
        
        if (navigator.share) {
            navigator.share({
                title: `Abrigo: ${shelter.nome}`,
                text: shareText,
                url: window.location.href
            }).catch(err => console.log('Error sharing:', err));
        } else {
            navigator.clipboard.writeText(shareText).then(() => {
                if (window.notificationManager) {
                    window.notificationManager.show({
                        type: 'success',
                        title: 'Copiado!',
                        message: 'Informações do abrigo copiadas para a área de transferência.',
                        duration: 3000
                    });
                }
            }).catch(err => console.log('Error copying:', err));
        }
    }
    
    centerOnShelter(shelterId) {
        const marker = document.querySelector(`[data-shelter-id="${shelterId}"]`);
        if (marker) {
            marker.scrollIntoView({ behavior: 'smooth', block: 'center' });
            
            // Highlight the marker temporarily
            marker.style.transform = 'scale(1.5)';
            marker.style.zIndex = '200';
            marker.style.boxShadow = '0 0 20px rgba(255, 255, 255, 0.8)';
            
            setTimeout(() => {
                marker.style.transform = 'scale(1)';
                marker.style.zIndex = '5';
                marker.style.boxShadow = '';
            }, 3000);
        }
        
        // Close the modal
        document.getElementById('shelterDetailsModal').style.display = 'none';
    }
    
    showAllShelters() {
        document.querySelectorAll('.map-btn').forEach(btn => btn.classList.remove('active'));
        document.getElementById('showAllBtn').classList.add('active');
        
        this.applyFilters();
    }
    
    showAvailableShelters() {
        document.querySelectorAll('.map-btn').forEach(btn => btn.classList.remove('active'));
        document.getElementById('showAvailableBtn').classList.add('active');
        
        // Set availability filter
        document.getElementById('availabilityFilter').value = 'available';
        this.applyFilters();
    }
    
    centerOnUserLocation() {
        if (!navigator.geolocation) {
            if (window.notificationManager) {
                window.notificationManager.show({
                    type: 'error',
                    title: 'Geolocalização Indisponível',
                    message: 'Seu navegador não suporta geolocalização.',
                    duration: 4000
                });
            }
            return;
        }
        
        navigator.geolocation.getCurrentPosition(
            (position) => {
                if (window.notificationManager) {
                    window.notificationManager.show({
                        type: 'success',
                        title: 'Localização Encontrada',
                        message: 'Mapa centralizado na sua localização.',
                        duration: 3000
                    });
                }
                
                // In a real app, would center the map on user location
                this.findNearestShelter();
            },
            (error) => {
                if (window.notificationManager) {
                    window.notificationManager.show({
                        type: 'error',
                        title: 'Erro de Localização',
                        message: 'Não foi possível obter sua localização.',
                        duration: 4000
                    });
                }
            }
        );
    }
    
    showEmergencyActivationModal() {
        const modal = document.getElementById('emergencyActivationModal');
        if (!modal) return;
        
        // Populate shelter checklist
        this.populateEmergencyShelterChecklist();
        
        modal.style.display = 'block';
    }
    
    populateEmergencyShelterChecklist() {
        const checklist = document.getElementById('shelterChecklist');
        if (!checklist) return;
        
        const availableShelters = this.allShelters.filter(s => s.active);
        
        checklist.innerHTML = availableShelters.map(shelter => {
            const availableSpaces = shelter.capacity - shelter.currentOccupancy;
            return `
                <div class="shelter-checkbox-item">
                    <input type="checkbox" id="shelter-${shelter.id}" value="${shelter.id}">
                    <label for="shelter-${shelter.id}" class="shelter-checkbox-label">
                        ${shelter.nome}
                    </label>
                    <span class="shelter-checkbox-capacity">
                        ${availableSpaces}/${shelter.capacity} vagas
                    </span>
                </div>
            `;
        }).join('');
    }
    
    handleEmergencyActivation(event) {
        event.preventDefault();
        
        const formData = new FormData(event.target);
        const activationData = {
            area: formData.get('activationArea') || document.getElementById('activationArea').value,
            emergencyType: formData.get('emergencyType') || document.getElementById('emergencyType').value,
            estimatedAffected: parseInt(formData.get('estimatedAffected') || document.getElementById('estimatedAffected').value),
            notes: formData.get('emergencyNotes') || document.getElementById('emergencyNotes').value,
            selectedShelters: Array.from(document.querySelectorAll('#shelterChecklist input:checked')).map(cb => parseInt(cb.value)),
            timestamp: new Date(),
            activatedBy: 'Sistema AlertSlide'
        };
        
        // Validate
        if (!activationData.area || !activationData.emergencyType || activationData.selectedShelters.length === 0) {
            if (window.notificationManager) {
                window.notificationManager.show({
                    type: 'error',
                    title: 'Campos Obrigatórios',
                    message: 'Por favor, preencha todos os campos obrigatórios e selecione pelo menos um abrigo.',
                    duration: 5000
                });
            }
            return;
        }
        
        this.processEmergencyActivation(activationData);
    }
    
    processEmergencyActivation(data) {
        const submitBtn = document.querySelector('#emergencyActivationForm .btn-submit');
        if (submitBtn) {
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Ativando...';
            submitBtn.disabled = true;
        }
        
        setTimeout(() => {
            // Mark selected shelters as emergency-activated
            data.selectedShelters.forEach(shelterId => {
                const shelter = this.allShelters.find(s => s.id === shelterId);
                if (shelter) {
                    shelter.emergencyMode = true;
                    shelter.emergencyType = data.emergencyType;
                    shelter.emergencyArea = data.area;
                }
            });
            
            // Close modal and reset form
            document.getElementById('emergencyActivationModal').style.display = 'none';
            document.getElementById('emergencyActivationForm').reset();
            
            // Update displays
            this.renderShelters();
            this.updateMapMarkers();
            
            // Generate emergency alert
            const { DataService } = window.AlertSlideData;
            DataService.generateAlert(data.area, 'ALTO');
            
            // Show notifications
            if (window.notificationManager) {
                window.notificationManager.broadcastEmergency(
                    data.area,
                    `Emergência ativa: ${data.emergencyType}. ${data.selectedShelters.length} abrigo(s) ativado(s).`
                );
                
                // Also show evacuation alert
                setTimeout(() => {
                    window.notificationManager.showEvacuationAlert(data.area);
                }, 2000);
            }
            
            // Reset button
            if (submitBtn) {
                submitBtn.innerHTML = '<i class="fas fa-exclamation-triangle"></i> Ativar Emergência';
                submitBtn.disabled = false;
            }
            
            console.log('Emergency activation processed:', data);
        }, 3000);
    }
    
    showEmergencyModal() {
        const modal = document.getElementById('emergencyModal');
        if (modal) {
            modal.style.display = 'block';
        }
    }
    
    handleEmergencyReport(event) {
        event.preventDefault();
        
        const formData = new FormData(event.target);
        const emergencyData = {
            type: formData.get('emergencyTypeReport') || document.getElementById('emergencyTypeReport').value,
            location: formData.get('emergencyLocationReport') || document.getElementById('emergencyLocationReport').value,
            description: formData.get('emergencyDescriptionReport') || document.getElementById('emergencyDescriptionReport').value,
            timestamp: new Date()
        };
        
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
        
        // Process emergency report (reuse logic from main.js if available)
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
    
    startRealTimeUpdates() {
        // Update shelter data every 10 seconds
        setInterval(() => {
            // Simulate small occupancy changes
            this.allShelters.forEach(shelter => {
                if (shelter.active && Math.random() < 0.1) { // 10% chance of change
                    const change = Math.random() < 0.5 ? -1 : 1;
                    const newOccupancy = shelter.currentOccupancy + change;
                    
                    // Keep within valid bounds
                    if (newOccupancy >= 0 && newOccupancy <= shelter.capacity) {
                        shelter.currentOccupancy = newOccupancy;
                    }
                }
            });
            
            // Update displays
            this.renderShelters();
            this.updateStatistics();
            this.updateMapMarkers();
        }, 10000);
    }
    
    // Utility method for testing
    simulateEmergency(area = 'Centro', type = 'inundacao') {
        const activationData = {
            area: area,
            emergencyType: type,
            estimatedAffected: 50,
            notes: 'Simulação de emergência para teste',
            selectedShelters: this.allShelters.filter(s => s.active).slice(0, 2).map(s => s.id),
            timestamp: new Date(),
            activatedBy: 'Sistema de Teste'
        };
        
        this.processEmergencyActivation(activationData);
    }
    
    // Debug method
    getSystemStatus() {
        return {
            totalShelters: this.allShelters.length,
            filteredShelters: this.filteredShelters.length,
            currentView: this.currentView,
            activeShelters: this.allShelters.filter(s => s.active).length,
            totalCapacity: this.allShelters.reduce((sum, s) => sum + s.capacity, 0),
            totalOccupancy: this.allShelters.reduce((sum, s) => sum + s.currentOccupancy, 0)
        };
    }
}

// Additional CSS for enhanced shelter functionality
const sheltersPageStyles = `
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
    
    .empty-state {
        text-align: center;
        padding: var(--spacing-2xl);
        color: #7f8c8d;
    }
    
    .empty-state i {
        font-size: 4rem;
        margin-bottom: var(--spacing-lg);
        opacity: 0.5;
    }
    
    .empty-state h3 {
        margin-bottom: var(--spacing-sm);
        color: var(--primary-color);
    }
`;

// Inject styles
const sheltersStyleSheet = document.createElement('style');
sheltersStyleSheet.textContent = sheltersPageStyles;
document.head.appendChild(sheltersStyleSheet);

// Initialize shelters manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.sheltersManager = new SheltersManager();
    
    // Expose for console debugging
    window.SheltersPage = {
        manager: window.sheltersManager,
        simulateEmergency: (area, type) => window.sheltersManager.simulateEmergency(area, type),
        getStatus: () => window.sheltersManager.getSystemStatus()
    };
    
    console.log('🏠 Shelters Page Initialized');
    console.log('💡 Use SheltersPage.simulateEmergency("Area", "type") to test emergency activation');
});// js/shelters.js - Shelters page functionality

class SheltersManager {
    constructor() {
        this.currentView = 'cards';
        this.filteredShelters = [];
        this.allShelters = [];
        this.selectedShelter = null;
        this.checkInOutMode = 'checkin';
        this.mapManager = null;
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.loadShelters();
        this.updateStatistics();
        this.initializeMap();
        this.startRealTimeUpdates();
    }
    
    setupEventListeners() {
        // View switching
        document.querySelectorAll('.view-btn').forEach(btn => {
            btn.addEventListener('click', () => this.switchView(btn.dataset.view));
        });
        
        // Filter controls
        document.getElementById('applyFilters')?.addEventListener('click', () => this.applyFilters());
        document.getElementById('clearFilters')?.addEventListener('click', () => this.clearFilters());
        
        // Real-time filters
        document.getElementById('statusFilter')?.addEventListener('change', () => this.applyFilters());
        document.getElementById('capacityFilter')?.addEventListener('input', () => this.applyFilters());
        document.getElementById('availabilityFilter')?.addEventListener('change', () => this.applyFilters());
        document.getElementById('searchFilter')?.addEventListener('input', () => this.applyFilters());
        
        // Quick actions
        document.getElementById('refreshBtn')?.addEventListener('click', () => this.refreshShelters());
        document.getElementById('findNearestBtn')?.addEventListener('click', () => this.findNearestShelter());
        document.getElementById('checkInBtn')?.addEventListener('click', () => this.showCheckInModal());
        document.getElementById('checkOutBtn')?.addEventListener('click', () => this.showCheckOutModal());
        document.getElementById('emergencyActivateBtn')?.addEventListener('click', () => this.showEmergencyActivationModal());
        
        // Map controls
        document.getElementById('showAllBtn')?.addEventListener('click', () => this.showAllShelters());
        document.getElementById('showAvailableBtn')?.addEventListener('click', () => this.showAvailableShelters());
        document.getElementById('centerLocationBtn')?.addEventListener('click', () => this.centerOnUserLocation());
        
        // Modal controls
        this.setupModalControls();
        
        // Form submissions
        document.getElementById('checkInOutForm')?.addEventListener('submit', (e) => this.handleCheckInOut(e));
        document.getElementById('emergencyActivationForm')?.addEventListener('submit', (e) => this.handleEmergencyActivation(e));
        document.getElementById('emergencyForm')?.addEventListener('submit', (e) => this.handleEmergencyReport(e));
        
        // Emergency button
        document.getElementById('emergencyBtn')?.addEventListener('click', () => this.showEmergencyModal());
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
    
    loadShelters() {
        const { shelters } = window.AlertSlideData;
        this.allShelters = [...shelters];
        this.applyFilters();
    }
    
    applyFilters() {
        const { DataService } = window.AlertSlideData;
        
        const statusFilter = document.getElementById('statusFilter')?.value;
        const capacityFilter = parseInt(document.getElementById('capacityFilter')?.value) || 0;
        const availabilityFilter = document.getElementById('availabilityFilter')?.value;
        const searchFilter = document.getElementById('searchFilter')?.value.toLowerCase();
        
        this.filteredShelters = this.allShelters.filter(shelter => {
            const status = DataService.getShelterStatus(shelter);
            const availableCapacity = shelter.capacity - shelter.currentOccupancy;
            const availabilityPercent = (availableCapacity / shelter.capacity) * 100;
            
            // Status filter
            if (statusFilter && status !== statusFilter) return false;
            
            // Capacity filter
            if (capacityFilter && shelter.capacity < capacityFilter) return false;
            
            // Availability filter
            if (availabilityFilter) {
                switch (availabilityFilter) {
                    case 'available':
                        if (availableCapacity <= 0) return false;
                        break;
                    case 'low':
                        if (availabilityPercent >= 20) return false;
                        break;
                    case 'critical':
                        if (availabilityPercent >= 5) return false;
                        break;
                }
            }
            
            // Search filter
            if (searchFilter) {
                const searchableText = `${shelter.nome} ${shelter.location}`.toLowerCase();
                if (!searchableText.includes(searchFilter)) return false;
            }
            
            return true;
        });
        
        this.renderShelters();
        this.updateMapMarkers();
    }
    
    clearFilters() {
        document.getElementById('statusFilter').value = '';
        document.getElementById('capacityFilter').value = '';
        document.getElementById('availabilityFilter').value = '';
        document.getElementById('searchFilter').value = '';
        
        this.applyFilters();
    }
    
    switchView(view) {
        this.currentView = view;
        
        // Update active button
        document.querySelectorAll('.view-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.view === view);
        });
        
        this.renderShelters();
    }
    
    renderShelters() {
        const container = document.getElementById('sheltersContainer');
        if (!container) return;
        
        if (this.filteredShelters.length === 0) {
            container.innerHTML = this.renderEmptyState();
            return;
        }
        
        // Set container class based on view
        container.className = `shelters-${this.currentView}`;
        
        switch (this.currentView) {
            case 'cards':
                container.innerHTML = this.filteredShelters.map(shelter => this.renderShelterCard(shelter)).join('');
                break;
            case 'list':
                container.innerHTML = this.filteredShelters.map(shelter => this.renderShelterListItem(shelter)).join('');
                break;
            case 'table':
                container.innerHTML = this.renderSheltersTable();
                break;
        }
        
        // Add click handlers
        this.addShelterClickHandlers();
    }
    
    renderShelterCard(shelter) {
        const { DataService } = window.AlertSlideData;
        const status = DataService.getShelterStatus(shelter);
        const occupancyPercent = Math.round((shelter.currentOccupancy / shelter.capacity) * 100);
        const availableSpaces = shelter.capacity - shelter.currentOccupancy;
        
        return `
            <div class="shelter-card ${status}" data-shelter-id="${shelter.id}">
                <div class="shelter-header">
                    <div>
                        <div class="shelter-name">${shelter.nome}</div>
                        <div class="shelter-location">
                            <i class="fas fa-map-marker-alt"></i>
                            ${shelter.location}
                        </div>
                    </div>
                    <div class="shelter-status ${status}">${this.getStatusText(status)}</div>
                </div>
                
                <div class="shelter-info">
                    <div class="info-item">
                        <span class="info-value">${shelter.capacity}</span>
                        <span class="info-label">Capacidade</span>
                    </div>
                    <div class="info-item">
                        <span class="info-value">${availableSpaces}</span>
                        <span class="info-label">Disponível</span>
                    </div>
                </div>
                
                <div class="capacity-bar">
                    <div class="capacity-fill" style="width: ${occupancyPercent}%; background-color: ${this.getCapacityColor(occupancyPercent)}"></div>
                </div>
                
                <div class="shelter-actions">
                    <button class="shelter-action