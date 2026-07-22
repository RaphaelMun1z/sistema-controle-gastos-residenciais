-- MOCK DE DADOS

USE db_household_expense_tracking_development;
GO

-- IDs utilizados para manter os relacionamentos entre as tabelas
DECLARE @Person1 UNIQUEIDENTIFIER = NEWID();
DECLARE @Person2 UNIQUEIDENTIFIER = NEWID();
DECLARE @Person3 UNIQUEIDENTIFIER = NEWID();
DECLARE @Person4 UNIQUEIDENTIFIER = NEWID();
DECLARE @Person5 UNIQUEIDENTIFIER = NEWID();

DECLARE @Account1 UNIQUEIDENTIFIER = NEWID();
DECLARE @Account2 UNIQUEIDENTIFIER = NEWID();
DECLARE @Account3 UNIQUEIDENTIFIER = NEWID();
DECLARE @Account4 UNIQUEIDENTIFIER = NEWID();


-- =========================================================
-- PESSOAS
-- =========================================================

INSERT INTO dbo.tb_people (
    Id,
    Name,
    BirthDate
)
VALUES
    (@Person1, 'Raphael Muniz', '2004-10-22'),
    (@Person2, 'Mariana Silva', '1995-09-22'),
    (@Person3, 'Carlos Oliveira', '1988-03-10'),

    -- Pessoas menores de idade para testar a regra de negócio
    (@Person4, 'Ana Souza', '2012-07-08'),
    (@Person5, 'Lucas Ferreira', '2010-11-25');


-- =========================================================
-- CONTAS
-- =========================================================

INSERT INTO dbo.tb_accounts (
    Id,
    PersonId,
    Email,
    Password
)
VALUES
    (
        @Account1,
        @Person1,
        'raphael.muniz@email.com',
        'senha_mock_123'
    ),
    (
        @Account2,
        @Person2,
        'mariana.silva@email.com',
        'senha_mock_123'
    ),
    (
        @Account3,
        @Person3,
        'carlos.oliveira@email.com',
        'senha_mock_123'
    ),
    (
        @Account4,
        @Person4,
        'ana.souza@email.com',
        'senha_mock_123'
    );

-- Person5 permanece sem conta
-- Isso permite testar uma pessoa cadastrada sem conta associada


-- =========================================================
-- TRANSAÇÕES DA PESSOA 1
-- =========================================================

INSERT INTO dbo.tb_transactions (
    Id,
    PersonId,
    Amount,
    Type,
    Description
)
VALUES
    (
        NEWID(),
        @Person1,
        3500.00,
        1,
        'Salário mensal'
    ),
    (
        NEWID(),
        @Person1,
        950.00,
        0,
        'Aluguel'
    ),
    (
        NEWID(),
        @Person1,
        185.50,
        0,
        'Conta de energia'
    ),
    (
        NEWID(),
        @Person1,
        120.00,
        0,
        'Internet'
    );


-- =========================================================
-- TRANSAÇÕES DA PESSOA 2
-- =========================================================

INSERT INTO dbo.tb_transactions (
    Id,
    PersonId,
    Amount,
    Type,
    Description
)
VALUES
    (
        NEWID(),
        @Person2,
        4200.00,
        1,
        'Salário mensal'
    ),
    (
        NEWID(),
        @Person2,
        500.00,
        1,
        'Trabalho freelancer'
    ),
    (
        NEWID(),
        @Person2,
        650.00,
        0,
        'Supermercado'
    ),
    (
        NEWID(),
        @Person2,
        250.00,
        0,
        'Combustível'
    );


-- =========================================================
-- TRANSAÇÕES DA PESSOA 3
-- =========================================================

INSERT INTO dbo.tb_transactions (
    Id,
    PersonId,
    Amount,
    Type,
    Description
)
VALUES
    (
        NEWID(),
        @Person3,
        5800.00,
        1,
        'Salário mensal'
    ),
    (
        NEWID(),
        @Person3,
        1250.00,
        0,
        'Financiamento'
    ),
    (
        NEWID(),
        @Person3,
        420.00,
        0,
        'Supermercado'
    );


-- =========================================================
-- TRANSAÇÕES DA PESSOA 4
-- =========================================================

-- Pessoa menor de 18 anos
-- Possui apenas despesas conforme a regra de negócio

INSERT INTO dbo.tb_transactions (
    Id,
    PersonId,
    Amount,
    Type,
    Description
)
VALUES
    (
        NEWID(),
        @Person4,
        45.00,
        0,
        'Material escolar'
    ),
    (
        NEWID(),
        @Person4,
        30.00,
        0,
        'Lanche'
    );


-- =========================================================
-- TRANSAÇÕES DA PESSOA 5
-- =========================================================

-- Pessoa menor de 18 anos
-- Possui apenas despesas conforme a regra de negócio

INSERT INTO dbo.tb_transactions (
    Id,
    PersonId,
    Amount,
    Type,
    Description
)
VALUES
    (
        NEWID(),
        @Person5,
        80.00,
        0,
        'Livro'
    ),
    (
        NEWID(),
        @Person5,
        25.00,
        0,
        'Transporte'
    );
GO