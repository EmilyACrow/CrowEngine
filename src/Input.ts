import {Component, Point} from "./CrowEngine";

export class Input extends Component {
    inputs: KeyboardEvent[];
    
    constructor() { 
        super();
    
    }

    handleKeyEvent(e: KeyboardEvent): void {
        this.inputs.push(e);
    }

    clearInputs(): void {
        this.inputs = [];
    }
}

