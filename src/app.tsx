import type { Component } from 'solid-js';
import { Router, Routes, Route } from '@solidjs/router';

import { QueryClient, QueryClientProvider } from '@tanstack/solid-query';
import SecurityContextProvider from './context/SecurityContextProvider';
import { AuthHeader } from './components/AuthHeader';
import RouteGuard from './components/RouteGuard';
import Dashboard from './pages/Dashboard';

const queryClient = new QueryClient();

const App: Component = () => {

    return (
        <QueryClientProvider client={queryClient}>
            <SecurityContextProvider>
                <AuthHeader />
                <Router>
                    <Routes>
                        <Route path="/" element={<RouteGuard component={<Dashboard />} />} />
                    </Routes>
                </Router>
            </SecurityContextProvider>
        </QueryClientProvider>
    );
};

export default App;
