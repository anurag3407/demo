import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase, ChatSession } from "@/lib/db";

export async function GET() {
  try {
    await connectToDatabase();
    const sessions = await ChatSession.find({ isArchived: false })
      .sort({ updatedAt: -1 })
      .limit(50)
      .lean();

    return NextResponse.json({ sessions });
  } catch (error: any) {
    // Graceful fallback if database is not reachable
    return NextResponse.json(
      { sessions: [], warning: "Database unavailable, falling back to local state." },
      { status: 200 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const { title, modelName } = await req.json();
    await connectToDatabase();

    const session = await ChatSession.create({
      title: title || "New Chat",
      modelName: modelName || "deepseek/deepseek-chat",
    });

    return NextResponse.json({ session }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to create chat session." },
      { status: 500 }
    );
  }
}
