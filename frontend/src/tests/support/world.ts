import { World, IWorldOptions, setWorldConstructor } from '@cucumber/cucumber';
import { QueryClient } from '@tanstack/react-query';
import { render } from '@testing-library/react';
import { createElement } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import App from '../../App';

// Type definitions
declare global {
  namespace Cucumber {
    interface World {
      queryClient: QueryClient;
      navigateTo(path: string): Promise<void>;
    }
  }
}

class CustomWorld extends World {
    queryClient: QueryClient;

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
        window.history.pushState({}, '', path);
        
        // Create a container for our app
        const container = document.createElement('div');
        container.id = 'root';
        document.body.appendChild(container);

        // Create elements using createElement instead of JSX
        const app = createElement(BrowserRouter, null,
            createElement(QueryClientProvider, { client: this.queryClient },
                createElement(App)
            )
        );

        // Render the app
        render(app);
    }
}

setWorldConstructor(CustomWorld);

export default CustomWorld; 