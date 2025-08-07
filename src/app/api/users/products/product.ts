import {randomUUID} from "node:crypto";

export default class Product {
    readonly id: `${string}-${string}-${string}-${string}-${string}`;
    name: string;
    owner: string;
    
    constructor(name: string, owner: string) {
        this.id = randomUUID();
        this.name = name;
        this.owner = owner;
    }
    
    getId(): `${string}-${string}-${string}-${string}-${string}` {
        return this.id;
    }
    
    toJSON(): Record<string, string> {
        return {
            id: this.id,
            name: this.name,
            owner: this.owner
        };
    }
    getName(): string {
        return this.name;
    }
    
    getOwner(): string {
        return this.owner;
    }
}