-- CONNECTOR RECORDS
INSERT INTO CONNECTOR
(Station_ID, Connector_Type, Power_Rating, Status)
VALUES
(1, 'CCS2', 50.00, 'Available'),
(1, 'CHAdeMO', 30.00, 'Occupied'),
(1, 'Type 2', 22.00, 'Available'),
(2, 'CCS2', 60.00, 'Available'),
(2, 'Type 2', 11.00, 'Maintenance'),
(3, 'CCS2', 120.00, 'Available'),
(3, 'CHAdeMO', 50.00, 'Available');


-- TARIFF RECORDS
INSERT INTO TARIFF
(Station_ID, Connector_Type, Price_Per_KWh)
VALUES
(1, 'CCS2', 18.00),
(1, 'CHAdeMO', 16.00),
(1, 'Type 2', 12.00),
(2, 'CCS2', 20.00),
(2, 'Type 2', 10.00),
(3, 'CCS2', 22.00),
(3, 'CHAdeMO', 19.00);


-- AVAILABILITY RECORDS
INSERT INTO AVAILABILITY
(Connector_ID, Time_Slot, Status)
VALUES
(1, '2026-11-26 09:00:00', 'Available'),
(2, '2026-11-26 10:00:00', 'Booked'),
(3, '2026-11-26 11:00:00', 'Available'),
(4, '2026-11-26 09:00:00', 'Available'),
(5, '2026-11-26 12:00:00', 'Unavailable'),
(6, '2026-11-26 10:00:00', 'Available'),
(7, '2026-11-26 11:00:00', 'Booked');


-- MAINTENANCE RECORDS
INSERT INTO MAINTENANCE
(Connector_ID, Issue, Maintenance_Date, Status)
VALUES
(1, 'Cable inspection', '2026-10-10', 'Completed'),
(1, 'Power fluctuation', '2026-11-01', 'Completed'),
(2, 'Connector overheating', '2026-11-05', 'Pending'),
(4, 'Charging failure', '2026-10-15', 'Completed'),
(4, 'Cable damage', '2026-11-10', 'In Progress'),
(5, 'Power supply issue', '2026-11-12', 'Pending'),
(6, 'Routine inspection', '2026-11-15', 'Completed');