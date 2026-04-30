const fs = require('fs')

function transform(path, fn) {
  let c = fs.readFileSync(path, 'utf8')
  const crlf = c.includes('\r\n')
  if (crlf) c = c.replace(/\r\n/g, '\n')
  let result = fn(c)
  if (crlf) result = result.replace(/\n/g, '\r\n')
  fs.writeFileSync(path, result, 'utf8')
  console.log('done:', path)
}

// ── Login.jsx ──────────────────────────────────────────────────────────
transform('frontend/src/pages/Login.jsx', c => c
  .replace(
    `import { useAuth } from '../contexts/AuthContext'`,
    `import { useAuth } from '../contexts/AuthContext'\nimport { useLang } from '../contexts/LanguageContext'`
  )
  .replace(
    `  const [loading, setLoading] = useState(false)`,
    `  const [loading, setLoading] = useState(false)\n  const { t } = useLang()`
  )
  .replace(`setError('Invalid username or password.')`, `setError(t.login.invalidCreds)`)
  .replace(`>Welcome Back</h2>`, `>{t.login.welcomeBack}</h2>`)
  .replace(`>Sign in to your BIM Drawing App account</p>`, `>{t.login.subtitle}</p>`)
  .replace(
    `              <label htmlFor="username" className="block text-sm font-semibold text-gray-700 mb-2">\n                Username\n              </label>`,
    `              <label htmlFor="username" className="block text-sm font-semibold text-gray-700 mb-2">\n                {t.login.username}\n              </label>`
  )
  .replace(`placeholder="Enter your username"`, `placeholder={t.login.usernamePlaceholder}`)
  .replace(
    `              <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">\n                Password\n              </label>`,
    `              <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">\n                {t.login.password}\n              </label>`
  )
  .replace(`placeholder="Enter your password"`, `placeholder={t.login.passwordPlaceholder}`)
  .replace(`<span className="ml-2 text-sm text-gray-600">Remember me</span>`, `<span className="ml-2 text-sm text-gray-600">{t.login.rememberMe}</span>`)
  .replace(`                  Signing in...\n                </span>`, `                  {t.login.signingIn}\n                </span>`)
  .replace(`                'Sign In'`, `                t.login.signIn`)
)

// ── Projects.jsx ───────────────────────────────────────────────────────
transform('frontend/src/pages/Projects.jsx', c => c
  .replace(
    `import { api } from '../utils/api'`,
    `import { api } from '../utils/api'\nimport { useLang } from '../contexts/LanguageContext'`
  )
  .replace(
    `  const [searchQuery, setSearchQuery] = useState('')`,
    `  const [searchQuery, setSearchQuery] = useState('')\n  const { t } = useLang()`
  )
  .replace(`          <h1 className="text-2xl font-bold text-gray-900">Projects</h1>`, `          <h1 className="text-2xl font-bold text-gray-900">{t.nav.projects}</h1>`)
  .replace(`          <p className="text-sm text-gray-400">Manage and organize your BIM projects</p>`, `          <p className="text-sm text-gray-400">{t.projects.subtitle}</p>`)
  .replace(`              placeholder="Search projects by name or description..."`, `              placeholder={t.projects.searchPlaceholder}`)
  .replace(`          <p className="text-gray-500 font-medium">No projects yet</p>`, `          <p className="text-gray-500 font-medium">{t.projects.noProjects}</p>`)
  .replace(`          <p className="text-gray-400 text-sm mt-1">Create your first project using the form above</p>`, `          <p className="text-gray-400 text-sm mt-1">{t.projects.noProjectsHint}</p>`)
  .replace(`          <p className="text-gray-500 font-medium">No projects found</p>`, `          <p className="text-gray-500 font-medium">{t.projects.noResults}</p>`)
  .replace(`          <p className="text-gray-400 text-sm mt-1">Try a different search term</p>`, `          <p className="text-gray-400 text-sm mt-1">{t.projects.noResultsHint}</p>`)
  .replace(`            {searchQuery ? 'Results' : 'All projects'} ({filteredProjects.length})`, `            {searchQuery ? t.projects.results : t.projects.allProjects} ({filteredProjects.length})`)
)

