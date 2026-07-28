# 🎵 Audio Wave

> Uma API RESTful de streaming e gerenciamento musical inspirada em players modernos (como Spotify, YouTube Music e Apple Music), construída com Java e Spring Boot, consumindo a **Jamendo API** para catálogo de músicas.

---

## 🎧 Sobre o Projeto

O **Audio Wave** nasceu com o objetivo de simular a infraestrutura de um serviço de streaming de música moderno. Além de gerenciar contas de usuários com diferentes níveis de acesso (`USER` e `ADMIN`), a aplicação foi projetada para interagir com a **Jamendo API**, permitindo a descoberta, busca e reprodução de faixas musicais de forma legal e gratuita.

---

## 🚀 Tecnologias Utilizadas

* **Java 21**
* **Spring Boot**
* **Spring Security** (Autenticação Stateless, JWT e Filtros customizados)
* **Spring Data JPA / Hibernate** (Persistência de dados)
* **PostgreSQL** (Banco de dados relacional)
* **Docker & Docker Compose** (Containerização completa do ambiente)
* **Lombok & Jakarta Validation**

---

## ⚙️ Arquitetura e Funcionalidades

* **Autenticação & Autorização:** Sistema de login seguro com JWT, controle de perfis (`ADMIN` e `USER`) via `@PreAuthorize`.
* **Gerenciamento de Usuários:** Cadastro, exclusão de conta própria (`/me`) e controle administrativo de usuários.
* **Segurança Avançada:** Validação de senha atual (`/verify-password`) para ações críticas e fluxo completo de **Recuperação de Senha** via token temporário com expiração.

---

## 📋 Pré-requisitos

* **Docker** e **Docker Compose** instalados.

---

## 🐳 Como Rodar o Projeto com Docker

1. Clone o repositório:
   ```bash
   git clone [https://github.com/seu-usuario/audio-wave-backend.git](https://github.com/seu-usuario/audio-wave-backend.git)
   cd audio-wave-backend
   ```
3. Suba os containers com o Docker Compose:
   ```bash
   docker compose up -d --build
   ```
   A API estará rodando e pronta para receber requisições em: http://localhost:8080

# 🔌 Documentação dos Endpoints

## 🔓 Rotas Públicas (`/auth`)

### `POST /auth/register`
Cadastra um novo usuário.

### `POST /auth/login`
Realiza o login e retorna o Token JWT.

### `POST /auth/forgot-password`
Solicita a recuperação de senha.

### `GET /auth/reset-password?token={token}`
Valida se o token de recuperação é válido.

### `POST /auth/reset-password`
Efetiva a troca de senha.

---

## 🔒 Rotas Protegidas
> **Requer Header:** `Authorization: Bearer <TOKEN>`

### `POST /auth/verify-password`
Valida a senha atual do usuário logado.

### `DELETE /api/users/me`
Deleta a própria conta.

### `GET /api/users/{id}`
Busca usuário por ID.  
**Restrito a:** `ADMIN`

### `DELETE /api/users/{id}`
Deleta usuário por ID.  
**Restrito a:** `ADMIN`

---

## 🚧 Em breve

Endpoints integrados com a **Jamendo API** para busca de faixas e playlists.

---

# 🛡️ Como testar no Postman

1. Faça uma requisição **POST** para:
   ```text
   http://localhost:8080/auth/login
   ```
   utilizando suas credenciais.

2. Copie o **Token JWT** retornado na resposta.

3. Nas rotas protegidas:
   - Acesse a aba **Authorization**;
   - Selecione **Bearer Token**;
   - Cole o token JWT no campo correspondente.
  
# ✒️ Autor

Desenvolvido por Eduardo Semeão
