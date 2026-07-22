CREATE TABLE dbo.tb_accounts (
    Id UNIQUEIDENTIFIER NOT NULL,
    PersonId UNIQUEIDENTIFIER NOT NULL,
    Email NVARCHAR(150) NOT NULL,
    Password NVARCHAR(255) NOT NULL,

    CONSTRAINT PK_Accounts
        PRIMARY KEY (Id),

    CONSTRAINT FK_Accounts_People_PersonId
        FOREIGN KEY (PersonId)
        REFERENCES dbo.tb_people(Id)
        ON DELETE CASCADE,

    CONSTRAINT UQ_Accounts_Email
        UNIQUE (Email),

    CONSTRAINT UQ_Accounts_PersonId
        UNIQUE (PersonId)
);
GO