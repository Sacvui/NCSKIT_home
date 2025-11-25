import { NextResponse, type NextRequest } from "next/server";
import { getBlogIndex } from "@/lib/blog";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const limit = Number(searchParams.get("limit") ?? "6");
  const posts = await getBlogIndex();

  return NextResponse.json({
    posts: posts.slice(0, Number.isNaN(limit) ? posts.length : limit),
  });
}

