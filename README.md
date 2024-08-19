# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh




- React Strict Mode causes Matter.js to reload, creating double screens. You have to remove it from main.jsx (<React.StrictMode/>)


Front end app with several examples of Matter-js 

Examples I made:

+ Bubbles: 
+ Ball Pit: 
+ Catapult:
+ Mousetrap

Matter.js Demos:

+ Avalanche [x]
+ Ball Pool [x]
+ Bridge [x]
+ Catapult [x]
+ Car [x]
+ Chains [x]
+ Circle Stack [x]
+ Cloth [x]
+ Collision Filtering [x]
+ Composite Manipulation [x]
+ Compound Bodies [x]
+ Compound Stack [x]
+ Concave [x]
+ Constraints [x]
+ Convex [x]
+ 
+ Double Pendulum [x]
+ Events [x]
+ Friction [x]
+ Gravity [x]
+ Gyro [x]
+ Manipulation [x]
+ Mixed [x]
+ Motor [x]
+ Newton's Cradle [x]
+ Pyramid [x]
+ Ragdoll [x]
+ Raycasting [x]
+ Restitution [x]
+ Rounded [x]
+ Sensors [x]
+ Sleeping [x]
+ Slingshot [x]
+ Soft Body [x]
+ Sprites [x]
+ Stack [x]
+ Static Friction [x]
+ Stats and Performance [x]
+ Stress 1 [x]
+ Stress 2 [x]
+ Stress 3 [x]
+ Stress 4 [x]
+ Substep [x]
+ Svg [x]
+ Terrain [x]
+ Timescale [x]
+ Views [x] 
+ Wrecking Ball [x]


Issues, Bugs and Further Development:

1. Need pathseg polyfill:

The SVG and Terrain examples get this error:
```bash
TypeError: Cannot read properties of undefined (reading 'body')
    at Body.setVertices (matter.js:1941:25)
    at Body.set (matter.js:1804:22)
    at _initProperties (matter.js:1730:14)
    at Body.create (matter.js:1688:9)
    at Bodies.fromVertices (matter.js:5506:29)
    at           Body.setVertices = function(body, vertices) {
        // change vertices
        if (vertices[0].body === body) {
            body.vertices = vertices;
        } else {
            body.vertices = Vertices.create(vertices, body);
        }
```

You have to use the [SVGPathSeg polyfill](https://github.com/progers/pathseg). Download pathseg.js and put into server folder (backend client/server) or client folder same level as index.html (front-end). Paste this into your index.html:

```bash
    <script src="pathseg.js"></script>
```

2. Need poly-decomp:

Need to install poly-decomp or you get this error:

```bash
matter-js: Bodies.fromVertices: Install the 'poly-decomp' library and use Common.setDecomp or provide 'decomp' as a global to decompose concave vertices.
```

Add this to the SVG component: 

```bash
import decomp from 'poly-decomp';

window.decomp = decomp;
```