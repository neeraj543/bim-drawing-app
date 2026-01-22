import { useEffect, useState } from 'react'
import { api } from '../../utils/api'
import FileUploadModal from './FileUploadModal'
import FilePreviewModal from './FilePreviewModal'

function DrawingSetCard({ set, onRefresh }) {
  const [files, setFiles] = useState([])
  const [showUpload, setShowUpload] = useState(false)
  const [loading, setLoading] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const [previewFile, setPreviewFile] = useState(null)
  const [previewUrl, setPreviewUrl] = useState(null)

  useEffect(() => {
    fetchFiles()
  }, [set.id])

  const fetchFiles = async () => {
    try {
      const data = await api.get(`/api/drawing-sets/${set.id}/files`)
      setFiles(data)
    } catch (err) {
      console.error('Failed to fetch files:', err)
    }
  }

  const handleUpload = async (uploadedFiles, floors, designerInitials) => {
    try {
      setLoading(true)
      const formData = new FormData()

      uploadedFiles.forEach(file => {
        formData.append('files', file)
      })

      floors.forEach(floor => {
        formData.append('floors', floor)
      })

      designerInitials.forEach(initials => {
        formData.append('designerInitials', initials)
      })

      await api.upload(`/api/drawing-sets/${set.id}/upload`, formData)

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
      const blob = await api.download(`/api/drawing-sets/${set.id}/download`)
      if (!blob) return // User was redirected to login

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

  const handlePreview = async (file) => {
    try {
      const blob = await api.download(`/api/files/${file.id}`)
      if (!blob) return // User was redirected to login

      const url = window.URL.createObjectURL(blob)
      setPreviewUrl(url)
      setPreviewFile(file)
    } catch (err) {
      alert('Preview failed: ' + err.message)
    }
  }

  const closePreview = () => {
    if (previewUrl) {
      window.URL.revokeObjectURL(previewUrl)
    }
    setPreviewUrl(null)
    setPreviewFile(null)
  }

  return (
    <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-2">
          <div className="w-5 shrink-0">
            {files.length > 0 && (
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className={`w-5 h-5 transition-transform ${isExpanded ? 'rotate-90' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            )}
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-800">{set.name}</h3>
            <p className="text-sm text-gray-500 mt-0.5">
              {set.revisionNumber} • {new Date(set.createdAt).toLocaleDateString()} • {set.fileCount} files
            </p>
            {set.description && <p className="text-sm text-gray-600 mt-2">{set.description}</p>}
          </div>
        </div>
        <div className="flex gap-2 ml-4">
          {files.length > 0 && (
            <button
              onClick={handleDownloadAll}
              className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-all flex items-center gap-1.5"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Download
            </button>
          )}
          <button
            onClick={() => setShowUpload(true)}
            className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-all"
          >
            Upload
          </button>
        </div>
      </div>

      {files.length > 0 && isExpanded && (
        <div className="mt-3 ml-7 space-y-1.5">
          {files.map(file => (
            <div key={file.id} className="flex items-center justify-between bg-gray-50 rounded px-3 py-2 text-sm group hover:bg-gray-100 transition-colors">
              <div className="flex-1">
                <p className="font-medium text-gray-800">{file.renamedFileName}</p>
                <p className="text-xs text-gray-500">Original: {file.originalFileName}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-600">{(file.fileSize / 1024).toFixed(1)} KB</span>
                <button
                  onClick={() => handlePreview(file)}
                  className="px-2 py-1 bg-amber-600 hover:bg-amber-700 text-white text-xs font-medium rounded transition-colors opacity-0 group-hover:opacity-100 flex items-center gap-1"
                  title="Preview file"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  Preview
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showUpload && <FileUploadModal onClose={() => setShowUpload(false)} onUpload={handleUpload} loading={loading} />}
      {previewFile && <FilePreviewModal file={previewFile} fileUrl={previewUrl} onClose={closePreview} />}
    </div>
  )
}

export default DrawingSetCard