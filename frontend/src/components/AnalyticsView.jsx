import React, { useState } from 'react';
import { Database, Play, Code2, Sparkles, CheckCircle2, ChevronRight, BarChart3, TrendingUp } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const AnalyticsView = () => {
  const { data, getLocation, getOperator } = useApp();

  const queries = [
    {
      id: 'rev_by_station',
      title: 'Station Revenue from Successful Payments',
      category: 'Financial Analytics',
      concept: '3-Table JOIN + GROUP BY + SUM + ORDER BY',
      sql: `SELECT S.Station_ID, S.Station_Name, SUM(CS.Total_Cost) AS Total_Revenue
FROM CHARGING_STATION S
JOIN CHARGING_SESSION CS ON S.Station_ID = CS.Station_ID
JOIN PAYMENT P ON P.Session_ID = CS.Session_ID
WHERE P.Payment_Status = 'Successful'
GROUP BY S.Station_ID, S.Station_Name
ORDER BY Total_Revenue DESC;`,
      execute: () => {
        const revMap = {};
        data.charging_sessions.forEach((cs) => {
          const p = data.payments.find((pay) => pay.session_id === cs.session_id);
          if (p && p.payment_status === 'Successful') {
            const st = data.charging_stations.find((s) => s.station_id === cs.station_id);
            const name = st ? st.station_name : `Station #${cs.station_id}`;
            revMap[cs.station_id] = revMap[cs.station_id] || { station_id: cs.station_id, station_name: name, total_revenue: 0 };
            revMap[cs.station_id].total_revenue += Number(cs.total_cost);
          }
        });
        return Object.values(revMap).sort((a, b) => b.total_revenue - a.total_revenue);
      }
    },
    {
      id: 'stations_by_city',
      title: 'Station Deployment Distribution by City',
      category: 'Geographic Distribution',
      concept: 'JOIN + GROUP BY + COUNT + ORDER BY',
      sql: `SELECT L.City, COUNT(C.Station_ID) AS Total_Stations
FROM LOCATION L
JOIN CHARGING_STATION C ON L.Location_ID = C.Location_ID
GROUP BY L.City
ORDER BY Total_Stations DESC;`,
      execute: () => {
        const cityMap = {};
        data.charging_stations.forEach((st) => {
          const loc = getLocation(st.location_id);
          const city = loc ? loc.city : 'Unknown';
          cityMap[city] = (cityMap[city] || 0) + 1;
        });
        return Object.entries(cityMap)
          .map(([city, count]) => ({ city, total_stations: count }))
          .sort((a, b) => b.total_stations - a.total_stations);
      }
    },
    {
      id: 'multi_vehicle_users',
      title: 'Drivers Owning Multiple EVs',
      category: 'User Management',
      concept: 'JOIN + GROUP BY + HAVING COUNT > 1',
      sql: `SELECT U.User_ID, U.Name, COUNT(V.Vehicle_ID) AS Total_Vehicles
FROM \`USER\` U
JOIN VEHICLE V ON U.User_ID = V.User_ID
GROUP BY U.User_ID, U.Name
HAVING COUNT(V.Vehicle_ID) > 1;`,
      execute: () => {
        const counts = {};
        data.vehicles.forEach((v) => {
          counts[v.user_id] = (counts[v.user_id] || 0) + 1;
        });
        return Object.entries(counts)
          .filter(([_, count]) => count > 1)
          .map(([userId, count]) => {
            const user = data.users.find((u) => u.user_id === Number(userId));
            return {
              user_id: Number(userId),
              name: user ? user.name : `User #${userId}`,
              total_vehicles: count
            };
          });
      }
    },
    {
      id: 'avg_rating_station',
      title: 'Average Driver Rating per Charging Station',
      category: 'Customer Satisfaction',
      concept: 'GROUP BY + AVG()',
      sql: `SELECT S.Station_ID, S.Station_Name, ROUND(AVG(R.Rating), 2) AS Average_Rating, COUNT(R.Review_ID) AS Total_Reviews
FROM REVIEW R
JOIN CHARGING_STATION S ON R.Station_ID = S.Station_ID
GROUP BY S.Station_ID, S.Station_Name
ORDER BY Average_Rating DESC;`,
      execute: () => {
        const ratingsMap = {};
        data.reviews.forEach((r) => {
          ratingsMap[r.station_id] = ratingsMap[r.station_id] || { sum: 0, count: 0 };
          ratingsMap[r.station_id].sum += r.rating;
          ratingsMap[r.station_id].count += 1;
        });
        return Object.entries(ratingsMap)
          .map(([stationId, { sum, count }]) => {
            const st = data.charging_stations.find((s) => s.station_id === Number(stationId));
            return {
              station_id: Number(stationId),
              station_name: st ? st.station_name : `Station #${stationId}`,
              average_rating: Number((sum / count).toFixed(2)),
              total_reviews: count
            };
          })
          .sort((a, b) => b.average_rating - a.average_rating);
      }
    },
    {
      id: 'battery_analytics',
      title: 'Fleet Battery Capacity Statistics',
      category: 'Vehicle Analytics',
      concept: 'MIN, MAX, AVG, SUM Aggregate Functions',
      sql: `SELECT 
    COUNT(*) AS Total_Vehicles,
    ROUND(SUM(Battery_Capacity), 2) AS Total_Battery_Capacity,
    ROUND(AVG(Battery_Capacity), 2) AS Average_Battery,
    MIN(Battery_Capacity) AS Minimum_Battery,
    MAX(Battery_Capacity) AS Maximum_Battery
FROM VEHICLE;`,
      execute: () => {
        const caps = data.vehicles.map((v) => Number(v.battery_capacity));
        const total = caps.reduce((a, b) => a + b, 0);
        return [
          {
            total_vehicles: caps.length,
            total_battery_capacity_kwh: Number(total.toFixed(2)),
            average_battery_kwh: Number((total / caps.length).toFixed(2)),
            minimum_battery_kwh: Math.min(...caps),
            maximum_battery_kwh: Math.max(...caps)
          }
        ];
      }
    },
    {
      id: 'payment_status_summary',
      title: 'Payment Status Breakdown & Gateway Settlements',
      category: 'Financial Analytics',
      concept: 'GROUP BY Payment_Status + COUNT(*) + SUM(Amount)',
      sql: `SELECT Payment_Status, COUNT(*) AS Payment_Count, SUM(Amount) AS Amount_Total
FROM PAYMENT
GROUP BY Payment_Status;`,
      execute: () => {
        const groups = {};
        data.payments.forEach((p) => {
          groups[p.payment_status] = groups[p.payment_status] || { count: 0, sum: 0 };
          groups[p.payment_status].count += 1;
          groups[p.payment_status].sum += Number(p.amount);
        });
        return Object.entries(groups).map(([status, val]) => ({
          payment_status: status,
          payment_count: val.count,
          amount_total: Number(val.sum.toFixed(2))
        }));
      }
    },
    {
      id: 'maintenance_status',
      title: 'Connector Maintenance Status Grouping',
      category: 'Hardware Diagnostics',
      concept: 'GROUP BY Status + COUNT(*)',
      sql: `SELECT Status, COUNT(*) AS Maintenance_Count
FROM MAINTENANCE
GROUP BY Status;`,
      execute: () => {
        const counts = {};
        data.maintenance.forEach((m) => {
          counts[m.status] = (counts[m.status] || 0) + 1;
        });
        return Object.entries(counts).map(([status, count]) => ({
          status,
          maintenance_count: count
        }));
      }
    },
    {
      id: 'fault_free_connectors',
      title: 'Connectors with Zero Maintenance Records',
      category: 'Hardware Diagnostics',
      concept: 'LEFT JOIN + WHERE Maintenance_ID IS NULL',
      sql: `SELECT C.Connector_ID, S.Station_Name, C.Connector_Type, C.Power_Rating, C.Status
FROM CONNECTOR C
JOIN CHARGING_STATION S ON C.Station_ID = S.Station_ID
LEFT JOIN MAINTENANCE M ON C.Connector_ID = M.Connector_ID
WHERE M.Maintenance_ID IS NULL;`,
      execute: () => {
        const maintainedIds = new Set(data.maintenance.map((m) => m.connector_id));
        return data.connectors
          .filter((c) => !maintainedIds.has(c.connector_id))
          .map((c) => {
            const st = data.charging_stations.find((s) => s.station_id === c.station_id);
            return {
              connector_id: c.connector_id,
              station_name: st ? st.station_name : `Station #${c.station_id}`,
              connector_type: c.connector_type,
              power_rating_kw: c.power_rating,
              status: c.status
            };
          });
      }
    },
    {
      id: 'cheapest_tariff',
      title: 'Cheapest Charging Tariff Comparison',
      category: 'Pricing Strategy',
      concept: 'Subquery: WHERE Price_Per_KWh = (SELECT MIN...)',
      sql: `SELECT S.Station_Name, T.Connector_Type, T.Price_Per_KWh
FROM TARIFF T
JOIN CHARGING_STATION S ON T.Station_ID = S.Station_ID
WHERE T.Price_Per_KWh = (SELECT MIN(Price_Per_KWh) FROM TARIFF);`,
      execute: () => {
        const minPrice = Math.min(...data.tariffs.map((t) => t.price_per_kwh));
        return data.tariffs
          .filter((t) => t.price_per_kwh === minPrice)
          .map((t) => {
            const st = data.charging_stations.find((s) => s.station_id === t.station_id);
            return {
              station_name: st ? st.station_name : `Station #${t.station_id}`,
              connector_type: t.connector_type,
              price_per_kwh: t.price_per_kwh
            };
          });
      }
    }
  ];

  const [activeQueryId, setActiveQueryId] = useState(queries[0].id);
  const selectedQuery = queries.find((q) => q.id === activeQueryId) || queries[0];
  const [results, setResults] = useState(selectedQuery.execute());

  const handleRunQuery = (q) => {
    setActiveQueryId(q.id);
    setResults(q.execute());
  };

  const headers = results.length > 0 ? Object.keys(results[0]) : [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-white flex items-center gap-2">
          <Database className="w-5 h-5 text-cyan-400" />
          <span>DBMS Analytics & SQL Query Studio</span>
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Execute and visualize SQL queries from <code className="text-cyan-400">analytics.sql</code> against the live normalized relational database state.
        </p>
      </div>

      {/* Main Container */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Query Selector */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 space-y-2">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2 px-1">
            Pre-configured SQL Queries
          </div>

          <div className="space-y-1.5 max-h-[600px] overflow-y-auto pr-1">
            {queries.map((q) => {
              const isSelected = q.id === activeQueryId;
              return (
                <button
                  key={q.id}
                  onClick={() => handleRunQuery(q)}
                  className={`w-full text-left p-3 rounded-lg border text-xs transition-all ${
                    isSelected
                      ? 'bg-cyan-950/50 border-cyan-500/50 text-white shadow-sm'
                      : 'bg-slate-950/60 border-slate-800/80 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-cyan-300">
                      {q.category}
                    </span>
                    {isSelected && <ChevronRight className="w-3.5 h-3.5 text-cyan-400" />}
                  </div>
                  <div className="font-semibold mt-1.5 text-slate-100">{q.title}</div>
                  <div className="text-[11px] text-slate-500 mt-1 font-mono truncate">{q.concept}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Center & Right: SQL Code & Output */}
        <div className="lg:col-span-2 space-y-5">
          {/* Query Header and Code Display */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
              <div>
                <span className="text-xs font-mono text-cyan-400 font-semibold">
                  {selectedQuery.concept}
                </span>
                <h2 className="text-base font-bold text-white mt-0.5">{selectedQuery.title}</h2>
              </div>
              <button
                onClick={() => setResults(selectedQuery.execute())}
                className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-slate-950 font-bold text-xs rounded-lg transition-all shadow-md shadow-cyan-500/20 shrink-0"
              >
                <Play className="w-3.5 h-3.5 fill-slate-950" />
                <span>Execute SQL</span>
              </button>
            </div>

            {/* SQL Terminal Box */}
            <div className="mt-4 bg-slate-950 border border-slate-800/90 rounded-xl p-4 font-mono text-xs text-slate-200 overflow-x-auto">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800 text-slate-500 text-[11px]">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80"></span>
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80"></span>
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80"></span>
                  <span className="ml-2 font-mono">mysql&gt; EV_CHARGING_NETWORK</span>
                </div>
                <span>analytics.sql</span>
              </div>
              <pre className="text-cyan-300 font-mono text-xs leading-relaxed whitespace-pre-wrap">
                {selectedQuery.sql}
              </pre>
            </div>
          </div>

          {/* Results Table */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <h3 className="text-sm font-bold text-white">Execution Result Set</h3>
              </div>
              <span className="text-xs font-mono text-slate-400">
                {results.length} {results.length === 1 ? 'row' : 'rows'} returned in 0.002s
              </span>
            </div>

            <div className="overflow-x-auto rounded-lg border border-slate-800">
              <table className="w-full text-xs text-left">
                <thead className="text-[11px] uppercase bg-slate-950 text-slate-400 border-b border-slate-800">
                  <tr>
                    {headers.map((h) => (
                      <th key={h} className="py-2.5 px-3 font-mono">
                        {h.replace(/_/g, ' ')}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 bg-slate-950/40">
                  {results.map((row, idx) => (
                    <tr key={idx} className="hover:bg-slate-800/40">
                      {headers.map((h) => (
                        <td
                          key={h}
                          className={`py-2.5 px-3 ${
                            typeof row[h] === 'number'
                              ? 'font-mono text-emerald-400 font-semibold'
                              : 'text-slate-300'
                          }`}
                        >
                          {String(row[h])}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
