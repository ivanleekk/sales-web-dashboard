import {afterAll, describe, expect, test} from "vitest";
import {GET, POST} from "@/app/api/sales/route";
import {NextRequest} from "next/server";
import {doc, getDoc} from "firebase/firestore";
import {db, firebaseEmulator} from "@/lib/firebase";
import IndividualSale from "@/app/api/sales/individualSale";
import GroupSale from "@/app/api/sales/groupSale";
import Product from "@/app/api/products/product";
import OrderItem from "@/app/api/sales/orderItem";
import Owner from "@/app/api/users/owner";

// firebaseApps previously initialized using initializeApp()
firebaseEmulator()
describe('Sales API', () => {
    afterAll(async () => {
            // Clean up Firestore after tests
            await fetch("http://localhost:8080/emulator/v1/projects/sales-web-dashboard/databases/(default)/documents",
                {
                    method: 'DELETE'
                })
        }
    )
    test('GET /api/sales should return 400 if user ID is not provided', async () => {
        const request = new NextRequest(`http://localhost:8080/api/sales`);
        const response = await GET(request);
        expect(response.status).toBe(400);
        const data = await response.json();
        expect(data.error).toBe('User ID is required');
    });
    
    test('POST /api/sales should be able to post an IndividualSale and GroupSale', async () => {
        // post a sale for the user
        const testUser1 = new Owner("test-user-1");
        const testUser2 = new Owner("test-user-2");
        const product1 = new Product("test-product-1", testUser1);
        const product2 = new Product("test-product-2", testUser2);
        const order1 = new OrderItem(product1, 2, 100, product1.getOwner())
        const order2 = new OrderItem(product2, 1, 200, product2.getOwner())
        const individualSale = new IndividualSale([order1]);
        const groupSale = new GroupSale([order1, order2]);
        const request = new NextRequest('http://localhost:8080/api/sales', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                type: "IndividualSale",
                amount: 100,
                owner: testUser1.getId(),
                orders: [
                    {
                    productId: product1.getId(),
                    quantity: 2,
                    price: 100,
                    },
                    {
                        productId: product2.getId(),
                        quantity: 1,
                        price: 200,
                    }]
            })
        });
        const response = await POST(request);
        console.log(request)
        expect(response.status).toBe(200);
        const request2 = new NextRequest('http://localhost:8080/api/sales', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                groupSale: groupSale.toJSON(),
            })
        });
        const response2 = await POST(request2);
        expect(response2.status).toBe(200);

        // get the sale and check if it exists
        const saleDocRef = doc(db, 'sales', individualSale.getId());
        const saleDoc = await getDoc(saleDocRef);
        expect(saleDoc.exists()).toBe(true);
        const saleData = saleDoc.data();
        expect(saleData).toEqual(individualSale.toJSON());
        const saleDocRef2 = doc(db, 'sales', groupSale.getId());
        const saleDoc2 = await getDoc(saleDocRef2);
        expect(saleDoc2.exists()).toBe(true);
        const saleData2 = saleDoc2.data();
        expect(saleData2).toEqual(groupSale.toJSON());
    })
    
    test('POST /api/sales should return 400 if type of sale is not provided', async () => {
        const request = new NextRequest('http://localhost:8080/api/sales', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                amount: 100,
                owner: "test-user-1"
            })
        });
        const response = await POST(request);
        expect(response.status).toBe(400);
        const data = await response.json();
        expect(data.error).toBe('Sale Type is required');
    });
    
    test('POST /api/sales should return 400 if type of owner is not provided', async () => {
        const request = new NextRequest('http://localhost:8080/api/sales', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                type: "IndividualSale",
                amount: 100,
            })
        });
        const response = await POST(request);
        expect(response.status).toBe(400);
        const data = await response.json();
        expect(data.error).toBe('Sale Owner is required');
    });
    
    test('POST /api/sales should return 400 if amount is not provided', async () => {
        const request = new NextRequest('http://localhost:8080/api/sales', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                type: "IndividualSale",
                owner: "test-user-1"
            })
        });
        const response = await POST(request);
        expect(response.status).toBe(400);
        const data = await response.json();
        expect(data.error).toBe('Sale Amount is required');
    });
    

});