import * as ce from "./src/CrowEngine"
import * as Input from "./src/Input"

function main() {
    let engine = new ce.Engine();

    const inputs = engine.addEntity();
    let inputHandler = new Input.Input();
    engine.addComponent(inputs,inputHandler);

    const origin: ce.Point = {x: 0, y: 0};


}