import { describe, test, expect } from 'vitest';
import GroupSale from '@/app/api/sales/groupSale';

describe('groupSale', () => {
    test('should return total price', async () => {
        const orderItem1 = { product: { name: "Product 1" }, quantity: 2, price: 100, seller: { name: "Seller 1" } };
        const orderItem2 = { product: { name: "Product 2" }, quantity: 3, price: 150, seller: { name: "Seller 2" } };
        const groupSale = new GroupSale([orderItem1, orderItem2]);

        const totalPrice = groupSale.getTotalPrice();
        expect(totalPrice).toBe(650); // (2 * 100) + (3 * 150)
    })
    
    test("should return products", async () => {
        const orderItem1 = { product: { name: "Product 1" }, quantity: 2, price: 100, seller: { name: "Seller 1" } };
        const orderItem2 = { product: { name: "Product 2" }, quantity: 3, price: 150, seller: { name: "Seller 2" } };
        const groupSale = new GroupSale([orderItem1, orderItem2]);
        
        const products = groupSale.getProducts();
        expect(products).toEqual([orderItem1, orderItem2]);
    })
    
    test("should return revenue for seller", async () => {
        const orderItem1 = { product: { name: "Product 1" }, quantity: 2, price: 100, seller: { name: "Seller 1", id:"testid1" } };
        const orderItem2 = { product: { name: "Product 2" }, quantity: 3, price: 150, seller: { name: "Seller 2", id:"testid2" } };
        const groupSale = new GroupSale([orderItem1, orderItem2]);
        
        
        const pricePerSeller = groupSale.getRevenueForSeller("testid1");
        expect(pricePerSeller).toBe(200); // 2 * 100
        const pricePerSeller2 = groupSale.getRevenueForSeller("testid2");
        expect(pricePerSeller2).toBe(450); // 3 * 150
    })
    
    test("should return array of sellers", async () => {
        const orderItem1 = { product: { name: "Product 1" }, quantity: 2, price: 100, seller: { name: "Seller 1", id:"testid1" } };
        const orderItem2 = { product: { name: "Product 2" }, quantity: 3, price: 150, seller: { name: "Seller 2", id:"testid2" } };
        const groupSale = new GroupSale([orderItem1, orderItem2]);
        
        const sellers = await groupSale.getSeller();
        expect(sellers).toEqual([orderItem1.seller, orderItem2.seller]); // Assuming the first seller is returned
    })
})