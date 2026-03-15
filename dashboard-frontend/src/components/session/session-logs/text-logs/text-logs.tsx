import { Clock, X } from 'lucide-react';
import { Highlight, themes, type Language } from 'prism-react-renderer';
import { useState } from 'react';
import { ISessionLogs } from '../../../../interfaces/ISessionLogs';
import '../../style.css';

interface TextLogsProps {
  sessionLogs: ISessionLogs[];
  showImages: boolean;
  showErrorsOnly: boolean;
  baseUrl: any;
}

const isValidJSON = (str: string): boolean => {
  if (typeof str !== 'string') return false;
  try {
    JSON.parse(str);
    return true;
  } catch (e) {
    return false;
  }
};

const isXMLLike = (str: string): boolean => {
  if (typeof str !== 'string') return false;
  return /^\s*<[^>]+>/.test(str);
};

const formatXML = (xml: string): string => {
  let formatted = '';
  const reg = /(>)(<)(\/*)/g;
  xml = xml.replace(reg, '$1\r\n$2$3');
  let pad = 0;

  xml.split('\r\n').forEach((node) => {
    let indent = 0;
    if (node.match(/.+<\/\w[^>]*>$/)) {
      indent = 0;
    } else if (node.match(/^<\/\w/)) {
      if (pad !== 0) pad -= 1;
    } else if (node.match(new RegExp('^<\\w[^>]*[^/]>.*$'))) {
      indent = 1;
    } else {
      indent = 0;
    }

    let padding = '';
    for (let i = 0; i < pad; i++) padding += '  ';

    formatted += padding + node + '\r\n';
    pad += indent;
  });

  return formatted.trim();
};

const formatData = (data: any): any => {
  if (!data) return '';

  if (typeof data === 'object') {
    return JSON.stringify(data, null, 2);
  }

  try {
    if (isValidJSON(data)) {
      return JSON.stringify(JSON.parse(data), null, 2);
    }
    if (isXMLLike(data)) {
      return formatXML(data);
    }
    return data;
  } catch (e) {
    return data;
  }
};

interface Token {
  types: string[];
  content: string;
  empty?: boolean;
}

interface LineInputProps {
  line: Token[];
  key?: number;
  style?: React.CSSProperties;
  className?: string;
}

interface TokenInputProps {
  token: Token;
  key?: number;
  style?: React.CSSProperties;
  className?: string;
}

const CodeBlock = ({ code, language }: { code: string; language: string }) => {
  // Helper function to check if a line contains error-related content
  const isErrorLine = (line: string): boolean => {
    const errorKeywords = ['error', 'exception', 'failed', 'failure', 'fatal', 'crash'];
    return errorKeywords.some((keyword) => line.toLowerCase().includes(keyword));
  };

  return (
    <Highlight
      theme={{
        ...themes.vsDark,
        plain: {
          color: '#E2E8F0',
          backgroundColor: '#1E1E2E',
        },
        styles: [
          ...themes.vsDark.styles,
          {
            types: ['string', 'attr-value'],
            style: {
              color: '#A6E3A1',
            },
          },
          {
            types: ['number'],
            style: {
              color: '#F9B17A',
            },
          },
          {
            types: ['property'],
            style: {
              color: '#89B4FA',
            },
          },
          {
            types: ['keyword', 'tag'],
            style: {
              color: '#CBA6F7',
            },
          },
        ],
      }}
      code={code}
      language={language as Language}
    >
      {({ className, style, tokens, getLineProps, getTokenProps }) => (
        <pre
          className={`${className} p-4 overflow-auto text-left text-sm max-h-[400px] border border-gray-800/30`}
          style={{
            ...style,
            fontSize: '0.75rem',
            lineHeight: '1.6',
            margin: 0,
            textAlign: 'left',
            backgroundColor: '#1E1E2E',
            borderRadius: 0,
          }}
        >
          {tokens.map((line, i) => {
            const lineContent = line.map((token) => token.content).join('');
            const isError = isErrorLine(lineContent);

            return (
              <div
                key={i}
                {...getLineProps({ line, key: i })}
                style={{
                  display: 'table-row',
                  backgroundColor: isError ? 'rgba(239, 68, 68, 0.1)' : 'transparent',
                }}
              >
                <span
                  style={{
                    display: 'table-cell',
                    textAlign: 'right',
                    paddingRight: '1.5em',
                    userSelect: 'none',
                    opacity: 0.5,
                    color: isError ? '#fca5a5' : '#94A3B8',
                    minWidth: '3em',
                    borderRight: '1px solid rgba(148, 163, 184, 0.1)',
                  }}
                >
                  {i + 1}
                </span>
                <span
                  style={{
                    display: 'table-cell',
                    paddingLeft: '1.5em',
                  }}
                >
                  {line.map((token, key) => (
                    <span
                      key={key}
                      {...getTokenProps({ token, key })}
                      style={{
                        ...getTokenProps({ token, key }).style,
                        color: isError ? '#fca5a5' : undefined,
                      }}
                    />
                  ))}
                </span>
              </div>
            );
          })}
        </pre>
      )}
    </Highlight>
  );
};

const DataViewer = ({ data }: { data: any }) => {
  const formattedData = formatData(data);

  if (typeof data === 'object' && data !== null && data.error) {
    return (
      <div className="space-y-4">
        <div className="overflow-hidden rounded-none ring-1 ring-red-800/50 shadow-md bg-red-900/20">
          <div className="p-4 space-y-2">
            <div className="text-red-400 font-medium">{data.error}</div>
            <div className="text-red-200">{data.message}</div>
          </div>
        </div>
        {data.stacktrace && (
          <div className="overflow-hidden rounded-none ring-1 ring-gray-800/50 shadow-md">
            <CodeBlock code={data.stacktrace} language="plaintext" />
          </div>
        )}
      </div>
    );
  }

  if (typeof data === 'object' && data !== null) {
    return (
      <div className="overflow-hidden rounded-none ring-1 ring-gray-800/50 shadow-md">
        <CodeBlock code={formattedData} language="json" />
      </div>
    );
  }

  if (isXMLLike(formattedData)) {
    return (
      <div className="overflow-hidden rounded-none ring-1 ring-gray-800/50 shadow-md">
        <CodeBlock code={formattedData} language="markup" />
      </div>
    );
  }

  if (isValidJSON(formattedData)) {
    return (
      <div className="overflow-hidden rounded-none ring-1 ring-gray-800/50 shadow-md">
        <CodeBlock code={formattedData} language="json" />
      </div>
    );
  }

  return (
    <pre className="p-4 text-xs font-mono text-gray-200 whitespace-pre-wrap max-h-[400px] overflow-auto bg-[#18181B] rounded-none ring-1 ring-gray-800/50 shadow-md">
      {String(formattedData)}
    </pre>
  );
};

interface ImageModalProps {
  src: string;
  alt: string;
  onClose: () => void;
}

const ImageModal = ({ src, alt, onClose }: ImageModalProps) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="relative max-w-[90vw] max-h-[90vh]">
        <button
          onClick={onClose}
          className="absolute -top-4 -right-4 p-2 rounded-full bg-gray-800 hover:bg-gray-700 transition-colors"
        >
          <X className="w-5 h-5 text-gray-200" />
        </button>
        <img src={src} alt={alt} className="max-w-full max-h-[90vh] object-contain" />
      </div>
    </div>
  );
};

function TextLogs({ sessionLogs, showImages, showErrorsOnly, baseUrl }: TextLogsProps) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const isEmptyObject = (obj: any) => {
    if (!obj) return true;
    return Object.keys(obj).length === 0;
  };

  const hasError = (response: any) => {
    try {
      const parsedResponse = typeof response === 'string' ? JSON.parse(response) : response;
      return parsedResponse?.value?.error !== undefined;
    } catch (e) {
      return false;
    }
  };

  return (
    <>
      <div className="space-y-3">
        {sessionLogs
          .sort((a, b) => (a.createdAt > b.createdAt ? 1 : -1))
          .filter((sessionLog) => (showErrorsOnly ? hasError(sessionLog.response) : true))
          .map((sessionLog, index, array) => {
            const currentTime = new Date(sessionLog.createdAt);
            const nextTime = index < array.length - 1 ? new Date(array[index + 1].createdAt) : null;
            const timeDifference = nextTime ? nextTime.getTime() - currentTime.getTime() : null;
            const formattedBody = sessionLog.body ? JSON.parse(sessionLog.body) : null;
            const formattedResponse = sessionLog.response
              ? JSON.parse(sessionLog.response)?.value
              : null;
            const isExpanded = expandedIndex === index;
            const isError = hasError(sessionLog.response);

            return (
              <div
                key={index}
                className={`
                  border transition-all duration-200
                  ${
                    isError
                      ? isExpanded
                        ? 'border-red-500/50 bg-red-500/10 shadow-md'
                        : 'border-red-500/30 bg-red-500/5'
                      : isExpanded
                        ? 'border-indigo-500/50 bg-indigo-500/10 shadow-md'
                        : 'border-gray-700/30 bg-gray-800/30 hover:border-gray-600/50'
                  }
                  rounded-none overflow-hidden backdrop-blur-sm
                `}
              >
                <button
                  className={`
                    w-full flex items-center justify-between px-6 py-4 text-sm transition-colors
                    ${
                      isError
                        ? isExpanded
                          ? 'bg-red-500/10 hover:bg-red-500/15'
                          : 'hover:bg-red-500/10'
                        : isExpanded
                          ? 'bg-indigo-500/10 hover:bg-indigo-500/15'
                          : 'hover:bg-gray-800/40'
                    }
                  `}
                  onClick={() => setExpandedIndex(isExpanded ? null : index)}
                >
                  <div className="flex items-center gap-6 min-w-0 flex-1">
                    <div
                      className={`font-medium truncate ${
                        isError ? 'text-red-200' : isExpanded ? 'text-indigo-200' : 'text-gray-100'
                      }`}
                    >
                      {sessionLog.title}
                    </div>
                    {formattedBody && formattedBody.using && formattedBody.value && (
                      <div className={`truncate ${isError ? 'text-red-200/70' : 'text-gray-300'}`}>
                        [{formattedBody.using}={formattedBody.value}]
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-4">
                    {timeDifference !== null && (
                      <div
                        className={`flex items-center gap-1.5 ${isError ? 'text-red-200/70' : 'text-gray-300'}`}
                      >
                        <Clock className="w-3.5 h-3.5" />
                        <span className="font-medium">{timeDifference} ms</span>
                      </div>
                    )}
                    <svg
                      className={`w-5 h-5 transition-transform duration-200 ${
                        isError
                          ? 'text-red-300'
                          : isExpanded
                            ? 'text-indigo-300 rotate-180'
                            : 'text-gray-300'
                      }`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </button>

                {isExpanded && (
                  <div className="border-t border-indigo-500/20">
                    <div className="p-6 space-y-6">
                      {showImages && sessionLog.screenshot && (
                        <div className="border border-gray-700/30 rounded-none overflow-hidden shadow-sm">
                          <button
                            onClick={() =>
                              setSelectedImage(
                                `${baseUrl}/device-farm/assets/${sessionLog.screenshot}`,
                              )
                            }
                            className="w-full h-48 relative group"
                          >
                            <img
                              className="w-full h-full object-contain"
                              src={`${baseUrl}/device-farm/assets/${sessionLog.screenshot}`}
                              alt="Test Screenshot"
                            />
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                              <span className="text-white text-sm">Click to enlarge</span>
                            </div>
                          </button>
                        </div>
                      )}

                      <div className="space-y-6">
                        <div>
                          <div className="pl-1 mb-3 text-xs font-semibold text-gray-300 uppercase tracking-wider text-left">
                            Response
                          </div>
                          <div className="rounded-none backdrop-blur-sm">
                            <DataViewer data={formattedResponse} />
                          </div>
                        </div>

                        {!isEmptyObject(formattedBody) && (
                          <div>
                            <div className="pl-1 mb-3 text-xs font-semibold text-gray-300 uppercase tracking-wider text-left">
                              Parameters
                            </div>
                            <div className="rounded-none backdrop-blur-sm">
                              <DataViewer data={formattedBody} />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
      </div>

      {selectedImage && (
        <ImageModal
          src={selectedImage}
          alt="Test Screenshot"
          onClose={() => setSelectedImage(null)}
        />
      )}
    </>
  );
}

export default TextLogs;
