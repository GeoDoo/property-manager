import { Routes, Route } from 'react-router-dom';
import { PropertyList } from './components/PropertyList';
import { AddProperty } from './components/AddProperty';

export default function App() {
    return (
        <Routes>
            <Route path="/" element={<PropertyList />} />
            <Route path="/property/new" element={<AddProperty />} />
        </Routes>
    );
}
