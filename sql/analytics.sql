
USE EV_CHARGING_NETWORK;

-- ==========================================
-- SECTION 1: USER MANAGEMENT
-- ==========================================

-- 1. Update user phone number
UPDATE `USER`
SET Phone = '9999999999'
WHERE User_ID = 1;

-- 2. Find users with multiple vehicles
SELECT U.User_ID, U.Name,
       COUNT(V.Vehicle_ID) AS Total_Vehicles
FROM `USER` U
JOIN VEHICLE V ON U.User_ID = V.User_ID
GROUP BY U.User_ID, U.Name
HAVING COUNT(V.Vehicle_ID) > 1;

-- 3. Find average rating of each station
SELECT Station_ID, AVG(Rating) AS Average_Rating
FROM REVIEW
GROUP BY Station_ID;

-- 4. Find users who submitted reviews
SELECT DISTINCT U.User_ID, U.Name
FROM `USER` U
JOIN REVIEW R ON U.User_ID = R.User_ID;

-- 5. Find a particular user
SELECT *
FROM `USER`
WHERE Name = 'Rahul Sharma';

-- 6. Display users alphabetically
SELECT *
FROM `USER`
ORDER BY Name ASC;

-- 7. Users with their reviews (LEFT JOIN)
SELECT U.User_ID, U.Name, R.Rating, R.Comment
FROM `USER` U
LEFT JOIN REVIEW R ON U.User_ID = R.User_ID;


-- ==========================================
-- SECTION 2: VEHICLE MANAGEMENT
-- ==========================================

-- 8. Vehicles with battery capacity above 40
SELECT *
FROM VEHICLE
WHERE Battery_Capacity > 40
ORDER BY Battery_Capacity DESC;

-- 9. Total number of users
SELECT COUNT(*) AS Total_Users
FROM `USER`;

-- 10. Total battery capacity
SELECT SUM(Battery_Capacity) AS Total_Battery_Capacity
FROM VEHICLE;

-- 11. Average battery capacity
SELECT AVG(Battery_Capacity) AS Average_Battery
FROM VEHICLE;

-- 12. Minimum battery capacity
SELECT MIN(Battery_Capacity) AS Minimum_Battery
FROM VEHICLE;

-- 13. Maximum battery capacity
SELECT MAX(Battery_Capacity) AS Maximum_Battery
FROM VEHICLE;


-- ==========================================
-- SECTION 3: OPERATOR AND STATION MANAGEMENT
-- ==========================================

-- 14. Find locations in Bengaluru
SELECT *
FROM LOCATION
WHERE City = 'Bengaluru';

-- 15. Stations managed by each operator
SELECT O.Operator_Name, C.Station_Name, C.Station_Status
FROM OPERATOR O
JOIN CHARGING_STATION C ON O.Operator_ID = C.Operator_ID
ORDER BY O.Operator_Name;

-- 16. Count stations in each city
SELECT L.City, COUNT(C.Station_ID) AS Total_Stations
FROM LOCATION L
JOIN CHARGING_STATION C ON L.Location_ID = C.Location_ID
GROUP BY L.City
ORDER BY Total_Stations DESC;

-- 17. Find active stations
SELECT Station_Name, Charger_Type, Power_Rating_kW
FROM CHARGING_STATION
WHERE Station_Status = 'Active';

-- 18. Stations with more than 5 ports
SELECT Station_Name, Number_Of_Ports
FROM CHARGING_STATION
WHERE Number_Of_Ports > 5;

-- 19. Average power rating
SELECT AVG(Power_Rating_kW) AS Average_Power
FROM CHARGING_STATION;

-- 20. Minimum and maximum power rating
SELECT MIN(Power_Rating_kW) AS Minimum_Power,
       MAX(Power_Rating_kW) AS Maximum_Power
FROM CHARGING_STATION;

-- 21. Total number of charging ports
SELECT SUM(Number_Of_Ports) AS Total_Ports
FROM CHARGING_STATION;

-- 22. Stations with their complete location
SELECT C.Station_Name, L.City, L.State, L.Address
FROM CHARGING_STATION C
JOIN LOCATION L ON C.Location_ID = L.Location_ID;

-- 23. Stations with operator and location
SELECT O.Operator_Name, C.Station_Name, L.City,
       C.Charger_Type, C.Power_Rating_kW
FROM OPERATOR O
JOIN CHARGING_STATION C ON O.Operator_ID = C.Operator_ID
JOIN LOCATION L ON C.Location_ID = L.Location_ID;

-- 24. Update station operating hours
UPDATE CHARGING_STATION
SET Operating_Hours = '24 Hours'
WHERE Station_ID = 1;


-- ==========================================
-- SECTION 4: DELETE DEMONSTRATIONS
-- ==========================================

-- Delete demonstration using transaction and rollback
START TRANSACTION;

DELETE FROM CHARGING_STATION
WHERE Station_ID = 8;

ROLLBACK;
