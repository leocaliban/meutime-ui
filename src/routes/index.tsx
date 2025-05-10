import { Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import Campeonato from '../pages/Campeonato';


const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/campeonatos" element={<Campeonato />} />
  </Routes>
);

export default AppRoutes;
