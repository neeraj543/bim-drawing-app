-- Initial data for H2 database
INSERT INTO users (username, password, email, full_name, created_at, updated_at)
VALUES ('system', 'system123', 'system@bim.local', 'System User', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);