// ── Home.jsx ───────────────────────────────────────────────────────────
transform('frontend/src/pages/Home.jsx', c => c
  .replace(
    `import { useAuth } from '../contexts/AuthContext'`,
    `import { useAuth } from '../contexts/AuthContext'\nimport { useLang } from '../contexts/LanguageContext'`
  )
  .replace(
    `  const { isAuthenticated } = useAuth()`,
    `  const { isAuthenticated } = useAuth()\n  const { t } = useLang()`
  )
  .replace(
    `            Pioneering CLT Construction\n          </h1>`,
    `            {t.home.pioneering}\n          </h1>`
  )
  .replace(
    `            Building the Future with Cross Laminated Timber\n          </p>`,
    `            {t.home.buildingFuture}\n          </p>`
  )
  .replace(
    `            Get Started\n            <svg`,
    `            {t.home.getStarted}\n            <svg`
  )
  .replace(`        <h2 className="text-3xl font-bold text-gray-900 text-center mb-4">Why Choose CLT Construction?</h2>`, `        <h2 className="text-3xl font-bold text-gray-900 text-center mb-4">{t.home.whyClt}</h2>`)
  .replace(`            <h3 className="text-xl font-bold text-gray-900 mb-3">Ecological</h3>`, `            <h3 className="text-xl font-bold text-gray-900 mb-3">{t.home.ecological}</h3>`)
  .replace(`            <h3 className="text-xl font-bold text-gray-900 mb-3">Reliable</h3>`, `            <h3 className="text-xl font-bold text-gray-900 mb-3">{t.home.reliable}</h3>`)
  .replace(`            <h3 className="text-xl font-bold text-gray-900 mb-3">Energy Efficient</h3>`, `            <h3 className="text-xl font-bold text-gray-900 mb-3">{t.home.energyEfficient}</h3>`)
  .replace(`            <h3 className="text-xl font-bold text-gray-900 mb-3">Speed</h3>`, `            <h3 className="text-xl font-bold text-gray-900 mb-3">{t.home.speed}</h3>`)
  .replace(`            <h3 className="text-xl font-bold text-gray-900 mb-3">Precision</h3>`, `            <h3 className="text-xl font-bold text-gray-900 mb-3">{t.home.precision}</h3>`)
  .replace(`            <h3 className="text-xl font-bold text-gray-900 mb-3">Total Partner</h3>`, `            <h3 className="text-xl font-bold text-gray-900 mb-3">{t.home.totalPartner}</h3>`)
  .replace(`        <h2 className="text-3xl font-bold text-gray-900 text-center mb-6">Building for Tomorrow</h2>`, `        <h2 className="text-3xl font-bold text-gray-900 text-center mb-6">{t.home.buildingTomorrow}</h2>`)
  .replace(`        <h2 className="text-4xl font-bold mb-4">Ready to Build with CLT?</h2>`, `        <h2 className="text-4xl font-bold mb-4">{t.home.readyToBuild}</h2>`)
  .replace(
    `            Access Platform\n            <svg`,
    `            {t.home.accessPlatform}\n            <svg`
  )
)

// ── UserManagement.jsx ─────────────────────────────────────────────────
transform('frontend/src/pages/UserManagement.jsx', c => c
  .replace(
    `import { api } from '../utils/api';`,
    `import { api } from '../utils/api';\nimport { useLang } from '../contexts/LanguageContext';`
  )
  .replace(
    `  const { user: currentUser } = useAuth();`,
    `  const { user: currentUser } = useAuth();\n  const { t } = useLang();`
  )
  .replace(`if (!window.confirm('Are you sure you want to delete this user?'))`, `if (!window.confirm(t.users.deleteConfirm))`)
  .replace(
    `      <div className="text-gray-500">Loading users...</div>`,
    `      <div className="text-gray-500">{t.users.loading}</div>`
  )
  .replace(`            <h1 className="text-3xl font-bold text-gray-800">User Management</h1>`, `            <h1 className="text-3xl font-bold text-gray-800">{t.users.title}</h1>`)
  .replace(`            <p className="text-gray-600 mt-1">Manage developers and administrators</p>`, `            <p className="text-gray-600 mt-1">{t.users.subtitle}</p>`)
  .replace(`            + Add User`, `            {t.users.addUser}`)
  .replace(`                  User\n                </th>`, `                  {t.users.colUser}\n                </th>`)
  .replace(`                  Email\n                </th>\n                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">\n                  Role`, `                  {t.users.colEmail}\n                </th>\n                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">\n                  {t.users.colRole}`)
  .replace(`                  Created\n                </th>`, `                  {t.users.colCreated}\n                </th>`)
  .replace(`                  Actions\n                </th>`, `                  {t.users.colActions}\n                </th>`)
  .replace(
    `                      <button\n                        onClick={() => handleDeleteUser(user.id)}\n                        className="text-red-600 hover:text-red-900 transition-colors"\n                      >\n                        Delete\n                      </button>`,
    `                      <button\n                        onClick={() => handleDeleteUser(user.id)}\n                        className="text-red-600 hover:text-red-900 transition-colors"\n                      >\n                        {t.users.delete}\n                      </button>`
  )
  .replace(`            No users found.\n          </div>`, `            {t.users.noUsers}\n          </div>`)
  .replace(`            <h2 className="text-2xl font-bold text-gray-800 mb-4">Add New User</h2>`, `            <h2 className="text-2xl font-bold text-gray-800 mb-4">{t.users.addNewUser}</h2>`)
  .replace(`                <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>`, `                <label className="block text-sm font-medium text-gray-700 mb-1">{t.users.username}</label>`)
  .replace(`                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>`, `                <label className="block text-sm font-medium text-gray-700 mb-1">{t.users.password}</label>`)
  .replace(`                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>`, `                <label className="block text-sm font-medium text-gray-700 mb-1">{t.users.email}</label>`)
  .replace(`                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>`, `                <label className="block text-sm font-medium text-gray-700 mb-1">{t.users.fullName}</label>`)
  .replace(`                <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>`, `                <label className="block text-sm font-medium text-gray-700 mb-1">{t.users.role}</label>`)
  .replace(`                  <option value="USER">Developer (USER)</option>`, `                  <option value="USER">{t.users.roleDeveloper}</option>`)
  .replace(`                  <option value="ADMIN">Administrator (ADMIN)</option>`, `                  <option value="ADMIN">{t.users.roleAdmin}</option>`)
  .replace(`                  {submitting ? 'Creating...' : 'Create User'}`, `                  {submitting ? t.users.creating : t.users.createUser}`)
  .replace(
    `                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 rounded-lg font-medium transition-colors"\n                >\n                  Cancel`,
    `                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 rounded-lg font-medium transition-colors"\n                >\n                  {t.users.cancel}`
  )
)

