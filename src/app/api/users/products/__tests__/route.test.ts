import {describe, expect, test, beforeAll, afterAll, vi} from "vitest";
import {GET, POST} from "@/app/api/users/products/route";
import {NextRequest} from "next/server";
import { doc, getDoc } from "firebase/firestore";
import {randomUUID} from "node:crypto";
import {db, firebaseEmulator} from "@/lib/firebase";

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
const Product = (await import("@/app/api/users/products/product")).default;


// firebaseApps previously initialized using initializeApp()
firebaseEmulator()
describe('Users/Products API', () => {
    afterAll(async () => {
            // Clean up Firestore after tests
            await fetch("http://localhost:8080/emulator/v1/projects/sales-web-dashboard/databases/(default)/documents",
                {
                    method: 'DELETE'
                })
        }
    )
    test("GET /api/users/products should return 400 if user ID is not provided", async () => {
        const request = new NextRequest(`http://localhost:8080/api/users/products`);
        const response = await GET(request);
        expect(response.status).toBe(400);
        const data = await response.json();
        expect(data.error).toBe('User ID is required');
    });
    
    test("POST /api/users/products should return 400 if product is not provided", async () => {
        const request = new NextRequest('http://localhost:8080/api/users/products', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({})
        });
        const response = await POST(request);
        expect(response.status).toBe(400);
        const data = await response.json();
        expect(data.error).toBe('Product is required');
    });
    
    test("POST /api/users/products should create a new product", async () => {
        const userId = "test-user-id"; // Replace with a valid user ID
        const productName = "Test Product";
        const request = new NextRequest('http://localhost:8080/api/users/products', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: productName, owner: userId })
        });
        const response = await POST(request);
        expect(response.status).toBe(201);
        const data = await response.json();
        expect(data.name).toBe(productName);
        expect(data.owner).toBe(userId);
        expect(data.id).toBeDefined();

        // Verify the product was created in Firestore
        const productDoc = await getDoc(doc(db, 'products', data.id));
        expect(productDoc.exists()).toBe(true);
        expect(productDoc.data()?.name).toBe(productName);
        expect(productDoc.data()?.owner).toBe(userId);
    });
    
    
    
});