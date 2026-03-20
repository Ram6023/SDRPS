import React from 'react';
import { 
  LineChart, Line, AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, BarChart, Bar
} from 'recharts';
import { motion } from 'framer-motion';

interface MainDashboardProps {
  history?: any[];
}

const MainDashboard: React.FC<MainDashboardProps> = ({ history }) => {
  const hasData = history && history.length > 0;

  const lineData = hasData
    ? history.map((h, i) => ({ name: `S${i+1}`, value: Math.round(h.probability * 100) }))
    : [{ name: 'N/A', value: 0 }];

  const riskLevels = hasData ? history.reduce((acc: any, curr) => {
    acc[curr.risk_level] = (acc[curr.risk_level] || 0) + 1;
    return acc;
  }, {}) : {};

  const pieData = hasData
    ? Object.keys(riskLevels).map(level => ({ name: level, value: riskLevels[level] }))
    : [{ name: 'No Data', value: 1 }];

  const avgAttendance = hasData ? (history.reduce((a, b) => a + b.attendance, 0) / history.length) : 0;
  const avgRisk = hasData ? (history.reduce((a, b) => a + b.probability, 0) / history.length) * 100 : 0;

  const barData = [
    { label: 'Attendance', value: Math.round(avgAttendance) },
    { label: 'Risk', value: Math.round(avgRisk) },
    { label: 'Coverage', value: hasData ? 100 : 0 },
  ];

  const COLORS = ['#06b6d4', '#10b981', '#f59e0b', '#f43f5e'];

  return (
    <div className="grid grid-cols-12 gap-5 p-4">
      {/* Area Chart */}
      <ChartCard title="Risk Probability Trends" span="col-span-12 lg:col-span-8">
        <ResponsiveContainer width="100%" height={220} minWidth={0}>
          <AreaChart data={lineData}>
            <defs>
              <linearGradient id="colorCyan" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.25}/>
                <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <XAxis dataKey="name" stroke="#334155" fontSize={10} tickLine={false} axisLine={false} />
            <YAxis stroke="#334155" fontSize={10} tickLine={false} axisLine={false} />
            <Tooltip content={<CustomTooltip />} cursor={{stroke: '#06b6d4', strokeWidth: 1}} />
            <Area type="monotone" dataKey="value" stroke="#06b6d4" strokeWidth={2} fillOpacity={1} fill="url(#colorCyan)" animationDuration={1500} />
          </AreaChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* Pie Chart */}
      <ChartCard title="Risk Distribution" span="col-span-12 lg:col-span-4">
        <div className="h-[220px] flex items-center justify-center relative">
          <ResponsiveContainer width="100%" height="100%" minWidth={0}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" innerRadius={55} outerRadius={72} paddingAngle={6} dataKey="value" animationDuration={1200}>
                {pieData.map((_entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex items-center justify-center flex-col pointer-events-none">
            <span className="text-2xl font-black text-white">{Math.round(avgRisk)}%</span>
            <span className="text-[9px] font-medium text-slate-500">Avg Risk</span>
          </div>
        </div>
      </ChartCard>

      {/* Bar Chart */}
      <ChartCard title="Factor Metrics" span="col-span-12 lg:col-span-5">
        <ResponsiveContainer width="100%" height={220} minWidth={0}>
          <BarChart data={barData} layout="vertical">
            <XAxis type="number" hide />
            <YAxis dataKey="label" type="category" stroke="#94a3b8" fontSize={10} width={70} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip />} cursor={false} />
            <Bar dataKey="value" radius={[0, 6, 6, 0]} barSize={16} animationDuration={1200}>
              {barData.map((_entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} fillOpacity={0.8} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* Line Chart */}
      <ChartCard title="Academic Trajectory" span="col-span-12 lg:col-span-7">
        <ResponsiveContainer width="100%" height={220} minWidth={0}>
          <LineChart data={lineData}>
            <XAxis dataKey="name" stroke="#334155" fontSize={10} tickLine={false} axisLine={false} />
            <YAxis stroke="#334155" fontSize={10} tickLine={false} axisLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Line type="monotone" dataKey="value" stroke="#22d3ee" strokeWidth={2} dot={false}
                  activeDot={{ r: 4, strokeWidth: 0, fill: '#22d3ee' }} animationDuration={1500} />
          </LineChart>
        </ResponsiveContainer>
      </ChartCard>
    </div>
  );
};

interface ChartCardProps {
  title: string;
  children: React.ReactNode;
  span: string;
}

const ChartCard: React.FC<ChartCardProps> = ({ title, children, span }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.6 }}
    className={`${span} rounded-2xl p-6 relative min-h-[300px]`}
    style={{ background: 'rgba(255,255,255,0.015)', border: '1px solid rgba(255,255,255,0.04)' }}
  >
    <div className="flex justify-between items-center mb-6">
      <h3 className="text-[11px] font-semibold text-slate-500 tracking-wide">{title}</h3>
      <div className="flex gap-1">
        {[1,2,3].map(i => <div key={i} className="w-1 h-1 rounded-full bg-slate-800" />)}
      </div>
    </div>
    {children}
  </motion.div>
);

const CustomTooltip: React.FC<any> = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="px-3 py-2 rounded-lg shadow-xl backdrop-blur-lg text-xs"
           style={{ background: 'rgba(12,18,30,0.9)', border: '1px solid rgba(6,182,212,0.2)' }}>
        <p className="font-bold text-white mb-0.5">{payload[0].payload.name || payload[0].payload.label}</p>
        <p className="text-accent-400">{`${payload[0].value}%`}</p>
      </div>
    );
  }
  return null;
};

export default MainDashboard;
