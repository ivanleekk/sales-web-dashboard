import {NextRequest} from 'next/server';
import {collection, CollectionReference, doc, getDocs, setDoc} from "@firebase/firestore";
import {db} from '@/lib/firebase';
import Product from "@/app/api/users/products/product";
import Owner from "@/app/api/users/owner";

const usersRef = collection(db, 'users');
function getProductCollection(userId: string): CollectionReference<Record<string, string>> {
    // 1. First, get a reference to the top-level 'users' collection.
    // We specify the type using <User> for type-safety.
    const usersCollection = collection(db, "users") as CollectionReference<Owner>;
    
    // 2. Next, get a reference to the specific user document using their ID.
    // The type of this reference is DocumentReference<User>.
    const userDocRef = doc(usersCollection, userId);
    
    // 3. Finally, get the nested 'products' collection from the user document reference.
    // We specify the type <Product> to ensure all documents in this collection
    // conform to the Product interface.
    const productsCollection = collection(userDocRef, "products");
    
    // Return the type-safe collection reference.
    return productsCollection;
}

export async function GET(request: NextRequest) {
    if (!request.nextUrl.searchParams.get('userId')) {
        return new Response(JSON.stringify({ error: 'User ID is required' }), { status: 400 });
    }
    const userId = request.nextUrl.searchParams.get('userId');
    if (!userId) {
        return new Response(JSON.stringify({ error: 'User ID is required' }), { status: 400 });
    }
    const productsCollection = getProductCollection(userId);
    const productsSnapshot = await getDocs(productsCollection);
    const products: Product[] = [];
    productsSnapshot.forEach((doc) => {
        const productData = doc.data();
        const product = Product.fromJSON(productData);
        // Set the ID of the product to the document ID
        products.push(product);
    });
    return new Response(JSON.stringify(products), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
    });
}

export async function POST(request: NextRequest) {
    const body = await request.json();
    const { name, owner } = body;
    if (!name) {
        return new Response(JSON.stringify({ error: 'Product name is required' }), { status: 400 });
    }
    if (!owner) {
        return new Response(JSON.stringify({ error: 'Product owner is required' }), { status: 400 });
    }

    // Create a new Product instance
    const newProduct = new Product(name, owner);
    // Get the products collection for the specified user
    const productsCollection = getProductCollection(owner);
    // Create a new document reference for the product
    const newDocRef = doc(productsCollection, newProduct.getId());
    // Save the product to Firestore
    await setDoc(newDocRef, newProduct.toJSON())
    return new Response(JSON.stringify(newProduct), {
        status: 201,
        headers: { 'Content-Type': 'application/json' }
    });
}