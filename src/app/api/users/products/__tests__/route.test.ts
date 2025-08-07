import {afterAll, describe, expect, test, vi} from "vitest";
import {GET, POST} from "@/app/api/users/products/route";
import {NextRequest} from "next/server";
import {randomUUID} from "node:crypto";
import {db, firebaseEmulator} from "@/lib/firebase";
import {collection, setDoc} from "@firebase/firestore";
import Owner from "@/app/api/users/owner";
import {doc, getDoc} from "firebase/firestore";

const usersRef = collection(db, 'users');
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
    describe("GET /api/users/products", () => {
        test("should return 400 if user ID is not provided", async () => {
            const request = new NextRequest(`http://localhost:8080/api/users/products`);
            const response = await GET(request);
            expect(response.status).toBe(400);
            const data = await response.json();
            expect(data.error).toBe('User ID is required');
        });
        
        test("should return 200 and an empty array if no products exist for the user", async () => {
            const owner = new Owner("test-user");
            const newOwnerDocRef = doc(usersRef, owner.getId());
            await setDoc(newOwnerDocRef, owner.toJSON())
            
            const userId = owner.getId();
            const request = new NextRequest(`http://localhost:8080/api/users/products?userId=${userId}`);
            const response = await GET(request);
            expect(response.status).toBe(200);
            const data = await response.json();
            expect(data).toEqual([]);
        });
        
        test("should return 200 and a list of multiple products for the user", async () => {
            const owner = new Owner("test-user");
            const userId = owner.getId();
            const newOwnerDocRef = doc(usersRef, userId);
            await setDoc(newOwnerDocRef, owner.toJSON())
            
            // Create multiple products for the user
            const product1 = { name: "Product 1", owner: userId };
            const product2 = { name: "Product 2", owner: userId };
            const product3 = { name: "Product 3", owner: userId };
            
            const productsCollection = collection(db, 'users', userId, 'products');
            await setDoc(doc(productsCollection, randomUUID()), product1);
            await setDoc(doc(productsCollection, randomUUID()), product2);
            await setDoc(doc(productsCollection, randomUUID()), product3);
            
            const request = new NextRequest(`http://localhost:8080/api/users/products?userId=${userId}`);
            const response = await GET(request);
            expect(response.status).toBe(200);
            const data = await response.json();
            expect(data.length).toBe(3);
            expect(data[0].owner).toBe(userId);
        })
    });
    
    describe("POST /api/users/products", () => {
        test("should return 400 if product name is not provided", async () => {
            const request = new NextRequest('http://localhost:8080/api/users/products', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({})
            });
            const response = await POST(request);
            expect(response.status).toBe(400);
            const data = await response.json();
            expect(data.error).toBe('Product name is required');
        });
        
        test("should return 400 if owner is not provided", async () => {
            const request = new NextRequest('http://localhost:8080/api/users/products', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: "Test Product" })
            });
            const response = await POST(request);
            expect(response.status).toBe(400);
            const data = await response.json();
            expect(data.error).toBe('Product owner is required');
        });
        
        test("should create a new product", async () => {
            const productOwner = new Owner("test-user")
            const productOwnerId = productOwner.getId(); // Replace with a valid user ID
            const productName = "Test Product";
            const request = new NextRequest('http://localhost:8080/api/users/products', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: productName, owner: productOwnerId })
            });
            
            // create owner in Firestore if it does not exist
            const newOwnerDocRef = doc(usersRef, productOwner.getId());
            await setDoc(newOwnerDocRef, productOwner.toJSON())
            const response = await POST(request);
            expect(response.status).toBe(201);
            const data = await response.json();
            expect(data.name).toBe(productName);
            expect(data.owner).toBe(productOwnerId);
            expect(data.id).toBeDefined();
            
            // Verify the product was created in Firestore
            const productDoc = await getDoc(doc(db,'users', productOwnerId, 'products', data.id));
            expect(productDoc.exists()).toBe(true);
            expect(productDoc.data()?.name).toBe(productName);
            expect(productDoc.data()?.owner).toBe(productOwnerId);
        });
        test("should be able to create multiple products for the same owner", async () => {
            const productOwner = new Owner("test-user")
            const productOwnerId = productOwner.getId(); // Replace with a valid user ID
            const productName = "Test Product";
            const request = new NextRequest('http://localhost:8080/api/users/products', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: productName, owner: productOwnerId })
            });
            const productName2 = "Other Test Product";
            const request2 = new NextRequest('http://localhost:8080/api/users/products', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: productName2, owner: productOwnerId })
            });
            
            // create owner in Firestore if it does not exist
            const newOwnerDocRef = doc(usersRef, productOwner.getId());
            await setDoc(newOwnerDocRef, productOwner.toJSON())
            const response = await POST(request);
            expect(response.status).toBe(201);
            const data = await response.json();
            expect(data.name).toBe(productName);
            expect(data.owner).toBe(productOwnerId);
            expect(data.id).toBeDefined();
            
            const response2 = await POST(request2);
            expect(response2.status).toBe(201);
            const data2 = await response2.json();
            expect(data2.name).toBe(productName2);
            expect(data2.owner).toBe(productOwnerId);
            expect(data2.id).toBeDefined();
            
            // Verify the product was created in Firestore
            const productDoc = await getDoc(doc(db,'users', productOwnerId, 'products', data.id));
            expect(productDoc.exists()).toBe(true);
            expect(productDoc.data()?.name).toBe(productName);
            expect(productDoc.data()?.owner).toBe(productOwnerId);
            
            const productDoc2 = await getDoc(doc(db,'users', productOwnerId, 'products', data2.id));
            expect(productDoc2.exists()).toBe(true);
            expect(productDoc2.data()?.name).toBe(productName2);
            expect(productDoc2.data()?.owner).toBe(productOwnerId);
        });
    });
    
    
    
});