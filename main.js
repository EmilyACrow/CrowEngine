import * as ce from "./src/CrowEngine";
import { Position, KeyboardInput } from "./src/Components";
import { MovementSystem } from "./src/Systems";
function main() {
    let engine = new ce.Engine();
    let player = engine.addEntity();
    const origin = { x: 0, y: 0 };
    let player_postion = new Position(origin);
    let input_system = new KeyboardInput();
    document.addEventListener('keypress', (event) => { input_system.inputCallback(event); });
    engine.addComponent(player, player_postion);
    engine.addComponent(player, input_system);
    let movement_system = new MovementSystem();
    engine.addSystem(1, movement_system);
}
