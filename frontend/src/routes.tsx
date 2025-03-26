import { PropertyList } from './components/PropertyList';
import { AddProperty } from './components/AddProperty';

export const routes = [
    {
        path: '/',
        element: <PropertyList />
    },
    {
        path: '/property/new',
        element: <AddProperty />
    }
]; 