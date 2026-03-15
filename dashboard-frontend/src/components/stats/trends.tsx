import React, { useEffect, useState, useMemo } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  AreaChart,
  Area,
  CartesianGrid,
} from 'recharts';
import {
  BarChart2,
  PieChart as PieChartIcon,
  Clock,
  Smartphone,
  Activity,
  ChevronDown,
  Search,
  X,
} from 'lucide-react';
import DeviceFarmApiService from '../../api-service';
import { IBuild } from '../../interfaces/IBuild';
import { ISession } from '../../interfaces/ISession';
import { format, parse, isValid } from 'date-fns';

const COLORS = {
  success: ['#22c55e', '#15803d'], // Green gradient for Pass
  warning: ['#fbbf24', '#d97706'], // Yellow gradient for Unmarked
  danger: ['#ef4444', '#b91c1c'], // Red gradient for Fail
  accent: [
    ['#8b5cf6', '#6d28d9'], // Purple gradient
    ['#ec4899', '#be185d'], // Pink gradient
    ['#06b6d4', '#0891b2'], // Cyan gradient
    ['#10b981', '#047857'], // Emerald gradient
    ['#f59e0b', '#d97706'], // Amber gradient
  ],
};

const gradientDefs = (
  <defs>
    {/* Pass gradient */}
    <linearGradient id="passGradient" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stopColor={COLORS.success[0]} stopOpacity={0.8} />
      <stop offset="100%" stopColor={COLORS.success[1]} stopOpacity={0.9} />
    </linearGradient>
    {/* Fail gradient */}
    <linearGradient id="failGradient" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stopColor={COLORS.danger[0]} stopOpacity={0.8} />
      <stop offset="100%" stopColor={COLORS.danger[1]} stopOpacity={0.9} />
    </linearGradient>
    {/* Unmarked gradient */}
    <linearGradient id="unmarkedGradient" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stopColor={COLORS.warning[0]} stopOpacity={0.8} />
      <stop offset="100%" stopColor={COLORS.warning[1]} stopOpacity={0.9} />
    </linearGradient>
    {/* Device Usage gradients */}
    {COLORS.accent.map((colorPair, i) => (
      <linearGradient key={i} id={`deviceGradient${i}`} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor={colorPair[0]} stopOpacity={0.8} />
        <stop offset="100%" stopColor={colorPair[1]} stopOpacity={0.9} />
      </linearGradient>
    ))}
    {/* Duration gradient */}
    <linearGradient id="durationGradient" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stopColor={COLORS.success[0]} stopOpacity={0.4} />
      <stop offset="100%" stopColor={COLORS.success[1]} stopOpacity={0.1} />
    </linearGradient>
    {/* Count gradient */}
    <linearGradient id="countGradient" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stopColor={COLORS.warning[0]} stopOpacity={0.4} />
      <stop offset="100%" stopColor={COLORS.warning[1]} stopOpacity={0.1} />
    </linearGradient>
  </defs>
);

const Card = ({
  children,
  title,
  icon: Icon,
}: {
  children: React.ReactNode;
  title: string;
  icon: React.ElementType;
}) => (
  <div className="relative bg-gray-800/40 backdrop-blur-xl shadow-2xl p-6 h-full border border-gray-700/30 overflow-hidden">
    {/* Gradient overlay */}
    <div className="absolute inset-0 bg-gradient-to-br from-gray-800/50 via-transparent to-transparent pointer-events-none" />

    {/* Glow effect */}
    <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 blur-xl opacity-50" />

    {/* Content */}
    <div className="relative">
      <h2 className="text-xl font-semibold mb-6 flex items-center text-white tracking-wide">
        {Icon && (
          <div className="flex items-center justify-center w-8 h-8 bg-gray-700/50 backdrop-blur-sm mr-3 border border-gray-600/30">
            <Icon className="w-5 h-5" />
          </div>
        )}
        {title}
      </h2>
      {children}
    </div>
  </div>
);

