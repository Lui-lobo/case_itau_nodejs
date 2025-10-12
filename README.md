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
9. [🚀 Execução e Scripts](#-execução-e-scripts)
10. [📈 Futuras Melhorias](#-futuras-melhorias)
11. [📄 Acesso à Documentação Swagger](#-acesso-à-documentação-swagger)
12. [👨‍💻 Autor](#-autor)

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

Request → Controller → Service → Prisma → Database → Response
Cada módulo é **isolado e testável**, e os serviços chamam métodos modulares (em `/methods`), o que permite **granularidade nos testes unitários** e manutenção simplificada.

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

