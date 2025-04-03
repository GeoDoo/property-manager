import { RouteObject } from 'react-router-dom';
import { ScrollRestoration, Outlet } from 'react-router-dom';
import PropertyList from './components/Property/PropertyList';
import { PropertyForm } from './components/Property/PropertyForm';
import { PropertyDetails } from './components/Property/PropertyDetails';
import { ROUTES } from './config/routes';

const RootLayout = () => {
    return (
        <>
            <ScrollRestoration />
            <div className="container mx-auto px-4 py-8">
                <Outlet />
            </div>
        </>
    );
};

export const routes: RouteObject[] = [
    {
        element: <RootLayout />,
        children: [
            {
                path: '/',
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
        ]
    }
]; 