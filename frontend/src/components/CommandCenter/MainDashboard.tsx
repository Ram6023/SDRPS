import React from 'react';
import { 
  LineChart, Line, AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, BarChart, Bar
} from 'recharts';
import { motion } from 'framer-motion';
import TiltCard from '@/components/ui/TiltCard';

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

  const avgAttendance = hasData ? (history.filter(h => h.attendance != null).reduce((a, b) => a + Number(b.attendance), 0) / history.filter(h => h.attendance != null).length || 0) : 0;
  const avgRisk = hasData ? (history.reduce((a, b) => a + b.probability, 0) / history.length) * 100 : 0;

  const barData = [
    { label: 'Attendance', value: Math.round(avgAttendance) },
    { label: 'Risk', value: Math.round(avgRisk) },
    { label: 'Coverage', value: hasData ? 100 : 0 },
  ];

  // Updated COLORS to Amethyst/Violet theme
  const COLORS = ['#8b5cf6', '#10b981', '#f59e0b', '#f43f5e'];

  return (
    <div className="grid grid-cols-12 gap-6 p-6">
      {/* Area Chart */}
      <ChartCard title="Risk Probability Trends" span="col-span-12 lg:col-span-8" glowColor="139, 92, 246">
        <ResponsiveContainer width="100%" height={240} minWidth={0}>
          <AreaChart data={lineData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorViolet" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <XAxis dataKey="name" stroke="#334155" fontSize={10} tickLine={false} axisLine={false} dy={10} />
            <YAxis stroke="#334155" fontSize={10} tickLine={false} axisLine={false} dx={-10} />
            <Tooltip content={<CustomTooltip />} cursor={{stroke: '#8b5cf6', strokeWidth: 1, strokeDasharray: '4 4'}} />
            <Area type="monotone" dataKey="value" stroke="#8b5cf6" strokeWidth={3} fillOpacity={1} fill="url(#colorViolet)" animationDuration={1800} />
          </AreaChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* Pie Chart */}
      <ChartCard title="Risk Distribution" span="col-span-12 lg:col-span-4" glowColor={hexToRgb(COLORS[0])}>
        <div className="h-[240px] flex items-center justify-center relative" style={{ transformStyle: 'preserve-3d' }}>
          <ResponsiveContainer width="100%" height="100%" minWidth={0}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={8} dataKey="value" animationDuration={1400} stroke="rgba(255,255,255,0.05)" strokeWidth={2}>
                {pieData.map((_entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex items-center justify-center flex-col pointer-events-none" style={{ transform: 'translateZ(30px)' }}>
            <span className="text-3xl font-black text-white tracking-widest leading-none mb-1">{Math.round(avgRisk)}%</span>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Avg Risk</span>
          </div>
        </div>
      </ChartCard>

      {/* Bar Chart */}
      <ChartCard title="Neural Performance Markers" span="col-span-12 lg:col-span-5" glowColor="16, 185, 129">
        <ResponsiveContainer width="100%" height={240} minWidth={0}>
          <BarChart data={barData} layout="vertical" margin={{ top: 10, right: 30, left: 10, bottom: 10 }}>
            <XAxis type="number" hide />
            <YAxis dataKey="label" type="category" stroke="#64748b" fontSize={10} width={80} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip />} cursor={false} />
            <Bar dataKey="value" radius={[0, 8, 8, 0]} barSize={20} animationDuration={1400}>
              {barData.map((_entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} fillOpacity={0.85} stroke={COLORS[index % COLORS.length]} strokeWidth={1} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* Line Chart */}
      <ChartCard title="Academic Engagement Vector" span="col-span-12 lg:col-span-7" glowColor="251, 191, 36">
        <ResponsiveContainer width="100%" height={240} minWidth={0}>
          <LineChart data={lineData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <XAxis dataKey="name" stroke="#334155" fontSize={10} tickLine={false} axisLine={false} dy={10} />
            <YAxis stroke="#334155" fontSize={10} tickLine={false} axisLine={false} dx={-10} />
            <Tooltip content={<CustomTooltip />} />
            <Line type="monotone" dataKey="value" stroke="#fbbf24" strokeWidth={3} dot={{ r: 4, fill: '#fbbf24', strokeWidth: 0 }}
                  activeDot={{ r: 6, strokeWidth: 0, fill: '#ffffff' }} animationDuration={1800} />
          </LineChart>
        </ResponsiveContainer>
      </ChartCard>
    </div>
  );
};

const hexToRgb = (hex: string) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` : '139, 92, 246';
};

interface ChartCardProps {
  title: string;
  children: React.ReactNode;
  span: string;
  glowColor?: string;
}

const ChartCard: React.FC<ChartCardProps> = ({ title, children, span, glowColor }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.8 }}
    className={span}
  >
    <TiltCard glowColor={glowColor} className="h-full">
      <div className="panel-glass rounded-3xl p-8 relative min-h-[340px] h-full overflow-hidden" style={{ transformStyle: 'preserve-3d' }}>
        <div className="flex justify-between items-center mb-8" style={{ transform: 'translateZ(20px)' }}>
          <h3 className="text-[11px] font-black text-slate-500 tracking-[0.2em] uppercase">{title}</h3>
          <div className="flex gap-1.5 p-1 rounded-md bg-white/[0.03]">
            {[1,2,3].map(i => <div key={i} className="w-1 h-1 rounded-full bg-slate-700" />)}
          </div>
        </div>
        <div style={{ transform: 'translateZ(10px)' }}>
          {children}
        </div>
      </div>
    </TiltCard>
  </motion.div>
);

const CustomTooltip: React.FC<any> = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="px-4 py-2.5 rounded-xl shadow-2xl backdrop-blur-xl text-[11px] font-bold ring-1 ring-white/10"
           style={{ background: 'rgba(5, 8, 16, 0.95)', border: '1px solid rgba(139, 92, 246, 0.3)' }}>
        <p className="text-slate-500 mb-1">{payload[0].payload.name || payload[0].payload.label}</p>
        <p className="text-white text-base tracking-tighter">{`${payload[0].value}%`}</p>
      </div>
    );
  }
  return null;
};

export default MainDashboard;