// ── ProjectDetails.jsx ─────────────────────────────────────────────────
transform('frontend/src/pages/ProjectDetails.jsx', c => c
  .replace(
    `import { api } from '../utils/api'`,
    `import { api } from '../utils/api'\nimport { useLang } from '../contexts/LanguageContext'`
  )
  .replace(
    `  const [searchQuery, setSearchQuery] = useState('')`,
    `  const [searchQuery, setSearchQuery] = useState('')\n  const { t } = useLang()`
  )
  .replace(`            <p className="text-gray-600">Loading project details...</p>`, `            <p className="text-gray-600">{t.projectDetails.loading}</p>`)
  .replace(/Back to Projects/g, `{t.projectDetails.backToProjects}`)
  .replace(
    `                Edit\n              </button>`,
    `                {t.projectDetails.edit}\n              </button>`
  )
  .replace(
    `                Delete\n              </button>`,
    `                {t.projectDetails.delete}\n              </button>`
  )
  .replace(`<span className="font-medium">Owner:</span>`, `<span className="font-medium">{t.projectDetails.owner}</span>`)
  .replace(`<span className="font-medium">Created:</span>`, `<span className="font-medium">{t.projectDetails.created}</span>`)
  .replace(`<span className="font-medium">Updated:</span>`, `<span className="font-medium">{t.projectDetails.updated}</span>`)
  .replace(`          <h2 className="text-xl font-bold text-gray-800">Drawing Sets</h2>`, `          <h2 className="text-xl font-bold text-gray-800">{t.projectDetails.drawingSets}</h2>`)
  .replace(
    `            New Set\n          </button>`,
    `            {t.projectDetails.newSet}\n          </button>`
  )
  .replace(`              placeholder="Search drawing sets..."`, `              placeholder={t.projectDetails.searchPlaceholder}`)
  .replace(`            <p className="text-gray-600 text-sm">No drawing sets yet</p>`, `            <p className="text-gray-600 text-sm">{t.projectDetails.noSets}</p>`)
  .replace(`            <p className="text-gray-500 text-xs mt-1">Create your first drawing set to upload PDFs</p>`, `            <p className="text-gray-500 text-xs mt-1">{t.projectDetails.noSetsHint}</p>`)
  .replace(`            <p className="text-gray-600 text-sm">No drawing sets found</p>`, `            <p className="text-gray-600 text-sm">{t.projectDetails.noSetsFound}</p>`)
  .replace(`            <p className="text-gray-500 text-xs mt-1">Try adjusting your search query</p>`, `            <p className="text-gray-500 text-xs mt-1">{t.projectDetails.noSetsFoundHint}</p>`)
)

