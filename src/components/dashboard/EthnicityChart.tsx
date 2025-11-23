/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

// Type definitions
interface ChartData {
  name: string;
  value: number;
}

interface TriangleBarProps {
  fill: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

interface BarLabelProps {
  x: number;
  y: number;
  width: number;
  value: number;
}

interface GenderData extends ChartData {
  percentage: string;
  color: string;
}

const DemographicsDashboard: React.FC = () => {
  // Race/Ethnicity data
  const raceData: ChartData[] = [
    { name: "White", value: 76 },
    { name: "Asian", value: 84 },
    { name: "Hispanic", value: 96 },
    { name: "Black", value: 82 },
    { name: "Others", value: 88 },
  ];

  // Age Distribution data
  const ageData: ChartData[] = [
    { name: "18-24", value: 75 },
    { name: "25-34", value: 82 },
    { name: "35-44", value: 78 },
    { name: "45-54", value: 95 },
    { name: "55+", value: 88 },
  ];

  // Gender Distribution data
  const genderData: GenderData[] = [
    { name: "Men", value: 93, percentage: "31.00%", color: "#6366F1" },
    { name: "Women", value: 85, percentage: "28.33%", color: "#10B981" },
    { name: "Non-Binary", value: 53, percentage: "17.67%", color: "#F59E0B" },
    { name: "Trans Men", value: 43, percentage: "14.33%", color: "#06B6D4" },
    { name: "Trans Women", value: 26, percentage: "8.67%", color: "#A855F7" },
  ];

  const COLORS: string[] = [
    "#6366F1",
    "#10B981",
    "#F59E0B",
    "#06B6D4",
    "#A855F7",
  ];
  const getTrianglePath = (
    x: number,
    y: number,
    width: number,
    height: number
  ) =>
    `M${x},${y + height} L${x + width / 2},${y} L${x + width},${y + height} Z`;

  const TriangleBar: React.FC<TriangleBarProps> = ({ fill, x, y, width, height }) => (
    <path d={getTrianglePath(x, y, width, height)} fill={fill} />
  );
  const raceDataMax = raceData.map((d) => ({ ...d, max: 100 }));
  const ageDataMax = ageData.map((d) => ({ ...d, max: 100 }));

  // Custom label component for displaying values on top of bars
  const renderBarLabel = (props: BarLabelProps) => {
    const { x, y, width, value } = props;
    return (
      <text
        x={x + width / 2}
        y={y - 5}
        textAnchor="middle"
        fill="#666"
        fontSize="12"
        fontWeight="500"
      >
        {value}
      </text>
    );
  };

  return (
    <div className="">
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mx-auto">
        {/* Race/Ethnicity Chart */}
        <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">
              Race / Ethnicity
            </h2>
            <div className="w-12 h-1 bg-cyan-400 rounded-full"></div>
            <hr className="mt-3 border-gray-200" />
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={raceDataMax}
                margin={{ top: 30, right: 20, left: 20, bottom: 20 }}
                barCategoryGap="5%" // gap kom, width barabe
                barSize={80}
                // margin={{ top: 30, right: 20, left: 20, bottom: 20 }}
                // barCategoryGap="28%"
              >
                <CartesianGrid
                  strokeDasharray="2 2"
                  stroke="#E5E7EB"
                  horizontal
                  vertical={false}
                />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 13, fill: "#6B7280", fontWeight: 500 }}
                  dy={10}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: "#9CA3AF" }}
                  domain={[0, 100]}
                  ticks={[0, 20, 40, 60, 80, 100]}
                />

                {/* Background ghost triangle to 100 */}
                <Bar
                  dataKey="max"
                  shape={(props: any) => <TriangleBar {...props} fill="url(#triangleBg)" />}
                  fill="url(#triangleBg)"
                  isAnimationActive={false}
                />

                {/* Foreground actual value */}
                <Bar
                  dataKey="value"
                  shape={(props: any) => <TriangleBar {...props} />}
                  fill="url(#triangleFg)"
                  label={renderBarLabel}
                />

                <defs>
                  {/* light translucent bg */}
                  {/* <linearGradient id="triangleBg" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#93C5FD" stopOpacity={0.25} />
                    <stop offset="100%" stopColor="#93C5FD" stopOpacity={0.1} />
                  </linearGradient> */}
                  {/* solid foreground like your purple */}
                  <linearGradient id="triangleFg" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#638BFF" />
                    <stop offset="100%" stopColor="#7DA2FF" />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Age Distribution Chart */}
        <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">
              Age Distribution
            </h2>
            <div className="w-12 h-1 bg-cyan-400 rounded-full"></div>
            <hr className="mt-3 border-gray-200" />
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={ageDataMax}
              margin={{ top: 30, right: 20, left: 20, bottom: 20 }}
                barCategoryGap="5%" // gap kom, width barabe
                barSize={60}
              >
                <CartesianGrid
                  strokeDasharray="2 2"
                  stroke="#E5E7EB"
                  horizontal
                  vertical={false}
                />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 13, fill: "#6B7280", fontWeight: 500 }}
                  dy={10}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: "#9CA3AF" }}
                  domain={[0, 100]}
                  ticks={[0, 20, 40, 60, 80, 100]}
                />

                <Bar
                  dataKey="max"
                  shape={(props: any) => <TriangleBar {...props} />}
                  fill="url(#triangleBg2)"
                  isAnimationActive={false}
                />
                <Bar
                  dataKey="value"
                  shape={(props: any) => <TriangleBar {...props} />}
                  fill="url(#triangleFg2)"
                  label={renderBarLabel}
                />

                <defs>
                  {/* <linearGradient id="triangleBg2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#93C5FD" stopOpacity={0.25} />
                    <stop offset="100%" stopColor="#93C5FD" stopOpacity={0.1} />
                  </linearGradient> */}
                  <linearGradient id="triangleFg2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#638BFF" />
                    <stop offset="100%" stopColor="#7DA2FF" />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Gender Distribution Chart */}
        <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 lg:col-span-2 xl:col-span-1">
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">
              Gender Distribution
            </h2>
            <div className="w-12 h-1 bg-cyan-400 rounded-full"></div>
            <hr className="mt-3 border-gray-200" />
          </div>

          <div className="relative">
            {/* Pie Chart Container */}
            <div className="h-64 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={genderData}
                    cx="50%"
                    cy="50%"
                    outerRadius={90}
                    innerRadius={0}
                    fill="#8884d8"
                    dataKey="value"
                    strokeWidth={2}
                    stroke="#ffffff"
                  >
                    {genderData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index]} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Custom Labels positioned around the pie chart */}
            <div className="absolute top-4 left-4 text-sm">
              <div className="text-gray-600 mb-1">Trans Women</div>
              <div className="font-semibold text-purple-600">
                26 <span className="text-gray-500 font-normal">8.67%</span>
              </div>
            </div>

            <div className="absolute top-16 left-2 text-sm">
              <div className="text-gray-600 mb-1">Trans Men</div>
              <div className="font-semibold text-cyan-600">
                43 <span className="text-gray-500 font-normal">14.33%</span>
              </div>
            </div>

            <div className="absolute top-4 right-4 text-sm text-right">
              <div className="text-gray-600 mb-1">Men</div>
              <div className="font-semibold text-indigo-600">
                93 <span className="text-gray-500 font-normal">31.00%</span>
              </div>
            </div>

            <div className="absolute bottom-20 right-4 text-sm text-right">
              <div className="text-gray-600 mb-1">Women</div>
              <div className="font-semibold text-green-600">
                85 <span className="text-gray-500 font-normal">28.33%</span>
              </div>
            </div>

            <div className="absolute bottom-16 left-2 text-sm">
              <div className="text-gray-600 mb-1">Non-Binary</div>
              <div className="font-semibold text-amber-600">
                53 <span className="text-gray-500 font-normal">17.67%</span>
              </div>
            </div>
          </div>

          {/* Bottom Legend */}
          <div className="mt-6 flex flex-wrap justify-center gap-4 text-sm">
            {genderData.map((item, index) => (
              <div key={item.name} className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: COLORS[index] }}
                />
                <span className="text-gray-700">{item.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DemographicsDashboard;
