import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { routes } from './routes';

export function App() {
    const router = createBrowserRouter(routes, {
        future: {
            v7_startTransition: true
        }
    });
    return <RouterProvider router={router} />;
}
