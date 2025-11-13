# import sqlite3
# def fetch_all_estimations():
#     try:
#         sqliteConnection = sqlite3.connect('backend/db/pi_database.db')
#         sql_query = """SELECT * FROM pi_estimations;"""
#         cursor = sqliteConnection.cursor()
#         cursor.execute(sql_query)
#         return cursor.fetchall() 
#     except sqlite3.Error as error:
#         print("Failed to execute the above query", error)
#         return None
#     finally:
#         if sqliteConnection:
#             sqliteConnection.close()

# def top_elements(num):
#     try:
#         sqliteConnection = sqlite3.connect('backend/db/pi_database.db')
#         sql_query = """select algorithm, time_seconds, correct_digits from pi_estimations order by time_seconds asc limit ?;"""
#         cursor = sqliteConnection.cursor()
#         cursor.execute(sql_query, (num,))
#         return cursor.fetchall() 
#     except sqlite3.Error as error:
#         print("Failed to execute the above query", error)
#         return None
#     finally:
#         if sqliteConnection:
#             sqliteConnection.close()

# a = top_elements(4)
# print(a)

import sqlite3
from contextlib import contextmanager
from typing import List, Tuple, Optional

DB_PATH = 'backend/db/pi_database.db'

@contextmanager
def get_db_connection():
    """Context manager para manejar conexiones a la base de datos."""
    conn = None
    try:
        conn = sqlite3.connect(DB_PATH)
        yield conn
    except sqlite3.Error as error:
        print(f"Error de base de datos: {error}")
        raise
    finally:
        if conn:
            conn.close()

def execute_query(query: str, params: tuple = ()) -> Optional[List[Tuple]]:
    """
    Ejecuta una consulta SQL y retorna los resultados.
    
    Args:
        query: Consulta SQL a ejecutar
        params: Parámetros para la consulta (opcional)
    
    Returns:
        Lista de tuplas con los resultados o None si hay error
    """
    try:
        with get_db_connection() as conn:
            cursor = conn.cursor()
            cursor.execute(query, params)
            return cursor.fetchall()
    except sqlite3.Error as error:
        print(f"Error al ejecutar consulta: {error}")
        return None

def fetch_all_estimations() -> Optional[List[Tuple]]:
    """Obtiene todas las estimaciones de pi."""
    query = "SELECT * FROM pi_estimations;"
    return execute_query(query)

def top_elements(num: int) -> Optional[List[Tuple]]:
    """
    Obtiene los top N elementos ordenados por tiempo.
    
    Args:
        num: Número de elementos a retornar
    
    Returns:
        Lista de tuplas (algorithm, time_seconds, correct_digits)
    """
    query = """
        SELECT algorithm, time_seconds, correct_digits 
        FROM pi_estimations 
        ORDER BY time_seconds ASC 
        LIMIT ?;
    """
    return execute_query(query, (num,))

print(top_elements(4))