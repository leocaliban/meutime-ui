import { BrowserRouter } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import AppRoutes from './routes';

function App() {
  return (
    <BrowserRouter>
      <div className="flex h-screen">
        <Sidebar />
        <main className="flex-1 p-6 bg-primary min-h-screen">
          <AppRoutes />
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
