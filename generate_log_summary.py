import pandas as pd
import sqlite3

def load_logs_from_db(db_path='database.db'):
    conn = sqlite3.connect(db_path)
    df = pd.read_sql_query("SELECT * FROM logs", conn, parse_dates=['timestamp'])
    conn.close()
    return df

def detect_anomalies(df):
    summary = {}

    if 'bytes_sent' in df.columns:
        threshold = df['bytes_sent'].mean() + 3 * df['bytes_sent'].std()
        summary['large_bytes'] = df[df['bytes_sent'] > threshold]

    if 'status_code' in df.columns and not df['status_code'].empty:
        summary['most_common_status'] = df['status_code'].mode()[0]

    if 'ip_address' in df.columns and not df['ip_address'].empty:
        summary['most_common_ip'] = df['ip_address'].mode()[0]

    return summary

def export_summary(summary, logs, out_file='log_summary.csv'):
    total_requests = len(logs)
    num_large_bytes = len(summary.get('large_bytes', []))
    most_common_status = summary.get('most_common_status', 'N/A')
    most_common_ip = summary.get('most_common_ip', 'N/A')

    with open(out_file, 'w') as f:
        f.write("Executive Summary\n")
        f.write("=================\n")
        f.write(f"Total requests analyzed: {total_requests}\n")
        f.write(f"Number of large requests (anomalies): {num_large_bytes}\n")
        f.write(f"Most common status code: {most_common_status}\n")
        f.write(f"Most common IP address: {most_common_ip}\n")
        if num_large_bytes > 0:
            f.write("ALERT: Large requests detected. Please review for potential abuse or misconfiguration.\n")
        f.write("\n\nDetailed Anomaly Data\n")
        f.write("====================\n")
        for key, value in summary.items():
            f.write(f"\n{key}:\n")
            if isinstance(value, pd.DataFrame) and not value.empty:
                value.to_csv(f, index=False)
            elif isinstance(value, pd.DataFrame):
                f.write("No data\n")
            else:
                f.write(str(value) + "\n")

if __name__ == "__main__":
    logs = load_logs_from_db()
    if logs.empty:
        print("No valid log entries found in database.")
    else:
        summary = detect_anomalies(logs)
        export_summary(summary, logs)
        print("Summary report generated as log_summary.csv")