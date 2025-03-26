import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { PropertyList } from './components/PropertyList';
import { EditProperty } from './components/EditProperty';
import { AddProperty } from './components/AddProperty';
import { PropertyDetails } from './components/PropertyDetails';
import { SearchBar } from './components/SearchBar';

// Create a client
const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <div className="min-h-screen bg-gray-50">
          <SearchBar />
          <Routes>
            <Route path="/" element={<PropertyList />} />
            <Route path="/property/new" element={<AddProperty />} />
            <Route path="/property/:id" element={<PropertyDetails />} />
            <Route path="/property/:id/edit" element={<EditProperty />} />
          </Routes>
        </div>
      </BrowserRouter>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default App;
