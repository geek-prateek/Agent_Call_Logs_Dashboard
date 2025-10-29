"use client";
import { useEffect, useState } from "react";

export default function ConversationModal({ call, onClose }) {
  if (!call) return null;
  const transcript = call.transcript || [];

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-6">
      <div className="absolute inset-0 bg-black/40" onClick={onClose}></div>
      <div className="relative bg-white rounded-lg shadow-lg w-full max-w-3xl max-h-[85vh] overflow-auto p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Conversation data</h2>
          <button className="text-gray-600" onClick={onClose}>Close</button>
        </div>

        <div className="space-y-6">
          <div>
            <h3 className="text-sm font-medium">Recording</h3>
            {call.recording_url ? (
              <audio controls className="w-full mt-2">
                <source src={call.recording_url} type="audio/mpeg" />
                Your browser does not support the audio element.
              </audio>
            ) : <p className="text-sm text-gray-500">No recording</p>}
          </div>

          <div>
            <h3 className="text-sm font-medium">Transcript</h3>
            <div className="mt-2 border rounded p-3 max-h-48 overflow-y-auto bg-gray-50">
              {Array.isArray(transcript) && transcript.length > 0 ? (
                transcript.map((m, i) => (
                  <div key={i} className="mb-3">
                    <div className="text-xs font-semibold">{m.role}</div>
                    <div className="text-sm">{m.text}</div>
                  </div>
                ))
              ) : (
                <div className="text-sm text-gray-500">{typeof transcript === 'string' ? transcript : 'No transcript available'}</div>
              )}
            </div>
          </div>

          {call.activity_logs && (
            <div>
              <h3 className="text-sm font-medium">Activity Logs</h3>
              <pre className="mt-2 p-3 bg-gray-100 rounded text-xs overflow-auto">{JSON.stringify(call.activity_logs, null, 2)}</pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
