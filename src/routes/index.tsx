import { Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import Campeonato from '../pages/Campeonato';
import Clube from '../pages/Clube';


const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/campeonatos" element={<Campeonato />} />
    <Route path="/clubes" element={<Clube />} />
  </Routes>
);

export default AppRoutes;
