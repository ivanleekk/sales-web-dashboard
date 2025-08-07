import { NextRequest } from 'next/server';
import {collection, doc, getDoc, setDoc} from "@firebase/firestore";
import { db } from '@/lib/firebase';
import Owner from "@/app/api/users/owner";

const usersRef = collection(db, 'users')

export async function GET(request: NextRequest) {
    // For example, fetch data from your DB here
    const searchParams = request.nextUrl.searchParams;
    if (!searchParams.has('user')) {
        return new Response(JSON.stringify({ error: 'User ID is required' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' }
        });
    }
    const userId = searchParams.get('user');
    const docRef = doc(usersRef, userId);
    const users = await getDoc(docRef);
    if (!users.exists()) {
        return new Response(JSON.stringify({ error: 'User not found' }), {
            status: 404,
            headers: { 'Content-Type': 'application/json' }
        });
    }
    return new Response(JSON.stringify(users.data()), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
    });
}

export async function POST(request: NextRequest) {
    // Parse the request body
    const body = await request.json();
    const { name } = body;
    if (!name) {
        return new Response(JSON.stringify({ error: 'Name is required' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' }
        });
    }
    // Create a new Owner instance
    const newOwner = new Owner(name);
    
    // e.g. Insert new user into your DB
    const newDoc = doc(usersRef,  newOwner.getId());
    await setDoc(newDoc, newOwner.toJSON())
    
    return new Response(JSON.stringify(newOwner), {
        status: 201,
        headers: { 'Content-Type': 'application/json' }
    });
}