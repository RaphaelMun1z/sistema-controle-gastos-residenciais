# Sistema de Controle de Gastos Residenciais

<div align="center">

[![Frontend Latest](https://img.shields.io/github/v/release/RaphaelMun1z/react-sistema-controle-gastos-residenciais?label=Frontend%20latest&style=for-the-badge&color=0EA5E9)](https://github.com/RaphaelMun1z/react-sistema-controle-gastos-residenciais/releases/latest)
[![Backend Latest](https://img.shields.io/github/v/release/RaphaelMun1z/csharp-dotnet-sistema-controle-gastos-residenciais?label=Backend%20latest&style=for-the-badge&color=22C55E)](https://github.com/RaphaelMun1z/csharp-dotnet-sistema-controle-gastos-residenciais/releases/latest)

![React](https://img.shields.io/badge/React-19.2.7-61DAFB?style=for-the-badge&logo=react&logoColor=111827)
![TypeScript](https://img.shields.io/badge/TypeScript-6.0.2-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-8.1.1-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Material UI](https://img.shields.io/badge/Material_UI-9.2.0-007FFF?style=for-the-badge&logo=mui&logoColor=white)

![.NET](https://img.shields.io/badge/.NET-10.0-512BD4?style=for-the-badge&logo=dotnet&logoColor=white)
![Entity Framework Core](https://img.shields.io/badge/EF_Core-10.0.10-68217A?style=for-the-badge&logo=dotnet&logoColor=white)
![SQL Server](https://img.shields.io/badge/SQL_Server-2022-CC2927?style=for-the-badge&logo=microsoftsqlserver&logoColor=white)
![Docker Compose](https://img.shields.io/badge/Docker_Compose-Ready-2496ED?style=for-the-badge&logo=docker&logoColor=white)

</div>

Sistema full stack para controle de gastos residenciais, com frontend em React e API REST em ASP.NET Core. A aplicação permite criar conta, fazer login, cadastrar pessoas, registrar receitas e despesas, consultar transações e acompanhar um resumo financeiro geral e por pessoa.

Este diretório reúne os dois projetos para facilitar a execução local com Docker Compose. O frontend e o backend também possuem repositórios individuais:

- Frontend: [RaphaelMun1z/react-sistema-controle-gastos-residenciais](https://github.com/RaphaelMun1z/react-sistema-controle-gastos-residenciais)
- Backend: [RaphaelMun1z/csharp-dotnet-sistema-controle-gastos-residenciais](https://github.com/RaphaelMun1z/csharp-dotnet-sistema-controle-gastos-residenciais)

## Sumário

- [Visão Geral](#visão-geral)
- [Imagens](#imagens)
- [Documentação](#documentação)
- [Como Executar Com Docker Compose](#como-executar-com-docker-compose)
- [Como Executar Sem Docker](#como-executar-sem-docker)
- [Estrutura](#estrutura)

## Visão Geral

O frontend é uma aplicação React com TypeScript, Vite, Material UI, React Router, TanStack Query, React Hook Form e Zod. Ele consome uma API versionada em `/api/v1`, usa autenticação JWT e organiza as telas por domínio.

O backend é uma API ASP.NET Core com arquitetura em camadas, Entity Framework Core, SQL Server, autenticação JWT, Serilog, Evolve para migrações, Swagger/OpenAPI e Scalar para documentação.

Entre as principais regras de negócio estão:

- Pessoas menores de 18 anos podem registrar apenas despesas.
- Cada pessoa pode possuir apenas uma conta.
- Contas e transações devem estar vinculadas a uma pessoa existente.
- O registro de usuário cria pessoa e conta de forma transacional.
- O resumo financeiro consolida receitas, despesas e saldo líquido.

## Imagens

<div align="center">
<table>
<tr>
<td width="50%" align="center">
  <strong>Pessoas Registradas</strong><br><br>
  <img src="./frontend/docs/preview_1.png" width="95%" alt="Tela de pessoas registradas">
</td>
<td width="50%" align="center">
  <strong>Transações Registradas</strong><br><br>
  <img src="./frontend/docs/preview_2.png" width="95%" alt="Tela de transações registradas">
</td>
</tr>
<tr>
<td width="50%" align="center">
  <strong>Resumo Financeiro</strong><br><br>
  <img src="./frontend/docs/preview_3.png" width="95%" alt="Tela de resumo financeiro">
</td>
<td width="50%" align="center">
  <strong>Cadastro de Usuário</strong><br><br>
  <img src="./frontend/docs/preview_4.png" width="95%" alt="Tela de cadastro de usuário">
</td>
</tr>
<tr>
<td width="50%" align="center">
  <strong>Swagger UI</strong><br><br>
  <img src="./backend/docs/swagger_preview.png" width="95%" alt="Documentação Swagger da API">
</td>
<td width="50%" align="center">
  <strong>Modelo do Banco</strong><br><br>
  <img src="./backend/docs/ModeloBancoDeDados.png" width="95%" alt="Modelo do banco de dados">
</td>
</tr>
</table>
</div>

## Documentação

Os arquivos de documentação, imagens e materiais de apoio ficam nos diretórios `docs` de cada projeto:

- Frontend: [`frontend/docs`](./frontend/docs)
- Backend: [`backend/docs`](./backend/docs)

No frontend, esse diretório reúne os previews da interface e a documentação completa do projeto. No backend, ficam os diagramas, requisitos, previews da documentação da API, scripts de apoio e a collection do Postman versionada.

## Como Executar Com Docker Compose

Pré-requisitos:

```text
Docker
Docker Compose
```

Na raiz deste repositório, construa e suba os containers:

```bash
docker compose up -d --build
```

Serviços disponíveis:

| Serviço | Endereço |
| :-- | :-- |
| Frontend | `http://localhost:5173` |
| API | `http://localhost:7201/api/v1` |
| Swagger UI | `http://localhost:7201/swagger-ui/index.html` |
| Scalar | `http://localhost:7201/scalar` |
| SQL Server | `localhost:1433` |

Para verificar os containers:

```bash
docker compose ps
```

Para acompanhar os logs:

```bash
docker compose logs -f
```

Para encerrar:

```bash
docker compose down
```

Para encerrar removendo também o volume do banco:

```bash
docker compose down -v
```

## Como Executar Sem Docker

Pré-requisitos:

```text
.NET 10 SDK
Node.js
npm
SQL Server local
```

Antes de iniciar a API, confira se o SQL Server está disponível em `localhost:1433`. A configuração padrão do backend usa:

```text
Database: db_household_expense_tracking_development
User Id: sa
Password: Database2026@
```

Se necessário, ajuste a connection string em `backend/SistemaControleGastosResidenciais/appsettings.json` ou sobrescreva por variável de ambiente.

### Backend

Em um terminal, execute:

```bash
cd backend/SistemaControleGastosResidenciais
dotnet restore
```

Defina a chave JWT para o ambiente local:

```powershell
$env:Jwt__SecretKey="SistemaControleGastosResidenciais-JWT-SecretKey-2026-Segura"
```

Inicie a API usando o perfil HTTPS:

```bash
dotnet run --launch-profile https
```

Endereços principais:

| Recurso | Endereço |
| :-- | :-- |
| API | `https://localhost:7201/api/v1` |
| Swagger UI | `https://localhost:7201/swagger-ui/index.html` |
| Scalar | `https://localhost:7201/scalar` |

### Frontend

Em outro terminal, execute:

```bash
cd frontend
npm install
```

Crie ou ajuste o arquivo `.env`:

```env
VITE_API_URL=https://localhost:7201/api/v1
VITE_BYPASS_AUTH=false
```

Inicie a interface:

```bash
npm run dev -- --host 0.0.0.0 --port 5173
```

A aplicação ficará disponível em:

```text
http://localhost:5173
```

## Estrutura

```text
.
├── frontend/
│   ├── Aplicação React
│   └── docs/
├── backend/
│   ├── API ASP.NET Core e Docker Compose original do backend
│   └── docs/
├── docker-compose.yml
└── README.md
```
