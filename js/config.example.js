/**
 * FleetControl Pro - Configuração
 * 
 * Copie este arquivo para config.js e preencha com suas informações
 */

const CONFIG = {
    // URL da API do Google Apps Script
    // Substitua pela URL do seu deploy
    API_URL: 'https://script.google.com/macros/s/SEU_SCRIPT_ID_AQUI/exec',
    
    // URL do Google Forms
    GOOGLE_FORM_URL: 'https://docs.google.com/forms/d/e/SEU_FORM_ID_AQUI/viewform',
    
    // Intervalo de atualização automática (em milissegundos)
    // Padrão: 30000 (30 segundos)
    REFRESH_INTERVAL: 30000,
    
    // Timeout para requisições (em milissegundos)
    // Padrão: 10000 (10 segundos)
    REQUEST_TIMEOUT: 10000,
    
    // Configurações de debug
    DEBUG: false,
    
    // Versão da aplicação
    VERSION: '1.0.0'
};

// Exporta para uso em outros módulos (se usar ES6 modules)
// export default CONFIG;
