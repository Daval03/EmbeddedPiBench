import requests
import logging
from utils.get_db import fetch_all_estimations
from utils.get_algorithm_url import extract_all_algorithm
from typing import Dict, Tuple

logger = logging.getLogger(__name__)

class FrontEndClient:
    """Cliente para comunicarse con el front end"""    
    def __init__(self, base_url: str, default_timeout: int = 30):
        self.base_url = base_url.rstrip('/')
        self.default_timeout = default_timeout
        self.session = requests.Session()
    
    def get_combined_data(self, timeout: int = None):
        """Obtiene datos combinados de estimaciones y algoritmos"""
        try:
            # Obtener estimaciones de la base de datos
            estimations = fetch_all_estimations()
            
            # Obtener implementaciones de algoritmos
            algorithms = extract_all_algorithm()
            
            # Combinar los datos
            combined_data = {
                "status": "success",
                "estimations": [],
                "algorithms": list(algorithms.keys()),
                "algorithm_implementations": algorithms
            }
            
            # Procesar las estimaciones
            for estimation in estimations:
                estimation_dict = {
                    "id": estimation[0],
                    "pi_estimate": float(estimation[1]) if estimation[1] else None,
                    "algorithm": estimation[2], 
                    "iterations": estimation[3],
                    "time_seconds": estimation[4],  
                    "iterations_per_second": estimation[5],  
                    "correct_digits": estimation[6],  
                    "perfect_decimal_precision": bool(estimation[8]),
                    "absolute_error": estimation[9],
                    "relative_error": estimation[10]
                }
                combined_data["estimations"].append(estimation_dict)
            
            return combined_data, 200
            
        except Exception as e:
            logger.error(f"Error obteniendo datos combinados: {e}")
            return {"error": str(e)}, 500

    
    def close(self):
        """Cierra la sesión de requests"""
        self.session.close()