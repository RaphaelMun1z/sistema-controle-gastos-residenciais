CREATE TABLE dbo.tb_transactions (
    Id UNIQUEIDENTIFIER NOT NULL,
    PersonId UNIQUEIDENTIFIER NOT NULL,
    Amount DECIMAL(18, 2) NOT NULL,
    Type INT NOT NULL,
    Description NVARCHAR(255) NOT NULL,
    TransactionDate DATE NOT NULL,
    CreatedAt DATETIME2 NOT NULL,

    CONSTRAINT PK_Transactions
        PRIMARY KEY (Id),

    CONSTRAINT FK_Transactions_People_PersonId
        FOREIGN KEY (PersonId)
        REFERENCES dbo.tb_people(Id)
        ON DELETE CASCADE,

    CONSTRAINT CK_Transactions_Amount
        CHECK (Amount > 0),

    CONSTRAINT CK_Transactions_Type
        CHECK (Type IN (0, 1))
);
GO

CREATE INDEX IX_Transactions_PersonId_TransactionDate
ON dbo.tb_transactions(PersonId, TransactionDate);
GO