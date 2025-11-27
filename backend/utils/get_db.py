import sqlite3
from contextlib import contextmanager
from typing import List, Tuple, Optional, Dict, Any
import json
import os

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DB_PATH = os.path.join(BASE_DIR, 'db', 'pi_database.db')
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

def update_estimation_after_rerun(algorithm_name: str, new_data: Dict[str, Any]) -> bool:
    """
    Actualiza un registro específico después de re-ejecutar un algoritmo.
    
    Args:
        algorithm_name: Nombre del algoritmo a actualizar
        new_data: Datos nuevos del cálculo (resultado del servidor C)
        
    Returns:
        True si fue exitoso, False si hubo error
    """
    update_fields = {
        'pi_estimate': new_data.get('pi_estimate'),
        'iterations': new_data.get('iterations'),
        'time_seconds': new_data.get('time_seconds'),
        'iterations_per_second': new_data.get('iterations_per_second'),
        'correct_digits': new_data.get('correct_digits'),
        'max_decimal_digits': new_data.get('max_decimal_digits'),
        'perfect_decimal_precision': new_data.get('perfect_decimal_precision'),
        'absolute_error': new_data.get('absolute_error'),
        'relative_error': new_data.get('relative_error')
    }
    
    # Filtrar campos None
    update_fields = {k: v for k, v in update_fields.items() if v is not None}
    
    if not update_fields:
        print("No hay datos válidos para actualizar")
        return False
    
    # Construir la consulta UPDATE
    set_parts = [f"{field} = ?" for field in update_fields.keys()]
    params = list(update_fields.values())
    params.append(algorithm_name)  # Para el WHERE clause
    
    query = f"""
        UPDATE pi_estimations 
        SET {', '.join(set_parts)}
        WHERE algorithm = ?
    """
    
    try:
        with get_db_connection() as conn:
            cursor = conn.cursor()
            cursor.execute(query, tuple(params))
            conn.commit()
            
            if cursor.rowcount > 0:
                print(f"✅ Registro actualizado para algoritmo: {algorithm_name}")
                return True
            else:
                print(f"⚠️ No se encontró el algoritmo: {algorithm_name}")
                return False
                
    except sqlite3.Error as error:
        print(f"❌ Error al actualizar registro: {error}")
        return False
    
################################################

def load_algorithms(PATH):
    with open(PATH, 'r') as f:
        return json.load(f)


def get_algorithm_details(algorithm_id):
    """Obtiene toda la información detallada de un algoritmo específico"""
    algorithms = load_algorithms(FORMULA_PATH)
    
    for algorithm in algorithms:
        if algorithm['id'] == algorithm_id.lower():
            return algorithm
        
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