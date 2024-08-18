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

import BallPool from './pages/BallPool';
import Bridge from './pages/Bridge';
import Car from './pages/Car';
import Chains from './pages/Chains';
import CircleStack from './pages/CircleStack';
import Cloth from './pages/Cloth';
import CollisionFiltering from './pages/CollisionFiltering';
import Compound from './pages/Compound';
import Concave from './pages/Concave';
import Constraints from './pages/Constraints';
import Convex from './pages/Convex';
import Demo from './pages/Demo';
import Density from './pages/Density';
import Events from './pages/Events';
import Friction from './pages/Friction';
import Gravity from './pages/Gravity';
import Gyro from './pages/Gyro';
import Manipulation from './pages/Manipulation';
import Mixed from './pages/Mixed';
import Motor from './pages/Motor';
import Pyramid from './pages/Pyramid';
import Raycasting from './pages/Raycasting';
import Restitution from './pages/Restitution';
import Rounded from './pages/Rounded';
import Sleeping from './pages/Sleeping';
import Slingshot from './pages/Slingshot';
import Softbody from './pages/Softbody';
import Sprites from './pages/Sprites';
import Stack from './pages/Stack';
import Stress from './pages/Stress';
import Svg from './pages/Svg';
import Terrain from './pages/Terrain';
import Timescale from './pages/Timescale';
import Views from './pages/Views';
import WreckingBall from './pages/WreckingBall';
import World from './pages/World';
import Yard from './pages/Yard';


import AirFriction from './pages/AirFriction';

// Render the application without React.StrictMode
ReactDOM.createRoot(document.getElementById('root')).render(
  <Router>
    <Routes>
      <Route path="/" element={<App />}>
        <Route index element={<Home />} />
        <Route path="about" element={<About />} />
        <Route path="contact" element={<Contact />} />

        <Route path="avalanche" element={<Avalanche />} />
        <Route path="airfriction" element={<AirFriction />} />

        <Route path="bubbles" element={<Bubbles />} />
        <Route path="ball" element={<Balls />} />
        <Route path="catapult" element={<Catapult />} />
        <Route path="bike" element={<Bike />} />
        <Route path="mousetrap" element={<Mousetrap />} />

<Route path='ballpool' element={<BallPool />} />
<Route path='bridge' element={<Bridge />} />
<Route path='car' element={<Car />} />
<Route path='catapult' element={<Catapult />} />
<Route path='circlestack' element={<CircleStack />} />
<Route path='cloth' element={<Cloth />} />
<Route path='chains' element={<Chains />} />
<Route path='collisionfiltering' element={<CollisionFiltering />} />
<Route path='compound' element={<Compound />} />
<Route path='concave' element={<Concave />} />
<Route path='constraints' element={<Constraints />} />
<Route path='convex' element={<Convex />} />
<Route path='demo' element={<Demo />} />
<Route path='density' element={<Density />} />
<Route path='events' element={<Events />} />
<Route path='friction' element={<Friction />} />
<Route path='gravity' element={<Gravity />} />
<Route path='gyro' element={<Gyro />} />
<Route path='manipulation' element={<Manipulation />} />
<Route path='mixed' element={<Mixed />} />
<Route path='motor' element={<Motor />} />
<Route path='pyramid' element={<Pyramid />} />
<Route path='raycasting' element={<Raycasting />} />
<Route path='restitution' element={<Restitution />} />
<Route path='rounded' element={<Rounded />} />
<Route path='sleeping' element={<Sleeping />} />
<Route path='slingshot' element={<Slingshot />} />
<Route path='softbody' element={<Softbody />} />
<Route path='sprites' element={<Sprites />} />
<Route path='stack' element={<Stack />} />
<Route path='stress' element={<Stress />} />
<Route path='svg' element={<Svg />} />
<Route path='terrain' element={<Terrain />} />
<Route path='timescale' element={<Timescale />} />
<Route path='views' element={<Views />} />
<Route path='wreckingball' element={<WreckingBall />} />
 
<Route path='world' element={<World />} />
<Route path='yard' element={<Yard />} />
<Route path='mixed' element={<Mixed />} />











      </Route>
    </Routes>
  </Router>
);