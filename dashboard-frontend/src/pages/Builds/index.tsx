import { ChevronRight } from 'lucide-react';
import { useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Link, useNavigate } from 'react-router-dom';
import DeviceFarmApiService from '../../api-service';
import BuildContainer from '../../components/build-container/build-container';
import CleanupModal from '../../components/cleanup-modal/cleanup-modal';
import Capabilities from '../../components/session/capabilities/capabilities';
import SessionInfo from '../../components/session/session-info/session-info';
import SessionLogs from '../../components/session/session-logs/session-logs';
import TableFilter from '../../components/table-filter/table-filter';
import { IBuild } from '../../interfaces/IBuild';
import { ISession } from '../../interfaces/ISession';

function Builds() {
  const navigate = useNavigate();
  const [selectedBuild, setSelectedBuild] = useState<IBuild>();
  const [selectedSession, setSelectedSession] = useState<ISession>();
  const [builds, setBuilds] = useState<IBuild[]>([]);
  const [sessions, setSessions] = useState<ISession[]>([]);
  const [filteredSessions, setFilteredSessions] = useState<ISession[]>([]);
  const [timeFilter, setTimeFilter] = useState<string>('all');
  const [customDateRange, setCustomDateRange] = useState<[Date | null, Date | null]>([null, null]);
  const [isCustomDate, setIsCustomDate] = useState(false);
  const [isCleanupModalOpen, setIsCleanupModalOpen] = useState(false);

  useEffect(() => {
    async function init() {
      try {
        const [builds, sessions] = await Promise.all([
          DeviceFarmApiService.getBuilds(),
          DeviceFarmApiService.getSessions(),
        ]);
        setBuilds(builds);
        setSessions(sessions);
        setSelectedBuild(builds[0]);
      } catch (error) {
        console.log(error);
      }
    }

    init();
  }, []);

  const getTimeFilteredSessions = (sessions: ISession[], filter: string) => {
    const now = new Date();

    if (isCustomDate && customDateRange[0] && customDateRange[1]) {
      return sessions.filter((session) => {
        const sessionTime = new Date(session.startTime).getTime();
        return (
          sessionTime >= customDateRange[0]!.getTime() &&
          sessionTime <= customDateRange[1]!.getTime()
        );
      });
    }

    const filterMap: { [key: string]: number } = {
      '24h': 24 * 60 * 60 * 1000,
      '7d': 7 * 24 * 60 * 60 * 1000,
      '30d': 30 * 24 * 60 * 60 * 1000,
      all: Infinity,
    };

    const filterTime = filterMap[filter] || filterMap['all'];
    if (filterTime === Infinity) return sessions;

    return sessions.filter((session) => {
      const sessionTime = new Date(session.startTime).getTime();
      return now.getTime() - sessionTime <= filterTime;
    });
  };

  useEffect(() => {
    if (selectedBuild) {
      const buildSessions = sessions.filter((session) => session.buildId === selectedBuild.id);
      const timeFilteredSessions = getTimeFilteredSessions(buildSessions, timeFilter);
      setFilteredSessions(timeFilteredSessions);
    }
  }, [selectedBuild, sessions, timeFilter, customDateRange]);

  const handleSelectedBuildChange = (build: IBuild) => {
    setSelectedBuild(build);
    setSelectedSession(undefined);
    navigate(`/builds?buildId=${build.id}`);
  };

  const handleSelectedSessionChange = (build: IBuild, session: ISession) => {
    setSelectedBuild(build);
    setSelectedSession(session);
    navigate(`/builds?buildId=${build.id}/session/${session.id}`);
  };

  const handleFilterChange = (
    filters: Array<{ column: string; operator: string; value: string }>,
  ) => {
    if (!selectedBuild) return;

    let filtered = sessions.filter((session) => session.buildId === selectedBuild.id);

    if (filters.length > 0) {
      filtered = filtered.filter((session) => {
        return filters.every((filter) => {
          // Get the session value based on the column
          const sessionValue = (() => {
            switch (filter.column) {
              case 'testName':
                return session.name || session.id;
              case 'platform':
                return session.devicePlatform;
              case 'device':
                return session.deviceName;
              case 'status':
                return session.status;
              default:
                return '';
            }
          })();

          // Skip empty values
          if (!sessionValue || !filter.value) return true;

          const filterValue = filter.value.toLowerCase();
          const compareValue = sessionValue.toLowerCase();

          switch (filter.operator) {
            case '=':
              return compareValue === filterValue;
            case '!=':
              return compareValue !== filterValue;
            case 'contains':
              return compareValue.includes(filterValue);
            case 'starts with':
              return compareValue.startsWith(filterValue);
            case 'ends with':
              return compareValue.endsWith(filterValue);
            default:
              return true;
          }
        });
      });
    }

    setFilteredSessions(filtered);
  };

  const handleCleanup = async (retentionDays: number) => {
    try {
      await DeviceFarmApiService.cleanupBuilds(retentionDays);
      // Refresh the builds and sessions after cleanup
      const [builds, sessions] = await Promise.all([
        DeviceFarmApiService.getBuilds(),
        DeviceFarmApiService.getSessions(),
      ]);
      setBuilds(builds);
      setSessions(sessions);
    } catch (error) {
      console.error('Error cleaning up builds:', error);
    }
  };

  const getStatusColor = (status: string): string => {
    if (status === 'passed') return 'text-emerald-400 bg-emerald-400/10';
    if (status === 'failed') return 'text-red-400 bg-red-400/10';
    return 'text-amber-400 bg-amber-400/10';
  };

  const formatTime = (time: string) => {
    return new Date(time).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const filterColumns = [
    { key: 'testName', label: 'Test Name' },
    { key: 'platform', label: 'Platform' },
    { key: 'device', label: 'Device' },
    { key: 'status', label: 'Status' },
  ];

  const filterData = sessions
    .filter((session) => session.buildId === selectedBuild?.id)
    .map((session) => ({
      testName: session.name || session.id,
      platform: session.devicePlatform || '',
      device: session.deviceName || '',
      status: session.status || '',
    }));

  const handleTimeFilterChange = (value: string) => {
    setTimeFilter(value);
    setIsCustomDate(value === 'custom');
  };

  const formatDuration = (seconds: number | null) => {
    if (seconds === null) return '-';
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  return (
    <div className="max-w-8xl mx-auto">
      <BuildContainer
        selectedBuild={selectedBuild}
        handleBuildClick={handleSelectedBuildChange}
        builds={builds}
        sessions={sessions}
      />
      <div className="lg:pl-[19.5rem]">
        <div className="max-w-7xl mx-auto relative px-6">
          <div className="sticky top-[60px] z-30 bg-gray-900">
            {!selectedSession && (
              <>
                <div className="p-4 flex items-start gap-4">
                  <TableFilter
                    columns={filterColumns}
                    data={filterData}
                    onFilterChange={handleFilterChange}
                  />
                  <div className="flex items-start gap-2">
                    <button
                      onClick={() => setIsCleanupModalOpen(true)}
                      className="h-[38px] px-3 text-sm text-gray-300 bg-gray-800 hover:bg-gray-700 border border-gray-700 cursor-pointer focus:outline-none focus:ring-2 focus:ring-gray-600"
                    >
                      Clean up
                    </button>
                    <select
                      value={timeFilter}
                      onChange={(e) => handleTimeFilterChange(e.target.value)}
                      className="h-[38px] px-3 text-sm text-gray-300 bg-gray-800 hover:bg-gray-700 border border-gray-700 cursor-pointer focus:outline-none focus:ring-2 focus:ring-gray-600"
                    >
                      <option value="all" className="bg-gray-800">
                        All time
                      </option>
                      <option value="24h" className="bg-gray-800">
                        Last 24 hours
                      </option>
                      <option value="7d" className="bg-gray-800">
                        Last 7 days
                      </option>
                      <option value="30d" className="bg-gray-800">
                        Last 30 days
                      </option>
                      <option value="custom" className="bg-gray-800">
                        Custom range
                      </option>
                    </select>
                    {isCustomDate && (
                      <DatePicker
                        selectsRange={true}
                        startDate={customDateRange[0]}
                        endDate={customDateRange[1]}
                        onChange={(update) => {
                          setCustomDateRange(update);
                        }}
                        className="h-[38px] px-3 text-sm text-gray-300 bg-gray-800 hover:bg-gray-700 border border-gray-700 cursor-pointer focus:outline-none focus:ring-2 focus:ring-gray-600"
                        wrapperClassName="!bg-gray-800"
                        dateFormat="MMM d, yyyy"
                        placeholderText="Select date range"
                        monthsShown={2}
                        showPopperArrow={false}
                        calendarClassName="custom-calendar"
                      />
                    )}
                  </div>
                </div>
                <div className="border-y border-gray-800">
                  <div className="grid grid-cols-[2fr,1fr,1fr,1fr,1fr,1fr,1fr] gap-4 px-6 bg-gray-800/50">
                    <div className="py-2 text-xs font-medium text-gray-400 text-left">
                      Test Name
                    </div>
                    <div className="py-2 text-xs font-medium text-gray-400 text-left">Platform</div>
                    <div className="py-2 text-xs font-medium text-gray-400 text-left">
                      Device Version
                    </div>
                    <div className="py-2 text-xs font-medium text-gray-400 text-left">Status</div>
                    <div className="py-2 text-xs font-medium text-gray-400 text-left">
                      Start Time
                    </div>
                    <div className="py-2 text-xs font-medium text-gray-400 text-left">End Time</div>
                    <div className="py-2 text-xs font-medium text-gray-400 text-left">Duration</div>
                  </div>
                </div>
              </>
            )}
          </div>

          {!selectedSession ? (
            <div className="bg-gray-900">
              <div className="border-x border-gray-800">
                {filteredSessions.map((session) => {
                  const duration = session.endTime
                    ? Math.floor(
                        (new Date(session.endTime).getTime() -
                          new Date(session.startTime).getTime()) /
                          1000,
                      )
                    : null;

                  return (
                    <button
                      key={session.id}
                      className="w-full grid grid-cols-[2fr,1fr,1fr,1fr,1fr,1fr,1fr] gap-4 px-6 group hover:bg-gray-800/50 border-b border-gray-800"
                      onClick={() =>
                        selectedBuild && handleSelectedSessionChange(selectedBuild, session)
                      }
                    >
                      <div className="py-2 font-medium text-gray-300 text-sm truncate text-left">
                        {session.name || session.id}
                      </div>
                      <div className="py-2 text-left">
                        <span className="px-2 py-0.5 text-xs font-medium bg-gray-800 text-gray-300">
                          {session.devicePlatform}
                        </span>
                      </div>
                      <div className="py-2 text-sm text-gray-400 text-left">
                        {session.deviceVersion}
                      </div>
                      <div className="py-2 text-left">
                        <span
                          className={`px-2 py-0.5 text-xs font-medium rounded ${getStatusColor(session.status)}`}
                        >
                          {session.status}
                        </span>
                      </div>
                      <div className="py-2 text-sm text-gray-400 text-left">
                        {formatTime(session.startTime)}
                      </div>
                      <div className="py-2 text-sm text-gray-400 text-left">
                        {session.endTime ? formatTime(session.endTime) : '-'}
                      </div>
                      <div className="py-2 text-sm text-gray-400 text-left">
                        {formatDuration(duration)}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="bg-gray-900 h-[calc(100vh-60px)] flex flex-col">
              {/* Session Header */}
              <div className="border-b border-gray-800 flex-shrink-0">
                <div className="p-4">
                  <div className="flex items-center gap-2 text-sm mb-4">
                    <Link
                      to="/builds"
                      className="text-gray-400 hover:text-gray-300 transition-colors"
                    >
                      Builds
                    </Link>
                    <ChevronRight className="w-4 h-4 text-gray-600" />
                    <Link
                      to={`/builds?buildId=${selectedBuild?.id}`}
                      className="text-gray-400 hover:text-gray-300 transition-colors"
                    >
                      {selectedBuild?.name || selectedBuild?.id}
                    </Link>
                    <ChevronRight className="w-4 h-4 text-gray-600" />
                    <button
                      onClick={() => setSelectedSession(undefined)}
                      className="text-gray-400 hover:text-gray-300 transition-colors"
                    >
                      Sessions
                    </button>
                    <ChevronRight className="w-4 h-4 text-gray-600" />
                    <span className="text-gray-200">
                      {selectedSession.name || selectedSession.id}
                    </span>
                  </div>

                  <SessionInfo session={selectedSession} />
                </div>
              </div>

              {/* Main Content */}
              <div className="flex-1 overflow-hidden p-4">
                <div className="grid grid-cols-12 gap-6 h-full">
                  <div className="col-span-8 overflow-hidden">
                    <SessionLogs session={selectedSession} />
                  </div>
                  <div className="col-span-4 overflow-hidden">
                    <Capabilities session={selectedSession} />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <CleanupModal
        isOpen={isCleanupModalOpen}
        onRequestClose={() => setIsCleanupModalOpen(false)}
        onConfirm={handleCleanup}
      />
    </div>
  );
}

export default Builds;
