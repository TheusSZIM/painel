# 🔌 Documentação da API

Esta documentação descreve a API do FleetControl Pro para integração com Google Apps Script.

## 📋 Índice

- [Visão Geral](#visão-geral)
- [Autenticação](#autenticação)
- [Endpoints](#endpoints)
- [Exemplos](#exemplos)
- [Códigos de Erro](#códigos-de-erro)

## 🔭 Visão Geral

A API do FleetControl Pro utiliza **JSONP** (JSON with Padding) para comunicação cross-origin com Google Apps Script.

### URL Base

```
https://script.google.com/macros/s/{SCRIPT_ID}/exec
```

### Formato de Resposta

Todas as respostas seguem o formato:

```javascript
callbackName({
  "success": true|false,
  "data": [...],        // Para getAll
  "error": "mensagem"   // Em caso de erro
});
```

## 🔐 Autenticação

A API atualmente não requer autenticação. O acesso é controlado pelas configurações de deploy do Google Apps Script.

### Configurações de Deploy Recomendadas

- **Executar como:** Eu (dono do script)
- **Quem pode acessar:** Qualquer pessoa

## 🔌 Endpoints

### `getAll`

Retorna todas as solicitações cadastradas.

**Método:** `GET`

**Parâmetros:**
| Parâmetro | Tipo | Obrigatório | Descrição |
|-----------|------|-------------|-----------|
| `action` | string | Sim | `getAll` |
| `callback` | string | Sim | Nome da função callback |

**Resposta de Sucesso:**

```javascript
cb_1234567890({
  "success": true,
  "data": [
    {
      "id": 1,
      "carimbo": "01/01/2024 10:00:00",
      "solicitante": "João Silva",
      "area": "Logística",
      "tipoOperacao": "Operação de Carga",
      "codigoItem": "ABC123",
      "localizacao": "Armazém Principal",
      "observacao": "Urgente",
      "status": "Pendente",
      "tempoInicio": null,
      "duracao": null
    },
    {
      "id": 2,
      "carimbo": "01/01/2024 10:30:00",
      "solicitante": "Maria Santos",
      "area": "Recebimento",
      "tipoOperacao": "Descarga de Material",
      "codigoItem": "XYZ789",
      "localizacao": "Doca 3",
      "observacao": "",
      "status": "Em Andamento",
      "tempoInicio": "01/01/2024 10:35:00",
      "duracao": null
    }
  ]
});
```

**Resposta de Erro:**

```javascript
cb_1234567890({
  "success": false,
  "error": "Erro ao acessar planilha"
});
```

---

### `startTask`

Inicia uma tarefa, alterando seu status para "Em Andamento".

**Método:** `GET`

**Parâmetros:**
| Parâmetro | Tipo | Obrigatório | Descrição |
|-----------|------|-------------|-----------|
| `action` | string | Sim | `startTask` |
| `callback` | string | Sim | Nome da função callback |
| `id` | number | Sim | ID da tarefa |

**Resposta de Sucesso:**

```javascript
cb_1234567890({
  "success": true,
  "message": "Tarefa iniciada com sucesso"
});
```

**Resposta de Erro:**

```javascript
cb_1234567890({
  "success": false,
  "error": "Tarefa não encontrada"
});
```

---

### `completeTask`

Finaliza uma tarefa, alterando seu status para "Concluído".

**Método:** `GET`

**Parâmetros:**
| Parâmetro | Tipo | Obrigatório | Descrição |
|-----------|------|-------------|-----------|
| `action` | string | Sim | `completeTask` |
| `callback` | string | Sim | Nome da função callback |
| `id` | number | Sim | ID da tarefa |
| `duracao` | string | Sim | Duração formatada (MM:SS) |

**Resposta de Sucesso:**

```javascript
cb_1234567890({
  "success": true,
  "message": "Tarefa concluída com sucesso"
});
```

**Resposta de Erro:**

```javascript
cb_1234567890({
  "success": false,
  "error": "Tarefa não está em andamento"
});
```

---

## 💻 Exemplos

### JavaScript (Frontend)

```javascript
// Configuração
const API_URL = 'https://script.google.com/macros/s/SEU_SCRIPT_ID/exec';

// Função auxiliar para requisições JSONP
function apiRequest(action, data = {}) {
    return new Promise((resolve, reject) => {
        const callbackName = 'cb_' + Date.now();
        const script = document.createElement('script');
        
        const params = new URLSearchParams({
            action: action,
            callback: callbackName,
            ...data
        });
        
        window[callbackName] = function(response) {
            delete window[callbackName];
            document.head.removeChild(script);
            resolve(response);
        };
        
        script.onerror = () => {
            delete window[callbackName];
            document.head.removeChild(script);
            reject(new Error('Falha na requisição'));
        };
        
        setTimeout(() => {
            if (window[callbackName]) {
                delete window[callbackName];
                document.head.removeChild(script);
                reject(new Error('Timeout'));
            }
        }, 10000);
        
        script.src = API_URL + '?' + params.toString();
        document.head.appendChild(script);
    });
}

// Exemplos de uso

// Buscar todas as solicitações
apiRequest('getAll')
    .then(result => {
        if (result.success) {
            console.log('Solicitações:', result.data);
        }
    })
    .catch(error => {
        console.error('Erro:', error);
    });

// Iniciar uma tarefa
apiRequest('startTask', { id: 1 })
    .then(result => {
        if (result.success) {
            console.log('Tarefa iniciada!');
        }
    });

// Completar uma tarefa
apiRequest('completeTask', { id: 1, duracao: '05:30' })
    .then(result => {
        if (result.success) {
            console.log('Tarefa concluída!');
        }
    });
```

### cURL

```bash
# Buscar todas as solicitações
curl -X GET "https://script.google.com/macros/s/SEU_SCRIPT_ID/exec?action=getAll&callback=test"

# Iniciar uma tarefa
curl -X GET "https://script.google.com/macros/s/SEU_SCRIPT_ID/exec?action=startTask&id=1&callback=test"

# Completar uma tarefa
curl -X GET "https://script.google.com/macros/s/SEU_SCRIPT_ID/exec?action=completeTask&id=1&duracao=05:30&callback=test"
```

---

## ❌ Códigos de Erro

| Código | Descrição | Solução |
|--------|-----------|---------|
| `Ação inválida` | Ação não reconhecida | Verifique o parâmetro `action` |
| `Tarefa não encontrada` | ID da tarefa não existe | Verifique o ID fornecido |
| `Tarefa não está em andamento` | Tentativa de completar tarefa não iniciada | Inicie a tarefa primeiro |
| `Erro ao acessar planilha` | Problema com Google Sheets | Verifique permissões da planilha |
| `Timeout` | Requisição demorou muito | Verifique conexão e tente novamente |

---

## 📊 Limites

| Limite | Valor | Descrição |
|--------|-------|-----------|
| Timeout | 10 segundos | Tempo máximo de espera |
| Tamanho da resposta | 50 MB | Limite do Google Apps Script |
| Requisições por dia | 20.000 | Limite do plano gratuito |

---

## 🔗 Recursos Relacionados

- [Google Apps Script Documentation](https://developers.google.com/apps-script)
- [JSONP Pattern](https://en.wikipedia.org/wiki/JSONP)
- [CORS](https://developer.mozilla.org/pt-BR/docs/Web/HTTP/CORS)

---

<p align="center">
  <a href="../README.md">← Voltar para README</a>
</p>
