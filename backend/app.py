from flask import Flask
from flask_cors import CORS
import logging
from config import get_config
from services.server_c_client import ServerCClient
from routes.api import api_bp


def setup_logging(app):
    """Configura el sistema de logging"""
    log_level = getattr(logging, app.config['LOG_LEVEL'])
    
    # Formato de los logs
    formatter = logging.Formatter(
        '[%(asctime)s] %(levelname)s in %(module)s: %(message)s'
    )
    
    # Handler para consola
    console_handler = logging.StreamHandler()
    console_handler.setFormatter(formatter)
    console_handler.setLevel(log_level)
    
    # Configurar el logger de la app
    app.logger.addHandler(console_handler)
    app.logger.setLevel(log_level)
    
    # Configurar logging general
    logging.basicConfig(level=log_level)


def create_app(config_name='default'):
    """
    Application Factory Pattern
    Crea y configura la aplicación Flask
    """
    app = Flask(__name__)
    
    # Cargar configuración
    config = get_config()
    app.config.from_object(config)
    
    # Setup logging
    setup_logging(app)
    
    # Configurar CORS
    CORS(app, origins=app.config['CORS_ORIGINS'])
    
    # Inicializar cliente del Servidor C
    app.server_c_client = ServerCClient(
        base_url=app.config['SERVER_C_BASE'],
        default_timeout=app.config['SERVER_C_TIMEOUT']
    )
    
    # Registrar blueprints
    app.register_blueprint(api_bp)
    
    # Cleanup al cerrar la app
    @app.teardown_appcontext
    def cleanup(exception=None):
        if hasattr(app, 'server_c_client'):
            app.server_c_client.close()
    
    app.logger.info("✅ Flask Proxy Server configurado correctamente")
    
    return app


if __name__ == '__main__':
    app = create_app()
    
    print("🚀 Flask Proxy Server iniciado")
    print(f"📍 Servidor C: {app.config['SERVER_C_BASE']}")
    print(f"🔧 Modo: {'DEBUG' if app.config['DEBUG'] else 'PRODUCTION'}")
    
    app.run(
        host='0.0.0.0',
        port=5000,
        debug=app.config['DEBUG']
    )