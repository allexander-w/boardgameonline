import './style.css';
import BeginScreen from "./entities/screens/begin.screen";
import PreloaderScreen from "./entities/screens/preloader.screen";

// import FlashPointScene from "./scenes/flashpoint";
// import JackalScene from "./scenes/jackal";
// import VineScene from "./scenes/vine";

// new FlashPointScene();
// new VineScene();
// new JackalScene();


const beginScreen = new BeginScreen();
beginScreen.emitter.on("sign", async (name) => {
    beginScreen.off();
    const preload = new PreloaderScreen();
    const result = import ("./games/splendor");
    const scene = await result;

    const UndefinedScene = scene.default;
    new UndefinedScene({ name }, preload);
})
