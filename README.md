# VoltPulse EV Charging Network Management System
> **DBMS Group Project & Front-End Application**

A comprehensive web dashboard and management frontend built for the **EV_CHARGING_NETWORK** database. It features real-time station monitoring across 6 major Indian cities, live EV charging simulation with dynamic battery SoC tracking, slot bookings, billing ledger management, hardware maintenance logging, and an interactive DBMS SQL analytics lab.

---

## ⚡ Quick Start (Run on your System)

### Method 1: One-Click Launcher (Windows)
Double-click the **`start_frontend.bat`** file located in the root of the project folder:
```text
C:\Users\hp\OneDrive\Desktop\EV-Charging-Network\start_frontend.bat
```
This automatically launches the local server and opens **`http://localhost:5173`** in your default browser.

---

### Method 2: From PowerShell or Command Prompt

1. Open your terminal and navigate to the `frontend` folder:
   ```powershell
   cd "c:\Users\hp\OneDrive\Desktop\EV-Charging-Network\frontend"
   ```

2. Start the development server:
   ```powershell
   npm run dev
   ```

3. Open **[http://localhost:5173](http://localhost:5173)** in any browser.

---

### Method 3: Serve the Production Build (`dist`)
A pre-compiled, optimized production bundle is ready in `frontend/dist`:
```powershell
cd "c:\Users\hp\OneDrive\Desktop\EV-Charging-Network\frontend"
npm run preview
```

---

## 🚀 Key Modules & DBMS Integration

| Tab / Module | Connected Database Tables | Description |
| :--- | :--- | :--- |
| **Dashboard** | All tables (Aggregated) | High-level metrics: revenue (₹), energy delivered (kWh), active hubs, port availability, CPO operator directory. |
| **Charging Stations** | `CHARGING_STATION`, `LOCATION`, `CONNECTOR`, `TARIFF` | Interactive station explorer with city, charger type (CCS2, Type 2, CHAdeMO), and status filters. Add new stations with relational cascading. |
| **Live EV Charger** | `CHARGING_SESSION`, `PAYMENT`, `VEHICLE`, `CONNECTOR` | Real-time simulator: plug in an EV, watch live kWh power delivery, animated battery SoC %, accrued cost, and instant payment checkout. |
| **Slot Booking** | `AVAILABILITY`, `CONNECTOR` | Reserve time slots for specific connectors across stations. |
| **Billing & Payments** | `PAYMENT`, `CHARGING_SESSION` | Financial ledger with status management (`Successful`, `Pending`, `Failed`, `Refunded`) and printable payment receipts. |
| **Maintenance Hub** | `MAINTENANCE`, `CONNECTOR` | Hardware diagnostic tracker. Auto-syncs connector availability when work orders are marked completed. |
| **Users & EV Fleet** | `USER`, `VEHICLE` | 1:N driver-to-vehicle registry with battery capacities (kWh) for models like Nexon EV, MG ZS EV, Atto 3, Kona EV. |
| **Reviews & Feedback** | `REVIEW`, `USER`, `CHARGING_STATION` | Star rating breakdown and verified driver feedback per station. |
| **DBMS Analytics Lab** | `analytics.sql` queries | Run pre-configured SQL queries from `analytics.sql` (3-table JOINs, GROUP BY, HAVING, Subqueries, Aggregate metrics) with live results. |

---

## 🔄 Reset to Sample Data
The application saves modifications in browser storage. Click the **"Reset to SQL Seed Data"** button in the lower-left sidebar anytime to restore the default dataset from `sample_data.sql`.
