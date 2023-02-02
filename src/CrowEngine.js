/*
 * Copyright (c) 2022 Emily Crow
 *
 * Author: Emily Crow
 * Purpose: The base Crow Engine, with some core objects
 *
 */
export class Engine {
    constructor() {
        this._entities = new Map();
        this._systems = new Map();
        this.nextEntityId = 0;
        this.entitiesToDestroy = new Array();
    }
    addEntity() {
        let entity = this.nextEntityId;
        this.nextEntityId++;
        this._entities.set(entity, new ComponentWrapper());
        return entity;
    }
    /* Mark entity for removal */
    destroyEntity(entity) {
        this.entitiesToDestroy.push(entity);
    }
    addComponent(entity, component) {
        var _a;
        (_a = this._entities.get(entity)) === null || _a === void 0 ? void 0 : _a.add(component);
        this.checkEntity(entity);
    }
    getComponents(entity) {
        return this._entities.get(entity);
    }
    removeComponent(entity, component) {
        var _a;
        (_a = this._entities.get(entity)) === null || _a === void 0 ? void 0 : _a.delete(component);
        this.checkEntity(entity);
    }
    addSystem(priority, system) {
        /* We always want a system to have at least one required component, otherise
        *  the system will run on every entity
        */
        if (system.componentsRequired.size == 0) {
            console.warn("System not added: empty Components list.");
            console.warn(system);
            return;
        }
        //Give the system a reference to the engine
        system.engine = this;
        this._systems.set(system, new Set());
        for (let entity of this._entities.keys()) {
            this.checkEntitySystem(entity, system);
        }
        this._systemPriorities = Array.from((new Set(this._systemPriorities)).add(priority));
        this._systemPriorities.sort((a, b) => a - b);
        if (!this._updateMap.has(priority)) {
            this._updateMap.set(priority, new Set());
        }
        this._updateMap.get(priority).add(system);
    }
    // Called every tick
    update() {
        for (let priority of this._systemPriorities) {
            let systems = this._updateMap.get(priority);
            for (let system of systems) {
                if (system.enabled) {
                    system.update(this._systems.get(system));
                }
            }
        }
        // Clean up any entities that were marked for destruction
        while (this.entitiesToDestroy.length > 0) {
            this.destroyEntity(this.entitiesToDestroy.pop());
        }
    }
    /* Private checks to make sure state checks */
    checkEntity(entity) {
        for (let system of this._systems.keys()) {
            this.checkEntitySystem(entity, system);
        }
    }
    checkEntitySystem(entity, system) {
        let have = this._entities.get(entity);
        let need = system.componentsRequired;
        if (have === null || have === void 0 ? void 0 : have.hasAll(need)) {
            this._systems.get(system).add(entity);
        }
        else {
            this._systems.get(system).delete(entity);
        }
    }
}
export class Component {
}
export class System {
    constructor() {
        this._enabled = true;
    }
    get enabled() { return this._enabled; }
    set enabled(value) { this._enabled = value; }
}
/* The component class wrapper that will make instancing and different components
* easy to use
*/
export class ComponentWrapper {
    constructor() {
        this._map = new Map();
        this._enabled = true;
    }
    add(component) {
        this._map.set(component.constructor, component);
    }
    get(componentClass) {
        return this._map.get(componentClass);
    }
    // Return true if the component is of the given class
    has(componentClass) {
        return this._map.has(componentClass);
    }
    hasAll(componentClass) {
        for (let component of componentClass) {
            if (!this._map.has(component)) {
                return false;
            }
        }
        return true;
    }
    delete(componentClass) {
        this._map.delete(componentClass);
    }
    enable() { this._enabled = true; }
    disable() { this._enabled = false; }
    get enabled() { return this._enabled; }
}
