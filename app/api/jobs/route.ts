import { NextRequest, NextResponse } from 'next/server';
import { INITIAL_JOBS } from '@/lib/sample-data';

export async function GET() {
  return NextResponse.json({
    success: true,
    data: INITIAL_JOBS,
  });
}

export async function POST(request: NextRequest) {
  try {
    const jobData = await request.json();
    return NextResponse.json({
      success: true,
      data: {
        ...jobData,
        id: `job-${Date.now()}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    });
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
