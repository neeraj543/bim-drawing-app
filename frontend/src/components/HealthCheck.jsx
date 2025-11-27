import { useState, useEffect } from 'react'

export default function HealthCheck() {
  const [status, setStatus] = useState('loading')
  const [message, setMessage] = useState('')

  useEffect(() => {
    fetch('http://localhost:8080/health')
      .then(res => res.text())
      .then(data => {
        setMessage(data)
        setStatus('success')
      })
      .catch(err => {
        setMessage(err.message)
        setStatus('error')
      })
  }, [])

  return (
    <div className={`p-4 rounded-lg ${
      status === 'success' ? 'bg-green-100 border border-green-400' :
      status === 'error' ? 'bg-red-100 border border-red-400' :
      'bg-gray-100 border border-gray-400'
    }`}>
      <h3 className="font-semibold mb-2">API Status</h3>
      <p className={`${
        status === 'success' ? 'text-green-700' :
        status === 'error' ? 'text-red-700' :
        'text-gray-700'
      }`}>
        {status === 'loading' && 'Connecting...'}
        {status === 'success' && `✓ ${message}`}
        {status === 'error' && `✗ ${message}`}
      </p>
    </div>
  )
}
