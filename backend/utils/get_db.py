import sqlite3
from contextlib import contextmanager
from typing import List, Tuple, Optional
import json
import os

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DB_PATH = os.path.join(BASE_DIR, 'db', 'pi_database.db')
DESCRIPTION_PATH = os.path.join(BASE_DIR, 'db', 'formulaDescriptions.json')
FORMULA_PATH = os.path.join(BASE_DIR, 'db', 'piFormulasData.json')

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



def load_algorithms(PATH):
    with open(PATH, 'r') as f:
        return json.load(f)


def get_algorithm_details(algorithm_id):
    """Obtiene toda la información detallada de un algoritmo específico"""
    algorithms = load_algorithms(FORMULA_PATH)
    
    # Buscar por id
    for algorithm in algorithms:
        if algorithm['id'] == algorithm_id.lower():
            return algorithm
    
    # Si no encuentra por id, buscar por nombre (case insensitive)
    for algorithm in algorithms:
        if algorithm['name'].lower() == algorithm_id.lower():
            return algorithm
    
    available_ids = [algo['id'] for algo in algorithms]
    return f"Algorithm '{algorithm_id}' not found. Available: {', '.join(available_ids)}"

def get_all_formula_description(algorithm_list):
    info = []
    for id in algorithm_list:
        info.append(get_algorithm_details(id))
    return info


def get_algorithm_description(algorithm_name):
    algorithms = load_algorithms(DESCRIPTION_PATH)
    key = algorithm_name.lower()
    
    if key in algorithms:
        return f"{algorithm_name.upper()}: {algorithms[key]}"
    else:
        available = ", ".join(algorithms.keys())
        return f"Algorithm '{algorithm_name}' not found. Available: {available}"

def get_all_algorithm_description(algorithm_list):
    info = []
    for id in algorithm_list:
        info.append(get_algorithm_description(id))
    return info
