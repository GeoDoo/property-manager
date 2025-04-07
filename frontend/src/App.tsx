import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { routes } from './routes';
import { ErrorBoundary } from './components/ErrorBoundary/ErrorBoundary';

export function App() {
    const router = createBrowserRouter(routes);
    
    return (
        <ErrorBoundary>
            <RouterProvider router={router} />
        </ErrorBoundary>
    );
}
