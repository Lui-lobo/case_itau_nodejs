# 🏦 Case Itaú – API Node.js (NestJS + Prisma)

API desenvolvida em **Node.js com NestJS e Prisma ORM**, estruturada para oferecer **alta escalabilidade, segurança e padronização**, seguindo os princípios de arquitetura **MSC (Model–Service–Controller)** e boas práticas modernas de desenvolvimento backend.

---

## 📑 Sumário

1. [📘 Descrição Geral](#-descrição-geral)
2. [🏗️ Arquitetura do Projeto](#️-arquitetura-do-projeto)
3. [⚙️ Tecnologias e Bibliotecas](#️-tecnologias-e-bibliotecas)
4. [🧱 Estrutura de Pastas](#-estrutura-de-pastas)
5. [🔐 Segurança e Autenticação](#-segurança-e-autenticação)
6. [🧰 Boas Práticas Aplicadas](#-boas-práticas-aplicadas)
7. [🧠 Padrão de Logs e Observabilidade](#-padrão-de-logs-e-observabilidade)
8. [🧪 Testes Unitários e de Integração](#-testes-unitários-e-de-integração)
9. [⌨ Como rodar o projeto localmente](#-como-rodar-o-projeto-localmente)
10. [🐳 Rodar com Docker](#-rodar-com-docker)
11. [🚀 Execução e Scripts](#-execução-e-scripts)
12. [📈 Futuras Melhorias](#-futuras-melhorias)
13. [📄 Acesso à Documentação Swagger](#-acesso-à-documentação-swagger)
14. [👨‍💻 Autor](#-autor)

---

## 📘 Descrição Geral

Esta aplicação simula o backend de um sistema bancário modularizado, com foco em:

- **Gestão de clientes e transações (depósitos, saques e saldo)**  
- **Autenticação segura com JWT e Clients registrados**  
- **Camadas desacopladas (Controller, Service, Model)**  
- **Auditoria, logs e rastreamento por request**

A arquitetura foi projetada para **crescimento sustentável**, **testabilidade** e **resiliência**, adotando princípios inspirados em **Clean Architecture** e **Domain-Driven Design (DDD)**.

---

## 🏗️ Arquitetura do Projeto

O projeto segue o padrão **MSC (Model–Service–Controller)**, onde cada módulo tem responsabilidades bem definidas:

| Camada | Responsabilidade | Localização |
|--------|------------------|-------------|
| **Model** | Representa as entidades e acesso ao banco via Prisma ORM | `/prisma/schema` |
| **Service** | Contém a lógica de negócio e chamadas aos métodos de dados | `/src/apis/**/methods/` |
| **Controller** | Expõe endpoints HTTP e orquestra chamadas aos serviços | `/src/apis/**.controller.ts` |

### 🧩 Fluxo da Requisição

- Request → Controller → Service → Prisma → Database → Response
- Cada módulo é **isolado e testável**, e os serviços chamam métodos modulares (em `/methods`), o que permite **granularidade nos testes unitários** e manutenção simplificada.

---

## ⚙️ Tecnologias e Bibliotecas

| Categoria | Tecnologia |
|------------|------------|
| **Framework Backend** | [NestJS 11](https://nestjs.com/) |
| **ORM / Database** | [Prisma 6.17](https://www.prisma.io/) |
| **Banco Padrão** | SQLite (padrão dev) / PostgreSQL (suporte futuro) |
| **Autenticação** | JWT + Passport |
| **Criptografia** | bcryptjs |
| **Validação** | class-validator + class-transformer |
| **Documentação** | Swagger (auto gerada) |
| **Logs e Observabilidade** | Logger customizado com Request ID Tracking |
| **Testes** | Jest + Supertest (unitários e integração) |

---

## 🧱 Estrutura de Pastas

```bash
src/
├── apis/
│   ├── clientes/
│   │   ├── clientes.controller.ts
│   │   ├── clientes.service.ts
│   │   ├── methods/
│   │   │   ├── getAllClientes.ts
│   │   │   ├── getClienteById.ts
│   │   │   ├── depositar.ts
│   │   │   ├── sacar.ts
│   │   │   ├── updateCliente.ts
│   │   │   └── deleteCliente.ts
│   │   └── dto/
│   │       ├── create-cliente.dto.ts
│   │       ├── update-cliente.dto.ts
│   │       └── transaction.dto.ts
│   └── prisma/
│       ├── prisma.module.ts
│       └── prisma.service.ts
│
├── auth/
│   ├── users/
│   │   ├── users.controller.ts
│   │   ├── users.service.ts
│   │   ├── methods/
│   │   │   ├── registerCliente.ts
│   │   │   ├── loginCliente.ts
│   │   │   └── validateById.ts
│   ├── clients.guard.ts
│   └── guards/jwt-auth.guard.ts
│
├── common/
│   ├── logger/logger.service.ts
│   ├── crypto/crypto.service.ts
│   └── health/health.controller.ts
│
└── __tests__/
    ├── unit/
    ├── integration/
    └── setup/
```

## 🔐 Segurança e Autenticação

O sistema implementa duas camadas de segurança:

# 🧱 1. Autenticação de Client (Aplicação)
Cada aplicação que consome a API precisa possuir um registro em Client, com:
-  clientId
-  clientSecret
-  allowedRoutes
Um guard (ClientAuthGuard) valida as credenciais do Client em cada request.

# 🔑 2. Autenticação de Usuário (Cliente)

Cada cliente (usuário final) realiza login com e-mail e senha. Ao autenticar, é gerado um JWT token com as claims:
```bash
{
  "sub": 1,
  "email": "cliente@teste.com",
  "clientId": 1
}
```
- Esse token é validado pelo JwtAuthGuard, garantindo que apenas usuários logados e vinculados ao client tenham acesso.

# 🔒 Hash de Senhas
- Senhas são criptografadas usando bcryptjs no momento do registro e validadas no login.

# 🧩 Permissões futuras
- O design já suporta adição de roles e perfis de acesso, permitindo expansão para RBAC (Role-Based Access Control).

## 🧰 Boas Práticas Aplicadas
- ✅ Arquitetura MSC modularizada
- ✅ Separação clara entre lógica e camada de persistência
- ✅ DTOs e validações tipadas
- ✅ Logger estruturado com rastreamento de Request ID
- ✅ Interceptores e Guards para segurança de acesso
- ✅ Injeção de dependências (IoC)
- ✅ Testes unitários + integração automatizados
- ✅ Swagger documentando todos os endpoints
- ✅ Erro e exceções padronizados (Nest Exception Filters)
- ✅ Uso de métodos separados por função (/methods) para granularidade de testes

## 🧠 Padrão de Logs e Observabilidade
O sistema usa um Logger customizado (LoggerService) que adiciona:

- Identificador único por requisição (Request-ID)
- Contexto do módulo (ex: ClientesController:list)
- Tempo de execução da operação
- Log automático de inícios e conclusões de métodos
Exemplo:

```bash
[Nest] 20916  LOG [App] [req:a190a160-203a-4a9e-87fb-1fd0807572b1] ClientesController:list {"action":"start"}
[Nest] 20916  LOG [App] [req:a190a160-203a-4a9e-87fb-1fd0807572b1] getAllClientes {"action":"end","durationMs":3,"total":10}
```

## 🧪 Testes Unitários e de Integração
O projeto conta com dois níveis de testes:
- Testam funções individuais em /methods
- Utilizam Jest com mocks (PrismaService, LoggerService etc.)

# 🌐 Integração (End-to-End)
- Usam Supertest para simular requisições reais
- Executam a aplicação real via TestAppFactory
- Testam fluxos como:
- Registro e login de clientes
- Depósito, saque e listagem de transações

## ⌨ Como rodar o projeto localmente

# ⚙️ 2. Clonar o repositório
```bash
git clone https://github.com/Lui-lobo/case_itau_nodejs.git
cd case-itau-nodejs
```

# 📦 3. Instalar dependências
```bash
npm install
```

# 🧠 4. Configurar variáveis de ambiente
Crie um arquivo .env na raiz do projeto (caso não exista):
```bash
# .env
DATABASE_URL="file:./dev.db"
PORT=8080
NODE_ENV=development
JWT_SECRET=default-secret
```
OBS: 💡 Por padrão, este projeto usa SQLite, então não é necessário nenhum banco externo.

# 🧰 5. Criar e preparar o banco de dados
Rode os comandos abaixo para gerar o Prisma Client e criar o banco SQLite:
```bash
npx prisma generate --schema=prisma/schema/schema.prisma
npx prisma db push --schema=prisma/schema/schema.prisma
```

# 🧩 6. Rodar a aplicação em modo desenvolvimento
```bash
npm run start:dev
```
A aplicação estará disponível em: 👉 http://localhost:8080

## 🐳 Rodar com Docker
Caso prefira rodar a aplicação dentro de um container:

# 🏗️ Build da imagem:
```bash
docker build -t case-itau-api .
```

# 🚀 Executar o container:
```bash
docker run -d -p 3000:3000 --name case-itau \
  -e DATABASE_URL="file:/usr/src/app/prisma/dev.db" \
  -e JWT_SECRET="default-secret" \
  case-itau-api
```
A aplicação ficará acessível em: 👉 http://localhost:3000

## 🚀 Execução e Scripts

| Comando                    | Descrição                                 |
| -------------------------- | ----------------------------------------- |
| `npm run start:dev`        | Inicia o servidor em modo desenvolvimento |
| `npm run start`            | Compila e inicia o projeto                |
| `npm run test:unit`        | Executa testes unitários                  |
| `npm run test:integration` | Executa testes de integração              |

## 📈 Futuras Melhorias
- Banco de testes automatizado (isolado do dev)
- Sistema de permissões com perfis (RBAC)
- Cache e filas (Redis / BullMQ)
- Observabilidade com OpenTelemetry
- Versionamento de API e Rate Limiting dinâmico
- Integração com CI/CD para testes e deploy automatizados

## 📄 Acesso à Documentação Swagger
O projeto gera automaticamente uma documentação Swagger interativa.
- A documentação pode ser acessada em: http://localhost:8080/docs#/

# O Swagger exibe todos os endpoints com:
- Descrição
- Métodos HTTP
- Tipagem de entrada e saída
- Exemplos de payload

## 👨‍💻 Autor
- Desenvolvido por Luiz Henrique
