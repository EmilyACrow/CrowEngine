import { System, Component, Entity } from "./CrowEngine";
import * as Components from "./Components";


/** Keyboard input system */
export class MovementSystem extends System {
    public componentsRequired: Set<Function> = new Set([Components.KeyboardInput]);
    
    constructor() {
        super();
        this.componentsRequired = new Set([
            Components.KeyboardInput,
            Components.Position
        ]);
    }

    update(entites: Set<Entity> ): void {
        entites.forEach(entity => {
            let components = this.engine.getComponents(entity)!;
            let pos = components.get(Components.Position)
            let inputs = components.get(Components.KeyboardInput)

            if(inputs.inputBuffer.length > 0) {
                inputs.inputBuffer.forEach(input => {
                    this.moveEntity(pos, input);
                })
                inputs.inputBuffer = [];
            }
        })
    }

    private moveEntity(pos: Components.Position, input: KeyboardEvent): void {
        if(input.code === "ArrowUp" || input.code === "keyW") { 
            pos.y -= 1;
        }
        if(input.code === "ArrowDown" || input.code === "keyS") {
            pos.y += 1;
        }
        if(input.code === "ArrowLeft" || input.code === "keyA") {
            pos.x -= 1;
        }
        if(input.code === "ArrowRight" || input.code === "keyD") {
            pos.x += 1;
        }
    }

    public onDisable(): void {
        
    }

    public onEnable(): void { }
}