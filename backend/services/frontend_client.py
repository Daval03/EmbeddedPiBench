import requests
import logging
from utils.get_db import *
from utils.get_algorithm_url import extract_all_algorithm
from typing import Dict, Tuple, List, Any
from flask import current_app

logger = logging.getLogger(__name__)

class FrontEndClient:
    """Cliente para comunicación con el frontend"""
    
    def __init__(self, base_url: str, default_timeout: int = 30):
        self.base_url = base_url.rstrip('/')
        self.default_timeout = default_timeout
        self.session = requests.Session()
    
    def get_top_performers(self, top_n: int = 4) -> Tuple[Dict[str, Any], int]:
        """Obtiene el top N de algoritmos más rápidos"""
        try:
            estimations = top_elements(top_n)
            response_data = {
                "status": "success",
                "data": {
                    "estimations": [
                        {
                            "algorithm": estimation[0],
                            "time_seconds": estimation[1],
                            "correct_digits": estimation[2]
                        }
                        for estimation in estimations
                    ],
                    "metadata": {
                        "count": len(estimations),
                        "top_n": top_n
                    }
                }
            }
            return response_data, 200
            
        except Exception as e:
            logger.error(f"Error obteniendo top performers: {e}")
            return self._create_error_response("Error retrieving top performers", str(e)), 500
    
    def rerun_algorithm(self, request) -> Tuple[Dict[str, Any], int]:
        """
        Re-ejecuta un algoritmo específico en el servidor C y actualiza la base de datos
        
        Args:
            request: Objeto request de Flask con los datos JSON
            
        Returns:
            Tuple[Dict, int]: (response_data, status_code)
        """
        try:
            data = request.get_json()
            
            if not data or 'algorithmName' not in data:
                return {
                    'error': 'algorithmName is required'
                }, 400
            
            algorithm_name = data['algorithmName']
            
            # Llamar al servidor C para ejecutar el algoritmo
            server_c_client = current_app.server_c_client
            result_data, result_status = server_c_client.run_algorithm(algorithm_name)
            
            # Actualizar la base de datos con el nuevo resultado
            if result_status == 200:
                success = update_estimation_after_rerun(algorithm_name, result_data)
                if success:
                    logger.info(f"Base de datos actualizada para {algorithm_name}")
                else:
                    logger.warning(f"No se pudo actualizar la base de datos para {algorithm_name}")
            
            return {
                'algorithmName': algorithm_name,
                'result': result_data
            }, result_status
            
        except Exception as e:
            logger.exception("Error processing rerun request")
            return {
                'error': 'Error processing request',
                'details': str(e)
            }, 500
        
    def get_algorithms_info(self) -> Tuple[Dict[str, Any], int]:
        """
        Obtiene información de todos los algoritmos disponibles:
        - Código/implementación
        - Descripción
        - Información de metadatos
        """

        try:
            algorithms = extract_all_algorithm()                  
            algorithm_ids = list(algorithms.keys())
            formulas_data = get_all_formula_description(algorithm_ids)
            types_map = dict(fetch_all_type())

            # Crear un mapa de descripciones por ID
            descriptions_map = {}
            for formula_data in formulas_data:
                if isinstance(formula_data, dict):
                    algorithm_id = formula_data['id']
                    descriptions_map[algorithm_id] = formula_data.get('description', '')

            algorithms_data = {
                name: {
                    "implementation": code,
                    "description": descriptions_map.get(name, ''),
                    "type": types_map.get(name, "Unknown")
                }
                for name, code in algorithms.items()
            }
            response_data = {
                "status": "success",
                "data": {
                    "algorithms": algorithms_data,
                    "metadata": {
                        "total_algorithms": len(algorithms_data)
                    }
                }
            }

            return response_data, 200

        except Exception as e:
            logger.exception("Error obteniendo información de algoritmos")  
            return self._create_error_response(
                "Error retrieving algorithms information",
                str(e)
            ), 500


    def get_estimations_without_algorithms(self) -> Tuple[Dict[str, Any], int]:
        """Obtiene todas las estimaciones de PI sin información de algoritmos"""
        try:
            estimations = fetch_all_estimations()
            
            estimations_data = []
            for estimation in estimations:
                estimation_data = {
                    "id": estimation[0],
                    "pi_estimate": float(estimation[1]) if estimation[1] else None,
                    "algorithm": estimation[2], 
                    "iterations": estimation[3],
                    "time_seconds": estimation[4],  
                    "iterations_per_second": estimation[5],  
                    "correct_digits": estimation[6],  
                    "perfect_decimal_precision": bool(estimation[8]),
                    "absolute_error": estimation[9],
                    "relative_error": estimation[10],
                    "type": estimation[12]
                }
                estimations_data.append(estimation_data)
            
            response_data = {
                "status": "success",
                "data": {
                    "estimations": estimations_data,
                    "metadata": {
                        "total_estimations": len(estimations_data)
                    }
                }
            }
            return response_data, 200
            
        except Exception as e:
            logger.error(f"Error obteniendo estimaciones: {e}")
            return self._create_error_response("Error retrieving estimations", str(e)), 500
    
    def get_formulas_info(self) -> Tuple[Dict[str, Any], int]:
        """
        Obtiene información completa de todas las fórmulas disponibles:
        - Datos completos de cada fórmula
        - Descripciones detalladas
        - Metadatos estructurados
        """
        try:
            algorithms = extract_all_algorithm()
            algorithm_ids = list(algorithms.keys())
        
            formulas_data = get_all_formula_description(algorithm_ids)

            formulas_info = {}
            for formula_data in formulas_data:
                if isinstance(formula_data, dict):  
                    algorithm_id = formula_data['id']
                    
                    formulas_info[algorithm_id] = {
                        "id": algorithm_id,
                        "name": formula_data.get('name', ''),
                        "formula": formula_data.get('formula', ''),
                        "full_description": formula_data.get('description', ''),
                        "deep_explanation": formula_data.get('deepExplanation', ''),
                        "convergence": formula_data.get('convergence', ''),
                        "applications": formula_data.get('applications', ''),
                        "complexity": formula_data.get('complexity', ''),
                    }
            
            response_data = {
                "status": "success",
                "data": {
                    "formulas": formulas_info,
                    "metadata": {
                        "total_formulas": len(formulas_info),
                        "available_ids": list(formulas_info.keys())
                    }
                }
            }
            return response_data, 200
        except Exception as e:
            logger.exception("Error obteniendo información de fórmulas")
            return self._create_error_response(
                "Error retrieving formulas information",
                str(e)
            ), 500
    
    def get_estimations(self) -> Tuple[Dict[str, Any], int]:
        """Obtiene todas las estimaciones de PI con sus codigons"""
        try:
            estimations = fetch_all_estimations()
            algorithms = extract_all_algorithm()
            
            estimations_data = []
            for estimation in estimations:
                estimation_data = {
                    "id": estimation[0],
                    "pi_estimate": float(estimation[1]) if estimation[1] else None,
                    "algorithm": estimation[2], 
                    "iterations": estimation[3],
                    "time_seconds": estimation[4],  
                    "iterations_per_second": estimation[5],  
                    "correct_digits": estimation[6],  
                    "perfect_decimal_precision": bool(estimation[8]),
                    "absolute_error": estimation[9],
                    "relative_error": estimation[10],
                    "type": estimation[12]
                }
                estimations_data.append(estimation_data)
            
            response_data = {
                "status": "success",
                "data": {
                    "estimations": estimations_data,
                    "available_algorithms": list(algorithms.keys()),
                    "algorithm_implementations": algorithms,
                    "metadata": {
                        "total_estimations": len(estimations_data),
                        "total_algorithms": len(algorithms)
                    }
                }
            }
            return response_data, 200
            
        except Exception as e:
            logger.error(f"Error obteniendo estimaciones: {e}")
            return self._create_error_response("Error retrieving estimations", str(e)), 500

    def _find_algorithm_description(self, algorithm_name: str, descriptions: List[str]) -> str:
        """Busca la descripción de un algoritmo en la lista de descripciones"""
        for desc in descriptions:
            if algorithm_name.upper() in desc.split(':')[0]:
                return desc.split(': ')[1] if ': ' in desc else desc
        return f"Implementation of {algorithm_name} algorithm"

    def _create_error_response(self, message: str, details: str = None) -> Dict[str, Any]:
        """Crea una respuesta de error estandarizada"""
        error_response = {
            "status": "error",
            "error": {
                "message": message,
                "code": "INTERNAL_ERROR"
            }
        }
        if details:
            error_response["error"]["details"] = details
        return error_response

    def close(self):
        """Cierra la sesión de requests"""
        self.session.close()