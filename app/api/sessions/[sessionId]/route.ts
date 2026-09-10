import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase, ChatSession, Message } from "@/lib/db";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  try {
    const { sessionId } = await params;
    await connectToDatabase();

    const session = await ChatSession.findById(sessionId).lean();
    if (!session) {
      return NextResponse.json({ error: "Session not found." }, { status: 404 });
    }

    const messages = await Message.find({ sessionId })
      .sort({ createdAt: 1 })
      .lean();

    return NextResponse.json({ session, messages });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to fetch session messages." },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  try {
    const { sessionId } = await params;
    await connectToDatabase();

    await Message.deleteMany({ sessionId });
    await ChatSession.findByIdAndDelete(sessionId);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to delete session." },
      { status: 500 }
    );
  }
}
