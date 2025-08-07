import {describe, test, expect} from "vitest";
import Product from '@/app/api/users/products/product';

describe('Product', () => {
    test("should create a product with a unique ID", () => {
        const product = new Product("Test Product", "Test Owner");
        expect(product.getId()).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/);
    });
    
    test("should return the correct name and owner", () => {
        const product = new Product("Test Product", "Test Owner");
        expect(product.getName()).toBe("Test Product");
        expect(product.getOwner()).toBe("Test Owner");
    });
    
    test("should convert to JSON correctly", () => {
        const product = new Product("Test Product", "Test Owner");
        const json = product.toJSON();
        expect(json).toEqual({
            id: product.getId(),
            name: "Test Product",
            owner: "Test Owner"
        });
    });
    
    test("should have a unique ID for each instance", () => {
        const product1 = new Product("Product 1", "Owner 1");
        const product2 = new Product("Product 2", "Owner 2");
        expect(product1.getId()).not.toBe(product2.getId());
    });
});
