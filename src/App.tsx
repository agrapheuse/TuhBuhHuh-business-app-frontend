import type { Component } from 'solid-js';
import { Router, Routes, Route } from '@solidjs/router';

import { QueryClient, QueryClientProvider } from '@tanstack/solid-query';
import SecurityContextProvider from './context/SecurityContextProvider';
import RouteGuard from './components/RouteGuard';
import { DataMapView } from './pages/DataMap';
import { Header } from './components/Header';
import UserView from './pages/UserView';

const query_client = new QueryClient();

const App: Component = () => {

    return (
        <QueryClientProvider client={query_client}>
            <SecurityContextProvider>
                <Header />
                <Routes>
                    <Route path="/" element={
                        <RouteGuard component={DataMapView} />
                    } />
                    <Route path="/settings" element={
                        <RouteGuard component={UserView} />
                    } />
                </Routes>
            </SecurityContextProvider>
        </QueryClientProvider>
    );
};

export default App;
