/* eslint-disable @typescript-eslint/no-explicit-any */
import { useAgeDistributionQuery, useEthnicityDistributionQuery, useGenderdistributionQuery } from "@/lib/store/dashbaord/dashbaordOverviewApi";
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
  const { data: ageDistribution } = useAgeDistributionQuery();
  console.log(ageDistribution);
  const { data: ethnicityDistribution } = useEthnicityDistributionQuery();
  console.log(ethnicityDistribution);
  const { data: genderDistribution } = useGenderdistributionQuery();
  console.log(genderDistribution);

  // Race/Ethnicity data - Transform API data
  const raceData: ChartData[] = ethnicityDistribution?.data
    ? Object.entries(ethnicityDistribution.data).map(([name, value]) => ({
        name,
        value: typeof value === "number" ? value : 0,
      }))
    : [];

  // Age Distribution data - Transform API data to chart format
  const ageData: ChartData[] = ageDistribution?.data
    ? Object.entries(ageDistribution.data).map(([name, value]) => ({
        name,
        value: typeof value === "number" ? value : 0,
      }))
    : [];

  // Gender Distribution data - Transform API data
  const genderData: GenderData[] = genderDistribution?.data
    ? Object.entries(genderDistribution.data)
        .map(([key, data]: [string, any]) => {
          const value = data.total || 0;
          const percentage = data.percentage || "0%";
          // Map gender keys to display names
          const nameMap: Record<string, string> = {
            MAN: "Men",
            WOMEN: "Women",
            "NON-BINARY": "Non-Binary",
            "TRANS MAN": "Trans Men",
            "TRANS WOMAN": "Trans Women",
            Unknown: "Unknown",
          };
          return {
            name: nameMap[key] || key,
            value,
            percentage,
            color: "#6366F1",
          };
        })
    : [];

  const COLORS: string[] = [
    "#6366F1",
    "#10B981",
    "#F59E0B",
    "#06B6D4",
    "#A855F7",
    "#EF4444",
  ];

  // Assign colors to gender data
  const genderDataWithColors: GenderData[] = genderData.map((item, index) => ({
    ...item,
    color: COLORS[index % COLORS.length],
  }));
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
         {/* Race/Ethnicity Chart */}
        <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 mb-6">
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
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 gap-6 mx-auto">
     

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
              {genderDataWithColors.some((item) => item.value > 0) ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={genderDataWithColors}
                      cx="50%"
                      cy="50%"
                      outerRadius={90}
                      innerRadius={0}
                      fill="#8884d8"
                      dataKey="value"
                      strokeWidth={2}
                      stroke="#ffffff"
                    >
                      {genderDataWithColors.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="text-center text-gray-500">
                  <p className="text-sm">No data available</p>
                </div>
              )}
            </div>

            {/* Dynamic Labels positioned around the pie chart */}
            {genderDataWithColors.length > 0 && (
              <>
                {genderDataWithColors[0] && (
                  <div className="absolute top-4 right-4 text-sm text-right">
                    <div className="text-gray-600 mb-1">{genderDataWithColors[0].name}</div>
                    <div className="font-semibold" style={{ color: genderDataWithColors[0].color }}>
                      {genderDataWithColors[0].value}{" "}
                      <span className="text-gray-500 font-normal">
                        {genderDataWithColors[0].percentage}
                      </span>
                    </div>
                  </div>
                )}
                {genderDataWithColors[1] && (
                  <div className="absolute top-16 right-2 text-sm text-right">
                    <div className="text-gray-600 mb-1">{genderDataWithColors[1].name}</div>
                    <div className="font-semibold" style={{ color: genderDataWithColors[1].color }}>
                      {genderDataWithColors[1].value}{" "}
                      <span className="text-gray-500 font-normal">
                        {genderDataWithColors[1].percentage}
                      </span>
                    </div>
                  </div>
                )}
                {genderDataWithColors[2] && (
                  <div className="absolute bottom-16 left-2 text-sm">
                    <div className="text-gray-600 mb-1">{genderDataWithColors[2].name}</div>
                    <div className="font-semibold" style={{ color: genderDataWithColors[2].color }}>
                      {genderDataWithColors[2].value}{" "}
                      <span className="text-gray-500 font-normal">
                        {genderDataWithColors[2].percentage}
                      </span>
                    </div>
                  </div>
                )}
                {genderDataWithColors[3] && (
                  <div className="absolute bottom-20 left-2 text-sm">
                    <div className="text-gray-600 mb-1">{genderDataWithColors[3].name}</div>
                    <div className="font-semibold" style={{ color: genderDataWithColors[3].color }}>
                      {genderDataWithColors[3].value}{" "}
                      <span className="text-gray-500 font-normal">
                        {genderDataWithColors[3].percentage}
                      </span>
                    </div>
                  </div>
                )}
                {genderDataWithColors[4] && (
                  <div className="absolute top-4 left-4 text-sm">
                    <div className="text-gray-600 mb-1">{genderDataWithColors[4].name}</div>
                    <div className="font-semibold" style={{ color: genderDataWithColors[4].color }}>
                      {genderDataWithColors[4].value}{" "}
                      <span className="text-gray-500 font-normal">
                        {genderDataWithColors[4].percentage}
                      </span>
                    </div>
                  </div>
                )}
                {genderDataWithColors[5] && (
                  <div className="absolute bottom-4 left-4 text-sm">
                    <div className="text-gray-600 mb-1">{genderDataWithColors[5].name}</div>
                    <div className="font-semibold" style={{ color: genderDataWithColors[5].color }}>
                      {genderDataWithColors[5].value}{" "}
                      <span className="text-gray-500 font-normal">
                        {genderDataWithColors[5].percentage}
                      </span>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Bottom Legend / Data Table */}
          {/* <div className="mt-6">
            {genderDataWithColors.some((item) => item.value > 0) ? (
              <div className="flex flex-wrap justify-center gap-4 text-sm">
                {genderDataWithColors.map((item) => (
                  <div key={item.name} className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-gray-700">{item.name}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="px-4 py-2 text-left font-semibold text-gray-700">
                        Gender
                      </th>
                      <th className="px-4 py-2 text-right font-semibold text-gray-700">
                        Count
                      </th>
                      <th className="px-4 py-2 text-right font-semibold text-gray-700">
                        Percentage
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {genderDataWithColors.map((item) => (
                      <tr key={item.name} className="border-b hover:bg-gray-50">
                        <td className="px-4 py-2 text-gray-700 flex items-center gap-2">
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: item.color }}
                          />
                          {item.name}
                        </td>
                        <td className="px-4 py-2 text-right text-gray-600">
                          {item.value}
                        </td>
                        <td className="px-4 py-2 text-right text-gray-600">
                          {item.percentage}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default DemographicsDashboard;
