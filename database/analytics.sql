-- 1. Display all connectors
SELECT * FROM CONNECTOR;


-- 2. Display available connectors
SELECT *
FROM CONNECTOR
WHERE Status = 'Available';


-- 3. Display connectors with their station names
SELECT C.Connector_ID, C.Connector_Type,
       C.Power_Rating, C.Status, S.Station_Name
FROM CONNECTOR C
JOIN CHARGING_STATION S
ON C.Station_ID = S.Station_ID;


-- 4. Display connectors in a particular city
SELECT C.Connector_ID, C.Connector_Type,
       S.Station_Name, L.City
FROM CONNECTOR C
JOIN CHARGING_STATION S
ON C.Station_ID = S.Station_ID
JOIN LOCATION L
ON S.Location_ID = L.Location_ID
WHERE L.City = 'Delhi';


-- 5. Display tariffs in ascending order
SELECT *
FROM TARIFF
ORDER BY Price_Per_KWh ASC;


-- 6. Find the cheapest tariff
SELECT *
FROM TARIFF
WHERE Price_Per_KWh = (
    SELECT MIN(Price_Per_KWh)
    FROM TARIFF
);


-- 7. Find connectors having more than one maintenance record
SELECT Connector_ID, COUNT(*) AS Maintenance_Count
FROM MAINTENANCE
GROUP BY Connector_ID
HAVING COUNT(*) > 1;


-- 8. Display connectors currently under maintenance
SELECT DISTINCT C.Connector_ID, C.Connector_Type,
       M.Issue, M.Status
FROM CONNECTOR C
JOIN MAINTENANCE M
ON C.Connector_ID = M.Connector_ID
WHERE M.Status IN ('Pending', 'In Progress');


-- 9. Find connectors that have never undergone maintenance
SELECT C.Connector_ID, C.Connector_Type
FROM CONNECTOR C
LEFT JOIN MAINTENANCE M
ON C.Connector_ID = M.Connector_ID
WHERE M.Maintenance_ID IS NULL;


-- 10. Count connectors at each station
SELECT Station_ID, COUNT(*) AS Total_Connectors
FROM CONNECTOR
GROUP BY Station_ID;


-- 11. Find average tariff
SELECT AVG(Price_Per_KWh) AS Average_Tariff
FROM TARIFF;


-- 12. Find minimum and maximum tariff
SELECT MIN(Price_Per_KWh) AS Minimum_Tariff,
       MAX(Price_Per_KWh) AS Maximum_Tariff
FROM TARIFF;


-- 13. Count connectors according to their status
SELECT Status, COUNT(*) AS Total
FROM CONNECTOR
GROUP BY Status;


-- 14. Count maintenance records for each connector
SELECT Connector_ID, COUNT(*) AS Total_Maintenance
FROM MAINTENANCE
GROUP BY Connector_ID;


-- 15. Find average power rating at each station
SELECT Station_ID, AVG(Power_Rating) AS Average_Power
FROM CONNECTOR
GROUP BY Station_ID;


-- 16. Find stations having more than two available connectors
SELECT Station_ID, COUNT(*) AS Available_Connectors
FROM CONNECTOR
WHERE Status = 'Available'
GROUP BY Station_ID
HAVING COUNT(*) > 2;


-- 17. Display connector, station and tariff details
SELECT C.Connector_ID, S.Station_Name,
       C.Connector_Type, C.Power_Rating,
       T.Price_Per_KWh
FROM CONNECTOR C
JOIN CHARGING_STATION S
ON C.Station_ID = S.Station_ID
JOIN TARIFF T
ON C.Station_ID = T.Station_ID
AND C.Connector_Type = T.Connector_Type;


-- 18. Display availability details
SELECT A.Availability_ID, C.Connector_Type,
       A.Time_Slot, A.Status
FROM AVAILABILITY A
JOIN CONNECTOR C
ON A.Connector_ID = C.Connector_ID;


-- 19. Display complete maintenance history
SELECT M.Maintenance_ID, C.Connector_Type,
       S.Station_Name, M.Issue,
       M.Maintenance_Date, M.Status
FROM MAINTENANCE M
JOIN CONNECTOR C
ON M.Connector_ID = C.Connector_ID
JOIN CHARGING_STATION S
ON C.Station_ID = S.Station_ID
ORDER BY M.Maintenance_Date DESC;


-- 20. Find the cheapest connector tariff at each station
SELECT T.Station_ID, T.Connector_Type,
       T.Price_Per_KWh
FROM TARIFF T
WHERE T.Price_Per_KWh = (
    SELECT MIN(T2.Price_Per_KWh)
    FROM TARIFF T2
    WHERE T2.Station_ID = T.Station_ID
);