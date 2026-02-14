import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

// Allowed column types the user can create
const ALLOWED_TYPES: Record<string, string> = {
  text: "TEXT",
  number: "NUMERIC",
  integer: "INTEGER",
  boolean: "BOOLEAN",
  date: "DATE",
  timestamp: "TIMESTAMP WITH TIME ZONE",
  select: "TEXT", // select is stored as text, options managed in metadata
};

// Tables that cannot be modified or deleted
const PROTECTED_TABLES = ["table_settings"];

// System columns that cannot be deleted or renamed
const PROTECTED_COLUMNS = ["id", "created_at", "updated_at", "user_id"];

// Validate identifier: alphanumeric + underscores, starts with letter, max 63 chars
function isValidIdentifier(name: string): boolean {
  return /^[a-z][a-z0-9_]{0,62}$/.test(name);
}

// Escape identifier for safe SQL usage
function quoteIdent(name: string): string {
  if (!isValidIdentifier(name)) {
    throw new Error(`Invalid identifier: ${name}`);
  }
  return `"${name}"`;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Validate auth
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "No authorization header" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY") || Deno.env.get("SUPABASE_PUBLISHABLE_KEY")!;

    // Verify user is authenticated
    const userClient = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: { user }, error: authError } = await userClient.auth.getUser();
    if (authError || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Use service role for DDL operations
    const adminClient = createClient(supabaseUrl, serviceRoleKey);

    const body = await req.json();
    const { action } = body;

    let result: any;

    switch (action) {
      case "get_schema": {
        result = await getSchema(adminClient);
        break;
      }
      case "add_column": {
        const { table_name, column_name, column_type, is_nullable, default_value } = body;
        validateTableName(table_name);
        if (!isValidIdentifier(column_name)) {
          throw new Error("Invalid column name. Use lowercase letters, numbers, and underscores only.");
        }
        if (!ALLOWED_TYPES[column_type]) {
          throw new Error(`Invalid column type. Allowed: ${Object.keys(ALLOWED_TYPES).join(", ")}`);
        }

        const sqlType = ALLOWED_TYPES[column_type];
        const nullable = is_nullable !== false ? "" : " NOT NULL";
        const defaultClause = default_value != null && default_value !== ""
          ? ` DEFAULT ${sanitizeDefault(default_value, column_type)}`
          : "";

        const sql = `ALTER TABLE public.${quoteIdent(table_name)} ADD COLUMN ${quoteIdent(column_name)} ${sqlType}${nullable}${defaultClause}`;
        const { error } = await adminClient.rpc("exec_ddl", { sql_text: sql });
        if (error) throw new Error(error.message);
        result = { success: true, message: `Column '${column_name}' added to '${table_name}'` };
        break;
      }
      case "delete_column": {
        const { table_name, column_name } = body;
        validateTableName(table_name);
        if (PROTECTED_COLUMNS.includes(column_name)) {
          throw new Error(`Cannot delete protected column: ${column_name}`);
        }
        if (!isValidIdentifier(column_name)) {
          throw new Error("Invalid column name.");
        }

        // Check if column has data
        const checkSql = `SELECT EXISTS (SELECT 1 FROM public.${quoteIdent(table_name)} WHERE ${quoteIdent(column_name)} IS NOT NULL LIMIT 1) as has_data`;
        const { data: checkData, error: checkError } = await adminClient.rpc("exec_query", { sql_text: checkSql });
        if (checkError) throw new Error(checkError.message);
        if (checkData?.[0]?.has_data === true) {
          throw new Error(`Column '${column_name}' contains data. Clear all data in this column before deleting.`);
        }

        const sql = `ALTER TABLE public.${quoteIdent(table_name)} DROP COLUMN ${quoteIdent(column_name)}`;
        const { error } = await adminClient.rpc("exec_ddl", { sql_text: sql });
        if (error) throw new Error(error.message);
        result = { success: true, message: `Column '${column_name}' deleted from '${table_name}'` };
        break;
      }
      case "rename_column": {
        const { table_name, old_name, new_name } = body;
        validateTableName(table_name);
        if (PROTECTED_COLUMNS.includes(old_name)) {
          throw new Error(`Cannot rename protected column: ${old_name}`);
        }
        if (!isValidIdentifier(old_name) || !isValidIdentifier(new_name)) {
          throw new Error("Invalid column name. Use lowercase letters, numbers, and underscores only.");
        }

        const sql = `ALTER TABLE public.${quoteIdent(table_name)} RENAME COLUMN ${quoteIdent(old_name)} TO ${quoteIdent(new_name)}`;
        const { error } = await adminClient.rpc("exec_ddl", { sql_text: sql });
        if (error) throw new Error(error.message);
        result = { success: true, message: `Column renamed from '${old_name}' to '${new_name}'` };
        break;
      }
      case "create_table": {
        const { table_name, columns, foreign_keys } = body;
        if (!isValidIdentifier(table_name)) {
          throw new Error("Invalid table name. Use lowercase letters, numbers, and underscores only.");
        }

        // Build columns SQL
        const colDefs = [
          `"id" UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY`,
          `"created_at" TIMESTAMP WITH TIME ZONE DEFAULT now()`,
        ];

        for (const col of columns || []) {
          if (!isValidIdentifier(col.name)) {
            throw new Error(`Invalid column name: ${col.name}`);
          }
          if (!ALLOWED_TYPES[col.type]) {
            throw new Error(`Invalid type for column ${col.name}`);
          }
          const nullable = col.is_nullable !== false ? "" : " NOT NULL";
          const defaultClause = col.default_value != null && col.default_value !== ""
            ? ` DEFAULT ${sanitizeDefault(col.default_value, col.type)}`
            : "";
          colDefs.push(`${quoteIdent(col.name)} ${ALLOWED_TYPES[col.type]}${nullable}${defaultClause}`);
        }

        // Add foreign key columns
        for (const fk of foreign_keys || []) {
          if (!isValidIdentifier(fk.column_name) || !isValidIdentifier(fk.ref_table)) {
            throw new Error("Invalid foreign key reference.");
          }
          colDefs.push(`${quoteIdent(fk.column_name)} UUID REFERENCES public.${quoteIdent(fk.ref_table)}(id) ON DELETE ${fk.on_delete === "cascade" ? "CASCADE" : "SET NULL"}`);
        }

        const createSql = `CREATE TABLE public.${quoteIdent(table_name)} (\n  ${colDefs.join(",\n  ")}\n)`;
        const { error: createErr } = await adminClient.rpc("exec_ddl", { sql_text: createSql });
        if (createErr) throw new Error(createErr.message);

        // Enable RLS
        const rlsSql = `ALTER TABLE public.${quoteIdent(table_name)} ENABLE ROW LEVEL SECURITY`;
        await adminClient.rpc("exec_ddl", { sql_text: rlsSql });

        // Create RLS policy for authenticated access
        const policySql = `CREATE POLICY "Authenticated access" ON public.${quoteIdent(table_name)} FOR ALL TO authenticated USING (true) WITH CHECK (true)`;
        await adminClient.rpc("exec_ddl", { sql_text: policySql });

        result = { success: true, message: `Table '${table_name}' created successfully` };
        break;
      }
      default:
        throw new Error(`Unknown action: ${action}`);
    }

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message || "Internal server error" }),
      {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});

