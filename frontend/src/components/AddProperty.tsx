import { useNavigate } from 'react-router-dom';
import { PropertyForm } from './PropertyForm';
import { Button } from './Button';

export function AddProperty() {
    const navigate = useNavigate();

    return (
        <div className="container mx-auto p-4">
            <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold">Add New Property</h1>
                    <Button variant="secondary" onClick={() => navigate('/')}>Back</Button>
                </div>
                <PropertyForm onClose={() => navigate('/')} />
            </div>
        </div>
    );
} 