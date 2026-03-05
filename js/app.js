/**
 * FleetControl Pro - Aplicação Principal
 * Sistema de Gerenciamento de Operações
 * 
 * @author FleetControl Team
 * @version 1.0.0
 */

// ============================================
// CONFIGURAÇÕES
// ============================================
const CONFIG = {
    API_URL: 'https://script.google.com/macros/s/AKfycbw19miaBO5m284EgvhDDwvqCq7Hgsus1q8h979Lc8PKmB58vPAPSb3-ou0xEfPRziXM/exec',
    REFRESH_INTERVAL: 30000, // 30 segundos
    REQUEST_TIMEOUT: 10000,  // 10 segundos
    GOOGLE_FORM_URL: 'https://docs.google.com/forms/d/e/1FAIpQLSePgmEk_1wSz9estUD49XRNyBGOufB5zacWu67vbTFkRO8IZg/viewform'
};

// ============================================
// ESTADO DA APLICAÇÃO
// ============================================
const state = {
    currentView: 'solicitante',
    currentFilter: 'all',
    allRequests: [],
    timers: {},
    isOnline: false,
    isLoading: false
};

// ============================================
// FUNÇÕES UTILITÁRIAS
// ============================================

/**
 * Converte valor para string de forma segura
 * @param {*} value - Valor a ser convertido
 * @returns {string} - String segura
 */
function safeString(value) {
    return String(value || '');
}

/**
 * Formata data para exibição
 * @param {string} dateStr - String de data
 * @returns {string} - Data formatada
 */
function formatDate(dateStr) {
    if (!dateStr) return 'N/A';
    try {
        const parts = dateStr.split(/[/ :]/);
        if (parts.length < 3) return dateStr;
        return `${parts[0]}/${parts[1]}/${parts[2]}`;
    } catch (e) {
        return dateStr;
    }
}

/**
 * Debounce para funções
 * @param {Function} func - Função a ser executada
 * @param {number} wait - Tempo de espera
 * @returns {Function} - Função com debounce
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// ============================================
// NAVEGAÇÃO E VIEWS
// ============================================

/**
 * Alterna entre as views da aplicação
 * @param {string} view - Nome da view ('solicitante' ou 'operador')
 */
function switchView(view) {
    state.currentView = view;
    
    // Atualiza navegação
    document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
    const navItem = document.getElementById(`nav-${view}`);
    if (navItem) navItem.classList.add('active');
    
    // Atualiza views
    document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
    const viewElement = document.getElementById(`view-${view}`);
    if (viewElement) viewElement.classList.add('active');
    
    // Fecha sidebar em mobile
    if (window.innerWidth <= 1024) {
        toggleSidebar();
    }
    
    // Carrega dados se necessário
    if (view === 'operador') {
        loadRequests();
    }
}

/**
 * Alterna a visibilidade da sidebar em mobile
 */
function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    if (sidebar) {
        sidebar.classList.toggle('open');
    }
}

// ============================================
// API E COMUNICAÇÃO
// ============================================

/**
 * Realiza requisição à API usando JSONP
 * @param {string} action - Ação a ser executada
 * @param {Object} data - Dados adicionais
 * @returns {Promise} - Promise com a resposta
 */
