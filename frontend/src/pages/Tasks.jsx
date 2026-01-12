import { useEffect, useState } from 'react'
import { api } from '../utils/api'
import { useAuth } from '../contexts/AuthContext'

function Tasks() {
  const { isAdmin } = useAuth()
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filterStatus, setFilterStatus] = useState('ALL')
  const [filterPriority, setFilterPriority] = useState('ALL')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [users, setUsers] = useState([])
  const [drawingSets, setDrawingSets] = useState([])

  useEffect(() => {
    fetchTasks()
    if (isAdmin()) {
      fetchUsers()
      fetchDrawingSets()
    }
  }, [])

  const fetchTasks = async () => {
    try {
      setLoading(true)
      const data = await api.get('/api/tasks')
      setTasks(data)
      setError(null)
    } catch (err) {
      setError(err.message)
      setTasks([])
    } finally {
      setLoading(false)
    }
  }

  const fetchUsers = async () => {
    try {
      const data = await api.get('/api/users')
      setUsers(data)
    } catch (err) {
      console.error('Failed to fetch users:', err)
    }
  }

  const fetchDrawingSets = async () => {
    try {
      const projects = await api.get('/api/projects')
      const allDrawingSets = []

      for (const project of projects) {
        const sets = await api.get(`/api/projects/${project.id}/drawing-sets`)
        sets.forEach(set => {
          allDrawingSets.push({
            ...set,
            projectName: project.name
          })
        })
      }

      setDrawingSets(allDrawingSets)
    } catch (err) {
      console.error('Failed to fetch drawing sets:', err)
    }
  }

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm('Are you sure you want to delete this task?')) {
      return
    }

    try {
      await api.delete(`/api/tasks/${taskId}`)
      await fetchTasks()
    } catch (err) {
      setError(err.message)
    }
  }

  const handleUpdateTaskStatus = async (taskId, newStatus) => {
    try {
      await api.put(`/api/tasks/${taskId}`, { status: newStatus })
      await fetchTasks()
    } catch (err) {
      setError(err.message)
    }
  }

  // Filter tasks
  const filteredTasks = tasks.filter(task => {
    const statusMatch = filterStatus === 'ALL' || task.status === filterStatus
    const priorityMatch = filterPriority === 'ALL' || task.priority === filterPriority
    return statusMatch && priorityMatch
  })

  const getStatusColor = (status) => {
    switch (status) {
      case 'TO_DO':
        return 'bg-gray-100 text-gray-700'
      case 'IN_PROGRESS':
        return 'bg-blue-100 text-blue-700'
      case 'DONE':
        return 'bg-green-100 text-green-700'
      default:
        return 'bg-gray-100 text-gray-700'
    }
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'LOW':
        return 'bg-gray-100 text-gray-700'
      case 'MEDIUM':
        return 'bg-yellow-100 text-yellow-700'
      case 'HIGH':
        return 'bg-red-100 text-red-700'
      default:
        return 'bg-gray-100 text-gray-700'
    }
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <svg className="animate-spin h-12 w-12 text-indigo-600 mx-auto mb-4" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p className="text-gray-600">Loading tasks...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-600 text-white rounded-lg p-2">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
            </div>
            <div>
              <h2 className="text-4xl font-bold text-gray-800">
                {isAdmin() ? 'All Tasks' : 'My Tasks'}
              </h2>
              <p className="text-gray-600">Manage and track your tasks</p>
            </div>
          </div>

          {isAdmin() && (
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-all"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Create Task
            </button>
          )}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow border border-gray-200 p-4 mb-6">
        <div className="flex gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="ALL">All</option>
              <option value="TO_DO">To Do</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="DONE">Done</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="ALL">All</option>
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
            </select>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-lg mb-6">
          <div className="flex items-center gap-3">
            <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-red-700 font-medium">Error: {error}</p>
          </div>
        </div>
      )}

      {filteredTasks.length === 0 ? (
        <div className="bg-white rounded-xl shadow-md p-12 text-center border-2 border-dashed border-gray-300">
          <svg className="w-20 h-20 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No tasks found</h3>
          <p className="text-gray-500">
            {isAdmin() ? 'Create your first task to get started!' : 'No tasks assigned to you yet.'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredTasks.map((task) => (
            <div key={task.id} className="bg-white rounded-lg shadow border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-800 mb-1">{task.title}</h3>
                  <p className="text-sm text-gray-600">{task.description}</p>
                </div>

                {isAdmin() && (
                  <button
                    onClick={() => handleDeleteTask(task.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors ml-4"
                    title="Delete task"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                )}
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                <span className={`px-2 py-1 rounded-lg text-xs font-medium ${getStatusColor(task.status)}`}>
                  {task.status.replace('_', ' ')}
                </span>
                <span className={`px-2 py-1 rounded-lg text-xs font-medium ${getPriorityColor(task.priority)}`}>
                  {task.priority}
                </span>
                {task.dueDate && (
                  <span className="px-2 py-1 rounded-lg text-xs font-medium bg-gray-100 text-gray-700">
                    Due: {new Date(task.dueDate).toLocaleDateString()}
                  </span>
                )}
              </div>

              <div className="flex items-center justify-between text-sm text-gray-600 pt-4 border-t">
                <div>
                  <span className="font-medium">Drawing Set:</span> {task.drawingSetName}
                </div>
                <div>
                  <span className="font-medium">Assigned to:</span> {task.assignedUserName}
                </div>
                <div>
                  <span className="font-medium">Created by:</span> {task.createdByName}
                </div>
              </div>

              {!isAdmin() && (
                <div className="mt-4 pt-4 border-t">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Update Status:</label>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleUpdateTaskStatus(task.id, 'TO_DO')}
                      disabled={task.status === 'TO_DO'}
                      className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      To Do
                    </button>
                    <button
                      onClick={() => handleUpdateTaskStatus(task.id, 'IN_PROGRESS')}
                      disabled={task.status === 'IN_PROGRESS'}
                      className="px-3 py-1 text-sm bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      In Progress
                    </button>
                    <button
                      onClick={() => handleUpdateTaskStatus(task.id, 'DONE')}
                      disabled={task.status === 'DONE'}
                      className="px-3 py-1 text-sm bg-green-100 hover:bg-green-200 text-green-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      Done
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {showCreateModal && (
        <CreateTaskModal
          onClose={() => setShowCreateModal(false)}
          onTaskCreated={() => {
            fetchTasks()
            setShowCreateModal(false)
          }}
          users={users}
          drawingSets={drawingSets}
        />
      )}
    </div>
  )
}

function CreateTaskModal({ onClose, onTaskCreated, users, drawingSets }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'MEDIUM',
    dueDate: '',
    drawingSetId: '',
    assignedUserId: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)

    if (!formData.title.trim()) {
      setError('Title is required')
      return
    }
    if (!formData.drawingSetId) {
      setError('Please select a drawing set')
      return
    }
    if (!formData.assignedUserId) {
      setError('Please select a user to assign')
      return
    }

    try {
      setLoading(true)
      await api.post('/api/tasks', {
        ...formData,
        drawingSetId: parseInt(formData.drawingSetId),
        assignedUserId: parseInt(formData.assignedUserId)
      })
      onTaskCreated()
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-800">Create New Task</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Task title"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              rows="3"
              placeholder="Task description"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
              <input
                type="date"
                value={formData.dueDate}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Drawing Set <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.drawingSetId}
              onChange={(e) => setFormData({ ...formData, drawingSetId: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">Select a drawing set</option>
              {drawingSets.map((set) => (
                <option key={set.id} value={set.id}>
                  {set.projectName} - {set.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Assign To <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.assignedUserId}
              onChange={(e) => setFormData({ ...formData, assignedUserId: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">Select a user</option>
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.fullName || user.username} ({user.role})
                </option>
              ))}
            </select>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg disabled:bg-gray-400 transition-colors"
            >
              {loading ? 'Creating...' : 'Create Task'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium rounded-lg transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Tasks
