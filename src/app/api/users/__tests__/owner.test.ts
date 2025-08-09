import {describe, test, expect, vi} from "vitest";
import Owner from "@/app/api/users/owner";
import {randomUUID} from "node:crypto";
vi.mock("@/app/api/product/product", () => {
    return {
        __esModule: true,
        default: vi.fn().mockImplementation(function (this: any, name: string, owner: string) {
            this.name = name;
            this.owner = owner;
            this.id = randomUUID()
            this.getId = vi.fn(()  => this.id);
        }),
    };
});
const Product = (await import("@/app/api/products/product")).default;


describe('Owner', () => {
    test("should create an owner with a name", () => {
        const owner = new Owner("Test Owner");
        expect(owner.getName()).toBe("Test Owner");
    });

    test("should add a product to the owner's product list", () => {
        const owner = new Owner("Test Owner");
        const product = new Product("Test Product", "Test Owner");
        owner.addProduct(product);
        expect(owner.products).toContain(product);
    });

    test("should remove a product from the owner's product list", () => {
        const owner = new Owner("Test Owner");
        const product1 = new Product("Test Product", "Test Owner");
        const product2 = new Product("Another Product", "Test Owner");
        owner.addProduct(product1);
        owner.addProduct(product2);
        owner.removeProduct(product1.getId());
        expect(owner.products).not.toContain(product1);
        expect(owner.products).toContain(product2);
    });
    
    test("should return the owner's product list", () => {
        const owner = new Owner("Test Owner");
        const product1 = new Product("Test Product 1", "Test Owner");
        const product2 = new Product("Test Product 2", "Test Owner");
        owner.addProduct(product1);
        owner.addProduct(product2);
        expect(owner.getProducts()).toEqual([product1, product2]);
    });
});