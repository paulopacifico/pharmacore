CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE "audit_events" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid()::text,
    "type" TEXT NOT NULL,
    "occurred_at" TIMESTAMPTZ NOT NULL,
    "method" TEXT NOT NULL,
    "endpoint" TEXT NOT NULL,
    "user_id" TEXT,
    "user_email" TEXT,
    "permission_id" TEXT,
    "permission_alias" TEXT,
    "action" TEXT NOT NULL,
    "criticality" TEXT NOT NULL,
    "status_code" INTEGER,
    "duration_ms" INTEGER NOT NULL,
    CONSTRAINT "audit_events_pkey" PRIMARY KEY ("occurred_at", "id")
) PARTITION BY RANGE ("occurred_at");

-- INFO: Partição de fallback: recebe eventos fora do range (caso um cron job atrase).
CREATE TABLE IF NOT EXISTS "audit_events_default"
PARTITION OF "audit_events" DEFAULT;

-- INFO: Índice para consultas por janela de tempo.
CREATE INDEX "audit_events_occurred_at_brin_idx"
ON "audit_events" USING BRIN ("occurred_at");

-- INFO: Índice para consultas por usuário, priorizando eventos mais recentes.
CREATE INDEX "audit_events_user_id_occurred_at_idx"
ON "audit_events" ("user_id", "occurred_at" DESC);

-- INFO: Garante a criação das partições mensais atuais/futuras.
CREATE OR REPLACE FUNCTION ensure_audit_events_partitions(months_ahead INTEGER DEFAULT 3)
RETURNS VOID
LANGUAGE plpgsql
AS $$
DECLARE
    i INTEGER;
    part_start DATE;
    part_end DATE;
    part_name TEXT;
BEGIN
    FOR i IN 0..months_ahead LOOP
        part_start := (date_trunc('month', now())::date + make_interval(months => i))::date;
        part_end := (part_start + INTERVAL '1 month')::date;
        part_name := format('audit_events_%s', to_char(part_start, 'YYYYMM'));

        EXECUTE format(
            'CREATE TABLE IF NOT EXISTS %I PARTITION OF "audit_events" FOR VALUES FROM (%L) TO (%L)',
            part_name,
            part_start,
            part_end
        );
    END LOOP;
END;
$$;

-- INFO: Cria as partições iniciais (mês atual + próximos 3).
SELECT ensure_audit_events_partitions(3);

-- INFO: Remove partições antigas com base na política de retenção.
CREATE OR REPLACE FUNCTION drop_old_audit_events_partitions(retention_interval INTERVAL DEFAULT INTERVAL '180 days')
RETURNS VOID
LANGUAGE plpgsql
AS $$
DECLARE
    child_name TEXT;
    child_month DATE;
    cutoff DATE;
BEGIN
    cutoff := date_trunc('month', now() - retention_interval)::date;

    FOR child_name IN
        SELECT c.relname
        FROM pg_inherits i
        JOIN pg_class c ON c.oid = i.inhrelid
        JOIN pg_class p ON p.oid = i.inhparent
        WHERE p.relname = 'audit_events'
          AND c.relname ~ '^audit_events_[0-9]{6}$'
    LOOP
        child_month := to_date(substring(child_name FROM 'audit_events_([0-9]{6})'), 'YYYYMM');

        IF child_month < cutoff THEN
            EXECUTE format('DROP TABLE IF EXISTS %I', child_name);
        END IF;
    END LOOP;
END;
$$;
