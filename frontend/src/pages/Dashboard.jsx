import { useEffect, useState } from 'react'
import ProjectCard from '../components/ProjectCard'

function Dashboard() {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchProjects()
  }, [])

  const fetchProjects = async () => {
    try {
      setLoading(true)
      const response = await fetch('http://localhost:8080/api/projects')

      if (!response.ok) {
        throw new Error('Failed to fetch projects')
      }

      const data = await response.json()
      setProjects(data)
      setError(null)
    } catch (err) {
      setError(err.message)
      setProjects([])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-6xl mx-auto">
      <h2 className="text-3xl font-bold text-gray-800 mb-8">Projects</h2>

      {loading && <p className="text-gray-600">Loading projects...</p>}

      {error && (
        <p className="text-red-600 bg-red-50 p-4 rounded">
          Error: {error}
        </p>
      )}

      {!loading && !error && projects.length === 0 && (
        <p className="text-gray-600">No projects yet. Create one to get started!</p>
      )}

      {!loading && !error && projects.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}
    </div>
  )
}

export default Dashboard