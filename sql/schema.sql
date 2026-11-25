
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
    CONSTRAINT uq_location_address
        UNIQUE (Address, City, State, Postal_Code),
    CONSTRAINT chk_latitude
        CHECK (Latitude IS NULL OR Latitude BETWEEN -90 AND 90),
    CONSTRAINT chk_longitude
        CHECK (Longitude IS NULL OR Longitude BETWEEN -180 AND 180)
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

    CONSTRAINT uq_station_name_location
        UNIQUE (Station_Name, Location_ID),
    CONSTRAINT chk_station_ports
        CHECK (Number_Of_Ports > 0),
    CONSTRAINT chk_station_power
        CHECK (Power_Rating_kW > 0),
    CONSTRAINT chk_station_status
        CHECK (Station_Status IN ('Active', 'Maintenance', 'Inactive')),

    FOREIGN KEY (Operator_ID)
        REFERENCES OPERATOR(Operator_ID)
        ON UPDATE CASCADE ON DELETE RESTRICT,

    FOREIGN KEY (Location_ID)
        REFERENCES LOCATION(Location_ID)
        ON UPDATE CASCADE ON DELETE RESTRICT
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

    FOREIGN KEY (User_ID)
        REFERENCES `USER`(User_ID)
);

-- 6. REVIEW
CREATE TABLE REVIEW (
    Review_ID INT AUTO_INCREMENT PRIMARY KEY,
    User_ID INT NOT NULL,
    Station_ID INT NOT NULL,
    Rating INT CHECK (Rating BETWEEN 1 AND 5),
    Comment VARCHAR(500),

    FOREIGN KEY (User_ID)
        REFERENCES `USER`(User_ID),

    FOREIGN KEY (Station_ID)
        REFERENCES CHARGING_STATION(Station_ID)
        ON UPDATE CASCADE
        ON DELETE RESTRICT
);
