import Product from "@/app/api/products/product";
import Owner from "@/app/api/users/owner";

// Type with product, quantity, and price
export default class OrderItem {
    product: Product;
    quantity: number;
    price: number;
    seller: Owner;
    
    constructor(product: Product, quantity: number, price: number, seller: Owner) {
        this.product = product;
        this.quantity = quantity;
        this.price = price;
        this.seller = seller;
    }
}
