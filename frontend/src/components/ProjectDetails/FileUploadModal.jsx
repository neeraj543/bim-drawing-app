import { useState } from 'react'

function FileUploadModal({ onClose, onUpload, loading }) {
  const [selectedFiles, setSelectedFiles] = useState([])
  const [descriptions, setDescriptions] = useState([])

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files)
    setSelectedFiles(files)
    setDescriptions(files.map(() => ''))
  }

  const handleSubmit = () => {
    if (selectedFiles.length === 0) {
      alert('Please select files')
      return
    }
    onUpload(selectedFiles, descriptions)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="bg-linear-to-r from-green-500 to-teal-500 h-2"></div>
        <div className="p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold text-gray-800">Upload PDFs</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700" disabled={loading}>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Select PDF Files</label>
            <input
              type="file"
              accept=".pdf"
              multiple
              onChange={handleFileChange}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg"
              disabled={loading}
            />
          </div>

          {selectedFiles.length > 0 && (
            <div className="space-y-3 mb-6">
              <h3 className="font-semibold text-gray-700">Files to upload:</h3>
              {selectedFiles.map((file, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <p className="font-medium text-gray-800 mb-2">{file.name}</p>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description (optional):
                  </label>
                  <input
                    type="text"
                    value={descriptions[index]}
                    onChange={(e) => {
                      const newDescs = [...descriptions]
                      newDescs[index] = e.target.value
                      setDescriptions(newDescs)
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    placeholder="e.g., Floor Plan Level 1"
                    disabled={loading}
                  />
                </div>
              ))}
            </div>
          )}

          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading || selectedFiles.length === 0}
              className="flex-1 px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all disabled:opacity-50"
            >
              {loading ? 'Uploading...' : `Upload ${selectedFiles.length} File${selectedFiles.length !== 1 ? 's' : ''}`}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FileUploadModal