
CREATE TABLE CONNECTOR (
    Connector_ID INT AUTO_INCREMENT PRIMARY KEY,
    Station_ID INT NOT NULL,
    Connector_Type VARCHAR(50) NOT NULL,
    Power_Rating DECIMAL(6,2) NOT NULL,
    Status VARCHAR(20) NOT NULL DEFAULT 'Available',

    CONSTRAINT chk_connector_power
    CHECK (Power_Rating > 0),

    CONSTRAINT chk_connector_status
    CHECK (Status IN ('Available', 'Occupied', 'Maintenance', 'Inactive')),

    CONSTRAINT fk_connector_station
    FOREIGN KEY (Station_ID)
    REFERENCES CHARGING_STATION(Station_ID)
    ON UPDATE CASCADE
    ON DELETE RESTRICT
);


CREATE TABLE TARIFF (
    Tariff_ID INT AUTO_INCREMENT PRIMARY KEY,
    Station_ID INT NOT NULL,
    Connector_Type VARCHAR(50) NOT NULL,
    Price_Per_KWh DECIMAL(8,2) NOT NULL,

    CONSTRAINT chk_tariff_price
    CHECK (Price_Per_KWh > 0),

    CONSTRAINT uq_station_tariff
    UNIQUE (Station_ID, Connector_Type),

    CONSTRAINT fk_tariff_station
    FOREIGN KEY (Station_ID)
    REFERENCES CHARGING_STATION(Station_ID)
    ON UPDATE CASCADE
    ON DELETE RESTRICT
);



CREATE TABLE AVAILABILITY (
    Availability_ID INT AUTO_INCREMENT PRIMARY KEY,
    Connector_ID INT NOT NULL,
    Time_Slot DATETIME NOT NULL,
    Status VARCHAR(20) NOT NULL,

    CONSTRAINT chk_availability_status
    CHECK (Status IN ('Available', 'Booked', 'Unavailable')),

    CONSTRAINT uq_connector_timeslot
    UNIQUE (Connector_ID, Time_Slot),

    CONSTRAINT fk_availability_connector
    FOREIGN KEY (Connector_ID)
    REFERENCES CONNECTOR(Connector_ID)
    ON UPDATE CASCADE
    ON DELETE RESTRICT
);


CREATE TABLE MAINTENANCE (
    Maintenance_ID INT AUTO_INCREMENT PRIMARY KEY,
    Connector_ID INT NOT NULL,
    Issue VARCHAR(255) NOT NULL,
    Maintenance_Date DATE NOT NULL,
    Status VARCHAR(20) NOT NULL DEFAULT 'Pending',

    CONSTRAINT chk_maintenance_status
    CHECK (Status IN ('Pending', 'In Progress', 'Completed')),

    CONSTRAINT fk_maintenance_connector
    FOREIGN KEY (Connector_ID)
    REFERENCES CONNECTOR(Connector_ID)
    ON UPDATE CASCADE
    ON DELETE RESTRICT
);