import React, { useEffect, useState } from 'react';
import ApiTokenService, {
  ApiToken,
  CreateApiTokenRequest,
} from '../../../services/ApiTokenService';
import DeleteIcon from '@mui/icons-material/Delete';
import { useAuth } from '../../../contexts/AuthContext';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

const formatDate = (dateStr?: string) => (dateStr ? new Date(dateStr).toLocaleString() : '-');

const ApiTokens: React.FC = () => {
  const [tokens, setTokens] = useState<ApiToken[]>([]);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [newTokenName, setNewTokenName] = useState('');
  const [newTokenExpiry, setNewTokenExpiry] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [createdToken, setCreatedToken] = useState<ApiToken | null>(null);
  const { user } = useAuth();
  const [accessKeyCopied, setAccessKeyCopied] = useState(false);
  const [copiedTokens, setCopiedTokens] = useState<{ [id: string]: boolean }>({});
  const [visibleTokens, setVisibleTokens] = useState<{ [id: string]: boolean }>({});
  const [isAccessKeyLoading, setIsAccessKeyLoading] = useState(true);

  useEffect(() => {
    // Check if access key is available
    if (user?.accessKey) {
      setIsAccessKeyLoading(false);
    } else {
      // If not available, wait for a short time and check again
      const timer = setTimeout(() => {
        setIsAccessKeyLoading(false);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [user?.accessKey]);

  const fetchTokens = async () => {
    setLoading(true);
    try {
      const data = await ApiTokenService.listApiTokens();
      setTokens(data);
    } catch (e) {
      setError('Failed to load tokens');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchTokens();
  }, []);

  const handleCreate = async () => {
    setError('');
    if (!newTokenName.trim()) {
      setError('Description is required');
      return;
    }
    setLoading(true);
    try {
      const req: CreateApiTokenRequest = { name: newTokenName };
      if (newTokenExpiry) req.expiresAt = newTokenExpiry;
      const token = await ApiTokenService.createApiToken(req);
      setCreatedToken(token);
      setShowModal(false);
      setNewTokenName('');
      setNewTokenExpiry('');
      fetchTokens();
    } catch (e) {
      setError('Failed to create token');
    }
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this token?')) return;
    setLoading(true);
    try {
      setTokens((prev) => prev.filter((t) => t.id !== id));
      await ApiTokenService.deleteApiToken(id);
      await fetchTokens();
    } catch (e) {
      setError('Failed to delete token');
    }
    setLoading(false);
  };

  // Fallback copy method for older browsers
  const fallbackCopyTextToClipboard = (text: string) => {
    const textArea = document.createElement('textarea');
    textArea.value = text;

    // Avoid scrolling to bottom
    textArea.style.top = '0';
    textArea.style.left = '0';
    textArea.style.position = 'fixed';
    textArea.style.opacity = '0';

    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
      const successful = document.execCommand('copy');
      if (successful) {
        console.log('Fallback: Copying text command was successful');
      } else {
        console.log('Fallback: Unable to copy');
      }
    } catch (err) {
      console.error('Fallback: Oops, unable to copy', err);
    }

    document.body.removeChild(textArea);
  };

  const handleCopy = async () => {
    try {
      if (user?.accessKey) {
        await navigator.clipboard.writeText(user.accessKey);
        setAccessKeyCopied(true);
        setTimeout(() => setAccessKeyCopied(false), 1500);
      }
    } catch (err) {
      console.error('Failed to copy access key:', err);
      // Fallback for older browsers
      if (user?.accessKey) {
        fallbackCopyTextToClipboard(user.accessKey);
        setAccessKeyCopied(true);
        setTimeout(() => setAccessKeyCopied(false), 1500);
      }
    }
  };

  const handleCopyToken = async (tokenId: string, token: string) => {
    try {
      await navigator.clipboard.writeText(token);
      setCopiedTokens((prev) => ({ ...prev, [tokenId]: true }));
      setTimeout(() => {
        setCopiedTokens((prev) => ({ ...prev, [tokenId]: false }));
      }, 1500);
    } catch (err) {
      console.error('Failed to copy token:', err);
      // Fallback for older browsers
      fallbackCopyTextToClipboard(token);
      setCopiedTokens((prev) => ({ ...prev, [tokenId]: true }));
      setTimeout(() => {
        setCopiedTokens((prev) => ({ ...prev, [tokenId]: false }));
      }, 1500);
    }
  };

  const toggleTokenVisibility = (id: string) => {
    setVisibleTokens((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const filteredTokens = tokens.filter(
    (t) =>
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.id.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="w-full">
      {/* Access Key Row */}
      <div className="flex items-center gap-4 mb-6 w-full max-w-xl">
        <label className="block text-sm font-medium text-gray-100 whitespace-nowrap">
          Access Key
        </label>
        <div className="relative flex-1 max-w-xs">
          {isAccessKeyLoading ? (
            <div className="w-full max-w-xs bg-gray-100/5 border border-gray-700 rounded-lg px-4 py-2 text-gray-100 text-sm font-mono pr-10">
              Loading...
            </div>
          ) : user?.accessKey ? (
            <>
              <input
                type="text"
                value={user.accessKey}
                readOnly
                className="w-full max-w-xs bg-gray-100/5 border border-gray-700 rounded-lg px-4 py-2 text-gray-100 text-sm font-mono pr-10 focus:outline-none focus:ring-2 focus:ring-blue-600/40 transition"
                style={{ letterSpacing: '0.01em' }}
              />
              <button
                type="button"
                onClick={handleCopy}
                className="absolute right-1 top-1/2 -translate-y-1/2 p-1 rounded hover:bg-gray-700 transition text-gray-400 hover:text-blue-400 focus:outline-none"
                title="Copy access key"
                style={{ background: 'none', border: 'none' }}
              >
                <ContentCopyIcon fontSize="small" />
              </button>
              {accessKeyCopied && (
                <span className="absolute right-10 top-1/2 -translate-y-1/2 text-xs text-green-400 bg-gray-900 px-2 py-1 rounded shadow">
                  Copied!
                </span>
              )}
            </>
          ) : (
            <div className="w-full max-w-xs bg-gray-100/5 border border-gray-700 rounded-lg px-4 py-2 text-gray-100 text-sm font-mono pr-10">
              No access key available
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between mb-5">
        <h3 className="text-lg font-semibold">Identity Tokens</h3>
        <div className="flex items-center justify-center gap-2">
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-1 px-4 rounded shadow transition"
            onClick={() => {
              setShowModal(true);
              setCreatedToken(null);
              setError('');
            }}
          >
            Generate New Token
          </button>
          <input
            type="text"
            placeholder="Search"
            className="bg-gray-800 border border-gray-700 rounded px-3 py-1 text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-600"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="overflow-x-auto bg-gray-800 border border-gray-700">
        <table className="min-w-full text-sm text-gray-200 table-fixed border border-gray-700 border-separate border-spacing-0">
          <thead>
            <tr className="bg-gray-700/80">
              <th className="py-3 px-4 text-left w-1/5 box-border font-semibold text-base tracking-wide border-b border-gray-700">
                Name
              </th>
              <th className="py-3 px-4 text-left w-2/5 box-border font-semibold text-base tracking-wide border-b border-gray-700">
                Token
              </th>
              <th className="py-3 px-4 text-left w-1/5 box-border font-semibold text-base tracking-wide border-b border-gray-700">
                Issued At
              </th>
              <th className="py-3 px-4 text-left w-1/5 box-border font-semibold text-base tracking-wide border-b border-gray-700">
                Expiry Date
              </th>
              <th className="py-3 px-4 w-12 box-border border-b border-gray-700"></th>
            </tr>
          </thead>
          <tbody>
            {filteredTokens.length === 0 && (
              <tr>
                <td
                  colSpan={5}
                  className="py-12 px-4 text-center text-gray-400 border-b border-gray-700"
                >
                  <div className="flex flex-col items-center justify-center gap-3">
                    {tokens.length === 0 ? (
                      <>
                        <div className="text-lg font-semibold text-gray-300">No tokens found</div>
                        <div className="text-gray-400 mb-2">
                          You haven't created any identity tokens yet.
                        </div>
                        <button
                          className="mt-2 px-5 py-2 rounded bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
                          onClick={() => setShowModal(true)}
                        >
                          Generate your first Identity Token
                        </button>
                      </>
                    ) : (
                      <>
                        <div className="text-lg font-semibold text-gray-300">
                          No tokens match your search.
                        </div>
                        <div className="text-gray-400 mb-2">
                          Try a different keyword or clear your search filter.
                        </div>
                        <button
                          className="mt-2 px-5 py-2 rounded bg-gray-700 text-white font-semibold hover:bg-gray-600 transition"
                          onClick={() => setSearch('')}
                        >
                          Clear search
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            )}
            {filteredTokens.map((token) => (
              <tr key={token.id} className="hover:bg-gray-700/60 transition">
                <td className="py-3 px-4 w-1/5 box-border text-left align-middle border-b border-gray-700">
                  {token.name}
                </td>
                <td className="py-3 px-4 w-2/5 font-mono box-border text-left align-middle border-b border-gray-700">
                  <div className="relative flex items-center">
                    <input
                      type={visibleTokens[token.id] ? 'text' : 'password'}
                      value={token.token || ''}
                      readOnly
                      className="w-full bg-transparent border-none text-gray-200 font-mono pr-16 focus:outline-none text-sm"
                      style={{ letterSpacing: '0.01em' }}
                    />
                    <div className="absolute right-1 top-1/2 -translate-y-1/2 flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => handleCopyToken(token.id, token.token || '')}
                        className="p-1 rounded hover:bg-gray-700 transition text-gray-400 hover:text-blue-400 focus:outline-none"
                        title="Copy token"
                      >
                        <ContentCopyIcon fontSize="small" />
                      </button>
                      {copiedTokens[token.id] && (
                        <span className="absolute right-8 top-1/2 -translate-y-1/2 text-xs text-green-400 bg-gray-900 px-2 py-1 rounded shadow">
                          Copied!
                        </span>
                      )}
                      <button
                        type="button"
                        onClick={() => toggleTokenVisibility(token.id)}
                        className="p-1 rounded hover:bg-gray-700 transition text-gray-400 hover:text-blue-400 focus:outline-none"
                        title={visibleTokens[token.id] ? 'Hide token' : 'Show token'}
                      >
                        {visibleTokens[token.id] ? (
                          <VisibilityOffIcon fontSize="small" />
                        ) : (
                          <VisibilityIcon fontSize="small" />
                        )}
                      </button>
                    </div>
                  </div>
                </td>
                <td className="py-3 px-4 w-1/5 box-border text-left align-middle border-b border-gray-700">
                  {formatDate(token.createdAt)}
                </td>
                <td className="py-3 px-4 w-1/5 box-border text-left align-middle border-b border-gray-700">
                  {formatDate(token.expiresAt)}
                </td>
                <td className="py-3 px-4 w-12 box-border text-left align-middle border-b border-gray-700">
                  <button
                    className="text-red-500 hover:text-red-700 transition"
                    onClick={() => handleDelete(token.id)}
                    title="Delete"
                  >
                    <DeleteIcon fontSize="small" className="text-red-500 hover:text-red-700" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal for creating token */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
          <div className="bg-gray-900 rounded-lg shadow-lg p-8 w-full max-w-md">
            <h3 className="text-xl font-semibold mb-4">Generate Identity Token</h3>
            <div className="mb-4">
              <label className="block mb-1 text-gray-300">Description</label>
              <input
                className="w-full px-3 py-2 rounded bg-gray-800 border border-gray-700 text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-600"
                value={newTokenName}
                onChange={(e) => setNewTokenName(e.target.value)}
                placeholder="e.g. mac, CI, etc."
              />
            </div>
            <div className="mb-4">
              <label className="block mb-1 text-gray-300">Expiry Date (optional)</label>
              <input
                type="datetime-local"
                className="w-full px-3 py-2 rounded bg-gray-800 border border-gray-700 text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-600 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200"
                value={newTokenExpiry}
                onChange={(e) => setNewTokenExpiry(e.target.value)}
                min={new Date().toISOString().slice(0, 16)}
              />
            </div>
            {error && <div className="text-red-400 mb-2">{error}</div>}
            <div className="flex justify-end gap-2">
              <button
                className="px-4 py-2 rounded bg-gray-700 text-gray-200 hover:bg-gray-600"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 rounded bg-blue-600 text-white font-semibold hover:bg-blue-700"
                onClick={handleCreate}
                disabled={loading}
              >
                {loading ? 'Creating...' : 'Create'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Show created token info */}
      {createdToken && (
        <div className="mt-6 bg-gray-800 border border-blue-700 rounded-lg p-4">
          <div className="text-green-400 font-semibold mb-2">Token created!</div>
          <div>
            <span className="font-semibold">Token:</span>
            <span className="ml-2 font-mono bg-gray-900 px-2 py-1 rounded text-blue-300">
              {createdToken.token}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApiTokens;
