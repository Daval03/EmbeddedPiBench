import requests
import logging
from typing import Dict, Tuple

logger = logging.getLogger(__name__)

class ServerCClient:
    """Cliente para comunicarse con el Servidor C"""    
    def __init__(self, base_url: str, default_timeout: int = 30):
        self.base_url = base_url.rstrip('/')
        self.default_timeout = default_timeout
        self.session = requests.Session()
    
    def health_check(self, timeout: int = 2) -> Tuple[Dict, int]:
        """
        Verifica el estado del servidor C
        
        Returns:
            Tuple[Dict, int]: (response_data, status_code)
        """
        try:
            response = self.session.get(
                f"{self.base_url}/api/health",
                timeout=timeout
            )
            
            if response.status_code == 200:
                return {
                    'server_c_status': 'ok',
                    'details': response.json()
                }, 200
            else:
                logger.warning(f"Servidor C respondió con código {response.status_code}")
                return {
                    'server_c_status': 'error',
                    'code': response.status_code
                }, 500
                
        except requests.exceptions.Timeout:
            logger.error("Timeout al conectar con Servidor C")
            return {
                'server_c_status': 'timeout',
                'error': 'Servidor C no responde (timeout)'
            }, 504
            
        except requests.exceptions.ConnectionError:
            logger.error("Error de conexión con Servidor C")
            return {
                'server_c_status': 'unreachable',
                'error': 'No se puede conectar al servidor C'
            }, 503
            
        except Exception as e:
            logger.exception("Error inesperado al verificar Servidor C")
            return {
                'server_c_status': 'error',
                'error': str(e)
            }, 500
    
    def run_algorithm(self, algorithm: str) -> Tuple[Dict, int]:
        """
        Solicita un cálculo de Pi al servidor C
        
        Args:
            algorithm: Nombre del algoritmo a usar
            
        Returns:
            Tuple[Dict, int]: (response_data, status_code)
        """
        try:
            response = self.session.get(
                f"{self.base_url}/api/pi/{algorithm}",
                timeout=self.default_timeout
            )
            
            logger.info(f"Cálculo de Pi con {algorithm}: status {response.status_code}")
            return response.json(), response.status_code
            
        except requests.exceptions.Timeout:
            logger.error(f"Timeout en cálculo de Pi ({algorithm})")
            return {
                'error': 'El cálculo tardó demasiado (timeout)',
                'algorithm': algorithm
            }, 504
            
        except requests.exceptions.RequestException as e:
            logger.exception(f"Error de red al calcular Pi ({algorithm})")
            return {
                'error': f'Error de comunicación con servidor C: {str(e)}',
                'algorithm': algorithm
            }, 500
            
        except Exception as e:
            logger.exception(f"Error inesperado al calcular Pi ({algorithm})")
            return {
                'error': f'Error interno: {str(e)}',
                'algorithm': algorithm
            }, 500
    
    def close(self):
        """Cierra la sesión de requests"""
        self.session.close()