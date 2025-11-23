import React, { useState, useMemo } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import {
  Bar,
  BarChart,
  Legend,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";

const conversionData = [
  { month: "Jan", freeUser: 70, trialSignup: 40, convertedToPaid: 45 },
  { month: "Feb", freeUser: 20, trialSignup: 25, convertedToPaid: 50 },
  { month: "Mar", freeUser: 35, trialSignup: 35, convertedToPaid: 35 },
  { month: "Apr", freeUser: 25, trialSignup: 40, convertedToPaid: 80 },
  { month: "May", freeUser: 45, trialSignup: 20, convertedToPaid: 70 },
  { month: "Jun", freeUser: 15, trialSignup: 15, convertedToPaid: 20 },
  { month: "Jul", freeUser: 65, trialSignup: 50, convertedToPaid: 85 },
  { month: "Aug", freeUser: 20, trialSignup: 35, convertedToPaid: 35 },
  { month: "Sep", freeUser: 60, trialSignup: 75, convertedToPaid: 90 },
  { month: "Oct", freeUser: 50, trialSignup: 30, convertedToPaid: 85 },
  { month: "Nov", freeUser: 75, trialSignup: 60, convertedToPaid: 40 },
  { month: "Dec", freeUser: 40, trialSignup: 95, convertedToPaid: 20 },
];

const monthOptions = [...new Set(conversionData.map((d) => d.month))];
const categoryOptions = [
  "All",
  "Free User",
  "Trial Signup",
  "Converted to Paid",
];

const maxValues = {
  freeUser: Math.max(...conversionData.map((d) => d.freeUser)),
  trialSignup: Math.max(...conversionData.map((d) => d.trialSignup)),
  convertedToPaid: Math.max(...conversionData.map((d) => d.convertedToPaid)),
};

type Custom3DBarWithWatermarkProps = {
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  fill?: string;
  dataKey: string;
  payload: Record<string, number>;
};
// Custom 3D Bar with watermark
const Custom3DBarWithWatermark = ({
  x = 0,
  y = 0,
  width = 0,
  height = 0,
  fill = "#000",
  dataKey,
  payload,
}: Custom3DBarWithWatermarkProps) => {
  const depth = 10;
  const maxValue = maxValues[dataKey as keyof typeof maxValues];
  const scale = maxValue / payload[dataKey];
  const watermarkHeight = height * scale;
  const watermarkY = y - (watermarkHeight - height);

  return (
    <g>
      <g opacity={0.1}>
        <rect
          x={x}
          y={watermarkY}
          width={width}
          height={watermarkHeight}
          fill={fill}
        />
        <polygon
          points={`${x},${watermarkY} ${x + depth},${watermarkY - depth} ${
            x + width + depth
          },${watermarkY - depth} ${x + width},${watermarkY}`}
          fill={fill}
        />
        <polygon
          points={`${x + width},${watermarkY} ${x + width + depth},${
            watermarkY - depth
          } ${x + width + depth},${watermarkY + watermarkHeight} ${x + width},${
            watermarkY + watermarkHeight
          }`}
          fill={fill}
        />
      </g>
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        fill={fill}
        opacity={0.4}
      />
      <polygon
        points={`${x},${y} ${x + depth},${y - depth} ${x + width + depth},${
          y - depth
        } ${x + width},${y}`}
        fill={fill}
        opacity={0.6}
      />
      <polygon
        points={`${x + width},${y} ${x + width + depth},${y - depth} ${
          x + width + depth
        },${y + height} ${x + width},${y + height}`}
        fill={fill}
        opacity={0.7}
      />
    </g>
  );
};

// Simple Card components
const Card = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => <div className={className}>{children}</div>;

const CardContent = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => <div className={className}>{children}</div>;

const MetricsCards = ({
  value,
  label,
  icons,
  percentage,
}: {
  value: string;
  label: string;
  icons: React.ReactNode;
  percentage: string;
}) => (
  <div className="bg-white/30 backdrop-blur-sm rounded-lg p-4">
    <div className="text-2xl font-bold text-white mb-1">{value}</div>
    <div className="text-sm text-white/80 mb-2">{label}</div>
    <div className="flex items-center gap-1">
      {icons}
      <span className="text-sm text-white/70">{percentage}%</span>
    </div>
  </div>
);

const PurchasesCard = ({
  value,
  text,
}: {
  value: string | number;
  text: string;
}) => (
  <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 border border-white/30">
    <div className="text-2xl font-bold text-white mb-1">{value}</div>
    <div className="text-xs text-white/70 uppercase">{text}</div>
  </div>
);

// ChartHeader component removed as it was unused

const RevenueMonetizationSection = () => {
  const [fromMonth, setFromMonth] = useState(monthOptions[0]);
  const [toMonth, setToMonth] = useState(monthOptions[monthOptions.length - 1]);
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredData = useMemo(() => {
    return conversionData.filter((d) => {
      const monthIndex = monthOptions.indexOf(d.month);
      const fromIndex = monthOptions.indexOf(fromMonth);
      const toIndex = monthOptions.indexOf(toMonth);
      return monthIndex >= fromIndex && monthIndex <= toIndex;
    });
  }, [fromMonth, toMonth]);

  return (
    <div className="rounded-lg  mb-6">
      {/* <ChartHeader /> */}

      {/* Filter Controls */}
      <div className="flex gap-4 mb-4 flex-wrap items-center justify-end">
        <div className="flex items-center gap-2">
          <label className="font-semibold text-white">From:</label>
          <select
            value={fromMonth}
            onChange={(e) => setFromMonth(e.target.value)}
            className="px-10 py-3 border border-gray-300 rounded-md bg-[#7C8B93]"
          >
            {monthOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <label className="font-semibold text-white">To:</label>
          <select
            value={toMonth}
            onChange={(e) => setToMonth(e.target.value)}
            className="px-10 py-3 border border-gray-300 rounded-md bg-[#7C8B93]"
          >
            {monthOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <label className="font-semibold text-white">Category:</label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-10 py-3 border border-gray-300 rounded-md bg-[#7C8B93]"
          >
            {categoryOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Chart */}
      <Card className="bg-white rounded-lg p-6 mb-6">
        <div className="mb-4">
          <h4 className="text-lg font-semibold text-gray-800">
            Conversion Funnel
          </h4>
          <div className="border-b-2 border-gray-200 mb-4" />
        </div>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={filteredData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <XAxis dataKey="month" axisLine={false} tickLine={false} />
              <YAxis axisLine={false} tickLine={false} />
              <Legend />
              {(selectedCategory === "All" ||
                selectedCategory === "Free User") && (
                <Bar
                  dataKey="freeUser"
                  fill="#6366f1"
                  name="Free User"
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  shape={(props: any) => (
                    <Custom3DBarWithWatermark {...props} dataKey="freeUser" />
                  )}
                />
              )}
              {(selectedCategory === "All" ||
                selectedCategory === "Trial Signup") && (
                <Bar
                  dataKey="trialSignup"
                  fill="#f59e0b"
                  name="Trial Signup"
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  shape={(props: any) => (
                    <Custom3DBarWithWatermark
                      {...props}
                      dataKey="trialSignup"
                    />
                  )}
                />
              )}
              {(selectedCategory === "All" ||
                selectedCategory === "Converted to Paid") && (
                <Bar
                  dataKey="convertedToPaid"
                  fill="#10b981"
                  name="Converted to Paid"
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  shape={(props: any) => (
                    <Custom3DBarWithWatermark
                      {...props}
                      dataKey="convertedToPaid"
                    />
                  )}
                />
              )}
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Metrics Cards */}
      <Card className="mb-6 backdrop-blur-md bg-white/20 p-6 rounded-lg">
        <h4 className="text-lg text-white font-semibold mb-3">
          Aura+ Subscriptions
        </h4>
        <div className="grid grid-cols-4 gap-4">
          <MetricsCards
            value="12,450"
            label="Active Subscriptions"
            icons={<ChevronUp className="w-4 h-4 text-green-500" />}
            percentage="12"
          />
          <MetricsCards
            value="312"
            label="New Subscriptions"
            icons={<ChevronDown className="w-4 h-4 text-red-500" />}
            percentage="12"
          />
          <MetricsCards
            value="88"
            label="Cancellations"
            icons={<ChevronDown className="w-4 h-4 text-red-500" />}
            percentage="12"
          />
          <MetricsCards
            value="92.8%"
            label="Renewal Rate"
            icons={<ChevronDown className="w-4 h-4 text-red-500" />}
            percentage="12"
          />
        </div>
      </Card>

      {/* Bottom Section */}
      <div className="grid grid-cols-2 gap-6">
        {/* In-App Purchases */}
        <Card className="bg-white/20 p-6 rounded-lg">
          <CardContent className="p-0">
            <h4 className="text-lg font-semibold text-white mb-4">
              In-App Purchases
            </h4>
            <div className="space-y-4">
              <PurchasesCard value="1.2M" text="GROSS REVENUE" />
              <PurchasesCard value="2,840" text="BUYERS / ONE-TIME PURCHASES" />
              <PurchasesCard value="$9.99" text="AVERAGE BASKET VALUE (ABV)" />
            </div>
          </CardContent>
        </Card>

        {/* ARPU & ARPPU */}
        <Card className="bg-white/20 p-6 rounded-lg">
          <CardContent className="p-0">
            <h4 className="text-lg font-semibold text-white mb-4">
              ARPU & ARPPU
            </h4>
            <div className="space-y-4">
              <PurchasesCard
                value="$1.75"
                text="AVERAGE REVENUE PER USER (ARPU)"
              />
              <PurchasesCard
                value="$15.20"
                text="AVG. REVENUE PER PAYING USER (ARPPU)"
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RevenueMonetizationSection;
