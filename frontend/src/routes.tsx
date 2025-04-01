import { RouteObject } from 'react-router-dom';
import PropertyList from './components/Property/PropertyList';
import { PropertyForm } from './components/Property/PropertyForm';
import { PropertyDetails } from './components/Property/PropertyDetails';
import { ROUTES } from './config/routes';

export const routes: RouteObject[] = [
    {
        path: ROUTES.HOME,
        element: <PropertyList />
    },
    {
        path: ROUTES.PROPERTIES.NEW,
        element: <PropertyForm />
    },
    {
        path: ROUTES.PROPERTIES.DETAILS(':id'),
        element: <PropertyDetails />
    },
    {
        path: ROUTES.PROPERTIES.EDIT(':id'),
        element: <PropertyForm />
    }
]; 