import {afterAll, describe, expect, test} from "vitest";
import {GET, POST} from "@/app/api/users/route";
import {NextRequest} from "next/server";
import {doc, getDoc} from "firebase/firestore";
import {db, firebaseEmulator} from "@/lib/firebase";

// firebaseApps previously initialized using initializeApp()
firebaseEmulator()
describe('Users API', () => {
    afterAll(async () => {
        // Clean up Firestore after tests
            await fetch("http://localhost:8080/emulator/v1/projects/sales-web-dashboard/databases/(default)/documents",
                {
                    method: 'DELETE'
                })
    }
    )
    test('GET /api/users should return 400 if user ID is not provided', async () => {
        const request = new NextRequest(`http://localhost:8080/api/users`);
        const response = await GET(request);
        expect(response.status).toBe(400);
        const data = await response.json();
        expect(data.error).toBe('User ID is required');
    });

    test('POST /api/users should return 400 if name is not provided', async () => {
        const request = new NextRequest('http://localhost:8080/api/users', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({})
        });
        const response = await POST(request);
        expect(response.status).toBe(400);
        const data = await response.json();
        expect(data.error).toBe('Name is required');
    });

    test('POST /api/users should create a new user', async () => {
        const userName = "Test User";
        const request = new NextRequest('http://localhost:8080/api/users', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: userName })
        });
        const response = await POST(request);
        expect(response.status).toBe(201);
        const data = await response.json();
        expect(data.name).toBe(userName);
        expect(data.id).toBeDefined();

        // Verify the user was created in Firestore
        const userDoc = await getDoc(doc(db, 'users', data.id));
        expect(userDoc.exists()).toBe(true);
        expect(userDoc.data()?.name).toBe(userName);
    });

    test('GET /api/users should return user data if user ID is provided', async () => {
        // First, create a user to fetch
        const userName = "Another Test User";
        const postRequest = new NextRequest(`http://localhost:8080/api/users`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: userName })
        });
        const postResponse = await POST(postRequest);
        const postData = await postResponse.json();
        const userId = postData.id;

        const request = new NextRequest(`http://localhost:8080/api/users?user=${userId}`);
        const response = await GET(request);
        expect(response.status).toBe(200);
        const data = await response.json();
        expect(data.id).toBe(userId);
        expect(data.name).toBe(userName);
    });
    
    test('GET /api/users should return 404 if user does not exist', async () => {
        const request = new NextRequest(`http://localhost:8080/api/users?user=nonexistent-id`);
        const response = await GET(request);
        expect(response.status).toBe(404);
        const data = await response.json();
        expect(data.error).toBe('User not found');
    });
    
});