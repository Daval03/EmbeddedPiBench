from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Permite peticiones desde el frontend

# Variable para almacenar el último resultado
current_result = {
    'digits': 8,
    'algorithm': 'xd',
    'timestamp': '1'
}

@app.route('/api/pi-digits', methods=['POST'])
def update_pi_digits():
    """Recibe el número de dígitos calculados desde la Raspberry Pi"""
    data = request.get_json()
    
    if not data or 'digits' not in data:
        return jsonify({'error': 'Faltan datos'}), 400
    
    current_result['digits'] = data.get('digits', 0)
    current_result['algorithm'] = data.get('algorithm', 'unknown')
    current_result['timestamp'] = data.get('timestamp', '')
    
    return jsonify({'status': 'success', 'message': 'Datos actualizados'}), 200

@app.route('/api/pi-digits', methods=['GET'])
def get_pi_digits():
    """Devuelve el último resultado calculado"""
    return jsonify(current_result), 200

@app.route('/api/health', methods=['GET'])
def health_check():
    """Endpoint para verificar que el servidor está funcionando"""
    return jsonify({'status': 'ok'}), 200

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)