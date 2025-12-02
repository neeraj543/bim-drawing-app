function ProjectCard({ project }) {
  const { name, description, ownerName, createdAt } = project

  return (
    <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
      <h3 className="text-xl font-bold text-gray-800 mb-2">
        {name}
      </h3>
      <p className="text-gray-600 mb-4 line-clamp-2">
        {description || 'No description'}
      </p>
      <div className="space-y-1 text-sm text-gray-500">
        <p>Owner: {ownerName}</p>
        <p>Created: {new Date(createdAt).toLocaleDateString()}</p>
      </div>
    </div>
  )
}

export default ProjectCard