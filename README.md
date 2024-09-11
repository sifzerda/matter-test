# MATTER.JS DEMOS 🔺⬜

## Table of Contents

- [MATTER.JS DEMOS 🔺⬜](#matterjs-demos-)
  - [Table of Contents](#table-of-contents)
  - [(1) Description](#1-description)
  - [(2) Badges](#2-badges)
  - [(3) Visuals](#3-visuals)
  - [(4) Installation](#4-installation)
  - [(5) Usage](#5-usage)
    - [Matter.js demos:](#matterjs-demos)
    - [Demos I made:](#demos-i-made)
  - [(6) Dev Stuff: Building:](#6-dev-stuff-building)
  - [(8) Bugs and Further Development:](#8-bugs-and-further-development)
  - [(9) To do:](#9-to-do)
  - [(10) Support](#10-support)
  - [(11) Contributing](#11-contributing)
  - [(12) Authors and acknowledgment](#12-authors-and-acknowledgment)
  - [(13) License](#13-license)
  - [(14) Project status](#14-project-status)

## (1) Description

The Matter js demo code is collected here in JSX format for personal reference. This creates a front-end site with demos accessible by nav tabs. It was built with React, Matter.js, Node, Javascript, and CSS. 

I also created some examples including ball pit, bubbles, mousetrap, jigsaw, and bike.

## (2) Badges

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT) 

![Visual Studio Code](https://img.shields.io/badge/Visual%20Studio%20Code-0078d7.svg?style=for-the-badge&logo=visual-studio-code&logoColor=white) 
![GitHub](https://img.shields.io/badge/github-%23121011.svg?style=for-the-badge&logo=github&logoColor=white) 
![HTML5](https://img.shields.io/badge/html5-%23E34F26.svg?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/css3-%231572B6.svg?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E) 
![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![ESLint](https://img.shields.io/badge/ESLint-4B3263?style=for-the-badge&logo=eslint&logoColor=white)
![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white) 
![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![React Router](https://img.shields.io/badge/React_Router-CA4245?style=for-the-badge&logo=react-router&logoColor=white)
![Matter.js](https://img.shields.io/badge/Matter.js-4B5562.svg?style=for-the-badge&logo=matterdotjs&logoColor=white)

## (3) Visuals

[Visit App deployed to ???](https://66c9775cff6a242bbc0f1342--matter-test.netlify.app/)

![matter-js-screenshot](???)

## (4) Installation

```bash
git clone https://github.com/sifzerda/matter-test.git
cd matter-test
npm install
npm run dev
```

## (5) Usage

### Matter.js demos:

+ [x] Air Friction 
+ [x] Avalanche 
+ [x] Ball Pool 
+ [x] Bridge 
+ [x] Car 
+ [x] Catapult 
+ [x] Chains 
+ [x] Circle Stack 
+ [x] Cloth 
+ [x] Collision Filtering 
+ [x] Composite Manipulation 
+ [x] Compound
+ [x] Compound Stack
+ [x] Concave
+ [x] Constraints 
+ [x] Double Pendulum
+ [x] Events 
+ [x] Friction
+ [x] Gravity 
+ [x] Gyro 
+ [x] Manipulation 
+ [x] Mixed 
+ [x] Newton's Cradle
+ [x] Pyramid 
+ [x] Ragdoll 
+ [x] Raycasting
+ [x] Restitution  
+ [x] Rounded 
+ [x] Sensors  
+ [x] Sleeping  
+ [x] Slingshot  
+ [x] Soft Body  
+ [x] Sprites 
+ [x] Stack 
+ [x] Static Friction 
+ [x] Stats  
+ [x] Stress 
+ [x] Stress 2  
+ [x] Stress 3  
+ [x] Stress 4  
+ [x] Substep 
+ [x] SVG 
+ [x] Terrain  
+ [x] Timescale 
+ [x] Views 
+ [x] Wrecking Ball 

### Demos I made:

+ [x] Ball Pit
+ [x] Bubbles [x]
+ [x] Bike [x]
+ [x] Mousetrap [x]
+ [ ] Jigsaw:
  + [ ] Render images on jigsaw pieces
  + [ ] Enable pieces to lock once connected
  + [ ] Piece positioning on board
+ [x] Air Hockey

## (6) Dev Stuff: Building:

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

## (8) Bugs and Further Development: 

- Some CSS formatting needed:
  - Resizing game screen window sizes
- Assets not loading in:
  - SVG
  - Jigsaw
  - Sprites
- Components not loading:
  - Air Hockey
  - Avalanche
  - Ball Pool
  - Terrain
- Components with no content:
  - Convex (need to add)
  - Motor

Optimization:
- use react-virtualized to only render visible stuff
- once game basically running, convert it into Redux or Zustand
- use a bundler like Webpack or Parcel to optimize build output: Enable code splitting, tree-shaking, and minification to reduce bundle size and improve load times.
- Consider memoizing components like Projectile and Particle using React.memo to prevent unnecessary re-renders, especially if their props rarely change.

## (9) To do: 

- [ ] 
- [ ] 
- [ ] 
- [ ] 

## (10) Support

For support, users can contact tydamon@hotmail.com.

## (11) Contributing

Any contributions you make are greatly appreciated.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement". 
1. Fork the Project
2. Create your Feature Branch (git checkout -b feature/NewFeature)
3. Commit your Changes (git commit -m 'Add some NewFeature')
4. Push to the Branch (git push origin feature/NewFeature)
5. Open a Pull Request

## (12) Authors and acknowledgment

The author acknowledges and credits those who have contributed to this project including:

- [Matter.js](https://github.com/liabru/matter-js)
- ChatGPT

## (13) License

Distributed under the MIT License. See LICENSE.txt for more information.

## (14) Project status

This project is incomplete. 
