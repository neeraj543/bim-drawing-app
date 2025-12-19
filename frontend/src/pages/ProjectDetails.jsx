import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { EditModal, CreateDrawingSetModal, DeleteDialog } from '../components/ProjectDetails/Modals'
import DrawingSetCard from '../components/ProjectDetails/DrawingSetCard'

function ProjectDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [project, setProject] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [drawingSets, setDrawingSets] = useState([])
  const [showCreateSetModal, setShowCreateSetModal] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    fetchProject()
    fetchDrawingSets()
  }, [id])

  const fetchProject = async () => {
    try {
      setLoading(true)
      const response = await fetch(`http://localhost:8080/api/projects/${id}`)

      if (!response.ok) {
        throw new Error('Failed to fetch project')
      }

      const data = await response.json()
      setProject(data)
      setError(null)
    } catch (err) {
      setError(err.message)
      setProject(null)
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateProject = async (updatedData) => {
    try {
      const response = await fetch(`http://localhost:8080/api/projects/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedData)
      })

      if (!response.ok) {
        throw new Error('Failed to update project')
      }

      await fetchProject()
      setShowEditModal(false)
    } catch (err) {
      throw new Error(err.message)
    }
  }

  const handleDeleteProject = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/projects/${id}`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        throw new Error('Failed to delete project')
      }

      navigate('/dashboard')
    } catch (err) {
      setError(err.message)
      setShowDeleteDialog(false)
    }
  }

  const fetchDrawingSets = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/projects/${id}/drawing-sets`)
      if (response.ok) {
        const data = await response.json()
        setDrawingSets(data)
      }
    } catch (err) {
      console.error('Failed to fetch drawing sets:', err)
    }
  }

  const handleCreateDrawingSet = async (setData) => {
    try {
      const response = await fetch(`http://localhost:8080/api/projects/${id}/drawing-sets`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...setData, projectId: parseInt(id) })
      })

      if (!response.ok) throw new Error('Failed to create drawing set')

      await fetchDrawingSets()
      setShowCreateSetModal(false)
    } catch (err) {
      throw new Error(err.message)
    }
  }

  // Filter drawing sets based on search query
  const filteredDrawingSets = drawingSets.filter(set => {
    const searchLower = searchQuery.toLowerCase()
    return (
      set.name.toLowerCase().includes(searchLower) ||
      (set.description && set.description.toLowerCase().includes(searchLower))
    )
  })

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <svg className="animate-spin h-12 w-12 text-indigo-600 mx-auto mb-4" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p className="text-gray-600">Loading project details...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto">
        <button
          onClick={() => navigate('/dashboard')}
          className="mb-6 flex items-center gap-2 text-indigo-600 hover:text-indigo-700 font-medium"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Projects
        </button>
        <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-lg">
          <div className="flex items-center gap-3">
            <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-red-700 font-medium">Error: {error}</p>
          </div>
        </div>
      </div>
    )
  }

  if (!project) {
    return null
  }

  return (
    <div>
      {/* Back Button */}
      <button
        onClick={() => navigate('/dashboard')}
        className="mb-6 flex items-center gap-2 text-indigo-600 hover:text-indigo-700 font-medium transition-colors"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to Projects
      </button>

      {/* Project Header */}
      <div className="bg-white rounded-lg shadow border border-gray-200 mb-6">
        <div className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">{project.name}</h1>
              <p className="text-sm text-gray-500 mt-1">Project ID: #{project.id}</p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <button
                onClick={() => setShowEditModal(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-sm bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-all"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Edit
              </button>
              <button
                onClick={() => setShowDeleteDialog(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-sm bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-all"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Delete
              </button>
            </div>
          </div>

          {/* Project Info - Compact */}
          <div className="flex flex-wrap gap-6 text-sm text-gray-600 mt-4 pt-4 border-t">
            <div>
              <span className="font-medium">Owner:</span> {project.ownerName}
            </div>
            <div>
              <span className="font-medium">Created:</span> {new Date(project.createdAt).toLocaleDateString()}
            </div>
            <div>
              <span className="font-medium">Updated:</span> {new Date(project.updatedAt).toLocaleDateString()}
            </div>
          </div>

          {/* Description Section */}
          {project.description && (
            <div className="mt-4">
              <p className="text-sm text-gray-600">{project.description}</p>
            </div>
          )}
        </div>
      </div>

      {/* Drawing Sets Section */}
      <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-800">Drawing Sets</h2>
          <button
            onClick={() => setShowCreateSetModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-all"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            New Set
          </button>
        </div>

        {/* Search Bar for Drawing Sets */}
        {drawingSets.length > 0 && (
          <div className="mb-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search drawing sets..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="block w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg bg-gray-50 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent focus:bg-white"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          </div>
        )}

        {drawingSets.length === 0 ? (
          <div className="text-center py-8 bg-gray-50 rounded-lg border border-dashed border-gray-300">
            <p className="text-gray-600 text-sm">No drawing sets yet</p>
            <p className="text-gray-500 text-xs mt-1">Create your first drawing set to upload PDFs</p>
          </div>
        ) : filteredDrawingSets.length === 0 ? (
          <div className="text-center py-8 bg-gray-50 rounded-lg border border-dashed border-gray-300">
            <svg className="w-12 h-12 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <p className="text-gray-600 text-sm">No drawing sets found</p>
            <p className="text-gray-500 text-xs mt-1">Try adjusting your search query</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredDrawingSets.map(set => (
              <DrawingSetCard key={set.id} set={set} onRefresh={fetchDrawingSets} />
            ))}
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {showEditModal && <EditModal project={project} onClose={() => setShowEditModal(false)} onSave={handleUpdateProject} />}

      {/* Create Drawing Set Modal */}
      {showCreateSetModal && <CreateDrawingSetModal onClose={() => setShowCreateSetModal(false)} onSave={handleCreateDrawingSet} />}

      {/* Delete Confirmation Dialog */}
      {showDeleteDialog && <DeleteDialog onClose={() => setShowDeleteDialog(false)} onConfirm={handleDeleteProject} projectName={project.name} />}
    </div>
  )
}

export default ProjectDetails