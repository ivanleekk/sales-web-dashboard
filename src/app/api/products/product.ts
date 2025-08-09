import {randomUUID} from "node:crypto";
import Owner from "@/app/api/users/owner";

export default class Product {
    id: `${string}-${string}-${string}-${string}-${string}`;
    name: string;
    owner: Owner;
    
    constructor(name: string, owner: Owner) {
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
    
    getOwner(): Owner {
        return this.owner;
    }
    
    static fromJSON(json: Record<string, string>): Product {
        const product = new Product(json.name, json.owner);
        product.id = json.id as `${string}-${string}-${string}-${string}-${string}`;
        return product;
    }
}