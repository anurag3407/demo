import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";

export async function GET() {
  try {
    const mongooseInstance = await connectToDatabase();
    const isConnected = mongooseInstance.connection.readyState === 1;

    return NextResponse.json({
      status: "healthy",
      database: {
        connected: isConnected,
        name: mongooseInstance.connection.name,
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        status: "unhealthy",
        database: {
          connected: false,
          error: error.message,
        },
        timestamp: new Date().toISOString(),
      },
      { status: 503 }
    );
  }
}
