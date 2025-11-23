"use client";
import React, { useState, useEffect } from "react";
import ChartHeader from "@/components/dashboard/ChartHeader";
import EthnicityChart from "@/components/dashboard/EthnicityChart";
import StatisticsDashboard from "@/components/dashboard/StatisticsDashboard";
import MonetizationFeaturesTable from "@/components/pages/analytics-reports/MonetizationFeaturesTable";
import { Card, CardContent } from "@/components/ui/card";
import {
  Bar,
  BarChart,
  ComposedChart,
  Line,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

// Extended data for different years and date ranges
const allMatchesData = {
  "2024": [
    { month: "Jan", matches: 20, line: 60 },
    { month: "Feb", matches: 35, line: 65 },
    { month: "Mar", matches: 25, line: 76 },
    { month: "Apr", matches: 40, line: 68 },
    { month: "May", matches: 15, line: 78 },
    { month: "Jun", matches: 60, line: 87 },
    { month: "Jul", matches: 20, line: 72 },
    { month: "Aug", matches: 55, line: 74 },
    { month: "Sep", matches: 60, line: 76 },
    { month: "Oct", matches: 45, line: 93 },
    { month: "Nov", matches: 35, line: 63 },
    { month: "Dec", matches: 25, line: 58 },
  ],
  "2023": [
    { month: "Jan", matches: 18, line: 55 },
    { month: "Feb", matches: 28, line: 58 },
    { month: "Mar", matches: 22, line: 62 },
    { month: "Apr", matches: 32, line: 64 },
    { month: "May", matches: 12, line: 68 },
    { month: "Jun", matches: 48, line: 72 },
    { month: "Jul", matches: 16, line: 66 },
    { month: "Aug", matches: 42, line: 69 },
    { month: "Sep", matches: 52, line: 71 },
    { month: "Oct", matches: 38, line: 78 },
    { month: "Nov", matches: 28, line: 58 },
    { month: "Dec", matches: 20, line: 52 },
  ],
};

const allCrashFreeData = {
  current: [
    { version: "Day 1", percentage: 56 },
    { version: "Day 7", percentage: 64 },
    { version: "Day 30", percentage: 76 },
  ],
};

// Custom tooltip component
const CustomTooltip = ({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: {
    color?: string;
    name?: string;
    dataKey?: string;
    value: unknown;
  }[];
  label?: string;
}) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white/95 p-3 rounded-lg shadow-lg border border-gray-200">
        <p className="font-semibold text-gray-800">{`${label}`}</p>
        {payload.map((entry, index) => (
          <p key={index} style={{ color: entry.color }} className="text-sm">
            {`${entry.name || entry.dataKey}: ${entry.value}`}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const Page = () => {
  // These variables will be used in future implementations
  // const [selectedYear] = useState('2024');
  // const [selectedPeriod] = useState('current');
  // const [selectedDateRange] = useState('Last 30 days');
  const [realTimeMetrics, setRealTimeMetrics] = useState({
    uptime: 99.98,
    latency: 82,
    errorRate: 0.03,
    churnRate: 3.5,
  });

  // Real-time data updates
  useEffect(() => {
    const interval = setInterval(() => {
      setRealTimeMetrics((prev) => ({
        uptime: Math.min(
          99.99,
          Math.max(99.9, prev.uptime + (Math.random() - 0.5) * 0.02)
        ),
        latency: Math.max(
          50,
          Math.min(120, prev.latency + (Math.random() - 0.5) * 8)
        ),
        errorRate: Math.max(
          0,
          Math.min(0.1, prev.errorRate + (Math.random() - 0.5) * 0.01)
        ),
        churnRate: Math.max(
          2,
          Math.min(5, prev.churnRate + (Math.random() - 0.5) * 0.2)
        ),
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const currentMatchesData = (
    allMatchesData as Record<string, (typeof allMatchesData)["2024"]>
  )["2024"];
  const currentCrashFreeData = (
    allCrashFreeData as Record<string, (typeof allCrashFreeData)["current"]>
  )["current"];

  return (
    <div>
      <div className="flex gap-6 mb-6">
        {/* Matches Created */}
        <Card className="bg-white/20 rounded-lg p-6 flex-1 w-full shadow-2xl">
          <div className="mb-4 flex justify-between items-center">
            <h4 className="text-lg font-semibold text-white">
              Matches Created (2024)
            </h4>
            <span className="text-sm text-gray-300">Last 30 days</span>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={currentMatchesData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="rgba(255,255,255,0.1)"
                />
                <XAxis
                  dataKey="month"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "white" }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "white" }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="matches" fill="#BBC2C5" name="Matches" />
                <Line
                  type="monotone"
                  dataKey="line"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  dot={{ fill: "#3b82f6", strokeWidth: 2, r: 4 }}
                  name="Trend"
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <StatisticsDashboard />
      </div>

      <ChartHeader />

      {/* Real-time Server Load */}
      <div className="bg-white/20 p-8 rounded-md mb-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-white pb-2">
            REAL-TIME SERVER LOAD
          </h3>
          <div className="flex gap-2 items-center">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-sm text-gray-300">Live</span>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <Card className="bg-white/50 flex flex-col items-center p-4 cursor-pointer hover:bg-white/60 transition-colors">
            <CardContent className="p-0">
              <div className="text-3xl font-bold text-white mb-1">
                {realTimeMetrics.uptime.toFixed(2)}%
              </div>
              <div className="text-sm text-gray-50 uppercase">Uptime (24h)</div>
              <div className="text-xs text-gray-50">Last 24 hours</div>
            </CardContent>
          </Card>
          <Card className="bg-white/50 flex flex-col items-center p-4 cursor-pointer hover:bg-white/60 transition-colors">
            <CardContent className="p-0">
              <div className="text-3xl font-bold text-white mb-1">
                {Math.round(realTimeMetrics.latency)}
              </div>
              <div className="text-sm text-gray-50 uppercase">
                API Latency (p95)
              </div>
              <div className="text-xs text-gray-50">Target &lt; 100ms</div>
            </CardContent>
          </Card>
          <Card className="bg-white/50 flex flex-col items-center p-4 cursor-pointer hover:bg-white/60 transition-colors">
            <CardContent className="p-0">
              <div className="text-3xl font-bold text-white mb-1">
                {realTimeMetrics.errorRate.toFixed(2)}%
              </div>
              <div className="text-sm text-gray-50 uppercase">
                API Error Rate
              </div>
              <div className="text-xs text-gray-50">Last 60 minutes</div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Matches Created 2 */}
      <Card className="bg-white/20 rounded-lg p-6 flex-1 w-full shadow-2xl mb-6">
        <div className="mb-4">
          <h4 className="text-lg font-semibold text-white">
            Matches Created (Detailed View)
          </h4>
        </div>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={currentMatchesData}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="rgba(255,255,255,0.1)"
              />
              <XAxis
                dataKey="month"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "white" }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "white" }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="matches" fill="#BBC2C5" name="Matches" />
              <Line
                type="monotone"
                dataKey="line"
                stroke="#3b82f6"
                strokeWidth={2}
                dot={{ fill: "#3b82f6", strokeWidth: 2, r: 4 }}
                name="Performance Score"
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Crash-Free Users by App Version */}
      <div className="flex gap-6 my-6">
        <div className="flex-1 w-full">
          <Card className="bg-white rounded-lg p-6">
            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <h4 className="text-lg font-semibold text-gray-800">
                  User Retention
                </h4>
              </div>
              <div className="border-b-2 border-gray-200 mb-4"></div>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={currentCrashFreeData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="version" axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar
                    dataKey="percentage"
                    fill="#6366f1"
                    name="Crash-Free %"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>

        <Card className="bg-white/20 rounded-lg p-6 shadow-2xl">
          <div className="flex flex-col items-center uppercase p-14 text-white max-w-5xl font-[Bebas_Neue] justify-center bg-white/50 rounded-md h-full w-full cursor-pointer hover:bg-white/60 transition-colors">
            <span className="font-bold text-2xl">Churn Rate</span>
            <span className="font-bold text-7xl">
              {realTimeMetrics.churnRate.toFixed(1)}%
            </span>
            <p className="w-64 text-center">
              Percentage of users who did not return in the last 30 days.
            </p>
            <div className="mt-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
                <span>Real-time data</span>
              </div>
            </div>
          </div>
        </Card>
      </div>

      <div className="mt-6">
        <EthnicityChart />
      </div>
      <MonetizationFeaturesTable />
    </div>
  );
};

export default Page;
