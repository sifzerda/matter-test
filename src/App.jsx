import { Link, Outlet } from 'react-router-dom';
import './App.css'


function App() {
  return (
      <div>
          <nav>
              <ul>
                  <li><Link to="/">Home</Link></li>
                  <li><Link to="/about">About</Link></li>
                  <li><Link to="/contact">Contact</Link></li>
                  <li><Link to="/bubbles">Bubbles</Link></li>
                  <li><Link to="/ball">Ball Pit</Link></li>
              </ul>
          </nav>
          <hr />
          <Outlet />
      </div>
  );
}

export default App;
