--CREATE TABLE Persons (
--   Person_Id INT PRIMARY KEY,
--   Personal_Name VARCHAR(50),
--   Family_Name VARCHAR(50),
--   Gender VARCHAR(10), 
--   Father_Id INT,
--   Mother_Id INT,
--   Spouse_Id INT
--);

--INSERT INTO Persons (Person_Id, Personal_Name, Family_Name, Gender, Father_Id, Mother_Id, Spouse_Id)
--VALUES
--(1, 'יוסי', 'כהן', 'זכר', NULL, NULL, 2),
--(2, 'מרים', 'כהן', 'נקבה', NULL, NULL, 1),
--(3, 'רחל', 'כהן', 'נקבה', 1, 2, NULL),
--(4, 'דוד', 'כהן', 'זכר', 1, 2, NULL),
--(5, 'שרה', 'לוי', 'נקבה', NULL, NULL, 3);

--תרגיל 1 
-- יצירת טבלת קשרים
CREATE TABLE Relationships (
    Person_Id INT,
    Relative_Id INT,
    Connection_Type VARCHAR(20),
    PRIMARY KEY (Person_Id, Relative_Id, Connection_Type)
);

-- הכנסת קשרי אב ואם וזוגיות
INSERT INTO Relationships (Person_Id, Relative_Id, Connection_Type)
SELECT Person_Id, Father_Id AS Relative_Id, 'אב' AS Connection_Type
FROM Persons
WHERE Father_Id IS NOT NULL

UNION ALL

SELECT Person_Id, Mother_Id AS Relative_Id, 'אם' AS Connection_Type
FROM Persons
WHERE Mother_Id IS NOT NULL

UNION ALL

SELECT Person_Id, Spouse_Id AS Relative_Id,
       CASE
           WHEN Gender = 'זכר' THEN 'בת זוג'
           WHEN Gender = 'נקבה' THEN 'בן זוג'
           ELSE 'בן/בת זוג'
       END AS Connection_Type
FROM Persons
WHERE Spouse_Id IS NOT NULL

UNION ALL

-- קשרי אחים ואחיות
SELECT p1.Person_Id, p2.Person_Id AS Relative_Id,
       CASE
           WHEN p2.Gender = 'זכר' THEN 'אח'
           WHEN p2.Gender = 'נקבה' THEN 'אחות'
           ELSE 'אח/ות'
       END AS Connection_Type
FROM Persons p1
JOIN Persons p2 ON p1.Person_Id != p2.Person_Id
WHERE (
    (p1.Father_Id IS NOT NULL AND p1.Father_Id = p2.Father_Id)
    OR
    (p1.Mother_Id IS NOT NULL AND p1.Mother_Id = p2.Mother_Id)
)

UNION ALL

-- קשרי בן/בת כלפי האב
SELECT p.Father_Id AS Person_Id, p.Person_Id AS Relative_Id,
       CASE
           WHEN p.Gender = 'זכר' THEN 'בן'
           WHEN p.Gender = 'נקבה' THEN 'בת'
           ELSE 'ילד/ה'
       END AS Connection_Type
FROM Persons p
WHERE p.Father_Id IS NOT NULL

UNION ALL

-- קשרי בן/בת כלפי האם
SELECT p.Mother_Id AS Person_Id, p.Person_Id AS Relative_Id,
       CASE
           WHEN p.Gender = 'זכר' THEN 'בן'
           WHEN p.Gender = 'נקבה' THEN 'בת'
           ELSE 'ילד/ה'
       END AS Connection_Type
FROM Persons p
WHERE p.Mother_Id IS NOT NULL;

-- הוספת קשרי בני זוג
INSERT INTO Relationships (Person_Id, Relative_Id, Connection_Type)
SELECT
    p2.Person_Id AS Person_Id,
    p1.Person_Id AS Relative_Id,
    CASE
        WHEN p2.Gender = 'זכר' THEN 'בת זוג'
        WHEN p2.Gender = 'נקבה' THEN 'בן זוג'
        ELSE 'בן/בת זוג'
    END AS Connection_Type
FROM Persons p1
JOIN Persons p2 ON p1.Spouse_Id = p2.Person_Id
WHERE (p2.Spouse_Id IS NULL OR p2.Spouse_Id != p1.Person_Id)
  AND p1.Spouse_Id IS NOT NULL
  AND NOT EXISTS (
      SELECT 1 FROM Relationships r
      WHERE r.Person_Id = p2.Person_Id
        AND r.Relative_Id = p1.Person_Id
        AND r.Connection_Type IN ('בן זוג', 'בת זוג', 'בן/בת זוג')
  );

-- הצגת תוצאות קשרים לאחר הוספת בני זוג
SELECT * FROM Relationships;
