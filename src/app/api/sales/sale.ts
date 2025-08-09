import {randomUUID} from "node:crypto";
import OrderItem from "@/app/api/sales/orderItem";
import Product from "@/app/api/products/product";
import Owner from "@/app/api/users/owner";

export default abstract class Sale {
    id: `${string}-${string}-${string}-${string}-${string}`;
    products: OrderItem[];
    
    constructor(products: OrderItem[]) {
        this.products = products;
        this.id = randomUUID();
    }
    
    abstract getTotalPrice(): number
    abstract getProducts(): Promise<Product[]>;
    abstract getSeller(): Promise<Owner>;
    abstract getId(): `${string}-${string}-${string}-${string}-${string}`;
    abstract toJSON(): Record<string, any>;
    
}