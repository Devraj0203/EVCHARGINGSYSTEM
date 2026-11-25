
USE EV_CHARGING_NETWORK;

-- 1. OPERATOR DATA
INSERT INTO OPERATOR
(Operator_Name, Contact_Person, Email, Phone, Website)
VALUES
('ChargeGrid India', 'Rohan Mehta', 'support@chargegrid.in', '9876501001', 'https://www.chargegrid.in'),
('VoltWay Networks', 'Priya Shah', 'help@voltway.in', '9876501002', 'https://www.voltway.in'),
('EcoCharge Services', 'Ankit Verma', 'contact@ecocharge.in', '9876501003', 'https://www.ecocharge.in'),
('RapidPlug Mobility', 'Neha Kapoor', 'care@rapidplug.in', '9876501004', 'https://www.rapidplug.in');

-- 2. LOCATION DATA
INSERT INTO LOCATION
(Address, City, State, Postal_Code, Latitude, Longitude)
VALUES
('Connaught Place, Block A', 'New Delhi', 'Delhi', '110001', 28.631500, 77.216700),
('Bandra Kurla Complex, Gate 3', 'Mumbai', 'Maharashtra', '400051', 19.060700, 72.868200),
('MG Road Metro Parking, MG Road', 'Bengaluru', 'Karnataka', '560001', 12.975900, 77.606600),
('Koramangala 5th Block, Near Forum Mall', 'Bengaluru', 'Karnataka', '560095', 12.935200, 77.624500),
('Andheri East Metro Parking', 'Mumbai', 'Maharashtra', '400069', 19.119700, 72.846400),
('Cyber City Parking, Phase 2', 'Gurugram', 'Haryana', '122002', 28.494600, 77.089600),
('Hitech City, Madhapur', 'Hyderabad', 'Telangana', '500081', 17.443500, 78.377200),
('Salt Lake Sector V, Tech Park', 'Kolkata', 'West Bengal', '700091', 22.572600, 88.431700);

-- 3. CHARGING STATION DATA
INSERT INTO CHARGING_STATION
(Operator_ID, Location_ID, Station_Name, Operating_Hours,
 Charger_Type, Number_Of_Ports, Power_Rating_kW, Station_Status)
VALUES
(1, 1, 'ChargeGrid CP Hub', '24 Hours', 'CCS2', 6, 60.00, 'Active'),
(1, 2, 'ChargeGrid BKC Point', '06:00-23:00', 'CCS2', 4, 120.00, 'Active'),
(2, 3, 'VoltWay MG Road', '07:00-22:00', 'Type 2', 8, 22.00, 'Active'),
(2, 4, 'VoltWay Koramangala', '07:00-22:00', 'Type 2', 5, 22.00, 'Active'),
(3, 5, 'EcoCharge Andheri', '08:00-22:00', 'CHAdeMO', 3, 50.00, 'Active'),
(3, 6, 'EcoCharge Cyber City', '24 Hours', 'CCS2', 5, 50.00, 'Maintenance'),
(4, 7, 'RapidPlug Hitech City', '24 Hours', 'CCS2', 10, 150.00, 'Active'),
(4, 8, 'RapidPlug Salt Lake', '07:00-23:00', 'Type 2', 4, 22.00, 'Inactive');

-- 4. USER DATA
INSERT INTO `USER` (Name, Email, Phone)
VALUES
('Rahul Sharma', 'rahul@gmail.com', '9876543210'),
('Aman Verma', 'aman@gmail.com', '9876543211'),
('Priya Singh', 'priya@gmail.com', '9876543212'),
('Rohit Gupta', 'rohit@gmail.com', '9876543213'),
('Sneha Kapoor', 'sneha@gmail.com', '9876543214');

-- 5. VEHICLE DATA
INSERT INTO VEHICLE
(User_ID, Vehicle_Number, Model, Battery_Capacity)
VALUES
(1, 'DL01AB1234', 'Tata Nexon EV', 40.5),
(1, 'DL02CD5678', 'MG ZS EV', 50.3),
(2, 'UP16EF9012', 'Tata Tiago EV', 24.0),
(3, 'HR26GH3456', 'Hyundai Kona EV', 39.2),
(4, 'DL03IJ7890', 'Mahindra XUV400', 34.5),
(5, 'UP14KL2345', 'BYD Atto 3', 60.5);

-- 6. REVIEW DATA
INSERT INTO REVIEW
(User_ID, Station_ID, Rating, Comment)
VALUES
(1, 1, 5, 'Excellent charging experience'),
(2, 1, 4, 'Good station and fast charging'),
(3, 2, 3, 'Average experience'),
(4, 2, 5, 'Very clean and convenient'),
(5, 3, 4, 'Good charging facilities'),
(1, 3, 5, 'Affordable and reliable');
