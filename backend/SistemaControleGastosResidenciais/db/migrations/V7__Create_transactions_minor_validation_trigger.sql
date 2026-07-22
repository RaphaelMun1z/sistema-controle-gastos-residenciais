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