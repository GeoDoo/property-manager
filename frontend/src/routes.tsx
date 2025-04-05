import { RouteObject } from 'react-router-dom';
import { ScrollRestoration, Outlet } from 'react-router-dom';
import PropertyList from './components/Property/PropertyList';
import { PropertyForm } from './components/Property/PropertyForm';
import { PropertyDetails } from './components/Property/PropertyDetails';
import { ROUTES } from './config/routes';
import Login from './components/Login';
import ProtectedRoute from './components/ProtectedRoute';

const RootLayout = () => {
    return (
        <>
            <ScrollRestoration />
            <div>
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
                path: ROUTES.PROPERTIES.LIST,
                element: <PropertyList />
            },
            {
                path: ROUTES.PROPERTIES.NEW,
                element: (
                    <ProtectedRoute requireAdmin>
                        <PropertyForm />
                    </ProtectedRoute>
                )
            },
            {
                path: ROUTES.PROPERTIES.DETAILS(':id'),
                element: <PropertyDetails />
            },
            {
                path: ROUTES.PROPERTIES.EDIT(':id'),
                element: (
                    <ProtectedRoute requireAdmin>
                        <PropertyForm />
                    </ProtectedRoute>
                )
            },
            {
                path: '/login',
                element: <Login />
            }
        ]
    }
]; 