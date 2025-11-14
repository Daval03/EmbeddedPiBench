import sqlite3
from contextlib import contextmanager
from typing import List, Tuple, Optional
import json

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
def fetch_all_type()-> Optional[List[Tuple]]:    
    """name and type"""
    query = "SELECT algorithm, type FROM pi_estimations;"
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



def load_algorithms():
    with open('backend/db/description.json', 'r') as f:
        return json.load(f)

def get_algorithm_description(algorithm_name):
    algorithms = load_algorithms()
    key = algorithm_name.lower()
    
    if key in algorithms:
        return f"{algorithm_name.upper()}: {algorithms[key]}"
    else:
        available = ", ".join(algorithms.keys())
        return f"Algorithm '{algorithm_name}' not found. Available: {available}"

def get_all_algorithm_description(algorithm_list):
    info = []
    for algo in algorithm_list:
        info.append(get_algorithm_description(algo))
    return info

