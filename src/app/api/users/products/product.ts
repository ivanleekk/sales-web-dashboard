import {randomUUID} from "node:crypto";

export default class Product {
    id: `${string}-${string}-${string}-${string}-${string}`;
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
    
    static fromJSON(json: Record<string, string>): Product {
        const product = new Product(json.name, json.owner);
        product.id = json.id as `${string}-${string}-${string}-${string}-${string}`;
        return product;
    }
}