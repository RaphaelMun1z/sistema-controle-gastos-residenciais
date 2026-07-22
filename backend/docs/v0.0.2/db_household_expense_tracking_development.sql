USE db_household_expense_tracking_development;
GO

-- Tabela que representa PESSOAS
CREATE TABLE dbo.tb_people (
    Id UNIQUEIDENTIFIER NOT NULL,
    Name NVARCHAR(150) NOT NULL,
    BirthDate DATE NOT NULL,

    -- Define o identificador da pessoa como chave primária
    CONSTRAINT PK_People
        PRIMARY KEY (Id)
);
GO

-- Tabela que representa CONTAS
CREATE TABLE dbo.tb_accounts (
    Id UNIQUEIDENTIFIER NOT NULL,
    PersonId UNIQUEIDENTIFIER NOT NULL,
    Email NVARCHAR(150) NOT NULL,
    Password NVARCHAR(255) NOT NULL,

    -- Define o identificador da conta como chave primária
    CONSTRAINT PK_Accounts
        PRIMARY KEY (Id),

    -- Define a relação entre a conta e a pessoa
    -- Caso a pessoa seja removida, sua conta também será excluída
    CONSTRAINT FK_Accounts_People_PersonId
        FOREIGN KEY (PersonId)
        REFERENCES dbo.tb_people(Id)
        ON DELETE CASCADE,

    -- Garante que não existam duas contas com o mesmo e-mail
    CONSTRAINT UQ_Accounts_Email
        UNIQUE (Email),

    -- Garante que uma pessoa tenha apenas uma conta
    CONSTRAINT UQ_Accounts_PersonId
        UNIQUE (PersonId)
);
GO

-- Tabela que representa TRANSAÇÕES
CREATE TABLE dbo.tb_transactions (
    Id UNIQUEIDENTIFIER NOT NULL,
    PersonId UNIQUEIDENTIFIER NOT NULL,
    Amount DECIMAL(18, 2) NOT NULL,
    Type INT NOT NULL,
    Description NVARCHAR(255) NOT NULL,

    -- Define o identificador da transação como chave primária
    CONSTRAINT PK_Transactions
        PRIMARY KEY (Id),

    -- Define a relação entre a transação e a pessoa
    -- Caso a pessoa seja removida, suas transações também serão excluídas
    CONSTRAINT FK_Transactions_People_PersonId
        FOREIGN KEY (PersonId)
        REFERENCES dbo.tb_people(Id)
        ON DELETE CASCADE,

    -- Garante que o valor da transação seja maior que zero
    CONSTRAINT CK_Transactions_Amount
        CHECK (Amount > 0),

    -- Garante que somente tipos válidos de transação sejam armazenados
    -- 0 representa despesa
    -- 1 representa receita
    CONSTRAINT CK_Transactions_Type
        CHECK (Type IN (0, 1))
);
GO

-- Cria um índice para melhorar as consultas de transações associadas a uma pessoa
CREATE INDEX IX_Transactions_PersonId
    ON dbo.tb_transactions(PersonId);
GO

-- Valida a data de nascimento ao cadastrar uma pessoa
-- Impede datas futuras e idades superiores a 150 anos
CREATE TRIGGER dbo.TR_People_ValidateBirthDate
ON dbo.tb_people
AFTER INSERT
AS
BEGIN
    SET NOCOUNT ON;

    IF EXISTS (
        SELECT 1
        FROM inserted
        WHERE BirthDate > CAST(GETDATE() AS DATE)
            OR BirthDate < DATEADD(
                YEAR,
                -150,
                CAST(GETDATE() AS DATE)
            )
    )
    BEGIN
        THROW 50001,
            'A data de nascimento informada é inválida',
            1;
    END;
END;
GO

-- Impede que a data de nascimento seja alterada após o cadastro da pessoa
CREATE TRIGGER dbo.TR_People_PreventBirthDateUpdate
ON dbo.tb_people
AFTER UPDATE
AS
BEGIN
    SET NOCOUNT ON;

    IF EXISTS (
        SELECT 1
        FROM inserted i
        INNER JOIN deleted d
            ON d.Id = i.Id
        WHERE i.BirthDate <> d.BirthDate
    )
    BEGIN
        THROW 50002,
            'A data de nascimento não pode ser alterada após o cadastro',
            1;
    END;
END;
GO

-- Valida as transações cadastradas ou alteradas
-- Impede que pessoas menores de 18 anos registrem receitas
CREATE TRIGGER dbo.TR_Transactions_ValidateMinor
ON dbo.tb_transactions
AFTER INSERT, UPDATE
AS
BEGIN
    SET NOCOUNT ON;

    IF EXISTS (
        SELECT 1
        FROM inserted i
        INNER JOIN dbo.tb_people p
            ON p.Id = i.PersonId
        WHERE
            i.Type = 1
            AND DATEADD(YEAR, 18, p.BirthDate) > CAST(GETDATE() AS DATE)
    )
    BEGIN
        THROW 50003,
            'Pessoas menores de 18 anos podem registrar apenas despesas',
            1;
    END;
END;
GO