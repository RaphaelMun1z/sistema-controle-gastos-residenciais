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