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