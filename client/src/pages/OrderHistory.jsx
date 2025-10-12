import React from "react";
import { Link } from "react-router-dom";

const history = [
  {
    id: "STU-2025-001",
    type: "Studio",
    title: "Skyline Loft Residences",
    vendor: "Lumen Atelier",
    date: "2025-01-12",
    status: "Delivered",
    amount: 14500,
    currency: "USD",
  },
  {
    id: "MAT-2025-014",
    type: "Warehouse",
    title: "UltraTech OPC 53 Grade Cement",
    vendor: "BuildMart Logistics",
    date: "2025-02-04",
    status: "In transit",
    amount: 3890,
    currency: "INR",
  },
  {
    id: "ASC-2025-006",
    type: "Associate",
    title: "BIM Coordination Sprint",
    vendor: "Rahul Iyer",
    date: "2025-02-18",
    status: "Completed",
    amount: 1260,
    currency: "USD",
  },
  {
    id: "STU-2025-009",
    type: "Studio",
    title: "Terraced Courtyard Villa",
    vendor: "Atelier Oryza",
    date: "2025-03-01",
    status: "Processing",
    amount: 9800,
    currency: "USD",
  },
];

const statusColours = {
  Delivered: "bg-emerald-100 text-emerald-700 border border-emerald-200",
  Completed: "bg-emerald-100 text-emerald-700 border border-emerald-200",
  "In transit": "bg-amber-100 text-amber-700 border border-amber-200",
  Processing: "bg-slate-100 text-slate-600 border border-slate-200",
  Pending: "bg-slate-100 text-slate-600 border border-slate-200",
};

const OrderHistory = () => {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4 py-12">
          <p className="uppercase tracking-[0.35em] text-xs text-slate-400 mb-3">
            account
          </p>
          <h1 className="text-3xl sm:text-4xl font-semibold text-slate-900 mb-3">
            Order history
          </h1>
          <p className="text-sm sm:text-base text-slate-600 max-w-2xl">
            Track design packages, procurement consignments, and associate engagements
            fulfilled through Builtattic. These records are populated with demo data for
            quick onboarding.
          </p>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-10 space-y-6">
        <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-6">
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm text-left">
              <thead className="text-xs uppercase tracking-widest text-slate-500">
                <tr>
                  <th className="px-4 py-3">Order</th>
                  <th className="px-4 py-3">Type</th>
                  <th className="px-4 py-3">Vendor</th>
                  <th className="px-4 py-3 whitespace-nowrap">Status</th>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3 text-right">Amount</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {history.map((entry) => (
                  <tr key={entry.id} className="hover:bg-slate-50">
                    <td className="px-4 py-4">
                      <p className="font-semibold text-slate-800">{entry.title}</p>
                      <p className="text-xs text-slate-500 mt-1">{entry.id}</p>
                    </td>
                    <td className="px-4 py-4">
                      <span className="inline-flex items-center rounded-full bg-slate-100 text-slate-600 border border-slate-200 px-2.5 py-1 text-xs font-medium">
                        {entry.type}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-slate-600">{entry.vendor}</td>
                    <td className="px-4 py-4">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${statusColours[entry.status] || "bg-slate-100 text-slate-600 border border-slate-200"}`}>
                        {entry.status}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-slate-600">
                      {new Date(entry.date).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-4 text-right text-slate-800 font-semibold">
                      {new Intl.NumberFormat(undefined, {
                        style: "currency",
                        currency: entry.currency,
                        maximumFractionDigits: 0,
                      }).format(entry.amount)}
                    </td>
                    <td className="px-4 py-4 text-right">
                      <Link
                        to="#"
                        className="text-xs font-medium text-slate-600 hover:text-slate-900"
                      >
                        View invoice
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <section className="bg-white border border-slate-200 rounded-xl p-6 space-y-3 text-sm text-slate-600">
          <h2 className="text-base font-semibold text-slate-900">Need to reconcile?</h2>
          <p>
            Sync this record with your finance stack by exporting the demo data or connecting
            to your ERP when you move to production.
          </p>
          <div className="flex flex-wrap gap-3">
            <button className="px-4 py-2 rounded-lg border border-slate-200 text-slate-700 hover:border-slate-300">
              Export CSV
            </button>
            <button className="px-4 py-2 rounded-lg border border-slate-200 text-slate-700 hover:border-slate-300">
              Connect ERP
            </button>
          </div>
        </section>
      </main>
    </div>
  );
};

export default OrderHistory;

