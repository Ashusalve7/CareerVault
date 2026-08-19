// Cloudflare D1 Serverless SQL Database Client & Driver

export interface D1QueryResult<T = unknown> {
  results: T[];
  success: boolean;
  meta: {
    duration?: number;
    rows_read?: number;
    rows_written?: number;
    changes?: number;
    last_row_id?: number;
  };
  error?: string;
}

export class CloudflareD1Client {
  private accountId: string;
  private databaseId: string;
  private apiToken: string;

  constructor(accountId?: string, databaseId?: string, apiToken?: string) {
    this.accountId = accountId || process.env.CLOUDFLARE_ACCOUNT_ID || '';
    this.databaseId = databaseId || process.env.CLOUDFLARE_D1_DATABASE_ID || '';
    this.apiToken = apiToken || process.env.CLOUDFLARE_API_TOKEN || '';
  }

  public isConfigured(): boolean {
    return Boolean(this.accountId && this.databaseId && this.apiToken);
  }

  public async query<T = unknown>(sql: string, params: unknown[] = []): Promise<D1QueryResult<T>> {
    // If running in local mock mode without Cloudflare credentials configured
    if (!this.isConfigured()) {
      return {
        results: [],
        success: true,
        meta: { duration: 1, rows_read: 0, rows_written: 0, changes: 0 }
      };
    }

    try {
      const url = `https://api.cloudflare.com/client/v4/accounts/${this.accountId}/d1/database/${this.databaseId}/query`;
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sql,
          params
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        return {
          results: [],
          success: false,
          meta: {},
          error: `D1 API Error (${response.status}): ${errorText}`
        };
      }

      const data = await response.json();
      if (!data.success) {
        return {
          results: [],
          success: false,
          meta: {},
          error: data.errors?.[0]?.message || 'Cloudflare D1 Query Failed'
        };
      }

      const queryOutput = data.result?.[0] || {};
      return {
        results: (queryOutput.results as T[]) || [],
        success: true,
        meta: queryOutput.meta || {}
      };
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      return {
        results: [],
        success: false,
        meta: {},
        error: `D1 Connection Error: ${errorMessage}`
      };
    }
  }

  public async executeBatch(statements: { sql: string; params?: unknown[] }[]): Promise<boolean> {
    if (!this.isConfigured()) return true;

    try {
      const url = `https://api.cloudflare.com/client/v4/accounts/${this.accountId}/d1/database/${this.databaseId}/query`;
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(
          statements.map(s => ({ sql: s.sql, params: s.params || [] }))
        ),
      });

      const data = await response.json();
      return Boolean(data.success);
    } catch (err) {
      console.error('D1 Batch error:', err);
      return false;
    }
  }
}

export const d1Client = new CloudflareD1Client();
