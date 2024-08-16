import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import App from './App';
import './index.css';

import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import Bubbles from './pages/Bubbles';
import Balls from './pages/Balls';

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
      </Route>
    </Routes>
  </Router>
);