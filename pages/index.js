import { useEffect, useState } from 'react'
import ConversationModal from '../components/ConversationModal'

export default function Dashboard() {
  const [calls, setCalls] = useState([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState(null)
  const [page, setPage] = useState(0)
  const PAGE_SIZE = 20

  async function load() {
    setLoading(true)
    try {
      const res = await fetch(`/api/calls?limit=${PAGE_SIZE}&offset=${page * PAGE_SIZE}`)
      const data = await res.json()
      setCalls(data || [])
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [page])

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Agent Call Logs</h1>

      <div className="mb-4 flex items-center justify-between">
        <div>
          <label className="mr-2 text-sm">Rows per page</label>
          <select value={PAGE_SIZE} disabled className="border rounded px-2 py-1 bg-white">
            <option>{PAGE_SIZE}</option>
          </select>
        </div>
        <button 
          onClick={load} 
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2"
        >
          <svg className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          {loading ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>

      {loading ? <p>Loading...</p> : (
        <div className="overflow-x-auto border rounded">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 text-left">Phone</th>
                <th className="p-2 text-left">Duration (s)</th>
                <th className="p-2 text-left">Status</th>
                <th className="p-2 text-left">Cost</th>
                <th className="p-2 text-left">Timestamp</th>
                <th className="p-2 text-left">Conversation</th>
              </tr>
            </thead>
            <tbody>
              {calls.length === 0 ? (
                <tr><td colSpan="6" className="p-4 text-center">No calls</td></tr>
              ) : calls.map(call => (
                <tr key={call.id} className="border-t">
                  <td className="p-2">{call.phone_number || call.phone || '-'}</td>
                  <td className="p-2">{call.duration || '-'}</td>
                  <td className="p-2">
                    <span className={call.status === 'completed' ? 'text-green-600' : 'text-red-600'}>{call.status}</span>
                  </td>
                  <td className="p-2">{call.cost != null ? `$${Number(call.cost).toFixed(3)}` : '-'}</td>
                  <td className="p-2">{new Date(call.created_at).toLocaleString()}</td>
                  <td className="p-2">
                    {call.status === 'completed' ? (
                      <button className="text-blue-600 underline" onClick={() => setSelected(call)}>Recordings</button>
                    ) : <span className="text-gray-500">-</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="flex justify-between items-center mt-4">
        <button className="px-3 py-2 bg-gray-200 rounded" onClick={() => setPage(Math.max(0, page-1))}>Prev</button>
        <div>Page {page+1}</div>
        <button className="px-3 py-2 bg-gray-200 rounded" onClick={() => setPage(page+1)}>Next</button>
      </div>

      <ConversationModal call={selected} onClose={() => setSelected(null)} />
    </div>
  )
}