function apiRequest(action, data = {}) {
    return new Promise((resolve, reject) => {
        const callbackName = `cb_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        const script = document.createElement('script');
        
        const params = new URLSearchParams({
            action: action,
            callback: callbackName,
            ...data
        });
        
        // Callback de sucesso
        window[callbackName] = function(response) {
            cleanup();
            resolve(response);
        };
        
        // Callback de erro
        script.onerror = () => {
            cleanup();
            reject(new Error('Falha na requisição'));
        };
        
        // Timeout
        const timeoutId = setTimeout(() => {
            cleanup();
            reject(new Error('Timeout na requisição'));
        }, CONFIG.REQUEST_TIMEOUT);
        
        // Função de limpeza
        function cleanup() {
            delete window[callbackName];
            clearTimeout(timeoutId);
            if (script.parentNode) {
                document.head.removeChild(script);
            }
        }
        
        script.src = `${CONFIG.API_URL}?${params.toString()}`;
        document.head.appendChild(script);
    });
}

/**
 * Atualiza o status de conexão na UI
 * @param {boolean} online - Estado da conexão
 */
function updateStatus(online) {
    state.isOnline = online;
    const dot = document.getElementById('statusDot');
    const text = document.getElementById('statusText');
    
    if (dot && text) {
        if (online) {
            dot.classList.remove('offline');
            text.textContent = 'Conectado';
        } else {
            dot.classList.add('offline');
            text.textContent = 'Erro de conexão';
        }
    }
}

// ============================================
// GERENCIAMENTO DE ERROS
// ============================================

/**
 * Exibe mensagem de erro
 * @param {string} message - Mensagem de erro
 */
function showError(message) {
    const container = document.getElementById('errorContainer');
    if (container) {
        container.innerHTML = `
            <div class="error-box">
                <strong>⚠️ Erro:</strong> ${message}
            </div>
        `;
    }
}

/**
 * Limpa mensagens de erro
 */
function clearError() {
    const container = document.getElementById('errorContainer');
    if (container) {
        container.innerHTML = '';
    }
}

// ============================================
// CARREGAMENTO DE DADOS
// ============================================

/**
 * Carrega as solicitações da API
 */
async function loadRequests() {
    if (state.isLoading) return;
    
    state.isLoading = true;
    const syncIcon = document.getElementById('syncIcon');
    const syncText = document.getElementById('syncText');
    
    if (syncIcon) syncIcon.classList.add('syncing');
    if (syncText) syncText.textContent = 'Carregando...';
    
    try {
        clearError();
        const result = await apiRequest('getAll');
        
        if (result.success) {
            state.allRequests = result.data || [];
            renderRequests();
            updateStats();
            updateStatus(true);
            updateFormPreview();
        } else {
            throw new Error(result.error || 'Erro desconhecido');
        }
    } catch (error) {
        showError('Não foi possível conectar: ' + error.message);
        updateStatus(false);
    } finally {
        state.isLoading = false;
        if (syncIcon) syncIcon.classList.remove('syncing');
        if (syncText) syncText.textContent = 'Atualizar';
    }
}

/**
 * Atualiza o preview do formulário na tela de solicitante
 */
function updateFormPreview() {
    const pending = state.allRequests.filter(r => r.status === 'Pendente').length;
    const progress = state.allRequests.filter(r => r.status === 'Em Andamento').length;
    const completed = state.allRequests.filter(r => r.status === 'Concluído').length;
    
    const formPending = document.getElementById('form-pending');
    const formProgress = document.getElementById('form-progress');
    const formCompleted = document.getElementById('form-completed');
    
    if (formPending) formPending.textContent = pending || '0';
    if (formProgress) formProgress.textContent = progress || '0';
    if (formCompleted) formCompleted.textContent = completed || '0';
}

// ============================================
// RENDERIZAÇÃO
// ============================================

/**
 * Renderiza a lista de solicitações
 */
function renderRequests() {
    const container = document.getElementById('requests-list');
    if (!container) return;
    
    const filtered = state.currentFilter === 'all' 
        ? state.allRequests 
        : state.allRequests.filter(s => s.status === state.currentFilter);

    if (filtered.length === 0) {
        container.innerHTML = createEmptyState();
        return;
    }

    container.innerHTML = filtered.map(req => createCard(req)).join('');
    
    // Inicia timers para tarefas em andamento
    filtered.forEach(req => {
        if (req.status === 'Em Andamento' && req.tempoInicio) {
            const taskId = req.id || req.ID || req.Id || req.row || req.linha || 0;
            startTimer(taskId, req.tempoInicio);
        }
    });
}

/**
 * Cria o HTML do estado vazio
 * @returns {string} - HTML do estado vazio
 */
function createEmptyState() {
    return `
        <div class="empty-state">
            <div class="empty-state-icon">📭</div>
            <h3>Nenhuma solicitação encontrada</h3>
            <p>As respostas do Google Forms aparecerão aqui automaticamente.</p>
        </div>
    `;
}

/**
 * Cria o HTML de um card de solicitação
 * @param {Object} req - Objeto da solicitação
 * @returns {string} - HTML do card
 */
function createCard(req) {
    console.log('📝 createCard - dados recebidos:', req);
    
    const statusConfig = {
        'Pendente': { 
            icon: '⏳', 
            text: 'Aguardando', 
            class: 'status-pendente', 
            cardClass: 'pendente' 
        },
        'Em Andamento': { 
            icon: '⚙️', 
            text: 'Em Execução', 
            class: 'status-andamento', 
            cardClass: 'em-andamento' 
        },
        'Concluído': { 
            icon: '✓', 
            text: 'Concluído', 
            class: 'status-concluido', 
            cardClass: 'concluido' 
        }
    };

    const config = statusConfig[req.status] || statusConfig['Pendente'];
    
    // Verifica se é urgente
    const isUrgent = safeString(req.observacao).toLowerCase().includes('urgente') || 
                     safeString(req.tipoOperacao).toLowerCase().includes('urgente');

    // Botão de ação baseado no status
    let actionBtn = '';
    const taskId = req.id || req.ID || req.Id || req.row || req.linha || 0;
    console.log('🆔 taskId extraído:', taskId, 'de req:', req);
    
    if (req.status === 'Pendente') {
        actionBtn = `<button class="btn btn-primary" onclick="startTask('${taskId}')" data-task-id="${taskId}"><span>▶</span> Iniciar</button>`;
    } else if (req.status === 'Em Andamento') {
        actionBtn = `<button class="btn btn-success" onclick="completeTask('${taskId}')" data-task-id="${taskId}"><span class="timer" id="timer-${taskId}">00:00</span> ✓ Finalizar</button>`;
    } else {
        actionBtn = `<button class="btn" disabled style="background: #6b7280; color: white;"><span>✓</span> ${req.duracao || 'Concluído'}</button>`;
    }

    return `
        <div class="request-card ${config.cardClass}">
            <div class="card-status">
                <div class="status-icon ${config.class}">${config.icon}</div>
                <span class="status-text">${config.text}</span>
            </div>
            <div class="card-info">
                <div class="card-title-row">
                    <h3 class="card-title">${req.tipoOperacao || 'Operação'}</h3>
                    ${isUrgent ? '<span class="badge badge-urgent">URGENTE</span>' : ''}
                </div>
                <div class="card-meta">
                    <div class="meta-item">
                        <span>👤</span>
                        <strong>${req.solicitante || 'N/A'}</strong> • ${req.area || 'Sem área'}
                    </div>
                    <div class="meta-item">
                        <span>📦</span>
                        Código: ${req.codigoItem || 'N/A'}
                    </div>
                    <div class="meta-item">
                        <span>📍</span>
                        ${req.localizacao || 'Local não informado'}
                    </div>
                    <div class="meta-item">
                        <span>🕐</span>
                        ${req.carimbo || ''}
                    </div>
                    ${req.tempoAtendimento ? `
                        <div class="meta-item">
                            <span>⏱️</span>
                            Previsto: ${req.tempoAtendimento}
                        </div>
                    ` : ''}
                    ${req.observacao ? `
                        <div class="meta-item" style="color: var(--accent); width: 100%;">
                            <span>💬</span>
                            ${req.observacao}
                        </div>
                    ` : ''}
                </div>
            </div>
            <div class="card-actions">
                ${actionBtn}
            </div>
        </div>
    `;
}

// ============================================
// AÇÕES DE TAREFAS
// ============================================

/**
 * Inicia uma tarefa
 * @param {number} id - ID da tarefa
 */
async function startTask(id) {
    console.log('🚀 startTask chamado com ID:', id);
    
    // Valida o ID
    if (!id || id === 'undefined' || id === 'null') {
        console.error('❌ ID inválido:', id);
        showToast('✗ Erro: ID da tarefa inválido');
        return;
    }
    
    // Converte para número
    const taskId = parseInt(id, 10);
    if (isNaN(taskId)) {
        console.error('❌ ID não é um número válido:', id);
        showToast('✗ Erro: ID da tarefa inválido');
        return;
    }
    
    try {
        console.log('📡 Enviando requisição startTask para ID:', taskId);
        const result = await apiRequest('startTask', { id: taskId });
        console.log('📥 Resposta da API:', result);
        
        if (result.success) {
            showToast('✓ Operação iniciada!');
            loadRequests();
        } else {
            throw new Error(result.error || 'Erro desconhecido');
        }
    } catch (error) {
        console.error('❌ Erro em startTask:', error);
        showToast('✗ Erro: ' + error.message);
    }
}

/**
 * Completa uma tarefa
 * @param {number} id - ID da tarefa
 */
async function completeTask(id) {
    console.log('✅ completeTask chamado com ID:', id);
    
    // Valida o ID
    if (!id || id === 'undefined' || id === 'null') {
        console.error('❌ ID inválido:', id);
        showToast('✗ Erro: ID da tarefa inválido');
        return;
    }
    
    // Converte para número
    const taskId = parseInt(id, 10);
    if (isNaN(taskId)) {
        console.error('❌ ID não é um número válido:', id);
        showToast('✗ Erro: ID da tarefa inválido');
        return;
    }
    
    // Limpa o timer
    if (state.timers[taskId]) {
        clearInterval(state.timers[taskId]);
        delete state.timers[taskId];
    }
    
    const finalTime = document.getElementById(`timer-${taskId}`)?.textContent || '00:00';
    
    try {
        console.log('📡 Enviando requisição completeTask para ID:', taskId);
        const result = await apiRequest('completeTask', { 
            id: taskId, 
            duracao: finalTime 
        });
        console.log('📥 Resposta da API:', result);
        
        if (result.success) {
            showToast('✓ Operação concluída!');
            loadRequests();
        } else {
            throw new Error(result.error || 'Erro desconhecido');
        }
    } catch (error) {
        console.error('❌ Erro em completeTask:', error);
        showToast('✗ Erro: ' + error.message);
    }
}

// ============================================
// TIMER
// ============================================

/**
 * Inicia o timer para uma tarefa
 * @param {number} id - ID da tarefa
 * @param {string} startTimeStr - Data/hora de início
 */
function startTimer(id, startTimeStr) {
    try {
        const parts = startTimeStr.split(/[/ :]/);
        if (parts.length < 6) return;
        
        const startTime = new Date(
            parseInt(parts[2]), 
            parseInt(parts[1]) - 1, 
            parseInt(parts[0]), 
            parseInt(parts[3]), 
            parseInt(parts[4]), 
            parseInt(parts[5])
        ).getTime();
        
        // Limpa timer anterior se existir
        if (state.timers[id]) {
            clearInterval(state.timers[id]);
        }
        
        state.timers[id] = setInterval(() => {
            const now = new Date().getTime();
            const diff = Math.floor((now - startTime) / 1000);
            const mins = Math.floor(diff / 60).toString().padStart(2, '0');
            const secs = (diff % 60).toString().padStart(2, '0');
            
            const el = document.getElementById(`timer-${id}`);
            if (el) el.textContent = `${mins}:${secs}`;
        }, 1000);
    } catch (e) {
        console.error('Erro no timer:', e);
    }
}

// ============================================
// ESTATÍSTICAS
// ============================================

/**
 * Atualiza as estatísticas na UI
 */
function updateStats() {
    const pending = state.allRequests.filter(r => r.status === 'Pendente').length;
    const progress = state.allRequests.filter(r => r.status === 'Em Andamento').length;
    const completed = state.allRequests.filter(r => r.status === 'Concluído').length;
    
    const statPending = document.getElementById('stat-pending');
    const statProgress = document.getElementById('stat-progress');
    const statCompleted = document.getElementById('stat-completed');
    const statTotal = document.getElementById('stat-total');
    
    if (statPending) statPending.textContent = pending;
    if (statProgress) statProgress.textContent = progress;
    if (statCompleted) statCompleted.textContent = completed;
    if (statTotal) statTotal.textContent = state.allRequests.length;
}

// ============================================
// FILTROS
// ============================================

/**
 * Filtra as tarefas por status
 * @param {string} status - Status para filtrar
 */
function filterTasks(status) {
    state.currentFilter = status;
    
    // Atualiza tabs
    document.querySelectorAll('.tab').forEach(tab => tab.classList.remove('active'));
    if (event && event.target) {
        event.target.classList.add('active');
    }
    
    renderRequests();
}

// ============================================
// UI FEEDBACK
// ============================================

/**
 * Atualização manual dos dados
 */
function manualRefresh() {
    loadRequests();
    showToast('🔄 Atualizando...');
}

/**
 * Exibe toast notification
 * @param {string} msg - Mensagem a ser exibida
 * @param {number} duration - Duração em ms
 */
function showToast(msg, duration = 3000) {
    // Remove toast anterior
    const existing = document.querySelector('.toast');
    if (existing) existing.remove();
    
    // Cria novo toast
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = msg;
    document.body.appendChild(toast);
    
    // Remove após duração
    setTimeout(() => {
        if (toast.parentNode) {
            toast.remove();
        }
    }, duration);
}

// ============================================
// INICIALIZAÇÃO
// ============================================

/**
 * Inicializa a aplicação
 */
function init() {
    // Carrega dados iniciais
    loadRequests();
    
    // Configura auto-refresh
    setInterval(() => {
        if (state.currentView === 'operador' && 
            document.visibilityState === 'visible' && 
            state.isOnline) {
            loadRequests();
        }
    }, CONFIG.REFRESH_INTERVAL);
    
    // Event listeners
    document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible' && state.currentView === 'operador') {
            loadRequests();
        }
    });
    
    // Fecha sidebar ao clicar fora em mobile
    document.addEventListener('click', (e) => {
        const sidebar = document.getElementById('sidebar');
        const toggle = document.querySelector('.view-toggle');
        
        if (window.innerWidth <= 1024 && 
            sidebar && 
            sidebar.classList.contains('open') &&
            !sidebar.contains(e.target) &&
            !toggle.contains(e.target)) {
            sidebar.classList.remove('open');
        }
    });
    
    console.log('🚀 FleetControl Pro iniciado!');
}

// Inicia quando DOM estiver pronto
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

// Expõe funções necessárias globalmente
window.switchView = switchView;
window.toggleSidebar = toggleSidebar;
window.startTask = startTask;
window.completeTask = completeTask;
window.filterTasks = filterTasks;
window.manualRefresh = manualRefresh;
