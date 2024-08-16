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
                    <li><Link to="/catapult">Catapult</Link></li>
                    <li><Link to="/bike">Bike</Link></li>
                    <li><Link to="/mousetrap">Mousetrap</Link></li>


              </ul>
          </nav>
          <hr />
          <Outlet />
      </div>
  );
}

export default App;
