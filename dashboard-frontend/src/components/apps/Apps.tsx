import React, { useEffect, useState, useCallback, useMemo } from 'react';
import DeviceFarmApiService from '../../api-service';
import { IconButton, Typography } from '@mui/material';
import { CloudUpload, Search, ChevronLeft, ChevronRight } from '@mui/icons-material';
import { AppUploader } from './AppUploader';
import debounce from 'lodash/debounce';

interface DeletingState {
  [key: string]: boolean;
}

export default function AppList() {
  const [data, setData] = useState([]);
  const [pageData, setPageData] = useState([]);
  const [active, setActive] = React.useState(1);
  const [isDeleting, setIsDeleting] = useState<DeletingState>({});
  const [showFileUpload, setShowFileUpload] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAll, setShowAll] = useState(false);
  const itemsPerPage = 50; // Increased from 10 to 50 for better UX

  // Helper function to determine platform based on file extension
  const getPlatformFromFileName = (fileName: string) => {
    const lowerFileName = fileName.toLowerCase();
    if (lowerFileName.endsWith('.apk') || lowerFileName.endsWith('.aab')) {
      return 'android';
    } else if (lowerFileName.endsWith('.ipa') || lowerFileName.endsWith('.app')) {
      return 'ios';
    }
    return null; // Unknown platform
  };

  // Filter and pagination logic
  const filteredData = useMemo(() => {
    return data.filter((app: any) => {
      const searchLower = searchTerm.toLowerCase();
      return (
        app.fileName.toLowerCase().includes(searchLower) ||
        app.uploadedFileName.toLowerCase().includes(searchLower) ||
        app.platform.toLowerCase().includes(searchLower)
      );
    });
  }, [data, searchTerm]);

  // Update page data whenever filtered data changes
  useEffect(() => {
    if (showAll) {
      setPageData(filteredData);
    } else {
      const startIndex = (active - 1) * itemsPerPage;
      setPageData(filteredData.slice(startIndex, startIndex + itemsPerPage));
      // Reset to first page if current page would be empty
      if (active > Math.ceil(filteredData.length / itemsPerPage)) {
        setActive(1);
      }
    }
  }, [filteredData, active, itemsPerPage, showAll]);

  const debouncedSearch = useMemo(
    () =>
      debounce((term: string) => {
        setSearchTerm(term);
        setActive(1); // Reset to first page on search
      }, 300),
    [],
  );

  // Cleanup debounce on unmount
  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    debouncedSearch(e.target.value);
  };

  const next = () => {
    if (active === Math.ceil(filteredData.length / itemsPerPage)) return;
    setActive(active + 1);
  };

  const prev = () => {
    if (active === 1) return;
    setActive(active - 1);
  };

  const fetchAppList = useCallback(async () => {
    try {
      const appList = await DeviceFarmApiService.getUploadedAppsList();
      setData(appList);
    } catch (error) {
      console.error('Failed to fetch app list:', error);
    }
  }, []);

  useEffect(() => {
    fetchAppList();
  }, [fetchAppList]);

  return (
    <div className="flex flex-col h-[calc(100vh-64px)]">
      <div className="flex items-center justify-between px-6 py-4">
        <button
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-300 bg-gray-700 hover:bg-gray-600 transition-colors border border-gray-600"
          onClick={() => setShowFileUpload(true)}
        >
          <CloudUpload className="w-5 h-5" />
          <span>Upload Apps</span>
        </button>

        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search className="w-4 h-4 text-gray-400" />
          </div>
          <input
            type="text"
            className="w-80 p-2 pl-10 text-sm bg-gray-800 border border-gray-600 placeholder-gray-400 text-white focus:ring-1 focus:ring-blue-500 focus:border-blue-500 focus:outline-none"
            placeholder="Search by name, filename or platform..."
            defaultValue={searchTerm}
            onChange={handleSearch}
          />
        </div>
      </div>

      <div className="flex-1 min-h-0 mx-6 mb-6 flex flex-col bg-[#0B1121] border border-gray-600/50 overflow-hidden">
        <div className="flex-1 overflow-auto">
          <table className="w-full text-sm text-left text-gray-300 border-collapse">
            <thead className="bg-[#1F2937] sticky top-0 z-10">
              <tr className="border-b border-gray-600/50">
                <th scope="col" className="px-4 py-3 font-medium text-gray-200 text-[13px]">
                  App Name
                </th>
                <th scope="col" className="px-4 py-3 font-medium text-gray-200 text-[13px]">
                  Platform
                </th>
                <th scope="col" className="px-4 py-3 font-medium text-gray-200 text-[13px]">
                  File Size
                </th>
                <th scope="col" className="px-4 py-3 font-medium text-gray-200 text-[13px]">
                  Uploaded Date
                </th>
                <th scope="col" className="px-4 py-3 font-medium text-gray-200 text-[13px]">
                  Automation FileName
                </th>
                <th scope="col" className="px-4 py-3 font-medium text-gray-200 text-[13px]">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-600/50">
              {pageData.length > 0 ? (
                pageData.map((app: any) => {
                  const date = new Date(app.createdAt);
                  const options: Intl.DateTimeFormatOptions = {
                    year: 'numeric' as const,
                    month: 'long' as const,
                    day: 'numeric' as const,
                    hour: '2-digit' as const,
                    minute: '2-digit' as const,
                    hour12: true,
                  };
                  const readableDate = date.toLocaleString('en-US', options);
                  return (
                    <tr
                      key={app.uploadedFileName}
                      className="border-b border-gray-600/50 hover:bg-gray-800/50 transition-colors"
                    >
                      <td className="px-4 py-2 font-medium whitespace-nowrap">
                        <div className="flex items-center">
                          <span className="text-[#A1A1AA]">{app.fileName}</span>
                        </div>
                      </td>
                      <td className="px-4 py-2">
                        {(() => {
                          const platform = getPlatformFromFileName(app.fileName);
                          if (platform === 'ios') {
                            return (
                              <svg
                                className="h-5 w-5 text-[#A1A1AA]"
                                aria-hidden="true"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path d="M17.537 12.625a4.421 4.421 0 0 0 2.684 4.047 10.96 10.96 0 0 1-1.384 2.845c-.834 1.218-1.7 2.432-3.062 2.457-1.34.025-1.77-.794-3.3-.794-1.531 0-2.01.769-3.275.82-1.316.049-2.317-1.318-3.158-2.532-1.72-2.484-3.032-7.017-1.27-10.077A4.9 4.9 0 0 1 8.91 6.884c1.292-.025 2.51.869 3.3.869.789 0 2.27-1.075 3.828-.917a4.67 4.67 0 0 1 3.66 1.984 4.524 4.524 0 0 0-2.16 3.805m-2.52-7.432A4.4 4.4 0 0 0 16.06 2a4.482 4.482 0 0 0-2.945 1.516 4.185 4.185 0 0 0-1.061 3.093 3.708 3.708 0 0 0 2.967-1.416Z" />
                              </svg>
                            );
                          } else if (platform === 'android') {
                            return (
                              <svg
                                className="h-5 w-5 text-[#A1A1AA]"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                              >
                                <path d="M17.523 15.3414c-.5511 0-.9993-.4486-.9993-.9997s.4482-.9993.9993-.9993c.5511 0 .9993.4482.9993.9993.0001.5511-.4482.9997-.9993.9997m-11.046 0c-.5511 0-.9993-.4486-.9993-.9997s.4482-.9993.9993-.9993c.5511 0 .9993.4482.9993.9993 0 .5511-.4482.9997-.9993.9997m11.4045-6.02l1.9973-3.4592a.416.416 0 00-.1521-.5676.416.416 0 00-.5676.1521l-2.0223 3.503C15.5902 8.2439 13.8533 7.6818 12 7.6818s-3.5902.5621-5.1367 1.7279L4.841 5.9067a.416.416 0 00-.5676-.1521.416.416 0 00-.1521.5676l1.9973 3.4592C2.6889 11.1867.3432 14.6589 0 18.761h24c-.3432-4.1021-2.6889-7.5743-6.1185-9.4396" />
                              </svg>
                            );
                          } else {
                            return <span className="text-[#A1A1AA] text-sm">-</span>;
                          }
                        })()}
                      </td>
                      <td className="px-4 py-2 text-[#A1A1AA]">
                        {(app.fileSize / (1024 * 1024)).toFixed(2)} MB
                      </td>
                      <td className="px-4 py-2 text-[#A1A1AA]">{readableDate}</td>
                      <td className="px-4 py-2 text-[#A1A1AA]">{app.uploadedFileName}</td>
                      <td className="px-4 py-2">
                        {isDeleting[app.uploadedFileName] ? (
                          <div className="text-[#A1A1AA]">Deleting...</div>
                        ) : (
                          <button
                            className="font-medium text-red-500 hover:text-red-400 transition-colors"
                            onClick={async () => {
                              setIsDeleting((prevState) => ({
                                ...prevState,
                                [app.uploadedFileName]: true,
                              }));
                              try {
                                await DeviceFarmApiService.deleteUploadedApp(app.uploadedFileName);
                                await fetchAppList();
                              } catch (error) {
                                console.error('Failed to delete app: ', error);
                              } finally {
                                setIsDeleting((prevState) => ({
                                  ...prevState,
                                  [app.uploadedFileName]: false,
                                }));
                              }
                            }}
                          >
                            Remove
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={6}>
                    <div className="flex items-center justify-center h-[400px]">
                      <div className="text-center">
                        <p className="text-[#A1A1AA] text-lg">No apps available</p>
                        <p className="text-gray-500 text-sm mt-2">
                          {searchTerm
                            ? 'Try adjusting your search criteria'
                            : 'Upload an app to get started'}
                        </p>
                      </div>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {pageData.length > 0 && (
          <div className="flex items-center justify-between px-4 py-3 bg-[#1F2937] border-t border-gray-600/50">
            <div className="flex items-center gap-2">
              <Typography className="text-sm text-[#A1A1AA]">
                Showing {pageData.length} of {filteredData.length} apps
              </Typography>
              {!showAll && filteredData.length > itemsPerPage && (
                <button
                  onClick={() => setShowAll(true)}
                  className="px-3 py-1 text-xs bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors"
                >
                  Show All
                </button>
              )}
              {showAll && (
                <button
                  onClick={() => {
                    setShowAll(false);
                    setActive(1);
                  }}
                  className="px-3 py-1 text-xs bg-gray-600 hover:bg-gray-700 text-white rounded transition-colors"
                >
                  Show Paginated
                </button>
              )}
            </div>

            {!showAll && (
              <div className="flex items-center gap-4">
                <IconButton
                  onClick={prev}
                  disabled={active === 1}
                  className="p-1 hover:bg-gray-800/50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft className="h-5 w-5 text-[#A1A1AA]" />
                </IconButton>
                <Typography className="text-sm text-[#A1A1AA]">
                  Page <span className="font-medium">{active}</span> of{' '}
                  <span className="font-medium">
                    {Math.max(1, Math.ceil(filteredData.length / itemsPerPage))}
                  </span>
                </Typography>
                <IconButton
                  onClick={next}
                  disabled={active === Math.ceil(filteredData.length / itemsPerPage)}
                  className="p-1 hover:bg-gray-800/50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronRight className="h-5 w-5 text-[#A1A1AA]" />
                </IconButton>
              </div>
            )}
          </div>
        )}
      </div>

      <AppUploader
        open={showFileUpload}
        onClose={() => {
          setShowFileUpload(false);
          fetchAppList();
        }}
      />
    </div>
  );
}
