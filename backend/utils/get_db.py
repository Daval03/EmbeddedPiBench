import sqlite3
def fetch_all_estimations():
    try:
        sqliteConnection = sqlite3.connect('backend/db/pi_database.db')
        sql_query = """SELECT * FROM pi_estimations;"""
        cursor = sqliteConnection.cursor()
        cursor.execute(sql_query)
        return cursor.fetchall() 
    except sqlite3.Error as error:
        print("Failed to execute the above query", error)
        return None
    finally:
        if sqliteConnection:
            sqliteConnection.close()