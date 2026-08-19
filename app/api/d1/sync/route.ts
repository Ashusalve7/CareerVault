import { NextRequest, NextResponse } from 'next/server';
import { d1Client } from '@/lib/d1';
import { INITIAL_JOBS, INITIAL_RESUMES, INITIAL_CONTACTS } from '@/lib/sample-data';

export async function GET() {
  try {
    // If D1 is configured, query live table
    if (d1Client.isConfigured()) {
      const jobsResult = await d1Client.query('SELECT * FROM jobs ORDER BY column_order ASC, created_at DESC');
      const resumesResult = await d1Client.query('SELECT * FROM resumes ORDER BY upload_date DESC');
      const contactsResult = await d1Client.query('SELECT * FROM contacts ORDER BY created_at DESC');

      return NextResponse.json({
        success: true,
        source: 'cloudflare_d1',
        jobs: jobsResult.results,
        resumes: resumesResult.results,
        contacts: contactsResult.results,
      });
    }

    // Default return fallback
    return NextResponse.json({
      success: true,
      source: 'local_engine',
      jobs: INITIAL_JOBS,
      resumes: INITIAL_RESUMES,
      contacts: INITIAL_CONTACTS,
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, sql, params } = body;

    if (action === 'execute_sql' && sql) {
      const result = await d1Client.query(sql, params || []);
      return NextResponse.json(result);
    }

    return NextResponse.json({ success: true, message: 'D1 sync received' });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
  }
}
