import { Routes, Route } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { PropertyList } from './components/PropertyList';
import { AddProperty } from './components/AddProperty';
import { QueryClient } from '@tanstack/react-query';

interface AppProps {
    queryClient: QueryClient;
}

export default function App({ queryClient }: AppProps) {
    return (
        <QueryClientProvider client={queryClient}>
            <Routes>
                <Route path="/" element={<PropertyList />} />
                <Route path="/property/new" element={<AddProperty />} />
            </Routes>
        </QueryClientProvider>
    );
}
