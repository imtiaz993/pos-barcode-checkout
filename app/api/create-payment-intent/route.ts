import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "");

async function fetchCustomerByPhone(phone:any) {
  try {
    const customers = await stripe.customers.search({
      query: `name:'${phone}'`,
    });

    return customers.data.length > 0 ? customers.data[0] : null; // Return the first matching customer or null
  } catch (error) {
    console.error("Error fetching customer by phone:", error);
    throw error;
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { price, phone } = body;

    // Search for a customer by phone
    let searchedCustomer = await fetchCustomerByPhone(phone);

    // If no customer exists, create one
    if (!searchedCustomer) {
      const newCustomer = await stripe.customers.create({ name:phone });
      searchedCustomer = newCustomer; // Set the new customer as the searchedCustomer
    }

    // Create a PaymentIntent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: price,
      currency: "usd",
      customer: searchedCustomer.id,
      setup_future_usage: "off_session",
    });

    // Fetch saved payment methods
    const paymentMethods = await stripe.paymentMethods.list({
      customer: searchedCustomer.id,
      type: "card",
    });

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      paymentMethods: paymentMethods.data,
    });
  } catch (error: any) {
    console.error("Error creating PaymentIntent:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}