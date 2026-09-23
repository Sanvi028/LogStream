import { useState, useEffect } from 'react';
import { searchLogs } from '../services/api';

interface Log {
  service: string;
  level: string;
  message: string;
  timestamp: string;
}

export default function Dashboard() {
  const [logs, setLogs] = useState<Log[]>([]);
  const [query, setQuery] = useState('');

  const fetchLogs = async (searchQuery: string) => {
    try {
      const data = await searchLogs(searchQuery);
      setLogs(data.logs);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchLogs('');
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchLogs(query);
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">LogStream Dashboard</h1>

      <form onSubmit={handleSearch} className="mb-6 flex gap-2">
        <input
          type="text"
          placeholder="Search logs..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="border p-2 rounded flex-1"
        />
        <button type="submit" className="bg-blue-600 text-white px-4 rounded">
          Search
        </button>
      </form>

      <div className="space-y-2">
        {logs.map((log, i) => (
          <div key={i} className="border p-3 rounded bg-white shadow-sm">
            <div className="flex justify-between text-sm text-gray-500">
              <span>{log.service}</span>
              <span>{new Date(log.timestamp).toLocaleString()}</span>
            </div>
            <div className={`font-medium ${log.level === 'error' ? 'text-red-600' : 'text-gray-800'}`}>
              {log.message}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}