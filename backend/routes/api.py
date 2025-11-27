from flask import Blueprint, jsonify, current_app, request
import logging
from utils.get_db import *
logger = logging.getLogger(__name__)
# Blueprint para las rutas de la API
api_bp = Blueprint('api', __name__, url_prefix='/api/v1')


@api_bp.route('/health', methods=['GET'])
def health_check():
    """Health check del servidor Flask"""
    return jsonify({
        'status': 'ok',
        'service': 'Flask Proxy Server'
    }), 200

@api_bp.route('/estimations', methods=['GET'])
def send_info():
    """Envía información combinada de estimaciones y algoritmos"""
    client = current_app.frontend_client
    data, status_code = client.get_estimations()
    return jsonify(data), status_code

@api_bp.route('/estimations/basic', methods=['GET'])
def send_basic_estimations():
    """Envía solo las estimaciones sin información de algoritmos"""
    client = current_app.frontend_client
    data, status_code = client.get_estimations_without_algorithms()
    return jsonify(data), status_code

@api_bp.route('/formulas', methods=['GET'])
def send_formulas_data():
    """Envía información completa de todas las fórmulas disponibles"""
    client = current_app.frontend_client
    data, status_code = client.get_formulas_info()
    return jsonify(data), status_code

@api_bp.route('/algorithms', methods=['GET'])
def send_description_data():
    """ """
    client = current_app.frontend_client
    data, status_code = client.get_algorithms_info()
    return jsonify(data), status_code

@api_bp.route('/estimations/top', methods=['GET'])
def send_top_4():
    """Envía información del top 4 algorithmos"""
    client = current_app.frontend_client
    data, status_code = client.get_top_performers(4)
    return jsonify(data), status_code

@api_bp.route('/servers/c/health', methods=['GET'])
def check_server_c():
    """Verifica si el servidor C está activo"""
    client = current_app.server_c_client
    data, status_code = client.health_check(
        timeout=current_app.config['SERVER_C_HEALTH_TIMEOUT']
    )
    return jsonify(data), status_code

@api_bp.route('/estimations/rerun', methods=['POST'])
def rerun_algorithm():
    """Endpoint para re-ejecutar un algoritmo específico"""
    client = current_app.frontend_client
    data, status_code = client.rerun_algorithm(request)
    return jsonify(data), status_code

# @api_bp.route('/estimations/rerun', methods=['POST'])
# def rerun_algorithm():
#     """Endpoint para re-ejecutar un algoritmo específico"""
#     try:
#         data = request.get_json()
        
#         if not data or 'algorithmName' not in data:
#             return jsonify({
#                 'error': 'algorithmName is required'
#             }), 400
        
#         algorithm_name = data['algorithmName']
        
#         # Print the algorithm name to console
#         #print(f"🔄 Re-run requested for algorithm: {algorithm_name}")
        
#         # Llamar al servidor C para ejecutar el algoritmo
#         server_c_client = current_app.server_c_client
#         result_data, result_status = server_c_client.run_algorithm(algorithm_name)
        
#         # Imprimir el resultado en pantalla
#         #print(f"✅ Result from Server C: {result_data}")
        
#         # ACTUALIZAR LA BASE DE DATOS CON EL NUEVO RESULTADO
#         if result_status == 200:
#             success = update_estimation_after_rerun(algorithm_name, result_data)
#             if success:
#                 print(f"📊 Base de datos actualizada para {algorithm_name}")
#             else:
#                 print(f"⚠️ No se pudo actualizar la base de datos para {algorithm_name}")
        
#         return jsonify({
#             'algorithmName': algorithm_name,
#             'result': result_data
#         }), result_status
        
#     except Exception as e:
#         logger.exception("Error processing rerun request")
#         return jsonify({
#             'error': 'Error processing request',
#             'details': str(e)
#         }), 500

# Manejadores de errores
@api_bp.errorhandler(404)
def not_found(error):
    """Maneja endpoints no encontrados"""
    return jsonify({
        'error': 'Endpoint no encontrado',
        'status': 404
    }), 404


@api_bp.errorhandler(500)
def internal_error(error):
    """Maneja errores internos del servidor"""
    logger.exception("Error interno del servidor")
    return jsonify({
        'error': 'Error interno del servidor',
        'status': 500
    }), 500