import Sale from "@/app/api/sales/sale";
import Owner from "../users/owner";
import Product from "@/app/api/products/product";

export default class IndividualSale extends Sale {
    
    getTotalPrice(): number {
        const totalPrice = this.products.reduce((total, item) => {
            return total + (item.quantity * item.price);
        }, 0);
        return totalPrice;
    }
    getProducts(): Promise<Product[]> {
        return this.products;
    }
    getSeller(): Promise<Owner> {
        return this.products.at(0)?.seller ?? Promise.reject(new Error("No seller found"));
    }
    getId(): `${string}-${string}-${string}-${string}-${string}` {
        return this.id;
    }
    toJSON(): Record<string, any> {
        return {
            type: "IndividualSale",
            id: this.id,
            products: this.products.map(item => ({
                product: item.product,
                quantity: item.quantity,
                price: item.price,
                seller: item.seller
            })),
            totalPrice: this.getTotalPrice(),
            seller: this.getSeller(),
        }
    }
    
}