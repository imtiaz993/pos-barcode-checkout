import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "");

export async function POST(req: NextRequest) {


    try {
        // Use the parsed body to create a PaymentIntent
        const amount = 1000; // Default amount if not provided
        const paymentIntent = await stripe.paymentIntents.create({
            amount,
            currency: "usd",
            // description: "Purchase of goods or services",
        });

        return NextResponse.json({ clientSecret: paymentIntent.client_secret });
    } catch (error: any) {
        console.error("Error creating PaymentIntent:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