function validateTableName(name: string) {
  if (!isValidIdentifier(name)) {
    throw new Error("Invalid table name.");
  }
  if (PROTECTED_TABLES.includes(name)) {
    throw new Error(`Table '${name}' is protected and cannot be modified.`);
  }
}

function sanitizeDefault(value: string, type: string): string {
  if (type === "text" || type === "select") {
    // Escape single quotes
    const escaped = String(value).replace(/'/g, "''");
    return `'${escaped}'`;
  }
  if (type === "boolean") {
    return value === "true" ? "true" : "false";
  }
  if (type === "number" || type === "integer") {
    const num = Number(value);
    if (isNaN(num)) throw new Error("Invalid numeric default value.");
    return String(num);
  }
  return "NULL";
}

async function getSchema(client: any) {
  const sql = `
    SELECT
      t.table_name,
      json_agg(
        json_build_object(
          'column_name', c.column_name,
          'data_type', c.data_type,
          'udt_name', c.udt_name,
          'is_nullable', c.is_nullable,
          'column_default', c.column_default,
          'is_primary', COALESCE(tc_info.is_pk, false),
          'is_foreign_key', COALESCE(fk_info.is_fk, false),
          'fk_table', fk_info.ref_table,
          'fk_column', fk_info.ref_column
        ) ORDER BY c.ordinal_position
      ) as columns
    FROM information_schema.tables t
    JOIN information_schema.columns c ON c.table_name = t.table_name AND c.table_schema = t.table_schema
    LEFT JOIN LATERAL (
      SELECT true as is_pk
      FROM information_schema.table_constraints tc
      JOIN information_schema.key_column_usage kcu
        ON tc.constraint_name = kcu.constraint_name AND tc.table_schema = kcu.table_schema
      WHERE tc.constraint_type = 'PRIMARY KEY'
        AND tc.table_name = t.table_name
        AND tc.table_schema = 'public'
        AND kcu.column_name = c.column_name
      LIMIT 1
    ) tc_info ON true
    LEFT JOIN LATERAL (
      SELECT true as is_fk,
             ccu.table_name as ref_table,
             ccu.column_name as ref_column
      FROM information_schema.table_constraints tc
      JOIN information_schema.key_column_usage kcu
        ON tc.constraint_name = kcu.constraint_name AND tc.table_schema = kcu.table_schema
      JOIN information_schema.constraint_column_usage ccu
        ON ccu.constraint_name = tc.constraint_name AND ccu.table_schema = tc.table_schema
      WHERE tc.constraint_type = 'FOREIGN KEY'
        AND tc.table_name = t.table_name
        AND tc.table_schema = 'public'
        AND kcu.column_name = c.column_name
      LIMIT 1
    ) fk_info ON true
    WHERE t.table_schema = 'public'
      AND t.table_type = 'BASE TABLE'
      AND t.table_name != 'table_settings'
    GROUP BY t.table_name
    ORDER BY t.table_name
  `;
  const { data, error } = await client.rpc("exec_query", { sql_text: sql });
  if (error) throw new Error(error.message);
  return { tables: data };
}
