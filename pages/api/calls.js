import { getServiceSupabase } from '../../lib/supabase'

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' })
  const { limit = 50, offset = 0 } = req.query
  try {
    const supabase = getServiceSupabase()
    const from = Number(offset)
    const to = from + Number(limit) - 1
    const { data, error } = await supabase
      .from('calls')
      .select('*')
      .order('created_at', { ascending: false })
      .range(from, to)

    if (error) throw error
    return res.status(200).json(data)
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: 'internal_error' })
  }
}
