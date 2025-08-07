import {describe, test, expect, vi} from "vitest";
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
});