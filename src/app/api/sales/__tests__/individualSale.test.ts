import {describe, expect, test, vi} from "vitest";
import IndividualSale from "@/app/api/sales/individualSale";

vi.mock("@/app/api/users/sales/orderItem", () => {
    return {
        __esModule: true,
        default: vi.fn().mockImplementation(function (this: any, product: string, quantity: number, price: number, seller: string) {
            this.product = product;
            this.quantity = quantity;
            this.price = price;
            this.seller = seller;
            this.getProduct = vi.fn(() => this.product);
            this.getQuantity = vi.fn(() => this.quantity);
            this.getPrice = vi.fn(() => this.price);
            this.getSeller = vi.fn(() => this.seller);
        }),
    };
});
const OrderItem = (await import("@/app/api/sales/orderItem")).default;


describe('Individual Sale', () => {
    test("should create an individual sale", () => {
        // This test will be implemented later
        const orderItem = new OrderItem("Test Product", 2, 100, "Test Seller");
        const newSale = new IndividualSale([orderItem]);
        expect(newSale).toBeInstanceOf(IndividualSale);
    })
    
    test("should create an individual sale with multiple order items", () => {
        const orderItem1 = new OrderItem("Test Product 1", 2, 100, "Test Seller");
        const orderItem2 = new OrderItem("Test Product 2", 3, 150, "Test Seller");
        const newSale = new IndividualSale([orderItem1, orderItem2]);
        expect(newSale).toBeInstanceOf(IndividualSale);
        expect(newSale.getProducts()).toEqual([orderItem1, orderItem2]);
    })
    
    test("should get total price of the sale", () => {
        const orderItem1 = new OrderItem("Test Product 1", 2, 100, "Test Seller");
        const orderItem2 = new OrderItem("Test Product 2", 3, 150, "Test Seller");
        const newSale = new IndividualSale([orderItem1, orderItem2]);
        
        const totalPrice = newSale.getTotalPrice();
        expect(totalPrice).toBe(650); // (2 * 100) + (3 * 150)
    })
    
    test("should get the seller of the sale", async () => {
        const orderItem1 = new OrderItem("Test Product 1", 2, 100, "Test Seller");
        const orderItem2 = new OrderItem("Test Product 2", 3, 150, "Test Seller");
        const newSale = new IndividualSale([orderItem1, orderItem2]);
        
        const seller = await newSale.getSeller();
        expect(seller).toEqual("Test Seller"); // Mocked seller
    })
    
    test("should get the id of the sale", () => {
        const orderItem1 = new OrderItem("Test Product 1", 2, 100, "Test Seller");
        const newSale = new IndividualSale([orderItem1]);
        
        const saleId = newSale.getId();
        expect(saleId).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/);
    })
    
    test("should convert the sale to JSON", () => {
        const orderItem1 = new OrderItem("Test Product 1", 2, 100, "Test Seller");
        const newSale = new IndividualSale([orderItem1]);
        
        const json = newSale.toJSON();
        expect(json).toEqual({
            type: "IndividualSale",
            id: newSale.getId(),
            products: [
                {
                    product: "Test Product 1",
                    quantity: 2,
                    price: 100,
                    seller: "Test Seller"
                }
            ],
            totalPrice: 200, // 2 * 100
            seller: "Test Seller"
        });
    })
})