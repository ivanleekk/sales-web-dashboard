import {randomUUID} from "node:crypto";

export default abstract class Person{
    name: string;
    private id: `${string}-${string}-${string}-${string}-${string}`;
    
    constructor(name:string) {
        this.name = name;
        this.id = randomUUID();
    }
    
    getId(): `${string}-${string}-${string}-${string}-${string}` {
        return this.id;
    }
    
    toJSON(): Record<string, string> {
        return {
            id: this.id,
            name: this.name
        };
    }
    
    getName(): string {
        return this.name;
    }
}