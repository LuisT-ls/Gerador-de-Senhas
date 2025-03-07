# 🔐 Gerador de Senhas Fortes e Seguras

Uma aplicação web moderna para geração e análise de senhas seguras, com diversas ferramentas complementares para segurança digital.

![Gerador de Senhas](https://github.com/LuisT-ls/Gerador-de-Senhas/raw/main/screenshot.png)

## 🌟 Funcionalidades

### ⚡ Geração de Senhas

- Controle total sobre o comprimento da senha (8-64 caracteres)
- Personalização de tipos de caracteres (maiúsculas, minúsculas, números, símbolos)
- Opções avançadas (exclusão de caracteres ambíguos, evitar repetições)
- Configuração de formato (iniciar com maiúscula, terminar com número)
- Geração de múltiplas senhas simultaneamente

### 🛠️ Ferramentas Adicionais

- **Analisador de Senhas**: Verifique a força e segurança de suas senhas existentes
- **Gerador para Wi-Fi**: Crie senhas ideais para compartilhar acesso à sua rede
- **Gerador de PIN**: Produza códigos PIN seguros para uso em dispositivos
- **Gerador de Passphrase**: Crie frases-senha fáceis de lembrar e difíceis de quebrar

### 📁 Gerenciamento de Senhas

- Salve senhas com nome, categoria e notas
- Histórico de senhas geradas recentemente
- Exportação e importação de senhas (CSV/JSON)
- Opção de encriptação básica para arquivos exportados

### 📚 Recursos Educativos

- Glossário completo com conceitos de segurança digital
- Dicas para criação de senhas seguras
- Análises detalhadas da força da senha com sugestões para melhorar

## 🔧 Tecnologias Utilizadas

- **HTML5**: Estrutura semântica e acessível
- **CSS3**: Design responsivo com variáveis CSS e modo escuro
- **JavaScript (ES6+)**: Programação modular com padrões modernos
- **LocalStorage API**: Armazenamento seguro de dados no navegador

## 🚀 Como Usar

### Instalação Local

1. Clone o repositório:

   ```bash
   git clone https://github.com/LuisT-ls/Gerador-de-Senhas.git
   ```

2. Abra o arquivo `index.html` em seu navegador ou utilize um servidor local.

### Acesso Online

Acesse a versão online em: [https://geracaodesenhas.vercel.app/](https://geracaodesenhas.vercel.app/)

## 🔍 Guia de Uso

### Gerador Principal

1. Defina o comprimento desejado usando o slider
2. Selecione os tipos de caracteres que deseja incluir
3. Configure opções avançadas se necessário
4. Clique em "Gerar Senha"
5. Use os botões para copiar, atualizar ou salvar a senha

### Analisador de Senhas

1. Digite a senha que deseja verificar
2. Clique em "Analisar Senha"
3. Veja a análise detalhada com pontuação de força
4. Consulte as sugestões para melhorar a segurança

### Exportação e Importação

1. Na seção "Gerenciar Senhas", vá para a aba "Exportar/Importar"
2. Selecione o formato desejado (CSV ou JSON)
3. Para importar, selecione um arquivo previamente exportado

## 💼 Recursos para Desenvolvedores

### Estrutura do Projeto

```
.
├── ./assets
│   ├── ./assets/css
│   │   ├── ./assets/css/main.css
│   │   └── ./assets/css/modules
│   │       ├── ./assets/css/modules/base
│   │       ├── ./assets/css/modules/components
│   │       ├── ./assets/css/modules/features
│   │       ├── ./assets/css/modules/layout
│   │       └── ./assets/css/modules/utils
│   └── ./assets/img
├── ./index.html
├── ./js
│   ├── ./js/app.js
│   └── ./js/modules
│       ├── ./js/modules/core
│       │   ├── ./js/modules/core/analyzer.js
│       │   ├── ./js/modules/core/entropy.js
│       │   ├── ./js/modules/core/generator.js
│       │   └── ./js/modules/core/utils.js
│       ├── ./js/modules/features
│       ├── ./js/modules/glossary
│       ├── ./js/modules/storage
│       └── ./js/modules/ui
└── ./README.md
```

### Extensão e Personalização

- Adição de novos tipos de geradores:

  1. Crie um módulo em `js/modules/features/`
  2. Implemente a lógica de geração em `js/modules/core/generator.js`
  3. Registre o novo módulo em `js/app.js`

- Personalização do estilo:
  1. Os estilos são organizados de forma modular em `assets/css/modules/`
  2. Variáveis CSS globais estão em `assets/css/modules/base/variables.css`

## 🛡️ Segurança

- Todas as operações são realizadas localmente no navegador
- Nenhum dado é enviado para servidores externos
- Senhas são armazenadas apenas no localStorage do navegador
- Recomendamos limpar o histórico do navegador após usar em computadores compartilhados

## 🤝 Contribuição

Contribuições são bem-vindas! Para contribuir:

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📝 Melhorias Futuras

- [ ] Integração com APIs de verificação de vazamentos de senhas
- [ ] Backup em nuvem com criptografia de ponta a ponta
- [ ] Geração de QR codes para senhas Wi-Fi
- [ ] Tema personalizado pelo usuário
- [ ] Versão PWA para instalação offline

## 📜 Licença

Este projeto está licenciado sob a Licença MIT - veja o arquivo [LICENSE](LICENSE) para detalhes.

## 👤 Autor

**Luís Antonio Souza Teixeira**

- GitHub: [LuisT-ls](https://github.com/LuisT-ls)

---

⭐️ Se este projeto te ajudou, considere dar uma estrela no GitHub! ⭐️
