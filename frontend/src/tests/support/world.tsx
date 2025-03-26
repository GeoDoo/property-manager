import { World, IWorldOptions, setWorldConstructor } from '@cucumber/cucumber';
import { QueryClient } from '@tanstack/react-query';
import { render, cleanup } from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { PropertyList } from '../../components/PropertyList';
import { AddProperty } from '../../components/AddProperty';

class CustomWorld extends World {
    queryClient: QueryClient;
    private router: ReturnType<typeof createMemoryRouter> | null = null;

    constructor(options: IWorldOptions) {
        super(options);
        this.queryClient = new QueryClient({
            defaultOptions: {
                queries: {
                    retry: false,
                }
            }
        });
    }

    async navigateTo(path: string): Promise<void> {
        cleanup();

        const routes = [
            {
                path: '/',
                element: (
                    <QueryClientProvider client={this.queryClient}>
                        <PropertyList />
                    </QueryClientProvider>
                )
            },
            {
                path: '/property/new',
                element: (
                    <QueryClientProvider client={this.queryClient}>
                        <AddProperty />
                    </QueryClientProvider>
                )
            }
        ];

        this.router = createMemoryRouter(routes, {
            initialEntries: [path],
            initialIndex: 0
        });

        render(<RouterProvider router={this.router} />);
    }

    getCurrentPath(): string {
        if (!this.router) {
            throw new Error('Router not initialized. Did you call navigateTo first?');
        }
        return this.router.state.location.pathname;
    }
}

setWorldConstructor(CustomWorld); 