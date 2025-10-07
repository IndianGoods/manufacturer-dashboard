import React, { useState } from "react";
import Card from "../../../components/ui/Card";
import { Calendar } from "lucide-react";
import Breadcrumbs from "../../../components/layout/Breadcrumbs";

interface MetricCardProps {
  title: string;
  value: string;
  subtitle?: string;
}

const metricCards: MetricCardProps[] = [
  { title: "Gross sales", value: "₹0" },
  { title: "Returning customer rate", value: "0%" },
  { title: "Orders fulfilled", value: "0" },
  { title: "Orders", value: "0" },
];

const chartData = [
  { label: "12 AM", value: 0 },
  { label: "2 AM", value: 0 },
  { label: "4 AM", value: 0 },
  { label: "6 AM", value: 0 },
  { label: "8 AM", value: 0 },
  { label: "10 AM", value: 0 },
  { label: "12 PM", value: 0 },
  { label: "2 PM", value: 0 },
  { label: "4 PM", value: 0 },
  { label: "6 PM", value: 0 },
  { label: "8 PM", value: 0 },
  { label: "10 PM", value: 0 },
];

const breakdownRows = [
  { label: "Gross sales", value: "₹0.00" },
  { label: "Discounts", value: "₹0.00" },
  { label: "Returns", value: "₹0.00" },
  { label: "Net sales", value: "₹0.00" },
  { label: "Shipping charges", value: "₹0.00" },
  { label: "Return fees", value: "₹0.00" },
  { label: "Taxes", value: "₹0.00" },
  { label: "Total sales", value: "₹0.00" },
];

const dateRanges = [
  "Today",
  "Yesterday",
  "Last 7 days",
  "Last 30 days",
  "Last 90 days",
  "Last 12 months",
];

// Metric Card Component
const MetricCard: React.FC<MetricCardProps> = ({ title, value, subtitle }) => (
  <div className="flex flex-col justify-between p-6 rounded-xl border border-gray-200 bg-white shadow-sm min-h-[90px]">
    <div className="flex items-center justify-between">
      <div className="text-sm font-medium text-gray-700">{title}</div>
      {/* Optional: add a small line indicator */}
      <div className="w-16 h-1 bg-gray-100 rounded-full" />
    </div>
    <div className="mt-2 text-2xl font-bold text-gray-900">{value}</div>
    {subtitle && <div className="text-xs text-gray-500 mt-1">{subtitle}</div>}
  </div>
);

// Chart Line Component (simple placeholder)
const ChartLine: React.FC = () => (
  <svg width="100%" height="220" viewBox="0 0 800 220" className="block">
    <polyline
      fill="none"
      stroke="#3B82F6"
      strokeWidth="2"
      points="0,200 800,200"
      strokeDasharray="4 4"
    />
  </svg>
);

// Main Dashboard Component
const AnalyticsDashboard: React.FC = () => {
  const [selectedDateRange, setSelectedDateRange] = useState(dateRanges[0]);
  const [selectedDay, setSelectedDay] = useState(() => {
    const today = new Date();
    return today.toISOString().slice(0, 10);
  });

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4">
        {/* Breadcrumbs */}
        <Breadcrumbs
          items={[{ name: "Analytics", href: "/dashboard/analytics" }]}
        />

        {/* Header Section */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
            </div>
            <div className="flex items-center gap-2">
              <select
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none"
                value={selectedDateRange}
                onChange={(e) => setSelectedDateRange(e.target.value)}
              >
                {dateRanges.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
              <div className="flex items-center gap-1 px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm text-gray-700">
                <Calendar size={16} className="mr-1 text-gray-400" />
                <input
                  type="date"
                  value={selectedDay}
                  onChange={(e) => setSelectedDay(e.target.value)}
                  className="bg-transparent outline-none border-none text-gray-700"
                  style={{ width: 120 }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {metricCards.map((card, idx) => (
            <MetricCard key={idx} {...card} />
          ))}
        </div>

        {/* Main Chart & Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-6">
          {/* Main Chart */}
          <div className="lg:col-span-3 bg-white rounded-xl border border-gray-200 p-6 flex flex-col min-h-[340px]">
            <div className="mb-2">
              <div className="text-base font-semibold text-gray-900">
                Total sales over time
              </div>
              <div className="text-sm text-gray-500">₹0 —</div>
            </div>
            <div className="flex-1 flex items-center">
              <ChartLine />
            </div>
            <div className="flex gap-4 mt-2 text-xs text-gray-500">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-blue-500 inline-block" />{" "}
                Oct 6, 2025
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-blue-300 inline-block" />{" "}
                Oct 5, 2025
              </span>
            </div>
          </div>
          {/* Breakdown Sidebar */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 min-h-[340px] overflow-y-auto">
            <div className="text-base font-semibold text-gray-900 mb-2">
              Total sales breakdown
            </div>
            <table className="w-full text-sm">
              <tbody>
                {breakdownRows.map((row) => (
                  <tr key={row.label} className="border-b border-gray-100">
                    <td className="py-2 text-primary-600 font-medium">
                      {row.label}
                    </td>
                    <td className="py-2 text-right text-gray-700">
                      {row.value}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Lower Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-xl border border-gray-200 p-6 min-h-[180px]">
            <div className="text-base font-semibold text-gray-900 mb-2">
              Total sales by sales channel
            </div>
            <div className="flex items-center justify-center h-24 text-gray-400 text-sm">
              No data for this date range
            </div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-6 min-h-[180px]">
            <div className="text-base font-semibold text-gray-900 mb-2">
              Average order value over time
            </div>
            <div className="flex items-center justify-center h-24 text-gray-400 text-sm">
              No data for this date range
            </div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-6 min-h-[180px]">
            <div className="text-base font-semibold text-gray-900 mb-2">
              Total sales by product
            </div>
            <div className="flex items-center justify-center h-24 text-gray-400 text-sm">
              No data for this date range
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
