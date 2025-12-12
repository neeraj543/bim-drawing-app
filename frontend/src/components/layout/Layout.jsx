import Header from './Header'

function Layout({ children }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="w-full px-6 py-8">
        {children}
      </main>
    </div>
  )
}

export default Layout