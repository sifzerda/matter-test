import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import App from './App';
import './index.css';

import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import Bubbles from './pages/Bubbles';
import Balls from './pages/Balls';
import Catapult from './pages/Catapult';
import Bike from './pages/Bike';
import Mousetrap from './pages/Mousetrap';
import Avalanche from './pages/Avalanche';

import AirFriction from './pages/AirFriction';

// Render the application without React.StrictMode
ReactDOM.createRoot(document.getElementById('root')).render(
  <Router>
    <Routes>
      <Route path="/" element={<App />}>
        <Route index element={<Home />} />
        <Route path="about" element={<About />} />
        <Route path="contact" element={<Contact />} />
        <Route path="bubbles" element={<Bubbles />} />
        <Route path="ball" element={<Balls />} />
        <Route path="catapult" element={<Catapult />} />
        <Route path="bike" element={<Bike />} />
        <Route path="mousetrap" element={<Mousetrap />} />
        <Route path="avalanche" element={<Avalanche />} />

        <Route path="airfriction" element={<AirFriction />} />

      </Route>
    </Routes>
  </Router>
);