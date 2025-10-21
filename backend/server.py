import requests
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Permite peticiones desde el frontend

# URL del servidor C
SERVER_C_BASE = "http://192.168.18.40:8080"

@app.route('/api/check-server-c', methods=['GET'])
def check_server_c():
    """Verifica si el servidor C está activo"""
    try:
        # Ahora usa el endpoint correcto /api/health
        r = requests.get(f"{SERVER_C_BASE}/api/health", timeout=2)
        
        if r.status_code == 200:
            data = r.json()
            return jsonify({
                'server_c_status': 'ok', 
                'details': data
            }), 200
        else:
            return jsonify({
                'server_c_status': 'error', 
                'code': r.status_code
            }), 500
            
    except requests.exceptions.Timeout:
        return jsonify({
            'server_c_status': 'timeout',
            'error': 'Servidor C no responde (timeout)'
        }), 504
        
    except requests.exceptions.ConnectionError:
        return jsonify({
            'server_c_status': 'unreachable',
            'error': 'No se puede conectar al servidor C'
        }), 503
        
    except Exception as e:
        return jsonify({
            'server_c_status': 'error',
            'error': str(e)
        }), 500


@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check del servidor Flask"""
    return jsonify({
        'status': 'ok',
        'service': 'Flask Proxy Server'
    }), 200


@app.route('/api/pi/<algorithm>', methods=['GET'])
def calculate_pi(algorithm):
    """Proxy para cálculos de Pi desde el servidor C"""
    try:
        # Reenvía la petición al servidor C
        r = requests.get(
            f"{SERVER_C_BASE}/api/pi/{algorithm}", 
            timeout=30  # Los cálculos pueden tardar
        )
        return jsonify(r.json()), r.status_code
        
    except requests.exceptions.Timeout:
        return jsonify({
            'error': 'El cálculo tardó demasiado (timeout)',
            'algorithm': algorithm
        }), 504
        
    except Exception as e:
        return jsonify({
            'error': f'Error al comunicarse con servidor C: {str(e)}',
            'algorithm': algorithm
        }), 500


if __name__ == '__main__':
    print("🚀 Flask Proxy Server iniciado")
    print(f"📡 Conectando a servidor C en: {SERVER_C_BASE}")
    app.run(host='0.0.0.0', port=5000, debug=True)