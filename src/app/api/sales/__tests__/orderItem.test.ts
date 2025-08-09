import {describe, expect, test} from "vitest";
import OrderItem from "@/app/api/sales/orderItem";

describe('Order Item', () => {
    test("should create an order item with product, quantity, price, and seller", () => {
        const product = {name: "Test Product", id: "test-product-id"}; // Mock product
        const seller = {name: "Test seller", id: "test-seller-id"};
        const orderItem = new OrderItem(product, 2, 100, seller);
        expect(orderItem).toBeInstanceOf(OrderItem);
        expect(orderItem.product).toEqual(product);
        expect(orderItem.quantity).toBe(2);
        expect(orderItem.price).toBe(100);
        expect(orderItem.seller).toBe(seller);
    });
    
});