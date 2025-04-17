import { RouteObject } from 'react-router-dom';
import { ScrollRestoration, Outlet, Link } from 'react-router-dom';
import PropertyList from './components/Property/PropertyList';
import { PropertyForm } from './components/Property/PropertyForm';
import { PropertyDetails } from './components/Property/PropertyDetails';
import { ROUTES } from './config/routes';
import Login from './components/Login';
import ProtectedRoute from './components/ProtectedRoute';
import { withErrorBoundary } from './components/ErrorBoundary/withErrorBoundary';
import { Layout } from './components/Layout/Layout';

const RootLayout = () => {
    return (
        <>
            <ScrollRestoration />
            <Layout>
                <Outlet />
            </Layout>
        </>
    );
};

// Wrap components with custom error boundaries
const PropertyListWithError = withErrorBoundary(PropertyList, {
    title: "Unable to Load Properties",
    message: "We couldn't load the property listings. Please try again later.",
});

const PropertyFormWithError = withErrorBoundary(PropertyForm, {
    title: "Form Error",
    message: "There was a problem with the property form. Please try again.",
    customActions: (
        <Link
            to={ROUTES.PROPERTIES.LIST}
            className="block w-full bg-white text-gray-700 border-2 border-gray-300 px-4 py-2 rounded-xl hover:border-gray-400 transition-colors"
        >
            Back to Properties
        </Link>
    )
});

const PropertyDetailsWithError = withErrorBoundary(PropertyDetails, {
    title: "Property Not Found",
    message: "We couldn't load this property's details. It may have been removed or you may not have permission to view it.",
    customActions: (
        <Link
            to={ROUTES.PROPERTIES.LIST}
            className="block w-full bg-white text-gray-700 border-2 border-gray-300 px-4 py-2 rounded-xl hover:border-gray-400 transition-colors"
        >
            View All Properties
        </Link>
    )
});

const LoginWithError = withErrorBoundary(Login, {
    title: "Login Error",
    message: "There was a problem with the login process. Please try again.",
    showHome: false
});

export const routes: RouteObject[] = [
    {
        element: <RootLayout />,
        children: [
            {
                path: '/',
                element: <PropertyListWithError />
            },
            {
                path: ROUTES.PROPERTIES.LIST,
                element: <PropertyListWithError />
            },
            {
                path: ROUTES.PROPERTIES.NEW,
                element: (
                    <ProtectedRoute requireAdmin>
                        <PropertyFormWithError />
                    </ProtectedRoute>
                )
            },
            {
                path: ROUTES.PROPERTIES.DETAILS(':id'),
                element: <PropertyDetailsWithError />
            },
            {
                path: ROUTES.PROPERTIES.EDIT(':id'),
                element: (
                    <ProtectedRoute requireAdmin>
                        <PropertyFormWithError />
                    </ProtectedRoute>
                )
            },
            {
                path: '/login',
                element: <LoginWithError />
            }
        ]
    }
]; 