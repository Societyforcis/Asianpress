import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { College } from "@/models/College";

export async function GET() {
  try {
    await connectToDatabase();
    const colleges = await College.find({}).sort({ country: 1, collegeName: 1 });
    return NextResponse.json({ success: true, data: colleges });
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to fetch colleges" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await connectToDatabase();
    const { country, collegeName, researchLabs } = await request.json();

    if (!country || !collegeName) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const college = await College.create({ country, collegeName, researchLabs: researchLabs || [] });
    return NextResponse.json({ success: true, data: college }, { status: 201 });
  } catch (error: any) {
    if (error.code === 11000) {
      return NextResponse.json({ error: "College already exists in this country" }, { status: 409 });
    }
    return NextResponse.json({ error: "Failed to add college" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    await connectToDatabase();
    const { id, country, collegeName, researchLabs } = await request.json();

    if (!id || !country || !collegeName) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const updatedCollege = await College.findByIdAndUpdate(
      id,
      { country, collegeName, researchLabs: researchLabs || [] },
      { new: true }
    );

    if (!updatedCollege) {
      return NextResponse.json({ error: "College not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: updatedCollege });
  } catch (error: any) {
    if (error.code === 11000) {
      return NextResponse.json({ error: "College already exists in this country" }, { status: 409 });
    }
    return NextResponse.json({ error: "Failed to update college" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Missing college ID" }, { status: 400 });
    }

    await College.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to delete college" }, { status: 500 });
  }
}

