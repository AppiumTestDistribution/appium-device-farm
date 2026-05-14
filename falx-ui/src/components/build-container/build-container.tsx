import { IBuild } from '../../interfaces/IBuild';
import { ISession } from '../../interfaces/ISession';
import { Clock, ChevronRight, Search } from 'lucide-react';
import { useState, useMemo } from 'react';

function BuildContainer({
  selectedBuild,
  handleBuildClick,
  builds,
  sessions,
}: {
  selectedBuild: IBuild | undefined;
  handleBuildClick: (buildId: IBuild) => void;
  builds: IBuild[];
  sessions: ISession[];
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [dateFilter, setDateFilter] = useState('all');

  const path = window.location.pathname;

  function timeAgo(createdAt: string | number | Date) {
    const currentDate = new Date();
    const createdDate = new Date(createdAt);

    const timeDifference = Number(currentDate) - Number(createdDate);
    const seconds = Math.floor(timeDifference / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) {
      return `${days}d`;
    } else if (hours > 0) {
      return `${hours}h`;
    } else if (minutes > 0) {
      return `${minutes}m`;
    } else {
      return `${seconds}s`;
    }
  }

  const buildId = path.match(/builds\/(.+?)\//)?.[1];
  const sessionId = path.match(/session\/(.+?)$/)?.[1];
  console.log({ buildId, sessionId });

  const getSessionCountsByStatus = (buildId: string) => {
    const buildSessions = sessions.filter((session) => session.buildId === buildId);
    return {
      total: buildSessions.length,
      running: buildSessions.filter((s) => s.status === 'running').length,
      passed: buildSessions.filter((s) => s.status === 'passed').length,
      unmarked: buildSessions.filter((s) => s.status === 'unmarked').length,
      failed: buildSessions.filter((s) => s.status === 'failed').length,
    };
  };

  const filteredBuilds = useMemo(() => {
    return builds.filter((build) => {
      const matchesSearch =
        build.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        build.id.toLowerCase().includes(searchQuery.toLowerCase());

      const buildDate = new Date(build.createdAt);
      const now = new Date();
      const daysDiff = (now.getTime() - buildDate.getTime()) / (1000 * 60 * 60 * 24);

      const matchesDate =
        dateFilter === 'all' ||
        (dateFilter === 'today' && daysDiff < 1) ||
        (dateFilter === 'week' && daysDiff < 7) ||
        (dateFilter === 'month' && daysDiff < 30);

      return matchesSearch && matchesDate;
    });
  }, [builds, searchQuery, dateFilter]);

  return (
    <div className="lg:block fixed right-auto w-[19rem] h-[49rem] bg-gray-900 border-r border-gray-800">
      <div className="sticky top-0 border-b border-gray-800 bg-gray-900 z-10">
        <div className="p-4">
          <h2 className="text-lg font-semibold text-gray-200 mb-4 text-left">Builds</h2>
          <div className="flex flex-col gap-2">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
              <input
                type="text"
                placeholder="Search builds..."
                className="w-full pl-8 pr-3 py-2 bg-gray-800 border border-gray-700 rounded text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:border-gray-600"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <select
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded text-sm text-gray-200 focus:outline-none focus:border-gray-600"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
            >
              <option value="all">All time</option>
              <option value="today">Today</option>
              <option value="week">Last 7 days</option>
              <option value="month">Last 30 days</option>
            </select>
          </div>
        </div>
      </div>
      <div className="h-[calc(49rem-160px)] overflow-y-auto">
        <div className="p-1 pb-16">
          {filteredBuilds.map((build, index) => (
            <div key={build.id}>
              <button
                className={`w-full text-left transition-colors duration-100 border ${
                  build.id === selectedBuild?.id
                    ? 'bg-gray-800 border-gray-700'
                    : 'bg-gray-900 border-transparent hover:bg-gray-800/50'
                }`}
                type="button"
                onClick={() => handleBuildClick(build)}
              >
                <div className="p-3">
                  <div className="flex items-center justify-between">
                    <div className="min-w-0 flex-1">
                      <div
                        className="text-sm font-medium text-gray-200 truncate"
                        title={build.name === 'Unknown Build' ? build.id : build.name}
                      >
                        {build.name === 'Unknown Build' ? build.id : build.name}
                      </div>
                      <div className="mt-1 text-xs text-gray-500 truncate" title={build.id}>
                        {build.id}
                      </div>
                    </div>
                    <ChevronRight
                      className={`w-4 h-4 text-gray-600 ${
                        build.id === selectedBuild?.id ? 'opacity-100' : 'opacity-0'
                      }`}
                    />
                  </div>
                  <div className="mt-2 flex flex-col gap-2 text-xs text-gray-500">
                    <div className="flex items-center gap-2 flex-wrap">
                      {(() => {
                        const counts = getSessionCountsByStatus(build.id);
                        return (
                          <>
                            {counts.running > 0 && (
                              <span className="px-1.5 py-0.5 font-medium bg-blue-900/30 text-blue-400 border border-blue-800/50">
                                {counts.running} running
                              </span>
                            )}
                            {counts.passed > 0 && (
                              <span className="px-1.5 py-0.5 font-medium bg-green-900/30 text-green-400 border border-green-800/50">
                                {counts.passed} passed
                              </span>
                            )}
                            {counts.failed > 0 && (
                              <span className="px-1.5 py-0.5 font-medium bg-red-900/30 text-red-400 border border-red-800/50">
                                {counts.failed} failed
                              </span>
                            )}
                            {counts.unmarked > 0 && (
                              <span className="px-1.5 py-0.5 font-medium bg-yellow-900/30 text-yellow-400 border border-yellow-800/50">
                                {counts.unmarked} unmarked
                              </span>
                            )}
                          </>
                        );
                      })()}
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {timeAgo(build.updatedAt)}
                      </div>
                      <div>
                        {build.createdAt === build.updatedAt ? (
                          <span>Created {new Date(build.createdAt).toLocaleString()}</span>
                        ) : (
                          <span>Updated {new Date(build.updatedAt).toLocaleString()}</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </button>
              {index < filteredBuilds.length - 1 && <div className="border-b border-gray-800" />}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default BuildContainer;
