import React, { useMemo } from 'react';

const AnalyticsSection = ({ history }) => {
  const stats = useMemo(() => {
    if (!history || history.length === 0) return null;

    const total = history.length;
    const distribution = history.reduce((acc, item) => {
      acc[item.risk_level] = (acc[item.risk_level] || 0) + 1;
      return acc;
    }, {});

    const avgProb = (history.reduce((acc, item) => acc + item.probability, 0) / total) * 100;
    
    // Risk weight: Critical (4), High (3), Moderate (2), Low (1)
    const riskWeight = { 'Critical': 4, 'High': 3, 'Moderate': 2, 'Low': 1 };
    const avgRiskScore = history.reduce((acc, item) => acc + (riskWeight[item.risk_level] || 1), 0) / total;

    return { total, distribution, avgProb, avgRiskScore };
  }, [history]);

  if (!stats) return (
    <div className="glass rounded-3xl p-8 flex flex-col items-center justify-center text-center">
      <div className="w-16 h-16 rounded-full bg-accent-500/10 flex items-center justify-center mb-4">
        <svg className="w-8 h-8 text-accent-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      </div>
      <h3 className="text-white font-bold mb-2">Awaiting Intelligence</h3>
      <p className="text-slate-500 text-sm">Conduct assessments to generate analytical insights.</p>
    </div>
  );

  const riskColors = {
    'Critical': '#ef4444',
    'High': '#f59e0b',
    'Moderate': '#3b82f6',
    'Low': '#10b981'
  };

  return (
    <div className="space-y-6">
      {/* ── Key Indicators ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Analyzed" value={stats.total} icon="users" color="accent" />
        <StatCard label="Avg. Risk Probability" value={`${Math.round(stats.avgProb)}%`} icon="trending" color="warning" />
        <StatCard label="Critical Cases" value={stats.distribution['Critical'] || 0} icon="alert" color="danger" />
        <StatCard label="Stable Cases" value={stats.distribution['Low'] || 0} icon="check" color="success" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* ── Risk Distribution Chart ── */}
        <div className="glass rounded-3xl p-6">
          <h4 className="section-title">Risk Distribution</h4>
          <div className="space-y-4">
            {Object.keys(riskColors).map(level => {
              const count = stats.distribution[level] || 0;
              const percent = (count / stats.total) * 100;
              return (
                <div key={level}>
                  <div className="flex justify-between text-[11px] font-bold mb-1 uppercase tracking-wider">
                    <span style={{ color: riskColors[level] }}>{level}</span>
                    <span className="text-white">{count} ({Math.round(percent)}%)</span>
                  </div>
                  <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                    <div 
                      className="h-full transition-all duration-1000" 
                      style={{ 
                        width: `${percent}%`, 
                        backgroundColor: riskColors[level],
                        boxShadow: `0 0 10px ${riskColors[level]}40`
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Analytical Insight ── */}
        <div className="glass rounded-3xl p-6 relative overflow-hidden flex flex-col justify-center">
            <div className="absolute top-0 right-0 w-32 h-32 bg-accent-500/10 blur-3xl rounded-full" />
            <h4 className="section-title">Risk Quotient</h4>
            <div className="text-center py-4">
                <div className="text-5xl font-black text-white mb-2 tracking-tighter">
                   {stats.avgRiskScore.toFixed(1)}
                </div>
                <p className="text-slate-400 text-sm max-w-[200px] mx-auto leading-relaxed">
                    Average institutional risk level based on current session parameters.
                </p>
            </div>
            <div className="mt-4 pt-4 border-t border-slate-800/50 flex items-center gap-2 text-[10px] font-bold text-accent-400">
                <span className="w-1.5 h-1.5 rounded-full bg-accent-400 animate-pulse" />
                LIVE SESSION DATA
            </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ label, value, icon, color }) => {
  const icons = {
    users: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />,
    trending: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />,
    alert: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 15c-.77 1.333.192 3 1.732 3z" />,
    check: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  };

  const colors = {
    accent: 'text-accent-400 bg-accent-500/10 border-accent-500/20',
    warning: 'text-warning bg-warning/10 border-warning/20',
    danger: 'text-danger bg-danger/10 border-danger/20',
    success: 'text-success bg-success/10 border-success/20'
  };

  return (
    <div className={`glass p-4 rounded-3xl border ${colors[color]} group transition-all duration-300 hover:-translate-y-1`}>
      <div className="flex items-center gap-3 mb-2">
        <div className="p-2 rounded-xl bg-slate-900 group-hover:scale-110 transition-transform">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            {icons[icon]}
          </svg>
        </div>
        <span className="text-[10px] font-black uppercase tracking-widest opacity-60 text-slate-400">
          {label}
        </span>
      </div>
      <div className="text-xl font-black text-white">{value}</div>
    </div>
  );
};

export default AnalyticsSection;
