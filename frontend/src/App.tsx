import { Routes, Route } from 'react-router-dom';
import { PropertyList } from './components/PropertyList';
import { PropertyForm } from './components/PropertyForm';
import { PropertyDetails } from './components/PropertyDetails';
import { PropertyEdit } from './components/PropertyEdit';

function App() {
    return (
        <div className="min-h-screen bg-gray-100">
            <Routes>
                <Route path="/" element={<PropertyList />} />
                <Route path="/property/new" element={<PropertyForm />} />
                <Route path="/property/:id" element={<PropertyDetails />} />
                <Route path="/property/:id/edit" element={<PropertyEdit />} />
            </Routes>
        </div>
    );
}

export default App;
