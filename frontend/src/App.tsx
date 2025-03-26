import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { PropertyList } from './components/PropertyList';
import { EditProperty } from './components/EditProperty';
import { AddProperty } from './components/AddProperty';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <div className="min-h-screen bg-gray-100">
          <Routes>
            <Route path="/" element={<PropertyList />} />
            <Route path="/property/new" element={<AddProperty />} />
            <Route path="/property/:id/edit" element={<EditProperty />} />
          </Routes>
        </div>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
