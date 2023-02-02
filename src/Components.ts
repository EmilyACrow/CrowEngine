import { Component, Point } from "./CrowEngine";

/** 
 * An object that can be spawned
 * @param position Point the object is spawned at. Serves as a respawn point.
 */
export class Spawnable extends Component {
    public position: Point;

    constructor(position: Point) {
        super();
        this.position = position;
    }
}

/** Current position of the object */
export class Position extends Component {
    public x: number = 0;
    public y: number = 0;

    constructor(position: Point) {
        super();
        this.x = position.x;
        this.y = position.y;
    }
}

/** List of items the character has */
export class Items extends Component {
    public items: Item[];

    constructor(items: Item[]) {
        super();
        this.items = items;
    }
}

/** Item the character has */
export class Item extends Component {
    public name: string;
    public amount: number;

    constructor(name: string, amount: number) {
        super();
        this.name = name;
        this.amount = amount;
    }
}

/** Listens for keyboard inputs */
export class KeyboardInput extends Component {
    inputBuffer: KeyboardEvent[];
    
    constructor() { 
        super();
    }

    inputCallback(event: KeyboardEvent) {
        this.inputBuffer.push(event);
    }
}
