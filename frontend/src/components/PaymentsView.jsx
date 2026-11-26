import React, { useState } from 'react';
import { CreditCard, CheckCircle2, Clock, AlertTriangle, RefreshCw, Receipt, Search, Filter } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const PaymentsView = () => {
  const { data, updatePaymentStatus } = useApp();
  const [filterStatus, setFilterStatus] = useState('All');
  const [selectedReceipt, setSelectedReceipt] = useState(null);

  const filteredPayments = data.payments.filter((p) => {
    return filterStatus === 'All' || p.payment_status === filterStatus;
  });

  const successfulTotal = data.payments
    .filter((p) => p.payment_status === 'Successful')
    .reduce((sum, p) => sum + Number(p.amount), 0);

  const pendingTotal = data.payments
    .filter((p) => p.payment_status === 'Pending')
    .reduce((sum, p) => sum + Number(p.amount), 0);

  const failedTotal = data.payments
    .filter((p) => p.payment_status === 'Failed')
    .reduce((sum, p) => sum + Number(p.amount), 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-white flex items-center gap-2">
          <CreditCard className="w-5 h-5 text-emerald-400" />
          <span>Billing & Payments Ledger</span>
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          PAYMENT table records linked to CHARGING_SESSION with multi-method payment verification.
        </p>
      </div>

      {/* Financial Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Successful Settlements</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-emerald-400 mt-2">
            ₹{successfulTotal.toLocaleString()}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            {data.payments.filter((p) => p.payment_status === 'Successful').length} cleared payments
          </div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Pending Approvals</span>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-amber-400 mt-2">
            ₹{pendingTotal.toLocaleString()}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            {data.payments.filter((p) => p.payment_status === 'Pending').length} pending in gateway
          </div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Failed / Retrying</span>
            <AlertTriangle className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-rose-400 mt-2">
            ₹{failedTotal.toLocaleString()}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            {data.payments.filter((p) => p.payment_status === 'Failed').length} requires reconciliation
          </div>
        </div>
      </div>

      {/* Ledger Table */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <h2 className="text-sm font-bold text-white">Transactions Table (PAYMENT)</h2>
            <p className="text-xs text-slate-400">Click on status to simulate gateway status update</p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">Filter:</span>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white"
            >
              <option value="All">All Transactions</option>
              <option value="Successful">Successful</option>
              <option value="Pending">Pending</option>
              <option value="Failed">Failed</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="text-[11px] uppercase bg-slate-950/60 text-slate-400 border-b border-slate-800">
              <tr>
                <th className="py-2.5 px-3">Payment ID</th>
                <th className="py-2.5 px-3">Reference</th>
                <th className="py-2.5 px-3">Session</th>
                <th className="py-2.5 px-3">Amount</th>
                <th className="py-2.5 px-3">Method</th>
                <th className="py-2.5 px-3">Date & Time</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredPayments.map((p) => {
                const isSuccess = p.payment_status === 'Successful';
                const isPending = p.payment_status === 'Pending';
                const isFailed = p.payment_status === 'Failed';

                return (
                  <tr key={p.payment_id} className="hover:bg-slate-800/40">
                    <td className="py-2.5 px-3 font-mono text-slate-400">#{p.payment_id}</td>
                    <td className="py-2.5 px-3 font-mono font-medium text-white">
                      {p.transaction_reference}
                    </td>
                    <td className="py-2.5 px-3 font-mono text-cyan-400">#{p.session_id}</td>
                    <td className="py-2.5 px-3 font-mono font-bold text-emerald-400">
                      ₹{p.amount}
                    </td>
                    <td className="py-2.5 px-3 text-slate-300">{p.payment_method}</td>
                    <td className="py-2.5 px-3 font-mono text-slate-500 text-[11px]">
                      {p.payment_date}
                    </td>
                    <td className="py-2.5 px-3">
                      <select
                        value={p.payment_status}
                        onChange={(e) => updatePaymentStatus(p.payment_id, e.target.value)}
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border bg-slate-950 cursor-pointer focus:outline-none ${
                          isSuccess
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                            : isPending
                            ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                            : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                        }`}
                      >
                        <option value="Successful">Successful</option>
                        <option value="Pending">Pending</option>
                        <option value="Failed">Failed</option>
                        <option value="Refunded">Refunded</option>
                      </select>
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      <button
                        onClick={() => setSelectedReceipt(p)}
                        className="text-xs text-slate-400 hover:text-emerald-400 transition-colors p-1"
                        title="View Receipt"
                      >
                        <Receipt className="w-4 h-4 inline" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Receipt Modal */}
      {selectedReceipt && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-sm p-6 shadow-2xl">
            <div className="text-center pb-4 border-b border-slate-800">
              <h3 className="text-base font-bold text-white">Payment Receipt</h3>
              <p className="text-xs font-mono text-emerald-400 mt-0.5">
                {selectedReceipt.transaction_reference}
              </p>
            </div>

            <div className="my-4 p-4 rounded-xl bg-slate-950/70 border border-slate-800 text-xs space-y-2.5">
              <div className="flex justify-between text-slate-400">
                <span>Payment ID:</span>
                <span className="font-mono text-white">#{selectedReceipt.payment_id}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Session ID:</span>
                <span className="font-mono text-white">#{selectedReceipt.session_id}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Method:</span>
                <span className="text-white font-medium">{selectedReceipt.payment_method}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Timestamp:</span>
                <span className="font-mono text-slate-300">{selectedReceipt.payment_date}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Status:</span>
                <span className="text-emerald-400 font-bold">{selectedReceipt.payment_status}</span>
              </div>
              <div className="pt-2 border-t border-slate-800 flex justify-between text-sm font-bold text-white">
                <span>Total Amount:</span>
                <span className="font-mono text-emerald-400 text-base">₹{selectedReceipt.amount}</span>
              </div>
            </div>

            <button
              onClick={() => setSelectedReceipt(null)}
              className="w-full py-2 text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
