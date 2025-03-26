import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { PropertyList } from './components/Property/PropertyList'
import './App.css'

const queryClient = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="container">
        <header>
          <h1>Property Manager</h1>
        </header>
        <main>
          <PropertyList />
        </main>
      </div>
    </QueryClientProvider>
  )
}

export default App
