import { useState, useEffect } from 'react'
import { api } from '../../utils/api'

function FileUploadModal({ onClose, onUpload, loading }) {
  const [selectedFiles, setSelectedFiles] = useState([])
  const [floors, setFloors] = useState([])
  const [designerInitials, setDesignerInitials] = useState([])
  const [users, setUsers] = useState([])
  const [loadingUsers, setLoadingUsers] = useState(true)

  // Fetch users for dropdown
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await api.get('/api/users')
        setUsers(data)
      } catch (error) {
        console.error('Failed to fetch users:', error)
      } finally {
        setLoadingUsers(false)
      }
    }
    fetchUsers()
  }, [])

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files)
    setSelectedFiles(files)
    setFloors(files.map(() => ''))
    setDesignerInitials(files.map(() => ''))
  }

  const handleSubmit = () => {
    if (selectedFiles.length === 0) {
      alert('Please select files')
      return
    }

    // Validate all floors and designer initials are filled
    for (let i = 0; i < selectedFiles.length; i++) {
      if (!floors[i] || floors[i].trim() === '') {
        alert(`Please enter floor for file: ${selectedFiles[i].name}`)
        return
      }
      if (!designerInitials[i] || designerInitials[i].trim() === '') {
        alert(`Please select designer initials for file: ${selectedFiles[i].name}`)
        return
      }
    }

    onUpload(selectedFiles, floors, designerInitials)
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
            <div className="space-y-4 mb-6">
              <h3 className="font-semibold text-gray-700">Files to upload - Enter metadata for each file:</h3>
              {selectedFiles.map((file, index) => (
                <div key={index} className="border-2 border-gray-200 rounded-lg p-4 bg-gray-50">
                  <p className="font-medium text-gray-800 mb-3">{file.name}</p>

                  <div className="grid grid-cols-2 gap-3">
                    {/* Floor Input */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">
                        Floor <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={floors[index]}
                        onChange={(e) => {
                          const newFloors = [...floors]
                          newFloors[index] = e.target.value
                          setFloors(newFloors)
                        }}
                        className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="e.g., Gelijkvloers, Verdieping1"
                        disabled={loading}
                      />
                    </div>

                    {/* Designer Initials Dropdown */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">
                        Designer Initials <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={designerInitials[index]}
                        onChange={(e) => {
                          const newInitials = [...designerInitials]
                          newInitials[index] = e.target.value
                          setDesignerInitials(newInitials)
                        }}
                        className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        disabled={loading || loadingUsers}
                      >
                        <option value="">Select designer...</option>
                        {users.map(user => (
                          <option key={user.id} value={user.username.substring(0, 3).toUpperCase()}>
                            {user.username} ({user.username.substring(0, 3).toUpperCase()})
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
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
              disabled={loading || selectedFiles.length === 0 || loadingUsers}
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
