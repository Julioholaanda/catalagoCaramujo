# Git - Guia Simples

## O que é Git?

Git salva versões do seu código. É como um "ctrl+z" infinito para seus projetos.

## Configuração (fazer uma vez)

```bash
git config --global user.name "Seu Nome"
git config --global user.email "seu@email.com"
```

## Comandos Principais

### Começar

```bash
# Criar novo repositório
git init

# Copiar repositório existente
git clone https://github.com/usuario/repo.git
```

### Dia a dia

```bash
# Ver o que mudou
git status

# Adicionar arquivos
git add .

# Salvar mudanças
git commit -m "o que você fez"

# Enviar para GitHub
git push origin main

# Baixar atualizações
git pull origin main
```

## Fluxo Básico

1. Faça suas mudanças nos arquivos
2. `git add .`
3. `git commit -m "descrição"`
4. `git push origin main`

## Arquivo .gitignore

Crie um arquivo chamado `.gitignore` para ignorar coisas que não devem ir pro Git:

```
node_modules/
.env
.DS_Store
```

## Dica

Pratique! A melhor forma de aprender é fazendo.