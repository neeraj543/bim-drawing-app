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
    <div className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow bg-white">
      {/* Header Section */}
      <div className="p-4 bg-gray-50 border-b border-gray-200">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-bold text-gray-800">{set.name}</h3>
          <div className="flex gap-2">
            {files.length > 0 && (
              <button
                onClick={handleDownloadAll}
                className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-all flex items-center gap-1.5"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Download All
              </button>
            )}
            <button
              onClick={() => setShowUpload(true)}
              className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white text-sm font-medium rounded-lg transition-all"
            >
              + Upload
            </button>
          </div>
        </div>

        {/* Metadata Row */}
        <div className="flex items-center gap-4 text-sm text-gray-600">
          <span className="font-medium text-amber-700">{set.revisionNumber}</span>
          <span>•</span>
          <span>{new Date(set.createdAt).toLocaleDateString()}</span>
          <span>•</span>
          <span className="font-medium">{set.fileCount} {set.fileCount === 1 ? 'file' : 'files'}</span>
        </div>

        {set.description && (
          <p className="text-sm text-gray-600 mt-2">{set.description}</p>
        )}
      </div>

      {/* Files Section */}
      {files.length > 0 && (
        <div>
          {/* Expandable Header */}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-full px-4 py-2 bg-white hover:bg-gray-50 transition-colors flex items-center justify-between border-b border-gray-200"
          >
            <span className="text-sm font-medium text-gray-700">
              {isExpanded ? 'Hide' : 'Show'} Files ({files.length})
            </span>
            <svg
              className={`w-5 h-5 text-gray-500 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {/* Files List */}
          {isExpanded && (
            <div className="p-4 space-y-2">
              {files.map(file => (
                <div
                  key={file.id}
                  className="flex items-center justify-between bg-gray-50 rounded-lg px-4 py-3 text-sm group hover:bg-amber-50 hover:border-amber-200 border border-transparent transition-all"
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-800 truncate">{file.renamedFileName}</p>
                    <p className="text-xs text-gray-500 truncate">Original: {file.originalFileName}</p>
                  </div>
                  <div className="flex items-center gap-3 ml-4">
                    <span className="text-xs text-gray-600 whitespace-nowrap">{(file.fileSize / 1024).toFixed(1)} KB</span>
                    <button
                      onClick={() => handlePreview(file)}
                      className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-medium rounded-lg transition-all flex items-center gap-1.5"
                      title="Preview file"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
        </div>
      )}

      {/* Empty State */}
      {files.length === 0 && (
        <div className="p-6 text-center">
          <svg className="w-12 h-12 text-gray-300 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
          <p className="text-sm text-gray-500">No files uploaded yet</p>
          <p className="text-xs text-gray-400 mt-1">Click "Upload" to add files</p>
        </div>
      )}

      {showUpload && <FileUploadModal onClose={() => setShowUpload(false)} onUpload={handleUpload} loading={loading} />}
      {previewFile && <FilePreviewModal file={previewFile} fileUrl={previewUrl} onClose={closePreview} />}
    </div>
  )
}

export default DrawingSetCard