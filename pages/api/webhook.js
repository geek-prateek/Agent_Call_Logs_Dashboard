import { getServiceSupabase } from '../../lib/supabase'

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })
  const payload = req.body || {}

  // Basic HMAC signature verification (optional)
  const secret = process.env.BOLNA_SECRET
  if (secret) {
    try {
      const signature = req.headers['x-bolna-signature'] || req.headers['x-signature'] || ''
      const crypto = require('crypto')
      const hmac = crypto.createHmac('sha256', secret).update(JSON.stringify(payload)).digest('hex')
      const safeEqual = (a, b) => {
        try { return crypto.timingSafeEqual(Buffer.from(a), Buffer.from(b)) }
        catch (e) { return false }
      }
      if (!safeEqual(hmac, signature)) {
        return res.status(401).json({ error: 'invalid_signature' })
      }
    } catch (e) {
      console.warn('signature verify failed', e)
      return res.status(401).json({ error: 'invalid_signature' })
    }
  }

  // Normalize payload
  const call_id = payload.call_id || payload.id || payload.execution_id || null
  const phone_number = payload.phone_number || payload.from || payload.caller || payload.caller_phone || null
  const status_raw = (payload.status || payload.call_status || 'completed').toLowerCase()
  const status = status_raw === 'failed' ? 'failed' : 'completed' // only allow completed or failed
  const duration = payload.duration || payload.duration_seconds || null
  const recording_url = payload.recording_url || (payload.recording && payload.recording.url) || null
  const transcript = payload.transcript || payload.transcripts || null
  const activity_logs = status === 'completed' ? (payload.activity_logs || payload.activities || null) : null
  const cost = payload.cost || null

  if (!call_id) {
    return res.status(400).json({ error: 'missing_call_id' })
  }

  try {
    const supabase = getServiceSupabase()
    // Upsert by call_id (idempotent)
    const upsertObj = {
      call_id,
      phone_number,
      status,
      duration,
      recording_url,
      transcript,
      activity_logs,
      cost
    }
    const { data, error } = await supabase
      .from('calls')
      .upsert(upsertObj, { onConflict: 'call_id' })
      .select()

    if (error) throw error
    return res.status(200).json({ success: true, call: data?.[0] || null })
  } catch (err) {
    console.error('webhook error', err)
    return res.status(500).json({ error: 'internal_error' })
  }
}
