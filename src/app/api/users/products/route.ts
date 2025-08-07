import { NextRequest } from 'next/server';
import {collection, doc, getDoc, setDoc, CollectionReference, DocumentReference} from "@firebase/firestore";
import { db } from '@/lib/firebase';
import Product from "@/app/api/users/products/product";
import Owner from "@/app/api/users/owner";
function getProductCollection(userId: string): CollectionReference<Product> {
    // 1. First, get a reference to the top-level 'users' collection.
    // We specify the type using <User> for type-safety.
    const usersCollection = collection(db, "users") as CollectionReference<Owner>;
    
    // 2. Next, get a reference to the specific user document using their ID.
    // The type of this reference is DocumentReference<User>.
    const userDocRef: DocumentReference<Owner> = doc(usersCollection, userId);
    
    // 3. Finally, get the nested 'products' collection from the user document reference.
    // We specify the type <Product> to ensure all documents in this collection
    // conform to the Product interface.
    const productsCollection = collection(userDocRef, "products") as CollectionReference<Product>;
    
    // Return the type-safe collection reference.
    return productsCollection;
}
export async function GET(request: NextRequest) {
    if (!request.nextUrl.searchParams.has('userId')) {
        return new Response(JSON.stringify({ error: 'User ID is required' }), { status: 400 });
    }
}

export async function POST(request: NextRequest) {
    if (!request.nextUrl.searchParams.has('productId')) {
        return new Response(JSON.stringify({ error: 'Product is required' }), { status: 400 });
    }
    const body = await request.json();
    const { name, owner } = body;
    if (!name || !owner) {
        return new Response(JSON.stringify({ error: 'Name and owner are required' }), { status: 400 });
    }
    // Create a new Product instance
    const newProduct = new Product(name, owner);
    
    // Get the products collection for the specified user
    const productsCollection = getProductCollection(owner);
    // Create a new document reference for the product
    const newDocRef = doc(productsCollection, newProduct.getId());
    // Save the product to Firestore
    await setDoc(newDocRef, newProduct.toJSON());
}