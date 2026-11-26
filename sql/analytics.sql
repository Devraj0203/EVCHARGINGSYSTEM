USE EV_CHARGING_NETWORK;

-- SECTION 1: USER MANAGEMENT
UPDATE `USER` SET Phone='9999999999' WHERE User_ID=1;
SELECT U.User_ID,U.Name,COUNT(V.Vehicle_ID) AS Total_Vehicles FROM `USER` U JOIN VEHICLE V ON U.User_ID=V.User_ID GROUP BY U.User_ID,U.Name HAVING COUNT(V.Vehicle_ID)>1;
SELECT Station_ID,AVG(Rating) AS Average_Rating FROM REVIEW GROUP BY Station_ID;
SELECT DISTINCT U.User_ID,U.Name FROM `USER` U JOIN REVIEW R ON U.User_ID=R.User_ID;
SELECT * FROM `USER` WHERE Name='Rahul Sharma';
SELECT * FROM `USER` ORDER BY Name ASC;
SELECT U.User_ID,U.Name,R.Rating,R.Comment FROM `USER` U LEFT JOIN REVIEW R ON U.User_ID=R.User_ID;

-- SECTION 2: VEHICLE MANAGEMENT
SELECT * FROM VEHICLE WHERE Battery_Capacity>40 ORDER BY Battery_Capacity DESC;
SELECT COUNT(*) AS Total_Users FROM `USER`;
SELECT SUM(Battery_Capacity) AS Total_Battery_Capacity FROM VEHICLE;
SELECT AVG(Battery_Capacity) AS Average_Battery FROM VEHICLE;
SELECT MIN(Battery_Capacity) AS Minimum_Battery FROM VEHICLE;
SELECT MAX(Battery_Capacity) AS Maximum_Battery FROM VEHICLE;

-- SECTION 3: OPERATOR AND STATION MANAGEMENT
SELECT * FROM LOCATION WHERE City='Bengaluru';
SELECT O.Operator_Name,C.Station_Name,C.Station_Status FROM OPERATOR O JOIN CHARGING_STATION C ON O.Operator_ID=C.Operator_ID ORDER BY O.Operator_Name;
SELECT L.City,COUNT(C.Station_ID) AS Total_Stations FROM LOCATION L JOIN CHARGING_STATION C ON L.Location_ID=C.Location_ID GROUP BY L.City ORDER BY Total_Stations DESC;
SELECT Station_Name,Charger_Type,Power_Rating_kW FROM CHARGING_STATION WHERE Station_Status='Active';
SELECT Station_Name,Number_Of_Ports FROM CHARGING_STATION WHERE Number_Of_Ports>5;
SELECT AVG(Power_Rating_kW) AS Average_Power FROM CHARGING_STATION;
SELECT MIN(Power_Rating_kW) AS Minimum_Power,MAX(Power_Rating_kW) AS Maximum_Power FROM CHARGING_STATION;
SELECT SUM(Number_Of_Ports) AS Total_Ports FROM CHARGING_STATION;
SELECT C.Station_Name,L.City,L.State,L.Address FROM CHARGING_STATION C JOIN LOCATION L ON C.Location_ID=L.Location_ID;
SELECT O.Operator_Name,C.Station_Name,L.City,C.Charger_Type,C.Power_Rating_kW FROM OPERATOR O JOIN CHARGING_STATION C ON O.Operator_ID=C.Operator_ID JOIN LOCATION L ON C.Location_ID=L.Location_ID;
UPDATE CHARGING_STATION SET Operating_Hours='24 Hours' WHERE Station_ID=1;

-- SECTION 4: CONNECTOR MANAGEMENT
SELECT C.Connector_ID,S.Station_Name,C.Connector_Type,C.Power_Rating,C.Status FROM CONNECTOR C JOIN CHARGING_STATION S ON C.Station_ID=S.Station_ID WHERE C.Status='Available';
SELECT S.Station_Name,T.Connector_Type,T.Price_Per_KWh FROM TARIFF T JOIN CHARGING_STATION S ON T.Station_ID=S.Station_ID ORDER BY T.Price_Per_KWh;
SELECT S.Station_Name,T.Connector_Type,T.Price_Per_KWh FROM TARIFF T JOIN CHARGING_STATION S ON T.Station_ID=S.Station_ID WHERE T.Price_Per_KWh=(SELECT MIN(Price_Per_KWh) FROM TARIFF);
SELECT Station_ID,Status,COUNT(*) AS Connector_Count FROM CONNECTOR GROUP BY Station_ID,Status ORDER BY Station_ID;
SELECT AVG(Power_Rating) AS Average_Connector_Power FROM CONNECTOR;
SELECT C.Connector_ID,C.Connector_Type,A.Time_Slot,A.Status FROM AVAILABILITY A JOIN CONNECTOR C ON A.Connector_ID=C.Connector_ID ORDER BY A.Time_Slot;
SELECT C.Connector_ID,C.Connector_Type,M.Issue,M.Maintenance_Date,M.Status FROM MAINTENANCE M JOIN CONNECTOR C ON M.Connector_ID=C.Connector_ID ORDER BY M.Maintenance_Date DESC;
SELECT Status,COUNT(*) AS Maintenance_Count FROM MAINTENANCE GROUP BY Status;
SELECT C.Connector_ID,C.Connector_Type FROM CONNECTOR C LEFT JOIN MAINTENANCE M ON C.Connector_ID=M.Connector_ID WHERE M.Maintenance_ID IS NULL;

-- SECTION 5: CHARGING AND PAYMENT MANAGEMENT (OM)
SELECT * FROM CHARGING_SESSION;
SELECT AVG(Charging_Duration_Minutes) AS Average_Charging_Duration_Minutes FROM CHARGING_SESSION WHERE Session_Status='Completed';
SELECT S.Station_ID,S.Station_Name,SUM(CS.Total_Cost) AS Total_Revenue FROM CHARGING_STATION S JOIN CHARGING_SESSION CS ON S.Station_ID=CS.Station_ID JOIN PAYMENT P ON P.Session_ID=CS.Session_ID WHERE P.Payment_Status='Successful' GROUP BY S.Station_ID,S.Station_Name ORDER BY Total_Revenue DESC;
SELECT AVG(Total_Cost) AS Average_Charging_Cost_Per_Session FROM CHARGING_SESSION WHERE Session_Status='Completed';
SELECT S.Station_ID,S.Station_Name,COUNT(CS.Session_ID) AS Total_Sessions FROM CHARGING_STATION S JOIN CHARGING_SESSION CS ON S.Station_ID=CS.Station_ID GROUP BY S.Station_ID,S.Station_Name ORDER BY Total_Sessions DESC;
SELECT P.Payment_ID,P.Session_ID,P.Amount,P.Payment_Method,P.Payment_Status FROM PAYMENT P ORDER BY P.Payment_Date DESC;
SELECT Payment_Status,COUNT(*) AS Payment_Count,SUM(Amount) AS Amount_Total FROM PAYMENT GROUP BY Payment_Status;
UPDATE PAYMENT SET Payment_Status='Successful' WHERE Payment_ID=3;

-- SECTION 6: DELETE DEMONSTRATION (ROLLBACK)
START TRANSACTION;
DELETE FROM CHARGING_STATION WHERE Station_ID=8;
ROLLBACK;