// ── Tasks.jsx ──────────────────────────────────────────────────────────
transform('frontend/src/pages/Tasks.jsx', c => c
  .replace(
    `import { useAuth } from '../contexts/AuthContext'`,
    `import { useAuth } from '../contexts/AuthContext'\nimport { useLang } from '../contexts/LanguageContext'`
  )
  // Tasks component hook
  .replace(
    `  const { isAdmin } = useAuth()\n  const [tasks`,
    `  const { isAdmin } = useAuth()\n  const { t } = useLang()\n  const [tasks`
  )
  // CreateTaskModal hook
  .replace(
    `  const [loading, setLoading] = useState(false)\n  const [error, setError] = useState(null)\n\n  const handleSubmit`,
    `  const { t } = useLang()\n  const [loading, setLoading] = useState(false)\n  const [error, setError] = useState(null)\n\n  const handleSubmit`
  )
  .replace(`if (!window.confirm('Are you sure you want to delete this task?'))`, `if (!window.confirm(t.tasks.deleteConfirm))`)
  .replace(`            <p className="text-gray-600">Loading tasks...</p>`, `            <p className="text-gray-600">{t.tasks.loading}</p>`)
  .replace(`                {isAdmin() ? 'All Tasks' : 'My Tasks'}`, `                {isAdmin() ? t.tasks.allTasks : t.tasks.myTasks}`)
  .replace(`              <p className="text-gray-600">Manage and track your tasks</p>`, `              <p className="text-gray-600">{t.tasks.subtitle}</p>`)
  .replace(
    `              Create Task\n            </button>`,
    `              {t.tasks.createTask}\n            </button>`
  )
  .replace(`            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>`, `            <label className="block text-sm font-medium text-gray-700 mb-1">{t.tasks.status}</label>`)
  .replace(`            <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>\n            <select\n              value={filterPriority}`, `            <label className="block text-sm font-medium text-gray-700 mb-1">{t.tasks.priority}</label>\n            <select\n              value={filterPriority}`)
  .replace(
    `              <option value="ALL">All</option>\n              <option value="TO_DO">To Do</option>\n              <option value="IN_PROGRESS">In Progress</option>\n              <option value="DONE">Done</option>`,
    `              <option value="ALL">{t.tasks.all}</option>\n              <option value="TO_DO">{t.tasks.todo}</option>\n              <option value="IN_PROGRESS">{t.tasks.inProgress}</option>\n              <option value="DONE">{t.tasks.done}</option>`
  )
  .replace(
    `              <option value="ALL">All</option>\n              <option value="LOW">Low</option>\n              <option value="MEDIUM">Medium</option>\n              <option value="HIGH">High</option>`,
    `              <option value="ALL">{t.tasks.all}</option>\n              <option value="LOW">{t.tasks.low}</option>\n              <option value="MEDIUM">{t.tasks.medium}</option>\n              <option value="HIGH">{t.tasks.high}</option>`
  )
  .replace(`          <h3 className="text-xl font-semibold text-gray-700 mb-2">No tasks found</h3>`, `          <h3 className="text-xl font-semibold text-gray-700 mb-2">{t.tasks.noTasksFound}</h3>`)
  .replace(`            {isAdmin() ? 'Create your first task to get started!' : 'No tasks assigned to you yet.'}`, `            {isAdmin() ? t.tasks.noTasksAdmin : t.tasks.noTasksUser}`)
  .replace(`                  <span className="font-medium">Drawing Set:</span>`, `                  <span className="font-medium">{t.tasks.drawingSet}</span>`)
  .replace(`                  <span className="font-medium">Assigned to:</span>`, `                  <span className="font-medium">{t.tasks.assignedTo}</span>`)
  .replace(`                  <span className="font-medium">Created by:</span>`, `                  <span className="font-medium">{t.tasks.createdBy}</span>`)
  .replace(`                  <label className="block text-sm font-medium text-gray-700 mb-2">Update Status:</label>`, `                  <label className="block text-sm font-medium text-gray-700 mb-2">{t.tasks.updateStatus}</label>`)
  .replace(
    `                      To Do\n                    </button>`,
    `                      {t.tasks.todo}\n                    </button>`
  )
  .replace(
    `                      In Progress\n                    </button>`,
    `                      {t.tasks.inProgress}\n                    </button>`
  )
  .replace(
    `                      Done\n                    </button>`,
    `                      {t.tasks.done}\n                    </button>`
  )
  // CreateTaskModal strings
  .replace(`          <h2 className="text-2xl font-bold text-gray-800">Create New Task</h2>`, `          <h2 className="text-2xl font-bold text-gray-800">{t.tasks.createNewTask}</h2>`)
  .replace(`    if (!formData.title.trim()) {\n      setError('Title is required')`, `    if (!formData.title.trim()) {\n      setError(t.tasks.titleRequired)`)
  .replace(`    if (!formData.drawingSetId) {\n      setError('Please select a drawing set')`, `    if (!formData.drawingSetId) {\n      setError(t.tasks.drawingSetRequired)`)
  .replace(`    if (!formData.assignedUserId) {\n      setError('Please select a user to assign')`, `    if (!formData.assignedUserId) {\n      setError(t.tasks.userRequired)`)
  .replace(
    `            <label className="block text-sm font-medium text-gray-700 mb-1">\n              Title <span className="text-red-500">*</span>\n            </label>`,
    `            <label className="block text-sm font-medium text-gray-700 mb-1">\n              {t.tasks.titleLabel} <span className="text-red-500">*</span>\n            </label>`
  )
  .replace(`            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>`, `            <label className="block text-sm font-medium text-gray-700 mb-1">{t.tasks.descriptionLabel}</label>`)
  .replace(`              <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>\n              <select\n                value={formData.priority}`, `              <label className="block text-sm font-medium text-gray-700 mb-1">{t.tasks.priority}</label>\n              <select\n                value={formData.priority}`)
  .replace(
    `                <option value="LOW">Low</option>\n                <option value="MEDIUM">Medium</option>\n                <option value="HIGH">High</option>`,
    `                <option value="LOW">{t.tasks.low}</option>\n                <option value="MEDIUM">{t.tasks.medium}</option>\n                <option value="HIGH">{t.tasks.high}</option>`
  )
  .replace(`              <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>`, `              <label className="block text-sm font-medium text-gray-700 mb-1">{t.tasks.dueDateLabel}</label>`)
  .replace(
    `            <label className="block text-sm font-medium text-gray-700 mb-1">\n              Drawing Set <span className="text-red-500">*</span>\n            </label>`,
    `            <label className="block text-sm font-medium text-gray-700 mb-1">\n              {t.tasks.drawingSetLabel} <span className="text-red-500">*</span>\n            </label>`
  )
  .replace(`              <option value="">Select a drawing set</option>`, `              <option value="">{t.tasks.selectDrawingSet}</option>`)
  .replace(
    `            <label className="block text-sm font-medium text-gray-700 mb-1">\n              Assign To <span className="text-red-500">*</span>\n            </label>`,
    `            <label className="block text-sm font-medium text-gray-700 mb-1">\n              {t.tasks.assignToLabel} <span className="text-red-500">*</span>\n            </label>`
  )
  .replace(`              <option value="">Select a user</option>`, `              <option value="">{t.tasks.selectUser}</option>`)
  .replace(`              {loading ? 'Creating...' : 'Create Task'}`, `              {loading ? t.tasks.creating : t.tasks.createTaskBtn}`)
  .replace(
    `            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium rounded-lg transition-colors"\n            >\n              Cancel\n            </button>\n          </div>\n        </form>\n      </div>\n    </div>\n  )\n}\n\nexport default Tasks`,
    `            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium rounded-lg transition-colors"\n            >\n              {t.tasks.cancel}\n            </button>\n          </div>\n        </form>\n      </div>\n    </div>\n  )\n}\n\nexport default Tasks`
  )
)

