import './App.css';
import { Canvas } from "@react-three/fiber";
import Cylinder3d from "./components/FloatingIsland";
import DynamicPrism from "./components/DynamicPrism";
import PixiFlower from "./components/PixiFlower";
import MetaGallery from "./components/MetaGallery";
import { Parallax, ParallaxLayer } from "@react-spring/parallax";

const pixis = {
  1103970: "images/pixis/blue.png",
  416430: "images/pixis/green.png",
  310452: "images/pixis/oracle.png",
  327482: "images/pixis/pink.png",
  325185: "images/pixis/red.png",
  358574: "images/pixis/yellow.png",
  227675: "images/pixis/blue.png",
  911738: "images/pixis/green.png",
  1738986: "images/pixis/pink.png"
}
const pixi = (id) => pixis[id]
const images = [
  // Front
  { position: [0, 0, 1.5], rotation: [0, 0, 0], scale: [.5,.5,.5], url: pixi(1103970) },
  // Back
  { position: [-0.8, 0, -0.6], rotation: [0, 0, 0], scale: [.5,.5,.5], url: pixi(416430) },
  { position: [0.8, 0, -0.6], rotation: [0, 0, 0], scale: [.5,.5,.5], url: pixi(310452) },
  // Left
  { position: [-1.75, 0, 0.25], rotation: [0, Math.PI / 2.5, 0], scale: [.5,.5,.5], url: pixi(327482) },
  { position: [-2.15, 0, 1.5], rotation: [0, Math.PI / 2.5, 0], scale: [.5,.5,.5], url: pixi(325185) },
  { position: [-2, 0, 2.75], rotation: [0, Math.PI / 2.5, 0], scale: [.5,.5,.5], url: pixi(358574) },
  // Right
  { position: [1.75, 0, 0.25], rotation: [0, -Math.PI / 2.5, 0], scale: [.5,.5,.5], url: pixi(227675) },
  { position: [2.15, 0, 1.5], rotation: [0, -Math.PI / 2.5, 0], scale: [.5,.5,.5], url: pixi(911738) },
  { position: [2, 0, 2.75], rotation: [0, -Math.PI / 2.5, 0], scale: [.5,.5,.5], url: pixi(1738986) }
]

function App() {
  return (
    <Parallax pages={5} style={{ top: '0', left: '0', backgroundColor: '#000' }}>

      <ParallaxLayer
        offset={0}
        speed={2.5}
        style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <MetaGallery title="Pixiland" images={images} />
      </ParallaxLayer>

      <ParallaxLayer offset={1} speed={1} style={{ backgroundColor: '#0B37BD' }}>
        <h3>Hello Pixiland!</h3>
      </ParallaxLayer>

      <ParallaxLayer offset={2} speed={3}>
          <PixiFlower  />
      </ParallaxLayer>

      <ParallaxLayer offset={3} speed={2} style={{ backgroundColor: '#DE2B37' }} />
      
      <ParallaxLayer offset={3} speed={2} style={{ zIndex: 100, backgroundColor: '#037F04' }}>
        <Canvas>
          <ambientLight />
          <Cylinder3d position={[-2,0,0]}  />
          <Cylinder3d   />
          <Cylinder3d position={[2,0,0]}  />
        </Canvas>
      </ParallaxLayer>

      <ParallaxLayer offset={4} speed={1}>
        <DynamicPrism title="Pixiland" />
      </ParallaxLayer>

    </Parallax>
  );
}

export default App;
