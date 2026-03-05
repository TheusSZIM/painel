# 🤝 Contribuindo com FleetControl Pro

Obrigado por seu interesse em contribuir com o FleetControl Pro! Este documento fornece diretrizes para contribuir com o projeto.

## 📋 Índice

- [Código de Conduta](#código-de-conduta)
- [Como Contribuir](#como-contribuir)
- [Reportando Bugs](#reportando-bugs)
- [Sugerindo Features](#sugerindo-features)
- [Pull Requests](#pull-requests)
- [Estilo de Código](#estilo-de-código)
- [Desenvolvimento](#desenvolvimento)

## 📜 Código de Conduta

Este projeto segue um código de conduta que esperamos que todos os contribuidores sigam:

- Seja respeitoso e inclusivo
- Aceite críticas construtivas
- Foque no que é melhor para a comunidade
- Mostre empatia com outros membros

## 🚀 Como Contribuir

### 1. Fork o Repositório

```bash
# Clone seu fork
git clone https://github.com/seu-usuario/fleetcontrol-pro.git
cd fleetcontrol-pro
```

### 2. Crie uma Branch

```bash
# Crie uma branch para sua feature ou bugfix
git checkout -b feature/nome-da-feature
# ou
git checkout -b fix/nome-do-bug
```

### 3. Faça suas Alterações

- Escreva código limpo e bem documentado
- Siga as convenções de estilo do projeto
- Teste suas alterações

### 4. Commit suas Alterações

```bash
# Adicione os arquivos modificados
git add .

# Faça o commit com uma mensagem descritiva
git commit -m "feat: adiciona nova funcionalidade X"
```

#### Convenção de Commits

Usamos [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` - Nova funcionalidade
- `fix:` - Correção de bug
- `docs:` - Mudanças na documentação
- `style:` - Mudanças de formatação
- `refactor:` - Refatoração de código
- `test:` - Adição ou correção de testes
- `chore:` - Tarefas de manutenção

### 5. Push e Pull Request

```bash
# Envie para seu fork
git push origin feature/nome-da-feature
```

Depois, abra um Pull Request no GitHub.

## 🐛 Reportando Bugs

### Antes de Reportar

- Verifique se o bug já foi reportado
- Teste na versão mais recente
- Tente identificar os passos para reproduzir

### Como Reportar

Use o template de [Bug Report](.github/ISSUE_TEMPLATE/bug_report.md) e inclua:

- Descrição clara do problema
- Passos para reproduzir
- Comportamento esperado vs atual
- Screenshots (se aplicável)
- Ambiente (OS, navegador, versão)
- Logs de erro

## 💡 Sugerindo Features

### Antes de Sugerir

- Verifique se a feature já foi sugerida
- Considere se a feature está no escopo do projeto

### Como Sugerir

Use o template de [Feature Request](.github/ISSUE_TEMPLATE/feature_request.md) e inclua:

- Descrição clara da feature
- Problema que resolve
- Solução proposta
- Alternativas consideradas
- Mockups (se aplicável)

## 🔀 Pull Requests

### Processo de Review

1. Todos os PRs são revisados por mantenedores
2. CI deve passar (se configurado)
3. Pode ser solicitado mudanças
4. Após aprovação, será feito o merge

### Critérios de Aceitação

- [ ] Código segue o estilo do projeto
- [ ] Testes passam (se aplicável)
- [ ] Documentação atualizada
- [ ] Sem conflitos de merge
- [ ] Mensagens de commit claras

## 🎨 Estilo de Código

### HTML

- Use tags semânticas
- Inclua atributos ARIA quando necessário
- Mantenha indentação de 4 espaços

```html
<!-- Bom -->
<button class="btn btn-primary" aria-label="Enviar formulário">
    Enviar
</button>

<!-- Evite -->
<div class="btn" onclick="submit()">Enviar</div>
```

### CSS

- Use variáveis CSS para cores e valores repetidos
- Siga a metodologia BEM para classes
- Comente seções importantes

```css
/* ============================================
   Componente: Botão
   ============================================ */
.btn {
    padding: var(--spacing-md);
    background: var(--color-primary);
}

.btn--primary {
    background: var(--color-primary);
}

.btn--large {
    padding: var(--spacing-lg);
}
```

### JavaScript

- Use ES6+ (const, let, arrow functions)
- Documente funções com JSDoc
- Evite código duplicado

```javascript
/**
 * Calcula o tempo decorrido
 * @param {Date} startTime - Data de início
 * @returns {string} - Tempo formatado (MM:SS)
 */
function calculateElapsedTime(startTime) {
    const now = new Date();
    const diff = Math.floor((now - startTime) / 1000);
    const mins = Math.floor(diff / 60).toString().padStart(2, '0');
    const secs = (diff % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
}
```

## 💻 Desenvolvimento

### Estrutura de Arquivos

```
fleetcontrol-pro/
├── index.html          # Página principal
├── css/
│   └── styles.css      # Estilos globais
├── js/
│   └── app.js          # Lógica principal
├── assets/             # Recursos estáticos
└── docs/               # Documentação
```

### Servidor de Desenvolvimento

```bash
# Opção 1: Python
python -m http.server 8000

# Opção 2: Node.js (npx serve)
npx serve .

# Opção 3: PHP
php -S localhost:8000
```

### Testes

Teste em diferentes:
- Navegadores (Chrome, Firefox, Safari, Edge)
- Tamanhos de tela (mobile, tablet, desktop)
- Sistemas operacionais

### Debug

Use as ferramentas de desenvolvedor do navegador:
- Console para logs
- Network para requisições API
- Elements para inspeção de DOM
- Lighthouse para performance

## 📞 Contato

- **Issues:** [GitHub Issues](https://github.com/seu-usuario/fleetcontrol-pro/issues)
- **Discussions:** [GitHub Discussions](https://github.com/seu-usuario/fleetcontrol-pro/discussions)

## 🙏 Agradecimentos

Agradecemos a todos que contribuem para tornar o FleetControl Pro melhor!

---

<p align="center">
  Feito com 💜 pela comunidade
</p>