// ── Timesheet.jsx ──────────────────────────────────────────────────────
transform('frontend/src/pages/Timesheet.jsx', c => c
  .replace(
    `import { useAuth } from '../contexts/AuthContext'`,
    `import { useAuth } from '../contexts/AuthContext'\nimport { useLang } from '../contexts/LanguageContext'`
  )
  // Timesheet hook
  .replace(
    `  const { isAdmin } = useAuth()\n  const [entries`,
    `  const { isAdmin } = useAuth()\n  const { t } = useLang()\n  const [entries`
  )
  // EditEntryModal hook
  .replace(
    `  const [loading, setLoading] = useState(false)\n  const [error, setError] = useState(null)\n\n  // Editable hours`,
    `  const { t } = useLang()\n  const [loading, setLoading] = useState(false)\n  const [error, setError] = useState(null)\n\n  // Editable hours`
  )
  .replace(`    setTimerError('Start the timer first before logging time.')`, `    setTimerError(t.timesheet.startFirst)`)
  .replace(`    if (!window.confirm('Delete this time entry?')) return`, `    if (!window.confirm(t.timesheet.deleteConfirm)) return`)
  .replace(`          <h2 className="text-4xl font-bold text-gray-800">Timesheet</h2>`, `          <h2 className="text-4xl font-bold text-gray-800">{t.timesheet.title}</h2>`)
  .replace(`          <p className="text-gray-600">Track time spent on projects</p>`, `          <p className="text-gray-600">{t.timesheet.subtitle}</p>`)
  .replace(`        <h3 className="text-lg font-semibold text-gray-700 mb-4">Timer</h3>`, `        <h3 className="text-lg font-semibold text-gray-700 mb-4">{t.timesheet.timer}</h3>`)
  .replace(
    `              Start\n            </button>`,
    `              {t.timesheet.start}\n            </button>`
  )
  .replace(
    `              Pause\n            </button>`,
    `              {t.timesheet.pause}\n            </button>`
  )
  .replace(
    `            Reset\n          </button>`,
    `            {t.timesheet.reset}\n          </button>`
  )
  .replace(`            <label className="block text-sm font-medium text-gray-700 mb-1">Project (optional)</label>\n            <select\n              value={timerProjectId}`, `            <label className="block text-sm font-medium text-gray-700 mb-1">{t.timesheet.project}</label>\n            <select\n              value={timerProjectId}`)
  .replace(`              <option value="">No project</option>\n              {projects.map(p => (`, `              <option value="">{t.timesheet.noProject}</option>\n              {projects.map(p => (`)
  .replace(`            <label className="block text-sm font-medium text-gray-700 mb-1">Note (what did you do?)</label>`, `            <label className="block text-sm font-medium text-gray-700 mb-1">{t.timesheet.note}</label>`)
  .replace(
    `          Log Time\n        </button>`,
    `          {t.timesheet.logTime}\n        </button>`
  )
  .replace(`            {isAdmin() ? 'Total logged (all users)' : 'Total logged'}`, `            {isAdmin() ? t.timesheet.totalAll : t.timesheet.totalMe}`)
  .replace(`          <p className="text-gray-500">No time entries yet. Start the timer to log your first entry.</p>`, `          <p className="text-gray-500">{t.timesheet.noEntries}</p>`)
  .replace(`                <th className="text-left px-5 py-3 font-semibold text-gray-600">Date</th>`, `                <th className="text-left px-5 py-3 font-semibold text-gray-600">{t.timesheet.colDate}</th>`)
  .replace(`                {isAdmin() && <th className="text-left px-5 py-3 font-semibold text-gray-600">User</th>}`, `                {isAdmin() && <th className="text-left px-5 py-3 font-semibold text-gray-600">{t.timesheet.colUser}</th>}`)
  .replace(`                <th className="text-left px-5 py-3 font-semibold text-gray-600">Project</th>`, `                <th className="text-left px-5 py-3 font-semibold text-gray-600">{t.timesheet.colProject}</th>`)
  .replace(`                <th className="text-left px-5 py-3 font-semibold text-gray-600">Note</th>`, `                <th className="text-left px-5 py-3 font-semibold text-gray-600">{t.timesheet.colNote}</th>`)
  .replace(`                <th className="text-left px-5 py-3 font-semibold text-gray-600">Duration</th>`, `                <th className="text-left px-5 py-3 font-semibold text-gray-600">{t.timesheet.colDuration}</th>`)
  // EditEntryModal strings
  .replace(`          <h3 className="text-xl font-bold text-gray-800">Edit Time Entry</h3>`, `          <h3 className="text-xl font-bold text-gray-800">{t.timesheet.editTitle}</h3>`)
  .replace(`    if (totalSecs <= 0) {\n      setError('Duration must be greater than 0')`, `    if (totalSecs <= 0) {\n      setError(t.timesheet.durationError)`)
  .replace(`            <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>`, `            <label className="block text-sm font-medium text-gray-700 mb-1">{t.timesheet.duration}</label>`)
  .replace(`            <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>`, `            <label className="block text-sm font-medium text-gray-700 mb-1">{t.timesheet.date}</label>`)
  .replace(`            <label className="block text-sm font-medium text-gray-700 mb-1">Project (optional)</label>\n            <select value={form.projectId}`, `            <label className="block text-sm font-medium text-gray-700 mb-1">{t.timesheet.projectOpt}</label>\n            <select value={form.projectId}`)
  .replace(`              <option value="">No project</option>\n              {projects.map(p => <option`, `              <option value="">{t.timesheet.noProject}</option>\n              {projects.map(p => <option`)
  .replace(`            <label className="block text-sm font-medium text-gray-700 mb-1">Note</label>`, `            <label className="block text-sm font-medium text-gray-700 mb-1">{t.timesheet.noteLabel}</label>`)
  .replace(`              {loading ? 'Saving...' : 'Save'}`, `              {loading ? t.timesheet.saving : t.timesheet.save}`)
  .replace(
    `              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium rounded-lg transition-colors">\n              Cancel\n            </button>`,
    `              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium rounded-lg transition-colors">\n              {t.timesheet.cancel}\n            </button>`
  )
)

