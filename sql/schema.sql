CREATE DATABASE IF NOT EXISTS EV_CHARGING_NETWORK;
USE EV_CHARGING_NETWORK;

-- 1. OPERATOR
CREATE TABLE OPERATOR (
    Operator_ID INT AUTO_INCREMENT PRIMARY KEY,
    Operator_Name VARCHAR(100) NOT NULL UNIQUE,
    Contact_Person VARCHAR(100) NOT NULL,
    Email VARCHAR(100) NOT NULL UNIQUE,
    Phone VARCHAR(15) NOT NULL,
    Website VARCHAR(150)
);

-- 2. LOCATION
CREATE TABLE LOCATION (
    Location_ID INT AUTO_INCREMENT PRIMARY KEY,
    Address VARCHAR(200) NOT NULL,
    City VARCHAR(100) NOT NULL,
    State VARCHAR(100) NOT NULL,
    Postal_Code VARCHAR(10) NOT NULL,
    Latitude DECIMAL(9,6),
    Longitude DECIMAL(9,6),
    CONSTRAINT uq_location_address UNIQUE (Address, City, State, Postal_Code),
    CONSTRAINT chk_latitude CHECK (Latitude IS NULL OR Latitude BETWEEN -90 AND 90),
    CONSTRAINT chk_longitude CHECK (Longitude IS NULL OR Longitude BETWEEN -180 AND 180)
);

-- 3. CHARGING_STATION
CREATE TABLE CHARGING_STATION (
    Station_ID INT AUTO_INCREMENT PRIMARY KEY,
    Operator_ID INT NOT NULL,
    Location_ID INT NOT NULL,
    Station_Name VARCHAR(120) NOT NULL,
    Operating_Hours VARCHAR(100) NOT NULL,
    Charger_Type VARCHAR(50) NOT NULL,
    Number_Of_Ports INT NOT NULL,
    Power_Rating_kW DECIMAL(6,2) NOT NULL,
    Station_Status VARCHAR(20) NOT NULL DEFAULT 'Active',
    CONSTRAINT uq_station_name_location UNIQUE (Station_Name, Location_ID),
    CONSTRAINT chk_station_ports CHECK (Number_Of_Ports > 0),
    CONSTRAINT chk_station_power CHECK (Power_Rating_kW > 0),
    CONSTRAINT chk_station_status CHECK (Station_Status IN ('Active','Maintenance','Inactive')),
    FOREIGN KEY (Operator_ID) REFERENCES OPERATOR(Operator_ID) ON UPDATE CASCADE ON DELETE RESTRICT,
    FOREIGN KEY (Location_ID) REFERENCES LOCATION(Location_ID) ON UPDATE CASCADE ON DELETE RESTRICT
);

-- 4. USER
CREATE TABLE `USER` (
    User_ID INT AUTO_INCREMENT PRIMARY KEY,
    Name VARCHAR(100) NOT NULL,
    Email VARCHAR(100) UNIQUE NOT NULL,
    Phone VARCHAR(15) NOT NULL
);

-- 5. VEHICLE
CREATE TABLE VEHICLE (
    Vehicle_ID INT AUTO_INCREMENT PRIMARY KEY,
    User_ID INT NOT NULL,
    Vehicle_Number VARCHAR(20) UNIQUE NOT NULL,
    Model VARCHAR(100) NOT NULL,
    Battery_Capacity DECIMAL(6,2),
    FOREIGN KEY (User_ID) REFERENCES `USER`(User_ID)
);

-- 6. REVIEW
CREATE TABLE REVIEW (
    Review_ID INT AUTO_INCREMENT PRIMARY KEY,
    User_ID INT NOT NULL,
    Station_ID INT NOT NULL,
    Rating INT CHECK (Rating BETWEEN 1 AND 5),
    Comment VARCHAR(500),
    FOREIGN KEY (User_ID) REFERENCES `USER`(User_ID),
    FOREIGN KEY (Station_ID) REFERENCES CHARGING_STATION(Station_ID)
        ON UPDATE CASCADE ON DELETE RESTRICT
);

-- 7. CONNECTOR
CREATE TABLE CONNECTOR (
    Connector_ID INT AUTO_INCREMENT PRIMARY KEY,
    Station_ID INT NOT NULL,
    Connector_Type VARCHAR(50) NOT NULL,
    Power_Rating DECIMAL(6,2) NOT NULL,
    Status VARCHAR(20) NOT NULL DEFAULT 'Available',
    CONSTRAINT chk_connector_power CHECK (Power_Rating > 0),
    CONSTRAINT chk_connector_status CHECK (Status IN ('Available','Occupied','Maintenance','Inactive')),
    FOREIGN KEY (Station_ID) REFERENCES CHARGING_STATION(Station_ID)
        ON UPDATE CASCADE ON DELETE RESTRICT
);

