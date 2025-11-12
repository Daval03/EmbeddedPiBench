from flask import Blueprint, jsonify, current_app
import logging

logger = logging.getLogger(__name__)

# Blueprint para las rutas de la API
api_bp = Blueprint('api', __name__, url_prefix='/api')


@api_bp.route('/health', methods=['GET'])
def health_check():
    """Health check del servidor Flask"""
    return jsonify({
        'status': 'ok',
        'service': 'Flask Proxy Server'
    }), 200

@api_bp.route('/send-info', methods=['GET'])
def send_info():
    """Envía información combinada de estimaciones y algoritmos"""
    client = current_app.frontend_client
    data, status_code = client.get_combined_data(
        timeout=current_app.config.get('FRONTEND_DATA_TIMEOUT', 30)
    )
    return jsonify(data), status_code

@api_bp.route('/check-server-c', methods=['GET'])
def check_server_c():
    """Verifica si el servidor C está activo"""
    client = current_app.server_c_client
    data, status_code = client.health_check(
        timeout=current_app.config['SERVER_C_HEALTH_TIMEOUT']
    )
    return jsonify(data), status_code


@api_bp.route('/pi/<algorithm>', methods=['GET'])
def calculate_pi(algorithm):
    """
    Proxy para cálculos de Pi desde el servidor C
    
    Args:
        algorithm: Nombre del algoritmo (leibniz, montecarlo, etc.)
    """
    # Validación básica
    if not algorithm or len(algorithm) > 50:
        return jsonify({
            'error': 'Algoritmo inválido'
        }), 400
    
    client = current_app.server_c_client
    data, status_code = client.calculate_pi(algorithm)
    return jsonify(data), status_code


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