import { Component } from "./CrowEngine";
/**
 * An object that can be spawned
 * @param position Point the object is spawned at. Serves as a respawn point.
 */
export class Spawnable extends Component {
    constructor(position) {
        super();
        this.position = position;
    }
}
/** Current position of the object */
export class Position extends Component {
    constructor(position) {
        super();
        this.x = 0;
        this.y = 0;
        this.x = position.x;
        this.y = position.y;
    }
}
/** List of items the character has */
export class Items extends Component {
    constructor(items) {
        super();
        this.items = items;
    }
}
/** Item the character has */
export class Item extends Component {
    constructor(name, amount) {
        super();
        this.name = name;
        this.amount = amount;
    }
}
/** Listens for keyboard inputs */
export class KeyboardInput extends Component {
    constructor() {
        super();
    }
    inputCallback(event) {
        this.inputBuffer.push(event);
    }
}
