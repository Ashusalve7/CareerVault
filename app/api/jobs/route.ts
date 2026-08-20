import { NextRequest, NextResponse } from 'next/server';
import { d1Client } from '@/lib/d1';

export async function GET() {
  try {
    if (d1Client.isConfigured()) {
      const result = await d1Client.query('SELECT * FROM jobs ORDER BY column_order ASC, created_at DESC');
      return NextResponse.json({
        success: true,
        source: 'cloudflare_d1',
        data: result.results || [],
      });
    }

    return NextResponse.json({
      success: true,
      source: 'local_engine',
      data: [],
    });
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const jobData = await request.json();
    const id = jobData.id || `job-${Date.now()}`;
    const now = new Date().toISOString();

    if (d1Client.isConfigured()) {
      await d1Client.query(
        `INSERT INTO jobs (id, company, title, location, location_type, salary_min, salary_max, status, priority, job_url, job_description, notes, tags, color, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          id,
          jobData.company,
          jobData.title,
          jobData.location || 'Remote',
          jobData.locationType || 'remote',
          jobData.salaryMin || null,
          jobData.salaryMax || null,
          jobData.status || 'wishlist',
          jobData.priority || 'medium',
          jobData.jobUrl || null,
          jobData.jobDescription || null,
          jobData.notes || null,
          JSON.stringify(jobData.tags || []),
          jobData.color || '#3B82F6',
          now,
          now,
        ]
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        ...jobData,
        id,
        createdAt: now,
        updatedAt: now,
      },
    });
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
