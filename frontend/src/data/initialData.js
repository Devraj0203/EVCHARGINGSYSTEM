export const initialData = {
  operators: [
    {
      operator_id: 1,
      operator_name: "ChargeGrid India",
      contact_person: "Rohan Mehta",
      email: "support@chargegrid.in",
      phone: "9876501001",
      website: "https://www.chargegrid.in"
    },
    {
      operator_id: 2,
      operator_name: "VoltWay Networks",
      contact_person: "Priya Shah",
      email: "help@voltway.in",
      phone: "9876501002",
      website: "https://www.voltway.in"
    },
    {
      operator_id: 3,
      operator_name: "EcoCharge Services",
      contact_person: "Ankit Verma",
      email: "contact@ecocharge.in",
      phone: "9876501003",
      website: "https://www.ecocharge.in"
    },
    {
      operator_id: 4,
      operator_name: "RapidPlug Mobility",
      contact_person: "Neha Kapoor",
      email: "care@rapidplug.in",
      phone: "9876501004",
      website: "https://www.rapidplug.in"
    }
  ],

  locations: [
    {
      location_id: 1,
      address: "Connaught Place, Block A",
      city: "New Delhi",
      state: "Delhi",
      postal_code: "110001",
      latitude: 28.631500,
      longitude: 77.216700
    },
    {
      location_id: 2,
      address: "Bandra Kurla Complex, Gate 3",
      city: "Mumbai",
      state: "Maharashtra",
      postal_code: "400051",
      latitude: 19.060700,
      longitude: 72.868200
    },
    {
      location_id: 3,
      address: "MG Road Metro Parking, MG Road",
      city: "Bengaluru",
      state: "Karnataka",
      postal_code: "560001",
      latitude: 12.975900,
      longitude: 77.606600
    },
    {
      location_id: 4,
      address: "Koramangala 5th Block, Near Forum Mall",
      city: "Bengaluru",
      state: "Karnataka",
      postal_code: "560095",
      latitude: 12.935200,
      longitude: 77.624500
    },
    {
      location_id: 5,
      address: "Andheri East Metro Parking",
      city: "Mumbai",
      state: "Maharashtra",
      postal_code: "400069",
      latitude: 19.119700,
      longitude: 72.846400
    },
    {
      location_id: 6,
      address: "Cyber City Parking, Phase 2",
      city: "Gurugram",
      state: "Haryana",
      postal_code: "122002",
      latitude: 28.494600,
      longitude: 77.089600
    },
    {
      location_id: 7,
      address: "Hitech City, Madhapur",
      city: "Hyderabad",
      state: "Telangana",
      postal_code: "500081",
      latitude: 17.443500,
      longitude: 78.377200
    },
    {
      location_id: 8,
      address: "Salt Lake Sector V, Tech Park",
      city: "Kolkata",
      state: "West Bengal",
      postal_code: "700091",
      latitude: 22.572600,
      longitude: 88.431700
    }
  ],

  charging_stations: [
    {
      station_id: 1,
      operator_id: 1,
      location_id: 1,
      station_name: "ChargeGrid CP Hub",
      operating_hours: "24 Hours",
      charger_type: "CCS2",
      number_of_ports: 6,
      power_rating_kw: 60.00,
      station_status: "Active"
    },
    {
      station_id: 2,
      operator_id: 1,
      location_id: 2,
      station_name: "ChargeGrid BKC Point",
      operating_hours: "06:00-23:00",
      charger_type: "CCS2",
      number_of_ports: 4,
      power_rating_kw: 120.00,
      station_status: "Active"
    },
    {
      station_id: 3,
      operator_id: 2,
      location_id: 3,
      station_name: "VoltWay MG Road",
      operating_hours: "07:00-22:00",
      charger_type: "Type 2",
      number_of_ports: 8,
      power_rating_kw: 22.00,
      station_status: "Active"
    },
    {
      station_id: 4,
      operator_id: 2,
      location_id: 4,
      station_name: "VoltWay Koramangala",
      operating_hours: "07:00-22:00",
      charger_type: "Type 2",
      number_of_ports: 5,
      power_rating_kw: 22.00,
      station_status: "Active"
    },
    {
      station_id: 5,
      operator_id: 3,
      location_id: 5,
      station_name: "EcoCharge Andheri",
      operating_hours: "08:00-22:00",
      charger_type: "CHAdeMO",
      number_of_ports: 3,
      power_rating_kw: 50.00,
      station_status: "Active"
    },
    {
      station_id: 6,
      operator_id: 3,
      location_id: 6,
      station_name: "EcoCharge Cyber City",
      operating_hours: "24 Hours",
      charger_type: "CCS2",
      number_of_ports: 5,
      power_rating_kw: 50.00,
      station_status: "Maintenance"
    },
    {
      station_id: 7,
      operator_id: 4,
      location_id: 7,
      station_name: "RapidPlug Hitech City",
      operating_hours: "24 Hours",
      charger_type: "CCS2",
      number_of_ports: 10,
      power_rating_kw: 150.00,
      station_status: "Active"
    },
    {
      station_id: 8,
      operator_id: 4,
      location_id: 8,
      station_name: "RapidPlug Salt Lake",
      operating_hours: "07:00-23:00",
      charger_type: "Type 2",
      number_of_ports: 4,
      power_rating_kw: 22.00,
      station_status: "Inactive"
    }
  ],

  users: [
    { user_id: 1, name: "Rahul Sharma", email: "rahul@gmail.com", phone: "9876543210" },
    { user_id: 2, name: "Aman Verma", email: "aman@gmail.com", phone: "9876543211" },
    { user_id: 3, name: "Priya Singh", email: "priya@gmail.com", phone: "9876543212" },
    { user_id: 4, name: "Rohit Gupta", email: "rohit@gmail.com", phone: "9876543213" },
    { user_id: 5, name: "Sneha Kapoor", email: "sneha@gmail.com", phone: "9876543214" }
  ],

  vehicles: [
    { vehicle_id: 1, user_id: 1, vehicle_number: "DL01AB1234", model: "Tata Nexon EV", battery_capacity: 40.5 },
    { vehicle_id: 2, user_id: 1, vehicle_number: "DL02CD5678", model: "MG ZS EV", battery_capacity: 50.3 },
    { vehicle_id: 3, user_id: 2, vehicle_number: "UP16EF9012", model: "Tata Tiago EV", battery_capacity: 24.0 },
    { vehicle_id: 4, user_id: 3, vehicle_number: "HR26GH3456", model: "Hyundai Kona EV", battery_capacity: 39.2 },
    { vehicle_id: 5, user_id: 4, vehicle_number: "DL03IJ7890", model: "Mahindra XUV400", battery_capacity: 34.5 },
    { vehicle_id: 6, user_id: 5, vehicle_number: "UP14KL2345", model: "BYD Atto 3", battery_capacity: 60.5 }
  ],

  reviews: [
    { review_id: 1, user_id: 1, station_id: 1, rating: 5, comment: "Excellent charging experience" },
    { review_id: 2, user_id: 2, station_id: 1, rating: 4, comment: "Good station and fast charging" },
    { review_id: 3, user_id: 3, station_id: 2, rating: 3, comment: "Average experience" },
    { review_id: 4, user_id: 4, station_id: 2, rating: 5, comment: "Very clean and convenient" },
    { review_id: 5, user_id: 5, station_id: 3, rating: 4, comment: "Good charging facilities" },
    { review_id: 6, user_id: 1, station_id: 3, rating: 5, comment: "Affordable and reliable" }
  ],

  connectors: [
    { connector_id: 1, station_id: 1, connector_type: "CCS2", power_rating: 60.00, status: "Available" },
    { connector_id: 2, station_id: 1, connector_type: "CCS2", power_rating: 60.00, status: "Occupied" },
    { connector_id: 3, station_id: 2, connector_type: "CCS2", power_rating: 120.00, status: "Available" },
    { connector_id: 4, station_id: 2, connector_type: "CCS2", power_rating: 120.00, status: "Available" },
    { connector_id: 5, station_id: 3, connector_type: "Type 2", power_rating: 22.00, status: "Available" },
    { connector_id: 6, station_id: 3, connector_type: "Type 2", power_rating: 22.00, status: "Maintenance" },
    { connector_id: 7, station_id: 4, connector_type: "Type 2", power_rating: 22.00, status: "Available" },
    { connector_id: 8, station_id: 4, connector_type: "Type 2", power_rating: 22.00, status: "Available" },
    { connector_id: 9, station_id: 5, connector_type: "CHAdeMO", power_rating: 50.00, status: "Available" },
    { connector_id: 10, station_id: 5, connector_type: "CHAdeMO", power_rating: 50.00, status: "Available" },
    { connector_id: 11, station_id: 6, connector_type: "CCS2", power_rating: 50.00, status: "Maintenance" },
    { connector_id: 12, station_id: 6, connector_type: "CCS2", power_rating: 50.00, status: "Inactive" },
    { connector_id: 13, station_id: 7, connector_type: "CCS2", power_rating: 150.00, status: "Available" },
    { connector_id: 14, station_id: 7, connector_type: "CCS2", power_rating: 150.00, status: "Available" },
    { connector_id: 15, station_id: 8, connector_type: "Type 2", power_rating: 22.00, status: "Inactive" },
    { connector_id: 16, station_id: 8, connector_type: "Type 2", power_rating: 22.00, status: "Inactive" }
  ],

  tariffs: [
    { tariff_id: 1, station_id: 1, connector_type: "CCS2", price_per_kwh: 18.50 },
    { tariff_id: 2, station_id: 2, connector_type: "CCS2", price_per_kwh: 20.00 },
    { tariff_id: 3, station_id: 3, connector_type: "Type 2", price_per_kwh: 12.00 },
    { tariff_id: 4, station_id: 4, connector_type: "Type 2", price_per_kwh: 12.50 },
    { tariff_id: 5, station_id: 5, connector_type: "CHAdeMO", price_per_kwh: 17.00 },
    { tariff_id: 6, station_id: 6, connector_type: "CCS2", price_per_kwh: 16.00 },
    { tariff_id: 7, station_id: 7, connector_type: "CCS2", price_per_kwh: 22.00 },
    { tariff_id: 8, station_id: 8, connector_type: "Type 2", price_per_kwh: 11.50 }
  ],

  availability: [
    { availability_id: 1, connector_id: 1, time_slot: "2026-12-01 09:00:00", status: "Available" },
    { availability_id: 2, connector_id: 1, time_slot: "2026-12-01 10:00:00", status: "Booked" },
    { availability_id: 3, connector_id: 2, time_slot: "2026-12-01 09:00:00", status: "Booked" },
    { availability_id: 4, connector_id: 3, time_slot: "2026-12-01 11:00:00", status: "Available" },
    { availability_id: 5, connector_id: 5, time_slot: "2026-12-01 12:00:00", status: "Available" },
    { availability_id: 6, connector_id: 7, time_slot: "2026-12-01 13:00:00", status: "Unavailable" },
    { availability_id: 7, connector_id: 9, time_slot: "2026-12-01 14:00:00", status: "Available" },
    { availability_id: 8, connector_id: 13, time_slot: "2026-12-01 15:00:00", status: "Available" }
  ],

  maintenance: [
    {
      maintenance_id: 1,
      connector_id: 6,
      issue: "Connector overheating",
      maintenance_date: "2026-11-20",
      status: "In Progress"
    },
    {
      maintenance_id: 2,
      connector_id: 11,
      issue: "Cable insulation inspection",
      maintenance_date: "2026-11-18",
      status: "Pending"
    },
    {
      maintenance_id: 3,
      connector_id: 12,
      issue: "Power module replacement",
      maintenance_date: "2026-11-15",
      status: "Completed"
    },
    {
      maintenance_id: 4,
      connector_id: 2,
      issue: "Routine connector inspection",
      maintenance_date: "2026-11-10",
      status: "Completed"
    }
  ],

  charging_sessions: [
    {
      session_id: 1,
      user_id: 1,
      vehicle_id: 1,
      station_id: 1,
      connector_id: 1,
      tariff_id: 1,
      start_time: "2026-11-21 09:00:00",
      end_time: "2026-11-21 09:45:00",
      energy_delivered_kwh: 30.00,
      charging_duration_minutes: 45,
      total_cost: 555.00,
      session_status: "Completed"
    },
    {
      session_id: 2,
      user_id: 1,
      vehicle_id: 2,
      station_id: 2,
      connector_id: 3,
      tariff_id: 2,
      start_time: "2026-11-22 10:00:00",
      end_time: "2026-11-22 10:30:00",
      energy_delivered_kwh: 40.00,
      charging_duration_minutes: 30,
      total_cost: 800.00,
      session_status: "Completed"
    },
    {
      session_id: 3,
      user_id: 2,
      vehicle_id: 3,
      station_id: 3,
      connector_id: 5,
      tariff_id: 3,
      start_time: "2026-11-23 11:00:00",
      end_time: "2026-11-23 12:30:00",
      energy_delivered_kwh: 18.00,
      charging_duration_minutes: 90,
      total_cost: 216.00,
      session_status: "Completed"
    },
    {
      session_id: 4,
      user_id: 3,
      vehicle_id: 4,
      station_id: 5,
      connector_id: 9,
      tariff_id: 5,
      start_time: "2026-11-24 14:00:00",
      end_time: "2026-11-24 14:40:00",
      energy_delivered_kwh: 25.00,
      charging_duration_minutes: 40,
      total_cost: 425.00,
      session_status: "Completed"
    },
    {
      session_id: 5,
      user_id: 4,
      vehicle_id: 5,
      station_id: 7,
      connector_id: 13,
      tariff_id: 7,
      start_time: "2026-11-25 16:00:00",
      end_time: "2026-11-25 16:35:00",
      energy_delivered_kwh: 35.00,
      charging_duration_minutes: 35,
      total_cost: 770.00,
      session_status: "Completed"
    }
  ],

  payments: [
    {
      payment_id: 1,
      session_id: 1,
      amount: 555.00,
      payment_method: "UPI",
      payment_status: "Successful",
      transaction_reference: "EVPAY-TXN-1001",
      payment_date: "2026-11-21 09:50:00"
    },
    {
      payment_id: 2,
      session_id: 2,
      amount: 800.00,
      payment_method: "Card",
      payment_status: "Successful",
      transaction_reference: "EVPAY-TXN-1002",
      payment_date: "2026-11-22 10:35:00"
    },
    {
      payment_id: 3,
      session_id: 3,
      amount: 216.00,
      payment_method: "UPI",
      payment_status: "Pending",
      transaction_reference: "EVPAY-TXN-1003",
      payment_date: "2026-11-23 12:35:00"
    },
    {
      payment_id: 4,
      session_id: 4,
      amount: 425.00,
      payment_method: "Net Banking",
      payment_status: "Successful",
      transaction_reference: "EVPAY-TXN-1004",
      payment_date: "2026-11-24 14:45:00"
    },
    {
      payment_id: 5,
      session_id: 5,
      amount: 770.00,
      payment_method: "Wallet",
      payment_status: "Failed",
      transaction_reference: "EVPAY-TXN-1005",
      payment_date: "2026-11-25 16:40:00"
    }
  ]
};
