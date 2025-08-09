import {NextRequest} from 'next/server';
import {collection, doc, getDoc, setDoc} from "@firebase/firestore";
import {db} from '@/lib/firebase';
import Sale from "@/app/api/sales/sale";
import IndividualSale from "@/app/api/sales/individualSale";
import GroupSale from "@/app/api/sales/groupSale";

const salesRef = collection(db, 'sales')

export async function GET(request: NextRequest) {
    // For example, fetch data from your DB here
    throw Error('Not Found');
}

export async function POST(request: NextRequest) {
    // extract data from the request body
    const body = await request.json();
    // upload the data to the database
    // check type of sale
    if (!body.type) {
        return new Response(JSON.stringify({ error: 'Sale Type is required' }), { status: 400 });
    }
    if (!body.amount) {
        return new Response(JSON.stringify({ error: 'Sale Amount is required' }), { status: 400 });
    }
    if (!body.owner) {
        return new Response(JSON.stringify({ error: 'Sale Owner is required' }), { status: 400 });
    }
    // Create a new sale object
    let sale: Sale;
    if (body.type === "IndividualSale") {
        sale = new IndividualSale(body.products);
    }
    else if (body.type === "GroupSale") {
        sale = new GroupSale(body.products);
    }
    else {
        return new Response(JSON.stringify({ error: 'Sale Type must be IndividualSale or GroupSale' }), { status: 400 });
    }
    const newDocRef = doc(salesRef, sale.getId());
    console.log(sale)
    await setDoc(newDocRef, sale.toJSON())
    return new Response(JSON.stringify(sale), {
        status: 201,
        headers: { 'Content-Type': 'application/json' }
    });
    
}