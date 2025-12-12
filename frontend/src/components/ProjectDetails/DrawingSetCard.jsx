import { useEffect, useState } from 'react'
import FileUploadModal from './FileUploadModal'

function DrawingSetCard({ set, onRefresh }) {
  const [files, setFiles] = useState([])
  const [showUpload, setShowUpload] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchFiles()
  }, [set.id])

  const fetchFiles = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/drawing-sets/${set.id}/files`)
      if (response.ok) {
        const data = await response.json()
        setFiles(data)
      }
    } catch (err) {
      console.error('Failed to fetch files:', err)
    }
  }

  const handleUpload = async (uploadedFiles, descriptions) => {
    try {
      setLoading(true)
      const formData = new FormData()

      uploadedFiles.forEach(file => {
        formData.append('files', file)
      })

      descriptions.forEach(desc => {
        formData.append('descriptions', desc)
      })

      const response = await fetch(`http://localhost:8080/api/drawing-sets/${set.id}/upload`, {
        method: 'POST',
        body: formData
      })

      if (!response.ok) throw new Error('Upload failed')

      await fetchFiles()
      await onRefresh()
      setShowUpload(false)
    } catch (err) {
      alert('Upload failed: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleDownloadAll = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/drawing-sets/${set.id}/download`)
      if (!response.ok) throw new Error('Download failed')

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${set.name.replace(/[^A-Za-z0-9-]/g, '_')}.zip`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (err) {
      alert('Download failed: ' + err.message)
    }
  }

  return (
    <div className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-xl font-bold text-gray-800">{set.name}</h3>
          <p className="text-sm text-gray-600 mt-1">
            {set.revisionNumber} • {new Date(set.createdAt).toLocaleDateString()} • {set.fileCount} files
          </p>
          {set.description && <p className="text-gray-600 mt-2">{set.description}</p>}
        </div>
        <div className="flex gap-2">
          {files.length > 0 && (
            <button
              onClick={handleDownloadAll}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-md transition-all flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Download All
            </button>
          )}
          <button
            onClick={() => setShowUpload(true)}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg shadow-md transition-all"
          >
            Upload PDFs
          </button>
        </div>
      </div>

      {files.length > 0 && (
        <div className="mt-4 space-y-2">
          <h4 className="font-semibold text-gray-700 text-sm">Files:</h4>
          {files.map(file => (
            <div key={file.id} className="flex items-center justify-between bg-gray-50 rounded px-4 py-2">
              <div>
                <p className="font-medium text-gray-800">{file.renamedFileName}</p>
                <p className="text-xs text-gray-500">Original: {file.originalFileName}</p>
              </div>
              <span className="text-sm text-gray-600">{(file.fileSize / 1024).toFixed(1)} KB</span>
            </div>
          ))}
        </div>
      )}

      {showUpload && <FileUploadModal onClose={() => setShowUpload(false)} onUpload={handleUpload} loading={loading} />}
    </div>
  )
}

export default DrawingSetCard