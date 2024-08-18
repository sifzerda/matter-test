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

                    <li><Link to="/avalanche">Avalanche</Link></li>
                    <li><Link to="/airfriction">Air Friction</Link></li>

                    <li><Link to="/bridge">Bridge</Link></li>
                    <li><Link to="/ballpool">Ball Pool</Link></li>
                    <li><Link to="/car">Car</Link></li>
                    <li><Link to="/chains">Chains</Link></li>
                    <li><Link to="/circlestack">CircleStack</Link></li>
                    <li><Link to="/cloth">Cloth</Link></li>
                    <li><Link to="/collisionfiltering">Collision Filtering</Link></li>
                    <li><Link to="/compound">Compound</Link></li>
                    <li><Link to="/concave">Concave</Link></li>
                    <li><Link to="/constraints">Constraints</Link></li>
                    <li><Link to="/convex">Convex</Link></li>
                    <li><Link to="/demo">Demo</Link></li>
                    <li><Link to="/density">Density</Link></li>
                    <li><Link to="/events">Events</Link></li>
                    <li><Link to="/friction">Friction</Link></li>
                    <li><Link to="/gravity">Gravity</Link></li>
                    <li><Link to="/gyro">Gyro</Link></li>
                    <li><Link to="/manipulation">Manipulation</Link></li>
                    <li><Link to="/mixed">Mixed</Link></li>
                    <li><Link to="/motor">Motor</Link></li>
                    <li><Link to="/pyramid">Pyramid</Link></li>
                    <li><Link to="/raycasting">Raycasting</Link></li>
                    <li><Link to="/restitution">Restitution</Link></li>
                    <li><Link to="/rounded">Rounded</Link></li>
                    <li><Link to="/sleeping">Sleeping</Link></li>
                    <li><Link to="/slingshot">Slingshot</Link></li>
                    <li><Link to="/softbody">Softbody</Link></li>
                    <li><Link to="/sprites">Sprites</Link></li>
                    <li><Link to="/stack">Stack</Link></li>
                    <li><Link to="/stress">Stress</Link></li>
                    <li><Link to="/svg">SVG</Link></li>
                    <li><Link to="/terrain">Terrain</Link></li>
                    <li><Link to="/timescale">Timescale</Link></li>
                    <li><Link to="/views">Views</Link></li>
                    <li><Link to="/wreckingball">Wrecking Ball</Link></li>
                    <li><Link to="/world">World</Link></li>
                    <li><Link to="/yard">Yard</Link></li>
                    <li><Link to="/mixed">Mixed</Link></li>




              </ul>
          </nav>
          <hr />
          <Outlet />
      </div>
  );
}

export default App;
