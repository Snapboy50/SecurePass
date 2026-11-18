
import os
import sqlite3
from pathlib import Path



# Local SQLite database location
SQLITE_DATABASE = Path(__file__).resolve().parent.parent / "securepass.db"


# Connect to PostgreSQL online or SQLite locally
def get_connection():

    database_url = os.environ.get("DATABASE_URL")

    if database_url:

        import psycopg
        from psycopg.rows import dict_row

        database_url = database_url.replace(
            "postgres://",
            "postgresql://",
            1
        )

        return psycopg.connect(
            database_url,
            row_factory=dict_row
        )

    return sqlite3.connect(str(SQLITE_DATABASE))


# Create the SecurePass database and table
def create_database():

    database_url = os.environ.get("DATABASE_URL")

    connection = get_connection()
    cursor = connection.cursor()

    if database_url:

        cursor.execute("""
            CREATE TABLE IF NOT EXISTS password_history (
                id BIGSERIAL PRIMARY KEY,
                checked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                password_length INTEGER NOT NULL,
                criteria_met INTEGER NOT NULL,
                strength TEXT NOT NULL
            )
        """)

    else:

        cursor.execute("""
            CREATE TABLE IF NOT EXISTS password_history (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                checked_at TEXT DEFAULT CURRENT_TIMESTAMP,
                password_length INTEGER NOT NULL,
                criteria_met INTEGER NOT NULL,
                strength TEXT NOT NULL
            )
        """)

    connection.commit()
    connection.close()

    print("SecurePass database and table created successfully!")


# Save password-checking results
def save_password_history(password_length, criteria_met, strength):

    connection = get_connection()
    cursor = connection.cursor()

    database_url = os.environ.get("DATABASE_URL")

    placeholder = "%s" if database_url else "?"

    cursor.execute(
        f"""
        INSERT INTO password_history
        (password_length, criteria_met, strength)
        VALUES ({placeholder}, {placeholder}, {placeholder})
        """,
        (password_length, criteria_met, strength)
    )

    connection.commit()
    connection.close()


# Retrieve password history
def get_password_history():

    connection = get_connection()

    if os.environ.get("DATABASE_URL"):
        cursor = connection.cursor()
    else:
        connection.row_factory = sqlite3.Row
        cursor = connection.cursor()

    cursor.execute("""
        SELECT id, checked_at, password_length, criteria_met, strength
        FROM password_history
        ORDER BY id DESC
        LIMIT 50
    """)

    records = [dict(row) for row in cursor.fetchall()]

    # Convert PostgreSQL timestamps into strings for JSON
    for record in records:

        if hasattr(record["checked_at"], "strftime"):
            record["checked_at"] = record["checked_at"].strftime(
                "%Y-%m-%d %H:%M:%S"
            )

    connection.close()

    return records


# Clear password history
def clear_password_history():

    connection = get_connection()
    cursor = connection.cursor()

    cursor.execute("DELETE FROM password_history")

    deleted_count = cursor.rowcount

    connection.commit()
    connection.close()

    return deleted_count


if __name__ == "__main__":
    create_database()
