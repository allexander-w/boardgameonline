import './style.css';
import BeginScreen from "./entities/screens/begin.screen";
// import FlashPointScene from "./scenes/flashpoint";
// import JackalScene from "./scenes/jackal";
// import VineScene from "./scenes/vine";

// new FlashPointScene();
// new VineScene();
// new JackalScene();

const beginScreen = new BeginScreen();
beginScreen.emitter.on("sign", async (name) => {
    beginScreen.off();

    const result = import ("./scenes/vine");
    const scene = await result;

    const VineScene = scene.default;
    new VineScene({ name });
})
