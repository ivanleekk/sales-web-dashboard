import Sale from "@/app/api/sales/sale";

export default class GroupSale extends Sale{
    getTotalPrice(): number {
        const totalPrice = this.products.reduce((total, item) => {
            return total + (item.quantity * item.price);
        }, 0);
        return totalPrice;
    }
    
    getRevenueForSeller(sellerId: string): number {
        return this.products.reduce((total, item) => {
            if (item.seller.id === sellerId) {
                return total + (item.quantity * item.price);
            }
            return total;
        }, 0);
    }

    getProducts(): Promise<Product[]> {
        return this.products;
    }

    getSeller(): Promise<Owner> {
        // find all sellers in the products
        const sellers = this.products.map(item => item.seller);
        // return the first seller or reject if no sellers found
        return sellers.length > 0 ? Promise.resolve(sellers) : Promise.reject(new Error("No sellers found"));
        
    }

    getId(): `${string}-${string}-${string}-${string}-${string}` {
        return this.id;
    }

    toJSON(): Record<string, any> {
        return {
            type: "GroupSale",
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