const CustomDropdown = ({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const selectedOption = options.find((opt) => opt.value === value);

  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="relative mb-4">
      {/* Selected Value Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-2.5 bg-gray-700/50 text-white border border-gray-600/30
        backdrop-blur-sm transition-colors duration-200 hover:bg-gray-700/70 
        flex items-center justify-between"
      >
        <span className="truncate">{selectedOption ? selectedOption.label : 'Select a build'}</span>
        <ChevronDown
          className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'transform rotate-180' : ''}`}
        />
      </button>

      {/* Dropdown Panel */}
      {isOpen && (
        <div
          className="absolute z-10 w-full mt-1 bg-gray-800/95 backdrop-blur-xl border border-gray-700/30 
        shadow-2xl overflow-hidden"
        >
          {/* Search Input */}
          <div className="p-2 border-b border-gray-700/30 flex items-center gap-2">
            <Search className="w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search builds..."
              className="w-full bg-transparent border-none text-sm text-white placeholder-gray-400 
              focus:outline-none focus:ring-0"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Options List */}
          <div className="max-h-60 overflow-y-auto">
            {filteredOptions.length === 0 ? (
              <div className="p-2 text-sm text-gray-400 text-center">No builds found</div>
            ) : (
              filteredOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => {
                    onChange(option.value);
                    setIsOpen(false);
                    setSearchTerm('');
                  }}
                  className={`w-full p-2 text-left hover:bg-gray-700/50 transition-colors
                  ${option.value === value ? 'bg-gray-700/30 text-white' : 'text-gray-300'}`}
                >
                  {option.label}
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const safeParseDate = (dateString: string): Date | null => {
  if (!dateString) return null;

  try {
    const date = new Date(dateString);
    return isValid(date) ? date : null;
  } catch {
    return null;
  }
};

const formatDate = (dateString: string): string => {
  const parsedDate = safeParseDate(dateString);
  return parsedDate instanceof Date ? format(parsedDate, 'dd/MM/yyyy HH:mm') : dateString;
};

const formatDateOnly = (dateString: string): string => {
  const parsedDate = safeParseDate(dateString);
  return parsedDate instanceof Date ? format(parsedDate, 'dd/MM/yyyy') : dateString;
};

const chartStyle = {
  color: '#ffffff',
  fontFamily: 'Inter, system-ui, sans-serif',
};

const modernChartConfig = {
  tooltipStyle: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(8px)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
    padding: '12px 16px',
    fontFamily: 'Inter, system-ui, sans-serif',
    fontSize: '13px',
    color: '#1f2937',
  },
  axisStyle: {
    stroke: '#6b7280',
    fontSize: '12px',
    fontWeight: 500,
    fontFamily: 'Inter, system-ui, sans-serif',
  },
  gridStyle: {
    stroke: 'rgba(75, 85, 99, 0.15)',
    strokeDasharray: '6 6',
  },
  legendStyle: {
    fontSize: '13px',
    fontWeight: 500,
    fontFamily: 'Inter, system-ui, sans-serif',
  },
};

export function EnhancedTrends() {
  const [builds, setBuilds] = useState<IBuild[]>([]);
  const [sessions, setSessions] = useState<ISession[]>([]);
  const [selectedBuild, setSelectedBuild] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const [fetchedBuilds, fetchedSessions] = await Promise.all([
          DeviceFarmApiService.getBuilds(),
          DeviceFarmApiService.getSessions(),
        ]);
        setBuilds(fetchedBuilds);
        setSessions(fetchedSessions);
        if (fetchedBuilds.length > 0) {
          setSelectedBuild(fetchedBuilds[0].id);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }
    fetchData();
  }, []);

  const getChartData = useMemo(() => {
    return builds.map((build) => {
      const buildSessions = sessions.filter((session) => session.buildId === build.id);
      const passed = buildSessions.filter((session) => session.status === 'passed').length;
      const failed = buildSessions.filter((session) => session.status === 'failed').length;
      const unmarked = buildSessions.filter(
        (session) => session.status === 'unmarked' || !session.status,
      ).length;

      return {
        name: build.name || build.id,
        Pass: passed,
        Fail: failed,
        Unmarked: unmarked,
      };
    });
  }, [builds, sessions]);

  const getPieData = useMemo(() => {
    if (!selectedBuild) return [];
    const buildSessions = sessions.filter((session) => session.buildId === selectedBuild);
    const passed = buildSessions.filter((session) => session.status === 'passed').length;
    const failed = buildSessions.filter((session) => session.status !== 'passed').length;
    return [
      { name: 'Pass', value: passed },
      { name: 'Fail', value: failed },
    ];
  }, [selectedBuild, sessions]);

  const getTestDurationData = useMemo(() => {
    const groupedByDate: { [key: string]: number[] } = sessions
      .filter((session) => {
        const startDate = safeParseDate(session.startTime);
        const endDate = safeParseDate(session.endTime || '');
        return startDate && endDate;
      })
      .reduce(
        (acc, session) => {
          const startDate = safeParseDate(session.startTime)!;
          const endDate = safeParseDate(session.endTime || '')!;
          const dateKey = format(startDate, 'dd/MM/yyyy');

          const duration = Math.round((endDate.getTime() - startDate.getTime()) / (1000 * 60));

          if (!acc[dateKey]) {
            acc[dateKey] = [];
          }
          acc[dateKey].push(duration);
          return acc;
        },
        {} as { [key: string]: number[] },
      );

    return Object.entries(groupedByDate)
      .map(([date, durations]) => ({
        name: date,
        duration: Math.round(durations.reduce((sum, val) => sum + val, 0) / durations.length),
        count: durations.length,
      }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [sessions]);

  const getDeviceUsageData = useMemo(() => {
    const deviceUsage: { [key: string]: number } = {};
    sessions.forEach((session) => {
      if (!deviceUsage[session.deviceName]) {
        deviceUsage[session.deviceName] = 0;
      }
      deviceUsage[session.deviceName]++;
    });
    return Object.entries(deviceUsage).map(([name, value]) => ({ name, value }));
  }, [sessions]);

  const getTestCountOverTime = useMemo(() => {
    const countOverTime = builds
      .map((build) => {
        const buildSessions = sessions.filter((session) => session.buildId === build.id);
        return {
          name: build.name || build.id,
          count: buildSessions.length,
        };
      })
      .sort((a, b) => a.name.localeCompare(b.name));
    return countOverTime;
  }, [builds, sessions]);

  const getTestDurationDistribution = useMemo(() => {
    const durationRanges = {
      '0-5min': 0,
      '5-15min': 0,
      '15-30min': 0,
      '30-60min': 0,
      '60+min': 0,
    };

    sessions.forEach((session) => {
      const startDate = safeParseDate(session.startTime);
      const endDate = safeParseDate(session.endTime || '');

      if (startDate && endDate) {
        const duration = Math.round((endDate.getTime() - startDate.getTime()) / (1000 * 60));

        if (duration <= 5) durationRanges['0-5min']++;
        else if (duration <= 15) durationRanges['5-15min']++;
        else if (duration <= 30) durationRanges['15-30min']++;
        else if (duration <= 60) durationRanges['30-60min']++;
        else durationRanges['60+min']++;
      }
    });

    return Object.entries(durationRanges).map(([range, count]) => ({
      name: range,
      count,
    }));
  }, [sessions]);

  const getDeviceSuccessRate = useMemo(() => {
    const deviceStats: { [key: string]: { total: number; passed: number } } = {};

    sessions.forEach((session) => {
      if (!deviceStats[session.deviceName]) {
        deviceStats[session.deviceName] = { total: 0, passed: 0 };
      }
      deviceStats[session.deviceName].total++;
      if (session.status === 'passed') {
        deviceStats[session.deviceName].passed++;
      }
    });

    return Object.entries(deviceStats)
      .map(([device, stats]) => ({
        name: device,
        successRate: (stats.passed / stats.total) * 100,
        total: stats.total,
      }))
      .sort((a, b) => b.successRate - a.successRate);
  }, [sessions]);

  return (
    <div className="p-6 space-y-6 bg-gray-900 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-gray-900 via-gray-900 to-gray-800 text-white min-h-screen">
      {/* Test Trends - Full Width */}
      <Card title="Test Trends" icon={BarChart2}>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={getChartData} style={chartStyle} barSize={40}>
            {gradientDefs}
            <CartesianGrid {...modernChartConfig.gridStyle} />
            <XAxis
              dataKey="name"
              {...modernChartConfig.axisStyle}
              angle={-45}
              textAnchor="end"
              height={80}
              tickMargin={24}
              interval={0}
              fontSize={11}
            />
            <YAxis {...modernChartConfig.axisStyle} tickMargin={8} fontSize={11} />
            <Tooltip
              contentStyle={modernChartConfig.tooltipStyle}
              cursor={{ fill: 'rgba(255, 255, 255, 0.02)' }}
              formatter={(value: number, name: string) => [`${value} tests`, name]}
              labelStyle={{ color: '#4b5563' }}
            />
            <Legend
              iconType="circle"
              verticalAlign="top"
              height={36}
              wrapperStyle={modernChartConfig.legendStyle}
            />
            <Bar
              dataKey="Pass"
              stackId="a"
              fill="url(#passGradient)"
              radius={[4, 4, 0, 0]}
              style={{ filter: 'drop-shadow(0px 0px 10px rgba(34, 197, 94, 0.2))' }}
            />
            <Bar
              dataKey="Fail"
              stackId="a"
              fill="url(#failGradient)"
              style={{ filter: 'drop-shadow(0px 0px 10px rgba(239, 68, 68, 0.2))' }}
            />
            <Bar
              dataKey="Unmarked"
              stackId="a"
              fill="url(#unmarkedGradient)"
              radius={[0, 0, 4, 4]}
              style={{ filter: 'drop-shadow(0px 0px 10px rgba(251, 191, 36, 0.2))' }}
            />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      {/* Build Statistics and Device Usage */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card title="Build Statistics" icon={PieChartIcon}>
          <CustomDropdown
            value={selectedBuild || ''}
            onChange={setSelectedBuild}
            options={builds.map((build) => ({
              value: build.id,
              label: build.name || build.id,
            }))}
          />
          <ResponsiveContainer width="100%" height={300}>
            <PieChart style={chartStyle}>
              {gradientDefs}
              <Pie
                data={getPieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={110}
                innerRadius={85}
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {getPieData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={index === 0 ? 'url(#passGradient)' : 'url(#failGradient)'}
                    style={{
                      filter: `drop-shadow(0px 0px 12px ${
                        index === 0 ? 'rgba(34, 197, 94, 0.2)' : 'rgba(239, 68, 68, 0.2)'
                      })`,
                    }}
                  />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  ...modernChartConfig.tooltipStyle,
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.1)',
                  color: '#1f2937',
                }}
                formatter={(value: number, name: string) => [`${value} tests`, name]}
                labelStyle={{ color: '#4b5563' }}
              />
              <Legend
                iconType="circle"
                verticalAlign="bottom"
                height={36}
                wrapperStyle={modernChartConfig.legendStyle}
              />
            </PieChart>
          </ResponsiveContainer>
        </Card>

        <Card title="Device Usage" icon={Smartphone}>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart style={chartStyle}>
              {gradientDefs}
              <Pie
                data={getDeviceUsageData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={110}
                innerRadius={85}
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {getDeviceUsageData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={`url(#deviceGradient${index % 5})`}
                    style={{
                      filter: `drop-shadow(0px 0px 12px ${COLORS.accent[index % 5][0]}22)`,
                    }}
                  />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  ...modernChartConfig.tooltipStyle,
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.1)',
                  color: '#1f2937',
                }}
                formatter={(value: number, name: string) => [`${value} tests`, 'Device Usage']}
                labelStyle={{ color: '#4b5563' }}
              />
              <Legend
                iconType="circle"
                verticalAlign="bottom"
                height={36}
                wrapperStyle={modernChartConfig.legendStyle}
              />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Test Duration Trend and Test Count Over Time */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card title="Test Duration Trend" icon={Clock}>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={getTestDurationData} style={chartStyle}>
              <defs>
                <linearGradient id="durationGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={COLORS.success[0]} stopOpacity={0.4} />
                  <stop offset="100%" stopColor={COLORS.success[1]} stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <CartesianGrid {...modernChartConfig.gridStyle} />
              <XAxis
                dataKey="name"
                {...modernChartConfig.axisStyle}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis
                {...modernChartConfig.axisStyle}
                label={{
                  value: 'Avg Duration (minutes)',
                  angle: -90,
                  position: 'insideLeft',
                  style: { textAnchor: 'middle', fill: '#6b7280' },
                }}
              />
              <Tooltip
                contentStyle={modernChartConfig.tooltipStyle}
                formatter={(value: number, name: string, props: any) => [
                  `${value} minutes (${props.payload.count} tests)`,
                  'Average Duration',
                ]}
                labelStyle={{ color: '#4b5563' }}
              />
              <Area
                type="monotone"
                dataKey="duration"
                stroke={COLORS.success[0]}
                strokeWidth={2}
                fill="url(#durationGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        <Card title="Test Count Over Time" icon={Activity}>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={getTestCountOverTime} style={chartStyle}>
              <defs>
                <linearGradient id="countGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={COLORS.warning[0]} stopOpacity={0.4} />
                  <stop offset="100%" stopColor={COLORS.warning[1]} stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <CartesianGrid {...modernChartConfig.gridStyle} />
              <XAxis
                dataKey="name"
                {...modernChartConfig.axisStyle}
                angle={-45}
                textAnchor="end"
                height={80}
                interval={0}
                tickMargin={24}
              />
              <YAxis
                {...modernChartConfig.axisStyle}
                label={{
                  value: 'Number of Tests',
                  angle: -90,
                  position: 'insideLeft',
                  style: { textAnchor: 'middle', fill: '#6b7280' },
                }}
              />
              <Tooltip
                contentStyle={modernChartConfig.tooltipStyle}
                formatter={(value: number) => [`${value} tests`, 'Test Count']}
                labelStyle={{ color: '#4b5563' }}
              />
              <Area
                type="monotone"
                dataKey="count"
                stroke={COLORS.warning[0]}
                strokeWidth={2}
                fill="url(#countGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Test Duration Distribution and Device Pass Percentage */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card title="Test Duration Distribution" icon={Clock}>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={getTestDurationDistribution} style={chartStyle}>
              {gradientDefs}
              <CartesianGrid {...modernChartConfig.gridStyle} />
              <XAxis dataKey="name" {...modernChartConfig.axisStyle} />
              <YAxis
                {...modernChartConfig.axisStyle}
                label={{
                  value: 'Number of Tests',
                  angle: -90,
                  position: 'insideLeft',
                  style: { textAnchor: 'middle', fill: '#6b7280' },
                }}
              />
              <Tooltip
                contentStyle={modernChartConfig.tooltipStyle}
                formatter={(value: number) => [`${value} tests`, 'Duration Range']}
                cursor={{ fill: 'rgba(255, 255, 255, 0.02)' }}
                labelStyle={{ color: '#4b5563' }}
              />
              <Bar
                dataKey="count"
                fill="url(#passGradient)"
                radius={[6, 6, 0, 0]}
                style={{ filter: 'drop-shadow(0px 0px 10px rgba(34, 197, 94, 0.2))' }}
              />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card title="Device Pass Percentage" icon={Smartphone}>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={getDeviceSuccessRate}
              style={chartStyle}
              layout="vertical"
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              {gradientDefs}
              <CartesianGrid {...modernChartConfig.gridStyle} horizontal={false} />
              <XAxis
                type="number"
                {...modernChartConfig.axisStyle}
                domain={[0, 100]}
                tickFormatter={(value) => `${value}%`}
              />
              <YAxis type="category" dataKey="name" {...modernChartConfig.axisStyle} width={120} />
              <Tooltip
                contentStyle={modernChartConfig.tooltipStyle}
                formatter={(value: number, name: string, props: any) => [
                  `${value.toFixed(1)}% (${props.payload.total} tests)`,
                  'Pass Rate',
                ]}
                cursor={{ fill: 'rgba(255, 255, 255, 0.02)' }}
                labelStyle={{ color: '#4b5563' }}
              />
              <Bar
                dataKey="successRate"
                fill="url(#passRateGradient)"
                radius={[0, 4, 4, 0]}
                style={{ filter: 'drop-shadow(0px 0px 10px rgba(34, 197, 94, 0.2))' }}
              >
                {getDeviceSuccessRate.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={`url(${
                      entry.successRate >= 80
                        ? '#passGradient'
                        : entry.successRate >= 60
                          ? '#unmarkedGradient'
                          : '#failGradient'
                    })`}
                    style={{
                      filter: `drop-shadow(0px 0px 10px ${
                        entry.successRate >= 80
                          ? 'rgba(34, 197, 94, 0.2)'
                          : entry.successRate >= 60
                            ? 'rgba(251, 191, 36, 0.2)'
                            : 'rgba(239, 68, 68, 0.2)'
                      })`,
                    }}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>
    </div>
  );
}

export default EnhancedTrends;
