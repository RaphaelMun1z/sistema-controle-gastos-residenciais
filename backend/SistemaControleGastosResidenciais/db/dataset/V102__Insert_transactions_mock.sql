;WITH PeopleTransactions AS (
    SELECT
        Id AS PersonId,
        Name,
        BirthDate,
        ROW_NUMBER() OVER (ORDER BY Id) AS PersonNumber
    FROM dbo.tb_people
),
TransactionNumbers AS (
    SELECT 1 AS TransactionNumber
    UNION ALL SELECT 2
    UNION ALL SELECT 3
    UNION ALL SELECT 4
    UNION ALL SELECT 5
)
INSERT INTO dbo.tb_transactions (
    Id,
    PersonId,
    Amount,
    Type,
    Description,
    TransactionDate,
    CreatedAt
)
SELECT
    NEWID(),
    person.PersonId,

    CAST(
        CASE transactionNumber.TransactionNumber
            WHEN 1 THEN 120.00 + (person.PersonNumber * 7)
            WHEN 2 THEN 85.50 + (person.PersonNumber * 4)
            WHEN 3 THEN 250.00 + (person.PersonNumber * 10)
            WHEN 4 THEN 60.00 + (person.PersonNumber * 3)
            WHEN 5 THEN 500.00 + (person.PersonNumber * 15)
        END
        AS DECIMAL(18, 2)
    ),

    CASE
        -- Menores de idade só podem possuir despesas
        WHEN DATEADD(YEAR, 18, person.BirthDate) > CAST(GETDATE() AS DATE) THEN 0

        -- Alterna entre despesas e receitas para maiores de idade
        WHEN transactionNumber.TransactionNumber IN (2, 5) THEN 1
        ELSE 0
    END,

    CASE transactionNumber.TransactionNumber
        WHEN 1 THEN 'Conta de energia'
        WHEN 2 THEN 'Recebimento de serviço'
        WHEN 3 THEN 'Compras de supermercado'
        WHEN 4 THEN 'Pagamento de internet'
        WHEN 5 THEN 'Receita adicional'
    END,

    DATEADD(
        DAY,
        -(person.PersonNumber * 2 + transactionNumber.TransactionNumber * 3),
        CAST('2026-07-20' AS DATE)
    ),

    DATEADD(
        DAY,
        -(person.PersonNumber * 2 + transactionNumber.TransactionNumber * 3),
        CAST('2026-07-20T12:00:00' AS DATETIME2)
    )

FROM PeopleTransactions person

CROSS JOIN TransactionNumbers transactionNumber

WHERE transactionNumber.TransactionNumber <=
    CASE person.PersonNumber % 4
        WHEN 0 THEN 2
        WHEN 1 THEN 3
        WHEN 2 THEN 4
        WHEN 3 THEN 5
    END;
GO