CREATE TABLE logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    ip_address TEXT,
    timestamp TEXT,
    request TEXT,
    status_code TEXT,
    bytes_sent INTEGER,
    referrer TEXT,
    user_agent TEXT
);