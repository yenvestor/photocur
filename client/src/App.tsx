import { Route, Router } from 'wouter';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import EditorPage from './pages/editor';
import NotFoundPage from './pages/not-found';
import { Toaster } from "@/components/ui/toaster";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Route path="/" component={EditorPage} />
        <Route path="/editor" component={EditorPage} />
        <Route component={NotFoundPage} />
      </Router>
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
