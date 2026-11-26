USE EV_CHARGING_NETWORK;
INSERT INTO OPERATOR (Operator_Name,Contact_Person,Email,Phone,Website) VALUES
('ChargeGrid India','Rohan Mehta','support@chargegrid.in','9876501001','https://www.chargegrid.in'),
('VoltWay Networks','Priya Shah','help@voltway.in','9876501002','https://www.voltway.in'),
('EcoCharge Services','Ankit Verma','contact@ecocharge.in','9876501003','https://www.ecocharge.in'),
('RapidPlug Mobility','Neha Kapoor','care@rapidplug.in','9876501004','https://www.rapidplug.in');
INSERT INTO LOCATION (Address,City,State,Postal_Code,Latitude,Longitude) VALUES
('Connaught Place, Block A','New Delhi','Delhi','110001',28.631500,77.216700),
('Bandra Kurla Complex, Gate 3','Mumbai','Maharashtra','400051',19.060700,72.868200),
('MG Road Metro Parking, MG Road','Bengaluru','Karnataka','560001',12.975900,77.606600),
('Koramangala 5th Block, Near Forum Mall','Bengaluru','Karnataka','560095',12.935200,77.624500),
('Andheri East Metro Parking','Mumbai','Maharashtra','400069',19.119700,72.846400),
('Cyber City Parking, Phase 2','Gurugram','Haryana','122002',28.494600,77.089600),
('Hitech City, Madhapur','Hyderabad','Telangana','500081',17.443500,78.377200),
('Salt Lake Sector V, Tech Park','Kolkata','West Bengal','700091',22.572600,88.431700);
INSERT INTO CHARGING_STATION (Operator_ID,Location_ID,Station_Name,Operating_Hours,Charger_Type,Number_Of_Ports,Power_Rating_kW,Station_Status) VALUES
(1,1,'ChargeGrid CP Hub','24 Hours','CCS2',6,60,'Active'),
(1,2,'ChargeGrid BKC Point','06:00-23:00','CCS2',4,120,'Active'),
(2,3,'VoltWay MG Road','07:00-22:00','Type 2',8,22,'Active'),
(2,4,'VoltWay Koramangala','07:00-22:00','Type 2',5,22,'Active'),
(3,5,'EcoCharge Andheri','08:00-22:00','CHAdeMO',3,50,'Active'),
(3,6,'EcoCharge Cyber City','24 Hours','CCS2',5,50,'Maintenance'),
(4,7,'RapidPlug Hitech City','24 Hours','CCS2',10,150,'Active'),
(4,8,'RapidPlug Salt Lake','07:00-23:00','Type 2',4,22,'Inactive');
INSERT INTO `USER` (Name,Email,Phone) VALUES
('Rahul Sharma','rahul@gmail.com','9876543210'),('Aman Verma','aman@gmail.com','9876543211'),
('Priya Singh','priya@gmail.com','9876543212'),('Rohit Gupta','rohit@gmail.com','9876543213'),
('Sneha Kapoor','sneha@gmail.com','9876543214');
INSERT INTO VEHICLE (User_ID,Vehicle_Number,Model,Battery_Capacity) VALUES
(1,'DL01AB1234','Tata Nexon EV',40.5),(1,'DL02CD5678','MG ZS EV',50.3),
(2,'UP16EF9012','Tata Tiago EV',24),(3,'HR26GH3456','Hyundai Kona EV',39.2),
(4,'DL03IJ7890','Mahindra XUV400',34.5),(5,'UP14KL2345','BYD Atto 3',60.5);
INSERT INTO REVIEW (User_ID,Station_ID,Rating,Comment) VALUES
(1,1,5,'Excellent charging experience'),(2,1,4,'Good station and fast charging'),
(3,2,3,'Average experience'),(4,2,5,'Very clean and convenient'),
(5,3,4,'Good charging facilities'),(1,3,5,'Affordable and reliable');
INSERT INTO CONNECTOR (Station_ID,Connector_Type,Power_Rating,Status) VALUES
(1,'CCS2',60,'Available'),(1,'CCS2',60,'Occupied'),(2,'CCS2',120,'Available'),(2,'CCS2',120,'Available'),
(3,'Type 2',22,'Available'),(3,'Type 2',22,'Maintenance'),(4,'Type 2',22,'Available'),(4,'Type 2',22,'Available'),
(5,'CHAdeMO',50,'Available'),(5,'CHAdeMO',50,'Available'),(6,'CCS2',50,'Maintenance'),(6,'CCS2',50,'Inactive'),
(7,'CCS2',150,'Available'),(7,'CCS2',150,'Available'),(8,'Type 2',22,'Inactive'),(8,'Type 2',22,'Inactive');
INSERT INTO TARIFF (Station_ID,Connector_Type,Price_Per_KWh) VALUES
(1,'CCS2',18.5),(2,'CCS2',20),(3,'Type 2',12),(4,'Type 2',12.5),
(5,'CHAdeMO',17),(6,'CCS2',16),(7,'CCS2',22),(8,'Type 2',11.5);
INSERT INTO AVAILABILITY (Connector_ID,Time_Slot,Status) VALUES
(1,'2026-12-01 09:00:00','Available'),(1,'2026-12-01 10:00:00','Booked'),
(2,'2026-12-01 09:00:00','Booked'),(3,'2026-12-01 11:00:00','Available'),
(5,'2026-12-01 12:00:00','Available'),(7,'2026-12-01 13:00:00','Unavailable'),
(9,'2026-12-01 14:00:00','Available'),(13,'2026-12-01 15:00:00','Available');
INSERT INTO MAINTENANCE (Connector_ID,Issue,Maintenance_Date,Status) VALUES
(6,'Connector overheating','2026-11-20','In Progress'),
(11,'Cable insulation inspection','2026-11-18','Pending'),
(12,'Power module replacement','2026-11-15','Completed'),
(2,'Routine connector inspection','2026-11-10','Completed');
INSERT INTO CHARGING_SESSION
(User_ID,Vehicle_ID,Station_ID,Connector_ID,Tariff_ID,Start_Time,End_Time,Energy_Delivered_kWh,Charging_Duration_Minutes,Total_Cost,Session_Status) VALUES
(1,1,1,1,1,'2026-11-21 09:00:00','2026-11-21 09:45:00',30,45,555,'Completed'),
(1,2,2,3,2,'2026-11-22 10:00:00','2026-11-22 10:30:00',40,30,800,'Completed'),
(2,3,3,5,3,'2026-11-23 11:00:00','2026-11-23 12:30:00',18,90,216,'Completed'),
(3,4,5,9,5,'2026-11-24 14:00:00','2026-11-24 14:40:00',25,40,425,'Completed'),
(4,5,7,13,7,'2026-11-25 16:00:00','2026-11-25 16:35:00',35,35,770,'Completed');
INSERT INTO PAYMENT (Session_ID,Amount,Payment_Method,Payment_Status,Transaction_Reference,Payment_Date) VALUES
(1,555,'UPI','Successful','EVPAY-TXN-1001','2026-11-21 09:50:00'),
(2,800,'Card','Successful','EVPAY-TXN-1002','2026-11-22 10:35:00'),
(3,216,'UPI','Pending','EVPAY-TXN-1003','2026-11-23 12:35:00'),
(4,425,'Net Banking','Successful','EVPAY-TXN-1004','2026-11-24 14:45:00'),
(5,770,'Wallet','Failed','EVPAY-TXN-1005','2026-11-25 16:40:00');
