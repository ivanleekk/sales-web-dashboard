import Person from "@/app/api/users/person";
import Product from "@/app/api/users/products/product";

export default class Owner extends Person{
    products: Product[];
    
    constructor(name: string) {
        super(name);
        this.products = [];
    }
    
    addProduct(product: Product): void {
        this.products.push(product);
    }
    
    removeProduct(productId: string): void {
        this.products = this.products.filter(product => product.getId() !== productId);
    }
    
    getProducts(): Product[] {
        return this.products;
    }
}