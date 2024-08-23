// src/pages/Home.jsx

// Import SVG file
import SVGLogo from '/public/matter-js.svg'; // Adjust the path as needed

function Home() {
    return (
        <div className='center-screen'>

            {/* Add the SVG here */}
            <img className='logo' src={SVGLogo } alt="Description of SVG" />

            <h1>Demos</h1> 
            <p>Demos I made: <a href="/bubbles">Bubbles</a>, <a href="/mousetrap">Mousetrap</a>, <a href="/ballpit">Ballpit</a>, <a href="/bike">Bike</a></p>
            
        </div>
    );
}

export default Home;