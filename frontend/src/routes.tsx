import { RouteObject } from 'react-router-dom';
import { PropertyList } from './components/PropertyList';
import { PropertyForm } from './components/PropertyForm';
import { PropertyDetails } from './components/PropertyDetails';

export const routes: RouteObject[] = [
    {
        path: '/',
        element: <PropertyList />
    },
    {
        path: '/property/new',
        element: <PropertyForm />
    },
    {
        path: '/property/:id',
        element: <PropertyDetails />
    },
    {
        path: '/property/:id/edit',
        element: <PropertyForm />
    }
]; 