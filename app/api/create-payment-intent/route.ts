import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "");

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { price, phone } = body;

        const customer = await stripe.customers.create({
            phone,
        });

        const paymentIntent = await stripe.paymentIntents.create({
            amount: price,
            currency: "usd",
            customer: customer.id,
        });

        return NextResponse.json({ clientSecret: paymentIntent.client_secret });
    } catch (error: any) {
        console.error("Error creating PaymentIntent:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
