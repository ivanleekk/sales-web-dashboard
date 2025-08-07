import {describe, expect, test} from "vitest";
import Product from "@/app/api/users/products/product";

describe('Product', () => {
    test("should create a product with a name and owner", () => {
        const product = new Product("Test Product", "Test Owner");
        expect(product.getName()).toBe("Test Product");
        expect(product.getOwner()).toBe("Test Owner");
    });

    test("should generate a unique ID for each product", () => {
        const product1 = new Product("Product 1", "Owner 1");
        const product2 = new Product("Product 2", "Owner 2");
        expect(product1.getId()).not.toBe(product2.getId());
    });

    test("should return the product as JSON", () => {
        const product = new Product("Test Product", "Test Owner");
        expect(product.toJSON()).toEqual({
            id: product.getId(),
            name: "Test Product",
            owner: "Test Owner"
        });
    });
    
    test("should create a product from JSON", () => {
        const json = {
            id: "123e4567-e89b-12d3-a456-426614174000",
            name: "Test Product",
            owner: "Test Owner"
        };
        const product = Product.fromJSON(json);
        expect(product.getId()).toBe(json.id);
        expect(product.getName()).toBe(json.name);
        expect(product.getOwner()).toBe(json.owner);
    });
});