-- 8. TARIFF
CREATE TABLE TARIFF (
    Tariff_ID INT AUTO_INCREMENT PRIMARY KEY,
    Station_ID INT NOT NULL,
    Connector_Type VARCHAR(50) NOT NULL,
    Price_Per_KWh DECIMAL(8,2) NOT NULL,
    CONSTRAINT chk_tariff_price CHECK (Price_Per_KWh > 0),
    CONSTRAINT uq_station_tariff UNIQUE (Station_ID, Connector_Type),
    FOREIGN KEY (Station_ID) REFERENCES CHARGING_STATION(Station_ID)
        ON UPDATE CASCADE ON DELETE RESTRICT
);

-- 9. AVAILABILITY
CREATE TABLE AVAILABILITY (
    Availability_ID INT AUTO_INCREMENT PRIMARY KEY,
    Connector_ID INT NOT NULL,
    Time_Slot DATETIME NOT NULL,
    Status VARCHAR(20) NOT NULL,
    CONSTRAINT chk_availability_status CHECK (Status IN ('Available','Booked','Unavailable')),
    CONSTRAINT uq_connector_timeslot UNIQUE (Connector_ID, Time_Slot),
    FOREIGN KEY (Connector_ID) REFERENCES CONNECTOR(Connector_ID)
        ON UPDATE CASCADE ON DELETE RESTRICT
);

-- 10. MAINTENANCE
CREATE TABLE MAINTENANCE (
    Maintenance_ID INT AUTO_INCREMENT PRIMARY KEY,
    Connector_ID INT NOT NULL,
    Issue VARCHAR(255) NOT NULL,
    Maintenance_Date DATE NOT NULL,
    Status VARCHAR(20) NOT NULL DEFAULT 'Pending',
    CONSTRAINT chk_maintenance_status CHECK (Status IN ('Pending','In Progress','Completed')),
    FOREIGN KEY (Connector_ID) REFERENCES CONNECTOR(Connector_ID)
        ON UPDATE CASCADE ON DELETE RESTRICT
);

-- 11. CHARGING_SESSION
CREATE TABLE CHARGING_SESSION (
    Session_ID INT AUTO_INCREMENT PRIMARY KEY,
    User_ID INT NOT NULL,
    Vehicle_ID INT NOT NULL,
    Station_ID INT NOT NULL,
    Connector_ID INT NOT NULL,
    Tariff_ID INT NOT NULL,
    Start_Time DATETIME NOT NULL,
    End_Time DATETIME NOT NULL,
    Energy_Delivered_kWh DECIMAL(8,2) NOT NULL,
    Charging_Duration_Minutes INT NOT NULL,
    Total_Cost DECIMAL(10,2) NOT NULL,
    Session_Status VARCHAR(20) NOT NULL DEFAULT 'Completed',
    CONSTRAINT chk_session_energy CHECK (Energy_Delivered_kWh > 0),
    CONSTRAINT chk_session_duration CHECK (Charging_Duration_Minutes > 0),
    CONSTRAINT chk_session_cost CHECK (Total_Cost >= 0),
    CONSTRAINT chk_session_status CHECK (Session_Status IN ('Completed','In Progress','Cancelled')),
    CONSTRAINT chk_session_time CHECK (End_Time >= Start_Time),
    FOREIGN KEY (User_ID) REFERENCES `USER`(User_ID),
    FOREIGN KEY (Vehicle_ID) REFERENCES VEHICLE(Vehicle_ID),
    FOREIGN KEY (Station_ID) REFERENCES CHARGING_STATION(Station_ID),
    FOREIGN KEY (Connector_ID) REFERENCES CONNECTOR(Connector_ID),
    FOREIGN KEY (Tariff_ID) REFERENCES TARIFF(Tariff_ID)
);

-- 12. PAYMENT
CREATE TABLE PAYMENT (
    Payment_ID INT AUTO_INCREMENT PRIMARY KEY,
    Session_ID INT NOT NULL UNIQUE,
    Amount DECIMAL(10,2) NOT NULL,
    Payment_Method VARCHAR(30) NOT NULL,
    Payment_Status VARCHAR(20) NOT NULL DEFAULT 'Pending',
    Transaction_Reference VARCHAR(100) UNIQUE,
    Payment_Date DATETIME,
    CONSTRAINT chk_payment_amount CHECK (Amount >= 0),
    CONSTRAINT chk_payment_method CHECK (Payment_Method IN ('UPI','Card','Net Banking','Wallet','Cash')),
    CONSTRAINT chk_payment_status CHECK (Payment_Status IN ('Pending','Successful','Failed','Refunded')),
    FOREIGN KEY (Session_ID) REFERENCES CHARGING_SESSION(Session_ID)
        ON UPDATE CASCADE ON DELETE RESTRICT
);