// ── CRM.jsx ────────────────────────────────────────────────────────────
transform('frontend/src/pages/CRM.jsx', c => c
  .replace(
    `import { api } from '../utils/api'`,
    `import { api } from '../utils/api'\nimport { useLang } from '../contexts/LanguageContext'`
  )
  // CRM component hook
  .replace(
    `  const [activeTab, setActiveTab] = useState('contacts')`,
    `  const [activeTab, setActiveTab] = useState('contacts')\n  const { t } = useLang()`
  )
  .replace(`          <p className="text-gray-600">Manage contacts and companies</p>`, `          <p className="text-gray-600">{t.crm.subtitle}</p>`)
  .replace(
    `          Contacts\n        </button>`,
    `          {t.crm.contacts}\n        </button>`
  )
  .replace(
    `          Companies\n        </button>`,
    `          {t.crm.companies}\n        </button>`
  )
  // ContactsTab hook
  .replace(
    `  const [showForm, setShowForm] = useState(false)\n\n  useEffect(() => { fetchContacts(); fetchCompanies() }`,
    `  const { t } = useLang()\n  const [showForm, setShowForm] = useState(false)\n\n  useEffect(() => { fetchContacts(); fetchCompanies() }`
  )
  .replace(`    if (!window.confirm('Delete this contact?')) return`, `    if (!window.confirm(t.crm.deleteContactConfirm)) return`)
  .replace(`          placeholder="Search contacts..."`, `          placeholder={t.crm.searchContacts}`)
  .replace(
    `          Add Contact\n        </button>`,
    `          {t.crm.addContact}\n        </button>`
  )
  .replace(`                <th className="text-left px-5 py-3 font-semibold text-gray-600">Name</th>`, `                <th className="text-left px-5 py-3 font-semibold text-gray-600">{t.crm.colName}</th>`)
  .replace(`                <th className="text-left px-5 py-3 font-semibold text-gray-600">Company</th>`, `                <th className="text-left px-5 py-3 font-semibold text-gray-600">{t.crm.colCompany}</th>`)
  .replace(`                <th className="text-left px-5 py-3 font-semibold text-gray-600">Job Title</th>`, `                <th className="text-left px-5 py-3 font-semibold text-gray-600">{t.crm.colJobTitle}</th>`)
  .replace(`                <th className="text-left px-5 py-3 font-semibold text-gray-600">Email</th>`, `                <th className="text-left px-5 py-3 font-semibold text-gray-600">{t.crm.colEmail}</th>`)
  .replace(`                <th className="text-left px-5 py-3 font-semibold text-gray-600">Phone</th>`, `                <th className="text-left px-5 py-3 font-semibold text-gray-600">{t.crm.colPhone}</th>`)
  .replace(`        <EmptyState icon="person" text="No contacts yet. Add your first contact to get started." />`, `        <EmptyState text={t.crm.noContacts} />`)
  // ContactDetailModal hook
  .replace(
    `function ContactDetailModal({ contact, onClose, onEdit, onDelete }) {\n  const sal`,
    `function ContactDetailModal({ contact, onClose, onEdit, onDelete }) {\n  const { t } = useLang()\n  const sal`
  )
  .replace(
    `          <DetailSection label="Contact">\n            {contact.email && <DetailRow icon="email" value={contact.email} />}\n            {contact.phone && <DetailRow icon="phone" label="Phone" value={contact.phone} />}\n            {contact.mobile && <DetailRow icon="mobile" label="Mobile" value={contact.mobile} />}\n            {contact.website && <DetailRow icon="web" value={contact.website} />}\n          </DetailSection>\n\n          {address && (\n            <DetailSection label="Address">`,
    `          <DetailSection label={t.crm.contactSection}>\n            {contact.email && <DetailRow icon="email" value={contact.email} />}\n            {contact.phone && <DetailRow icon="phone" label={t.crm.colPhone} value={contact.phone} />}\n            {contact.mobile && <DetailRow icon="mobile" label={t.crm.mobile} value={contact.mobile} />}\n            {contact.website && <DetailRow icon="web" value={contact.website} />}\n          </DetailSection>\n\n          {address && (\n            <DetailSection label={t.crm.addressSection}>`
  )
  .replace(
    `          {contact.notes && (\n            <DetailSection label="Notes">`,
    `          {contact.notes && (\n            <DetailSection label={t.crm.notesSection}>`
  )
  .replace(
    `          className="flex-1 py-2 bg-amber-600 hover:bg-amber-700 text-white font-medium rounded-lg transition-colors">\n            Edit\n          </button>\n          <button onClick={onDelete}\n            className="px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 font-medium rounded-lg transition-colors">\n            Delete\n          </button>\n          <button onClick={onClose}\n            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors">\n            Close\n          </button>`,
    `          className="flex-1 py-2 bg-amber-600 hover:bg-amber-700 text-white font-medium rounded-lg transition-colors">\n            {t.crm.edit}\n          </button>\n          <button onClick={onDelete}\n            className="px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 font-medium rounded-lg transition-colors">\n            {t.crm.delete}\n          </button>\n          <button onClick={onClose}\n            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors">\n            {t.crm.close}\n          </button>`
  )
  // ContactFormModal hook
  .replace(
    `function ContactFormModal({ contact, companies, onClose, onSaved }) {\n  const [form`,
    `function ContactFormModal({ contact, companies, onClose, onSaved }) {\n  const { t } = useLang()\n  const [form`
  )
  .replace(`    if (!form.lastName.trim()) { setError('Last name is required'); return }`, `    if (!form.lastName.trim()) { setError(t.crm.lastNameRequired); return }`)
  .replace(`          <h3 className="text-xl font-bold text-gray-800">{isEdit ? 'Edit Contact' : 'Add Contact'}</h3>`, `          <h3 className="text-xl font-bold text-gray-800">{isEdit ? t.crm.editContact : t.crm.addContactTitle}</h3>`)
  .replace(`              <label className="block text-xs font-medium text-gray-600 mb-1">Salutation</label>`, `              <label className="block text-xs font-medium text-gray-600 mb-1">{t.crm.salutation}</label>`)
  .replace(`              <label className="block text-xs font-medium text-gray-600 mb-1">First Name</label>`, `              <label className="block text-xs font-medium text-gray-600 mb-1">{t.crm.firstName}</label>`)
  .replace(`              <label className="block text-xs font-medium text-gray-600 mb-1">Last Name <span className="text-red-500">*</span></label>`, `              <label className="block text-xs font-medium text-gray-600 mb-1">{t.crm.lastName} <span className="text-red-500">*</span></label>`)
  .replace(`              <label className="block text-xs font-medium text-gray-600 mb-1">Company</label>\n              <select value={form.companyId}`, `              <label className="block text-xs font-medium text-gray-600 mb-1">{t.crm.company}</label>\n              <select value={form.companyId}`)
  .replace(`                <option value="">No company</option>`, `                <option value="">{t.crm.noCompany}</option>`)
  .replace(`            <label className="block text-xs font-medium text-gray-600 mb-1">Notes</label>\n            <textarea value={form.notes} onChange={set('notes')} rows="3" placeholder="Additional notes..."`, `            <label className="block text-xs font-medium text-gray-600 mb-1">{t.crm.notes}</label>\n            <textarea value={form.notes} onChange={set('notes')} rows="3" placeholder={t.crm.notesPlaceholder}`)
  .replace(
    `              {loading ? 'Saving...' : isEdit ? 'Save Changes' : 'Add Contact'}`,
    `              {loading ? t.crm.saving : isEdit ? t.crm.saveChanges : t.crm.addContactBtn}`
  )
  .replace(
    `              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium rounded-lg transition-colors">\n              Cancel\n            </button>\n          </div>\n        </form>\n      </div>\n    </div>\n  )\n}\n\n/* ─── COMPANIES`,
    `              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium rounded-lg transition-colors">\n              {t.crm.cancel}\n            </button>\n          </div>\n        </form>\n      </div>\n    </div>\n  )\n}\n\n/* ─── COMPANIES`
  )
  // CompaniesTab hook
  .replace(
    `  const [showForm, setShowForm] = useState(false)\n\n  useEffect(() => { fetchCompanies() }`,
    `  const { t } = useLang()\n  const [showForm, setShowForm] = useState(false)\n\n  useEffect(() => { fetchCompanies() }`
  )
  .replace(`    if (!window.confirm('Delete this company?')) return`, `    if (!window.confirm(t.crm.deleteCompanyConfirm)) return`)
  .replace(`          placeholder="Search companies..."`, `          placeholder={t.crm.searchCompanies}`)
  .replace(
    `          Add Company\n        </button>`,
    `          {t.crm.addCompany}\n        </button>`
  )
  .replace(`                <th className="text-left px-5 py-3 font-semibold text-gray-600">Company</th>`, `                <th className="text-left px-5 py-3 font-semibold text-gray-600">{t.crm.colCompany}</th>`)
  .replace(`                <th className="text-left px-5 py-3 font-semibold text-gray-600">City</th>`, `                <th className="text-left px-5 py-3 font-semibold text-gray-600">{t.crm.colCity}</th>`)
  .replace(`                <th className="text-left px-5 py-3 font-semibold text-gray-600">VAT</th>`, `                <th className="text-left px-5 py-3 font-semibold text-gray-600">{t.crm.colVat}</th>`)
  .replace(`        <EmptyState icon="building" text="No companies yet. Add your first company to get started." />`, `        <EmptyState text={t.crm.noCompanies} />`)
  // CompanyDetailModal hook
  .replace(
    `function CompanyDetailModal({ company, onClose, onEdit, onDelete }) {\n  const address`,
    `function CompanyDetailModal({ company, onClose, onEdit, onDelete }) {\n  const { t } = useLang()\n  const address`
  )
  .replace(
    `          <DetailSection label="Contact">\n            {company.email && <DetailRow label="Email" value={company.email} />}\n            {company.phone && <DetailRow label="Phone" value={company.phone} />}\n            {company.website && <DetailRow label="Website" value={company.website} />}\n          </DetailSection>\n\n          {address && (\n            <DetailSection label="Address">`,
    `          <DetailSection label={t.crm.contactSection}>\n            {company.email && <DetailRow label={t.crm.email} value={company.email} />}\n            {company.phone && <DetailRow label={t.crm.colPhone} value={company.phone} />}\n            {company.website && <DetailRow label={t.crm.website} value={company.website} />}\n          </DetailSection>\n\n          {address && (\n            <DetailSection label={t.crm.addressSection}>`
  )
  .replace(
    `          {company.vatNumber && (\n            <DetailSection label="Business">\n              <DetailRow label="VAT" value={company.vatNumber} />`,
    `          {company.vatNumber && (\n            <DetailSection label={t.crm.businessSection}>\n              <DetailRow label={t.crm.colVat} value={company.vatNumber} />`
  )
  .replace(
    `          {company.notes && (\n            <DetailSection label="Notes">`,
    `          {company.notes && (\n            <DetailSection label={t.crm.notesSection}>`
  )
  .replace(
    `          className="flex-1 py-2 bg-amber-600 hover:bg-amber-700 text-white font-medium rounded-lg transition-colors">Edit</button>\n          <button onClick={onDelete}\n            className="px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 font-medium rounded-lg transition-colors">Delete</button>\n          <button onClick={onClose}\n            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors">Close</button>`,
    `          className="flex-1 py-2 bg-amber-600 hover:bg-amber-700 text-white font-medium rounded-lg transition-colors">{t.crm.edit}</button>\n          <button onClick={onDelete}\n            className="px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 font-medium rounded-lg transition-colors">{t.crm.delete}</button>\n          <button onClick={onClose}\n            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors">{t.crm.close}</button>`
  )
  // CompanyFormModal hook
  .replace(
    `function CompanyFormModal({ company, onClose, onSaved }) {\n  const [form`,
    `function CompanyFormModal({ company, onClose, onSaved }) {\n  const { t } = useLang()\n  const [form`
  )
  .replace(`    if (!form.name.trim()) { setError('Company name is required'); return }`, `    if (!form.name.trim()) { setError(t.crm.companyNameRequired); return }`)
  .replace(`          <h3 className="text-xl font-bold text-gray-800">{isEdit ? 'Edit Company' : 'Add Company'}</h3>`, `          <h3 className="text-xl font-bold text-gray-800">{isEdit ? t.crm.editCompany : t.crm.addCompanyTitle}</h3>`)
  .replace(`          <FormField label="Company Name *"`, `          <FormField label={t.crm.companyName}`)
  .replace(`            <FormField label="VAT Number"`, `            <FormField label={t.crm.vatNumber}`)
  .replace(`            <label className="block text-xs font-medium text-gray-600 mb-1">Notes</label>\n            <textarea value={form.notes} onChange={set('notes')} rows="3" placeholder="Additional notes..."`, `            <label className="block text-xs font-medium text-gray-600 mb-1">{t.crm.notes}</label>\n            <textarea value={form.notes} onChange={set('notes')} rows="3" placeholder={t.crm.notesPlaceholder}`)
  .replace(
    `              {loading ? 'Saving...' : isEdit ? 'Save Changes' : 'Add Company'}`,
    `              {loading ? t.crm.saving : isEdit ? t.crm.saveChanges : t.crm.addCompanyBtn}`
  )
  .replace(
    `              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium rounded-lg transition-colors">\n              Cancel\n            </button>\n          </div>\n        </form>\n      </div>\n    </div>\n  )\n}\n\n/* ─── SHARED`,
    `              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium rounded-lg transition-colors">\n              {t.crm.cancel}\n            </button>\n          </div>\n        </form>\n      </div>\n    </div>\n  )\n}\n\n/* ─── SHARED`
  )
)

console.log('\nAll done!')