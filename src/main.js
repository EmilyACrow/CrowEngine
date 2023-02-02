"use strict";
exports.__esModule = true;
var ce = require("./CrowEngine");
var Components_1 = require("./Components");
var Systems_1 = require("./Systems");
function main() {
    var engine = new ce.Engine();
    var player = engine.addEntity();
    var origin = { x: 0, y: 0 };
    var player_postion = new Components_1.Position(origin);
    var input_system = new Components_1.KeyboardInput();
    document.addEventListener('keypress', function (event) { input_system.inputCallback(event); });
    engine.addComponent(player, player_postion);
    engine.addComponent(player, input_system);
    var movement_system = new Systems_1.MovementSystem();
    engine.addSystem(1, movement_system);
}
