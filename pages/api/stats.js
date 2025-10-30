import { getServiceSupabase } from '../../lib/supabase'

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' })
  try {
    const supabase = getServiceSupabase()
    const { data, error } = await supabase.rpc('get_call_stats')
    if (error) throw error
    const row = Array.isArray(data) ? data[0] : data
    return res.status(200).json({
      total_executions: Number(row?.total_executions || 0),
      total_cost: Number(row?.total_cost || 0),
      total_duration: Number(row?.total_duration || 0),
      avg_cost: Number(row?.avg_cost || 0),
      avg_duration: Number(row?.avg_duration || 0)
    })
  } catch (err) {
    console.error('stats error', err)
    return res.status(500).json({ error: 'internal_error' })
  }
}


