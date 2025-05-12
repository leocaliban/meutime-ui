import { BrowserRouter } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import AppRoutes from './routes';
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <BrowserRouter>
      <div className="flex h-screen">
        <Toaster
          position="top-center"
          toastOptions={{
            style: {
              background: '#b9bbbe',
              color: '#202225',
            },
          }}
        />
        <Sidebar />
        <main className="flex-1 p-6 bg-primary min-h-screen">
          <AppRoutes />
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
