import sqlite3
import re

LOG_PATTERN = re.compile(
    r'(?P<ip_address>\S+) \S+ \S+ \[(?P<timestamp>[^\]]+)\] "(?P<request>[^"]*)" (?P<status_code>\d{3}) (?P<bytes_sent>\S+) "(?P<referrer>[^"]*)" "(?P<user_agent>[^"]*)"'
)

conn = sqlite3.connect('database.db')
cur = conn.cursor()

with open('access.log', 'r') as f:
    for line in f:
        match = LOG_PATTERN.match(line)
        if match:
            data = match.groupdict()
            cur.execute(
                '''INSERT INTO logs (ip_address, timestamp, request, status_code, bytes_sent, referrer, user_agent)
                   VALUES (?, ?, ?, ?, ?, ?, ?)''',
                (
                    data['ip_address'],
                    data['timestamp'],
                    data['request'],
                    data['status_code'],
                    int(data['bytes_sent']) if data['bytes_sent'].isdigit() else 0,
                    data['referrer'],
                    data['user_agent']
                )
            )
conn.commit()
conn.close()
print("Import complete.")