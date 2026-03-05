# ⚡ FleetControl Pro

Sistema de Gerenciamento de Operações e Solicitações em tempo real, integrado com Google Forms e Google Apps Script.

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![Status](https://img.shields.io/badge/status-active-success.svg)

## 📋 Índice

- [Sobre](#sobre)
- [Funcionalidades](#funcionalidades)
- [Demonstração](#demonstração)
- [Tecnologias](#tecnologias)
- [Instalação](#instalação)
- [Configuração](#configuração)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [API](#api)
- [Contribuição](#contribuição)
- [Licença](#licença)

## 🎯 Sobre

O **FleetControl Pro** é uma aplicação web completa para gerenciamento de operações e solicitações. O sistema permite:

- 📨 **Solicitantes**: Enviar solicitações via Google Forms
- ⚙️ **Operadores**: Gerenciar e acompanhar solicitações em tempo real
- 📊 **Dashboard**: Visualizar estatísticas e métricas de operações
- ⏱️ **Timers**: Acompanhar tempo de execução das tarefas

## ✨ Funcionalidades

### Para Solicitantes
- ✅ Interface intuitiva para acesso ao formulário
- ✅ Preview de estatísticas em tempo real
- ✅ Link direto ao Google Forms

### Para Operadores
- ✅ Painel de controle completo
- ✅ Filtros por status (Todas, Pendentes, Andamento, Concluídas)
- ✅ Cards informativos com todos os detalhes
- ✅ Ações rápidas (Iniciar/Finalizar tarefas)
- ✅ Timer automático para tarefas em andamento
- ✅ Atualização automática a cada 30 segundos
- ✅ Indicador de status de conexão
- ✅ Notificações toast

### Geral
- ✅ Design responsivo (mobile, tablet, desktop)
- ✅ Interface moderna e acessível
- ✅ Animações suaves
- ✅ Suporte a temas de cores
- ✅ Compatível com todos os navegadores modernos

## 🖥️ Demonstração

### Screenshots

```
┌─────────────────────────────────────────────────────────────┐
│  ⚡ FleetControl Pro                          Pro Edition   │
├─────────────────────────────────────────────────────────────┤
│  📝 Nova Solicitação                                        │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  📋 Formulário de Solicitação                        │   │
│  │                                                      │   │
│  │  [🚀 Abrir Formulário]                               │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐                  │
│  │    5     │  │    3     │  │   12     │                  │
│  │Aguardando│  │Em Andam. │  │Concluídas│                  │
│  └──────────┘  └──────────┘  └──────────┘                  │
└─────────────────────────────────────────────────────────────┘
```

```
┌─────────────────────────────────────────────────────────────┐
│  ⚡ FleetControl Pro                          Pro Edition   │
├─────────────────────────────────────────────────────────────┤
│  ⚙️ Painel do Operador                          [🔄 Atual.] │
│                                                             │
│  [Todas] [Pendentes] [Andamento] [Concluídas]              │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ ⏳          Operação de Carga          [▶ Iniciar]  │   │
│  │ Aguardando  👤 João Silva • Logística              │   │
│  │             📦 Código: ABC123                      │   │
│  │             📍 Armazém Principal                   │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ ⚙️          Descarga de Material    [⏱️ 05:23 ✓]   │   │
│  │ Em Execução 👤 Maria Santos • Recebimento          │   │
│  │             📦 Código: XYZ789                      │   │
│  │             📍 Doca 3                              │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

## 🛠️ Tecnologias

### Frontend
- **HTML5** - Estrutura semântica
- **CSS3** - Estilização moderna com variáveis CSS
- **JavaScript (ES6+)** - Lógica da aplicação
- **Google Fonts** - Tipografia (Inter, JetBrains Mono)

### Backend/Integração
- **Google Apps Script** - API e processamento de dados
- **Google Forms** - Coleta de solicitações
- **Google Sheets** - Armazenamento de dados

### Design
- **Mobile First** - Responsividade completa
- **Acessibilidade (a11y)** - ARIA labels e navegação por teclado
- **Animações CSS** - Transições suaves

## 📦 Instalação

### Pré-requisitos
- Navegador moderno (Chrome, Firefox, Safari, Edge)
- Conta Google (para integração com Forms)

### Passo a passo

1. **Clone o repositório**
   ```bash
   git clone https://github.com/seu-usuario/fleetcontrol-pro.git
   cd fleetcontrol-pro
   ```

2. **Configure o Google Apps Script**
   - Crie um novo projeto em [script.google.com](https://script.google.com)
   - Copie o código da API (veja seção [API](#api))
   - Faça o deploy como aplicativo web
   - Copie a URL de execução

3. **Configure a aplicação**
   - Edite `js/app.js`
   - Atualize a constante `API_URL` com sua URL do Apps Script
   - Atualize `GOOGLE_FORM_URL` se necessário

4. **Abra o arquivo HTML**
   ```bash
   # Simplesmente abra o index.html no navegador
   open index.html
   
   # Ou use um servidor local
   npx serve .
   ```

## ⚙️ Configuração

### Configuração da API (Google Apps Script)

Crie um novo projeto no Google Apps Script com o seguinte código:

```javascript
// Código da API - Google Apps Script
function doGet(e) {
  const action = e.parameter.action;
  const callback = e.parameter.callback;
  
  let result;
  
  switch(action) {
    case 'getAll':
      result = getAllRequests();
      break;
    case 'startTask':
      result = startTask(e.parameter.id);
      break;
    case 'completeTask':
      result = completeTask(e.parameter.id, e.parameter.duracao);
      break;
    default:
      result = { success: false, error: 'Ação inválida' };
  }
  
  const json = JSON.stringify(result);
  return ContentService.createTextOutput(callback + '(' + json + ');')
    .setMimeType(ContentService.MimeType.JAVASCRIPT);
}

function getAllRequests() {
  // Implemente a lógica para buscar dados da planilha
  // Retorne: { success: true, data: [...] }
}

function startTask(id) {
  // Implemente a lógica para iniciar uma tarefa
  // Retorne: { success: true }
}

function completeTask(id, duracao) {
  // Implemente a lógica para completar uma tarefa
  // Retorne: { success: true }
}
```

### Estrutura da Planilha Google Sheets

| Coluna | Campo | Descrição |
|--------|-------|-----------|
| A | Carimbo | Data/hora da solicitação |
| B | Solicitante | Nome do solicitante |
| C | Área | Departamento/área |
| D | Tipo de Operação | Tipo da operação |
| E | Código do Item | Código identificador |
| F | Localização | Local da operação |
| G | Observação | Observações adicionais |
| H | Status | Pendente/Em Andamento/Concluído |
| I | Tempo Início | Data/hora de início |
| J | Duração | Tempo total de execução |

## 📁 Estrutura do Projeto

```
fleetcontrol-pro/
├── index.html              # Página principal
├── css/
│   └── styles.css          # Estilos da aplicação
├── js/
│   └── app.js              # Lógica JavaScript
├── assets/                 # Imagens, ícones, fontes
│   └── (arquivos estáticos)
├── docs/                   # Documentação adicional
│   └── (guías, tutoriais)
├── .github/                # GitHub Actions, templates
│   └── workflows/
├── README.md               # Este arquivo
├── LICENSE                 # Licença MIT
└── .gitignore             # Arquivos ignorados pelo Git
```

## 🔌 API

### Endpoints

#### `getAll`
Retorna todas as solicitações.

**Resposta:**
```json
{
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
    }
  ]
}
```

#### `startTask`
Inicia uma tarefa.

**Parâmetros:**
- `id` (number): ID da tarefa

**Resposta:**
```json
{
  "success": true
}
```

#### `completeTask`
Finaliza uma tarefa.

**Parâmetros:**
- `id` (number): ID da tarefa
- `duracao` (string): Tempo de execução (formato MM:SS)

**Resposta:**
```json
{
  "success": true
}
```

## 🤝 Contribuição

Contribuições são bem-vindas! Siga os passos:

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/nova-funcionalidade`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request

### Diretrizes
- Mantenha o código limpo e bem documentado
- Siga as convenções de código existentes
- Teste em diferentes navegadores
- Atualize a documentação se necessário

## 📝 Licença

Este projeto está licenciado sob a Licença MIT - veja o arquivo [LICENSE](LICENSE) para detalhes.

```
MIT License

Copyright (c) 2024 FleetControl Pro

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.
```

## 👥 Autores

- **FleetControl Team** - *Desenvolvimento inicial*

## 🙏 Agradecimentos

- Google Apps Script pela plataforma de backend
- Comunidade open source pelas ferramentas e inspiração

---

<p align="center">
  Feito com ⚡ por FleetControl Pro
</p>
