import { Routes, Route } from 'react-router-dom';
import { PropertyList } from './components/PropertyList';
import { PropertyForm } from './components/PropertyForm';
import { PropertyDetails } from './components/PropertyDetails';

function App() {
    return (
        <div className="min-h-screen bg-gray-100">
            <div className="container mx-auto px-4 py-8">
                <Routes>
                    <Route path="/" element={<PropertyList />} />
                    <Route path="/property/new" element={<PropertyForm />} />
                    <Route path="/property/:id" element={<PropertyDetails />} />
                    <Route path="/property/:id/edit" element={<PropertyForm />} />
                </Routes>
            </div>
        </div>
    );
}

export default App;
