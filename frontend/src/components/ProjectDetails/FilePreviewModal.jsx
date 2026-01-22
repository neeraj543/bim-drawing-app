import { useState } from 'react'

function FilePreviewModal({ file, fileUrl, onClose }) {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const isPDF = file?.originalFileName?.toLowerCase().endsWith('.pdf')
  const isImage = file?.originalFileName?.match(/\.(jpg|jpeg|png|gif|bmp|svg)$/i)

  const handleIframeLoad = () => {
    setLoading(false)
  }

  const handleIframeError = () => {
    setError('Failed to load PDF file')
    setLoading(false)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-2">
      <div className="bg-white rounded-lg shadow-2xl max-w-7xl w-full h-[96vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-800 truncate">{file?.originalFileName}</h3>
            <p className="text-sm text-gray-500 mt-0.5">
              {file?.renamedFileName || file?.originalFileName}
            </p>
          </div>
          <button
            onClick={onClose}
            className="ml-4 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto bg-gray-100 p-4">
          {loading && (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <svg className="animate-spin h-12 w-12 text-amber-600 mx-auto mb-4" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <p className="text-gray-600">Loading preview...</p>
              </div>
            </div>
          )}

          {error && (
            <div className="flex items-center justify-center h-full">
              <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-lg">
                <div className="flex items-center gap-3">
                  <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-red-700 font-medium">{error}</p>
                </div>
              </div>
            </div>
          )}

          {!error && isPDF && (
            <div className="flex items-center justify-center h-full">
              <iframe
                src={fileUrl}
                className="w-full h-full border-0 rounded"
                title={file?.originalFileName}
                onLoad={handleIframeLoad}
                onError={handleIframeError}
              />
            </div>
          )}

          {!error && isImage && (
            <div className="flex items-center justify-center h-full">
              <img
                src={fileUrl}
                alt={file?.originalFileName}
                className="max-w-full max-h-full object-contain"
                onLoad={() => setLoading(false)}
                onError={() => {
                  setError('Failed to load image')
                  setLoading(false)
                }}
              />
            </div>
          )}

          {!error && !isPDF && !isImage && !loading && (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <svg className="w-20 h-20 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">Preview not available</h3>
                <p className="text-gray-500">This file type cannot be previewed in the browser.</p>
              </div>
            </div>
          )}
        </div>

        {/* Footer Info */}
        <div className="flex items-center justify-between p-4 border-t border-gray-200 bg-gray-50">
          <div className="text-sm text-gray-600">
            {isPDF && !error && <span>Use your browser's PDF controls to zoom and navigate</span>}
            {isImage && !error && <span>Image preview</span>}
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-medium transition-colors text-sm"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}

export default FilePreviewModal
