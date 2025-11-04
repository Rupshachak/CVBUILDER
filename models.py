import sqlite3
import os

def init_db():
    os.makedirs("static/resumes", exist_ok=True)
    conn = sqlite3.connect('users.db')
    c = conn.cursor()

    c.execute('''CREATE TABLE IF NOT EXISTS users (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    email TEXT UNIQUE NOT NULL,
                    password TEXT NOT NULL
                )''')

    c.execute('''CREATE TABLE IF NOT EXISTS resumes (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    user_id INTEGER,
                    name TEXT,
                    email TEXT,
                    phone TEXT,
                    education TEXT,
                    experience TEXT,
                    skills TEXT,
                    template_style TEXT,
                    created_at TEXT,
                    FOREIGN KEY (user_id) REFERENCES users(id)
                )''')
    conn.commit()
    conn.close()

def get_db():
    return sqlite3.connect('users.db')
