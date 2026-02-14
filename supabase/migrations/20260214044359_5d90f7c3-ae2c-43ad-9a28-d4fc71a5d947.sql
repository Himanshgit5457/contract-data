
-- Create a function to execute DDL statements (schema changes only)
-- This is used by the schema-manager edge function with service role
CREATE OR REPLACE FUNCTION public.exec_ddl(sql_text TEXT)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Only allow DDL statements (CREATE, ALTER, DROP)
  IF NOT (
    sql_text ~* '^\s*(CREATE|ALTER|DROP)\s'
  ) THEN
    RAISE EXCEPTION 'Only DDL statements are allowed';
  END IF;
  
  -- Block dangerous operations
  IF sql_text ~* '\b(auth|storage|realtime|supabase_functions|vault|pg_)\b' THEN
    RAISE EXCEPTION 'Cannot modify system schemas';
  END IF;
  
  EXECUTE sql_text;
END;
$$;

-- Create a function to execute read-only queries
CREATE OR REPLACE FUNCTION public.exec_query(sql_text TEXT)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  result JSONB;
BEGIN
  -- Only allow SELECT statements
  IF NOT (sql_text ~* '^\s*SELECT\s') THEN
    RAISE EXCEPTION 'Only SELECT statements are allowed';
  END IF;
  
  EXECUTE 'SELECT jsonb_agg(row_to_json(t)) FROM (' || sql_text || ') t' INTO result;
  RETURN COALESCE(result, '[]'::jsonb);
END;
$$;

-- Revoke direct access - only callable via service role
REVOKE EXECUTE ON FUNCTION public.exec_ddl(TEXT) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.exec_ddl(TEXT) FROM authenticated;
REVOKE EXECUTE ON FUNCTION public.exec_query(TEXT) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.exec_query(TEXT) FROM authenticated;
