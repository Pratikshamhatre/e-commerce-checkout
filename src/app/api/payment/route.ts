import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, cardNumber, expiry, cvv, cartItems } = body;

    // Simulate backend delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Basic validation
    if (!name || !cardNumber || !expiry || !cvv || !cartItems?.length  ) {
      return NextResponse.json(
        { message: "Invalid payment details" },
        { status: 400 }
      );
    }

    //  success response
    return NextResponse.json(
      {
        message: "Payment successful!",
        transactionId: `TXN-${Math.floor(Math.random() * 1000000)}`,
        cartItems,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Server error", error: (error as Error).message },
      { status: 500 }
    );
  }
}
