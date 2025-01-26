# Documentação de Instalação e Uso

## Sumário

- [Documentação de Instalação e Uso](#documentação-de-instalação-e-uso)
  - [Sumário](#sumário)
  - [1. Visão Geral do Projeto](#1-visão-geral-do-projeto)
  - [2. Configuração do Ambiente](#2-configuração-do-ambiente)
    - [2.1 Requisitos](#21-requisitos)
    - [2.2 Instalação](#22-instalação)
    - [2.3 Instalação para Desenvolvimento](#23-instalação-para-desenvolvimento)
      - [Backend (Django)](#backend-django)
      - [Configurar banco de dados PostgreSQL](#configurar-banco-de-dados-postgresql)
      - [Executar migrações](#executar-migrações)
      - [Criar superusuário (opcional)](#criar-superusuário-opcional)
      - [Iniciar servidor](#iniciar-servidor)
      - [Frontend (React)](#frontend-react)
      - [Instalar dependências](#instalar-dependências)
      - [Iniciar](#iniciar)
    - [3. Utilização das Funcionalidades](#3-utilização-das-funcionalidades)
    - [4. Testes](#4-testes)

---

## 1. Visão Geral do Projeto

Este projeto consiste o backend em Python (Django) e frontend em TypeScript (React). O objetivo é fornecer funcionalidades de autenticação e gerenciamento de livros.

---

## 2. Configuração do Ambiente

### 2.1 Requisitos

- [Python 3.9+](https://www.python.org/downloads/)
- [Node.js 18+](https://nodejs.org/en/download/)
- [Yarn](https://classic.yarnpkg.com/en/docs/install)
- [Docker](https://docs.docker.com/engine/install/)
- [Docker Compose](https://docs.docker.com/compose/install/)

### 2.2 Instalação

1. **Clonar o repositório:**

   ```bash
   git clone https://github.com/leonzv/dpsc-atividade.git
   cd dpsc-atividade
   ```

2. **Criar o arquivo ```.env```:**

- Copie o arquivo ```.env.example``` para ```.env``` e preencha com as suas configurações.

3. **Subir os contêineres:**

```bash
docker-compose up --build
```

4. **Verificar a execução:**

- Backend disponível em ```http://localhost:8000```
- Frontend disponível em ```http://localhost:5173```

Deixe o PostgreSQL rodando em container para que não precise instalá-lo diretamente no seu sistema :D

- PostgreSQL: Rodando na porta ```5432``` no host

---

### 2.3 Instalação para Desenvolvimento

#### Backend (Django)

1. **Criar e ativar o ambiente virtual:**

    - **Windows:**

        ```bash
        python -m venv venv
        venv\Scripts\activate
        ```

    - **Linux/MacOS:**

        ```bash
        python3 -m venv venv
        source venv/bin/activate
        ```

Instalar dependências:

```bash
cd dpsc-atividade-backend
pip install -r requirements.txt
```

#### Configurar banco de dados PostgreSQL

#### Executar migrações

```bash
python manage.py migrate
```

#### Criar superusuário (opcional)

Por padrão, foi criado um usuário admin com as seguintes credenciais:

Email: <admin@admin.com>  
Username: admin  
Senha: admin123

*Você também pode se registrar no próprio site :D*

Caso queira criar manualmente antes de entrar no site:

```bash
python manage.py createsuperuser
```

#### Iniciar servidor

```bash
python manage.py runserver
```

#### Frontend (React)

#### Instalar dependências

```bash
cd dpsc-atividade-frontend
yarn install
```

#### Iniciar

```bash
yarn dev
```

Disponível em <http://localhost:5173>.

---

### 3. Utilização das Funcionalidades

- **Autenticação:**
  - Login, registro e acesso a páginas protegidas.
  - **Funcionalidades Adicionais:**
    1. Você só pode criar, editar e deletar se estiver autenticado.
    2. Se não estiver autenticado, o menu de criar não aparecerá e botões de deletar também não estarão visíveis.
    3. As rotas para criar e editar estão protegidas e não podem ser acessadas sem autenticação.

- **Gerenciamento dos livros:**
  - Cadastro, listagem, edição e remoção de livros.
  - **Funcionalidades Adicionais:**
    1. Na listagem de livros, você pode editar e excluir cada item.
    2. Para criar um novo livro, clique no menu "Adicionar Livro" na barra lateral.
    3. O formulário de criação possui menus de sugestões ao lado direito, digitando um autor ou título, as sugestões começam a aparecer.
    4. Clicar em uma sugestão preenche automaticamente os campos correspondentes.
  - **Admin Django:** Área de controle de administração, acesse <http://localhost:8000/admin>.

### 4. Testes

- **Backend:** ```pytest``` (se configurado o ambiente de desenvolvimento).
- **Frontend:** ```yarn test``` (se configurado o ambiente de desenvolvimento).
