/*
 * Copyright (c) 2022 Emily Crow
 *
 * Author: Emily Crow
 * Purpose: The base Crow Engine, with some core objects
 *
 */

export class Engine {
    private entities: Map<Entity, ComponentWrapper>
    private systems: Map<System, Set<Entity>>

    private nextEntityId: number
    private entitiesToDestroy: Array<Entity>

    constructor() {
        this.entities = new Map<Entity, ComponentWrapper>()
        this.systems = new Map<System, Set<Entity>>()

        this.nextEntityId = 0
        this.entitiesToDestroy = new Array<Entity>()
    }

    public addEntity(): Entity {
        let entity = this.nextEntityId;
        this.nextEntityId++;
        this.entities.set(entity, new ComponentWrapper())
        return entity;
    }

    /* Mark entity for removal */
    public destroyEntity(entity: Entity): void {
        this.entitiesToDestroy.push(entity);
    }

    public addComponent(entity: Entity, component: Component): void {
        this.entities.get(entity)?.add(component);
        this.checkEntity(entity);
    }

    public getComponents(entity: Entity): ComponentWrapper | undefined {
        return this.entities.get(entity)
    }

    public removeComponent(entity: Entity, component: Function): void {
        this.entities.get(entity)?.delete(component)
        this.checkEntity(entity);
    }

    public addSystem(system: System): void {
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

        this.systems.set(system, new Set());
        for (let entity of this.entities.keys()) {
            this.checkEntitySystem(entity,system)
        }

    }

    // Called every tick
    public update(): void {

        for (let [system, entities] of this.systems.entries()) {
            system.update(entities)
        }

        // CLean up any entities that were marked for destruction
        while (this.entitiesToDestroy.length > 0) {
            this.destroyEntity(this.entitiesToDestroy.pop()!)
        }
    }

    /* Private checks to make sure state checks */

    private checkEntity(entity: Entity): void {
        for (let system of this.systems.keys()) {
            this.checkEntitySystem(entity, system);
        }
    }

    private checkEntitySystem(entity: Entity, system: System): void {
        let have = this.entities.get(entity);
        let need = system.componentsRequired;
        if (have?.hasAll(need)) {
            this.systems.get(system)!.add(entity)
        } else {
            this.systems.get(system)!.delete(entity);
        }
    }
}

// Entities are the base type of all engine objects
export type Entity = number;


export abstract class Component { }

export abstract class System {
    /* Set of all components the system requries before it will run
    * on a given entity 
    */
    public abstract componentsRequired: Set<Function>

    /* update is called every frame */
    public abstract update(entities: Set<Entity>): void

    /* All systems need to be able to access and modify things within the engine 
    */
    public engine: Engine

}

/* This is to help typescript understand what's happening by making the type of 
* a component available when working with the component wrapper 
*/
export type ComponentClass<T extends Component> = new (...args: any[]) => T

/* The component class wrapper that will make instancing and different components 
* easy to use
*/
export class ComponentWrapper {
    private map = new Map<Function, Component>()

    public add(component: Component): void {
        this.map.set(component.constructor, component)
    }

    public get<T extends Component>(componentClass: ComponentClass<T>): T {
        return this.map.get(componentClass) as T
    }

    // Return true if the component is of the given class
    public has(componentClass: Function): boolean {
        return this.map.has(componentClass)
    }

    public hasAll(componentClass: Iterable<Function>): boolean {
        for (let component of componentClass) {
            if (!this.map.has(component)) {
                return false
            }
        }

        return true
    }

    public delete(componentClass: Function): void {
        this.map.delete(componentClass)
    }
}

export type Point = {
    x: number;
    y: number;
}