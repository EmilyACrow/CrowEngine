/*
 * Copyright (c) 2022 Emily Crow
 *
 * Author: Emily Crow
 * Purpose: The base Crow Engine, with some core objects
 *
 */

export class Engine {
    private _entities: Map<Entity, ComponentWrapper>
    private _systems: Map<System, Set<Entity>>
    private _systemPriorities: number[]
    private _updateMap: Map<number, Set<System>>



    private nextEntityId: number
    private entitiesToDestroy: Array<Entity>

    constructor() {
        this._entities = new Map<Entity, ComponentWrapper>()
        this._systems = new Map<System, Set<Entity>>()

        this.nextEntityId = 0
        this.entitiesToDestroy = new Array<Entity>()
    }

    public addEntity(): Entity {
        let entity = this.nextEntityId;
        this.nextEntityId++;
        this._entities.set(entity, new ComponentWrapper())
        return entity;
    }

    /* Mark entity for removal */
    public destroyEntity(entity: Entity): void {
        this.entitiesToDestroy.push(entity);
    }

    public addComponent(entity: Entity, component: Component): void {
        this._entities.get(entity)?.add(component);
        this.checkEntity(entity);
    }

    public getComponents(entity: Entity): ComponentWrapper | undefined {
        return this._entities.get(entity)
    }

    public removeComponent(entity: Entity, component: Function): void {
        this._entities.get(entity)?.delete(component)
        this.checkEntity(entity);
    }

    public addSystem(priority: number, system: System): void {
        /* We always want a system to have at least one required component, otherise
        *  the system will run on every entity
        */
        if (system.componentsRequired.size == 0) {
            console.warn("System not added: empty Components list.")
            console.warn(system)
            return
        }

        //Give the system a reference to the engine
        system.engine = this;

        this._systems.set(system, new Set());
        for (let entity of this._entities.keys()) {
            this.checkEntitySystem(entity,system)
        }

        this._systemPriorities = Array.from((new Set(this._systemPriorities)).add(priority));
        this._systemPriorities.sort((a, b) => a - b);
        
        if (!this._updateMap.has(priority)) {
            this._updateMap.set(priority, new Set<System>());
        }
        this._updateMap.get(priority)!.add(system);
        
    }

    // Called every tick
    public update(): void {
        for (let priority of this._systemPriorities) {
            let systems = this._updateMap.get(priority)!;
            for (let system of systems) {
                if(system.enabled) {
                    system.update(this._systems.get(system)!)
                }
            }
        }

        // Clean up any entities that were marked for destruction
        while (this.entitiesToDestroy.length > 0) {
            this.destroyEntity(this.entitiesToDestroy.pop()!)
        }
    }

    /* Private checks to make sure state checks */

    private checkEntity(entity: Entity): void {
        for (let system of this._systems.keys()) {
            this.checkEntitySystem(entity, system);
        }
    }

    private checkEntitySystem(entity: Entity, system: System): void {
        let have = this._entities.get(entity);
        let need = system.componentsRequired;
        if (have?.hasAll(need)) {
            this._systems.get(system)!.add(entity)
        } else {
            this._systems.get(system)!.delete(entity);
        }
    }
}

// Entities are the base type of all engine objects
export type Entity = number;


export abstract class Component { }

export abstract class System {
    private _enabled: boolean = true;
        
    // Set of all components the system requries before it will run on a given entity
    public abstract componentsRequired: Set<Function>

    // All systems need to be able to access and modify things within the engine
    public engine: Engine

    // update is called every frame
    public abstract update(entities: Set<Entity>): void

    public abstract onEnable(): void
    public abstract onDisable(): void

    public get enabled(): boolean { return this._enabled }
    public set enabled(value: boolean) { this._enabled = value }
}

/* This is to help typescript understand what's happening by making the type of 
* a component available when working with the component wrapper 
*/
export type ComponentClass<T extends Component> = new (...args: any[]) => T

/* The component class wrapper that will make instancing and different components 
* easy to use
*/
export class ComponentWrapper {
    private _map = new Map<Function, Component>()
    private _enabled: boolean = true

    public add(component: Component): void {
        this._map.set(component.constructor, component)
    }

    public get<T extends Component>(componentClass: ComponentClass<T>): T {
        return this._map.get(componentClass) as T
    }

    // Return true if the component is of the given class
    public has(componentClass: Function): boolean {
        return this._map.has(componentClass)
    }

    public hasAll(componentClass: Iterable<Function>): boolean {
        for (let component of componentClass) {
            if (!this._map.has(component)) {
                return false
            }
        }

        return true
    }

    public delete(componentClass: Function): void {
        this._map.delete(componentClass)
    }

    public enable(): void { this._enabled = true }
    public disable(): void { this._enabled = false }
    public get enabled(): boolean { return this._enabled }
}

export type Point = {
    x: number;
    y: number;
}