-- Create audit_logs table
CREATE TABLE IF NOT EXISTS audit_logs (
    id SERIAL PRIMARY KEY,
    table_name VARCHAR(50) NOT NULL,
    record_id BIGINT NOT NULL,
    action VARCHAR(10) NOT NULL,
    old_data JSONB,
    new_data JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create trigger function
CREATE OR REPLACE FUNCTION audit_trigger_function()
RETURNS TRIGGER AS $$
BEGIN
    IF (TG_OP = 'DELETE') THEN
        INSERT INTO audit_logs (table_name, record_id, action, old_data)
        VALUES (TG_TABLE_NAME, OLD.id, 'DELETE', row_to_json(OLD));
        RETURN OLD;
    ELSIF (TG_OP = 'UPDATE') THEN
        INSERT INTO audit_logs (table_name, record_id, action, old_data, new_data)
        VALUES (TG_TABLE_NAME, NEW.id, 'UPDATE', row_to_json(OLD), row_to_json(NEW));
        RETURN NEW;
    ELSIF (TG_OP = 'INSERT') THEN
        INSERT INTO audit_logs (table_name, record_id, action, new_data)
        VALUES (TG_TABLE_NAME, NEW.id, 'INSERT', row_to_json(NEW));
        RETURN NEW;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for each table
CREATE TRIGGER users_audit_trigger
AFTER INSERT OR UPDATE OR DELETE ON users
FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();

CREATE TRIGGER equipments_audit_trigger
AFTER INSERT OR UPDATE OR DELETE ON equipments
FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();

CREATE TRIGGER requests_audit_trigger
AFTER INSERT OR UPDATE OR DELETE ON requests
FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();

CREATE TRIGGER returns_audit_trigger
AFTER INSERT OR UPDATE OR DELETE ON returns
FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();

CREATE TRIGGER allocation_logs_audit_trigger
AFTER INSERT OR UPDATE OR DELETE ON allocation_logs
FOR EACH ROW EXECUTE FUNCTION audit_trigger_function(); 