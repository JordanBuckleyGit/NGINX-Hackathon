CREATE TABLE logs_new (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    ip_address TEXT,
    timestamp TEXT,
    request TEXT,
    status_code TEXT,
    bytes_sent INTEGER,
    user_agent TEXT
);

INSERT INTO logs_new (id, ip_address, timestamp, request, status_code, bytes_sent, user_agent)
SELECT id, ip_address, timestamp, request, status_code, bytes_sent, user_agent FROM logs;

DROP TABLE logs;

ALTER TABLE logs_new RENAME TO logs;