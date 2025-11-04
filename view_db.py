import sqlite3

conn = sqlite3.connect('users.db')
c = conn.cursor()

print("USERS TABLE:")
for row in c.execute("SELECT * FROM users"):
    print(row)

print("\nRESUMES TABLE:")
for row in c.execute("SELECT * FROM resumes"):
    print(row)

conn.close()
