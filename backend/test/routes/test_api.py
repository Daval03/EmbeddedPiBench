import pytest
import sys
import os
from unittest.mock import Mock, MagicMock, patch
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '../..'))
from flask import Flask
from routes.api import api_bp

@pytest.fixture
def app():
    """Create and configure a test Flask application"""
    app = Flask(__name__)
    app.config['TESTING'] = True
    app.config['SERVER_C_HEALTH_TIMEOUT'] = 2
    
    # Register the blueprint
    app.register_blueprint(api_bp)
    
    # Create mock clients
    app.frontend_client = Mock()
    app.server_c_client = Mock()
    
    return app


@pytest.fixture
def client(app):
    """Create a test client for the Flask application"""
    return app.test_client()


class TestHealthCheck:
    """Tests for /api/v1/health endpoint"""
    
    def test_health_check_success(self, client):
        """Test successful health check"""
        response = client.get('/api/v1/health')
        
        assert response.status_code == 200
        data = response.get_json()
        assert data['status'] == 'ok'
        assert data['service'] == 'Flask Proxy Server'
    
    def test_health_check_returns_json(self, client):
        """Test that health check returns JSON"""
        response = client.get('/api/v1/health')
        
        assert response.content_type == 'application/json'


class TestEstimationsEndpoint:
    """Tests for /api/v1/estimations endpoint"""
    
    def test_send_info_success(self, app, client):
        """Test successful retrieval of estimations with algorithms"""
        # Arrange
        mock_data = {
            "status": "success",
            "data": {
                "estimations": [
                    {"algorithm": "monte_carlo", "pi_estimate": 3.14159}
                ]
            }
        }
        app.frontend_client.get_estimations.return_value = (mock_data, 200)
        
        # Act
        response = client.get('/api/v1/estimations')
        
        # Assert
        assert response.status_code == 200
        data = response.get_json()
        assert data['status'] == 'success'
        assert 'estimations' in data['data']
        app.frontend_client.get_estimations.assert_called_once()
    
    def test_send_info_error(self, app, client):
        """Test error handling in estimations endpoint"""
        # Arrange
        error_data = {
            "status": "error",
            "error": {"message": "Database error"}
        }
        app.frontend_client.get_estimations.return_value = (error_data, 500)
        
        # Act
        response = client.get('/api/v1/estimations')
        
        # Assert
        assert response.status_code == 500
        data = response.get_json()
        assert data['status'] == 'error'


class TestBasicEstimationsEndpoint:
    """Tests for /api/v1/estimations/basic endpoint"""
    
    def test_send_basic_estimations_success(self, app, client):
        """Test successful retrieval of basic estimations"""
        # Arrange
        mock_data = {
            "status": "success",
            "data": {
                "estimations": [
                    {"id": 1, "algorithm": "leibniz", "pi_estimate": 3.14}
                ]
            }
        }
        app.frontend_client.get_estimations_without_algorithms.return_value = (mock_data, 200)
        
        # Act
        response = client.get('/api/v1/estimations/basic')
        
        # Assert
        assert response.status_code == 200
        data = response.get_json()
        assert data['status'] == 'success'
        app.frontend_client.get_estimations_without_algorithms.assert_called_once()
    
    def test_send_basic_estimations_error(self, app, client):
        """Test error in basic estimations endpoint"""
        # Arrange
        error_data = {"status": "error", "error": {"message": "Error"}}
        app.frontend_client.get_estimations_without_algorithms.return_value = (error_data, 500)
        
        # Act
        response = client.get('/api/v1/estimations/basic')
        
        # Assert
        assert response.status_code == 500


class TestFormulasEndpoint:
    """Tests for /api/v1/formulas endpoint"""
    
    def test_send_formulas_data_success(self, app, client):
        """Test successful retrieval of formulas data"""
        # Arrange
        mock_data = {
            "status": "success",
            "data": {
                "formulas": {
                    "monte_carlo": {
                        "name": "Monte Carlo",
                        "formula": "π ≈ 4 * ratio"
                    }
                }
            }
        }
        app.frontend_client.get_formulas_info.return_value = (mock_data, 200)
        
        # Act
        response = client.get('/api/v1/formulas')
        
        # Assert
        assert response.status_code == 200
        data = response.get_json()
        assert data['status'] == 'success'
        assert 'formulas' in data['data']
        app.frontend_client.get_formulas_info.assert_called_once()
    
    def test_send_formulas_data_error(self, app, client):
        """Test error in formulas endpoint"""
        # Arrange
        error_data = {"status": "error", "error": {"message": "Network error"}}
        app.frontend_client.get_formulas_info.return_value = (error_data, 503)
        
        # Act
        response = client.get('/api/v1/formulas')
        
        # Assert
        assert response.status_code == 503
        data = response.get_json()
        assert data['status'] == 'error'


class TestAlgorithmsEndpoint:
    """Tests for /api/v1/algorithms endpoint"""
    
    def test_send_description_data_success(self, app, client):
        """Test successful retrieval of algorithms info"""
        # Arrange
        mock_data = {
            "status": "success",
            "data": {
                "algorithms": {
                    "monte_carlo": {
                        "implementation": "long double monte_carlo() {...}",
                        "description": "Probabilistic method",
                        "type": "probabilistic"
                    }
                }
            }
        }
        app.frontend_client.get_algorithms_info.return_value = (mock_data, 200)
        
        # Act
        response = client.get('/api/v1/algorithms')
        
        # Assert
        assert response.status_code == 200
        data = response.get_json()
        assert data['status'] == 'success'
        assert 'algorithms' in data['data']
        app.frontend_client.get_algorithms_info.assert_called_once()
    
    def test_send_description_data_error(self, app, client):
        """Test error in algorithms endpoint"""
        # Arrange
        error_data = {"status": "error", "error": {"message": "Failed"}}
        app.frontend_client.get_algorithms_info.return_value = (error_data, 500)
        
        # Act
        response = client.get('/api/v1/algorithms')
        
        # Assert
        assert response.status_code == 500


class TestTopPerformersEndpoint:
    """Tests for /api/v1/estimations/top endpoint"""
    
    def test_send_top_4_success(self, app, client):
        """Test successful retrieval of top 4 performers"""
        # Arrange
        mock_data = {
            "status": "success",
            "data": {
                "estimations": [
                    {"algorithm": "algo1", "time_seconds": 0.1},
                    {"algorithm": "algo2", "time_seconds": 0.2},
                    {"algorithm": "algo3", "time_seconds": 0.3},
                    {"algorithm": "algo4", "time_seconds": 0.4}
                ],
                "metadata": {"count": 4, "top_n": 4}
            }
        }
        app.frontend_client.get_top_performers.return_value = (mock_data, 200)
        
        # Act
        response = client.get('/api/v1/estimations/top')
        
        # Assert
        assert response.status_code == 200
        data = response.get_json()
        assert data['status'] == 'success'
        assert len(data['data']['estimations']) == 4
        app.frontend_client.get_top_performers.assert_called_once_with(4)
    
    def test_send_top_4_error(self, app, client):
        """Test error in top performers endpoint"""
        # Arrange
        error_data = {"status": "error", "error": {"message": "Error"}}
        app.frontend_client.get_top_performers.return_value = (error_data, 500)
        
        # Act
        response = client.get('/api/v1/estimations/top')
        
        # Assert
        assert response.status_code == 500


class TestServerCHealthEndpoint:
    """Tests for /api/v1/servers/c/health endpoint"""
    
    def test_check_server_c_healthy(self, app, client):
        """Test server C health check when healthy"""
        # Arrange
        mock_data = {
            "server_c_status": "ok",
            "details": {"uptime": 3600}
        }
        app.server_c_client.health_check.return_value = (mock_data, 200)
        
        # Act
        response = client.get('/api/v1/servers/c/health')
        
        # Assert
        assert response.status_code == 200
        data = response.get_json()
        assert data['server_c_status'] == 'ok'
        app.server_c_client.health_check.assert_called_once_with(timeout=2)
    
    def test_check_server_c_timeout(self, app, client):
        """Test server C health check timeout"""
        # Arrange
        mock_data = {
            "server_c_status": "timeout",
            "error": "Servidor C no responde (timeout)"
        }
        app.server_c_client.health_check.return_value = (mock_data, 504)
        
        # Act
        response = client.get('/api/v1/servers/c/health')
        
        # Assert
        assert response.status_code == 504
        data = response.get_json()
        assert data['server_c_status'] == 'timeout'
    
    def test_check_server_c_unreachable(self, app, client):
        """Test server C health check when unreachable"""
        # Arrange
        mock_data = {
            "server_c_status": "unreachable",
            "error": "No se puede conectar al servidor C"
        }
        app.server_c_client.health_check.return_value = (mock_data, 503)
        
        # Act
        response = client.get('/api/v1/servers/c/health')
        
        # Assert
        assert response.status_code == 503
        data = response.get_json()
        assert data['server_c_status'] == 'unreachable'
    
    def test_check_server_c_uses_config_timeout(self, app, client):
        """Test that server C health check uses configured timeout"""
        # Arrange
        app.config['SERVER_C_HEALTH_TIMEOUT'] = 5
        mock_data = {"server_c_status": "ok"}
        app.server_c_client.health_check.return_value = (mock_data, 200)
        
        # Act
        response = client.get('/api/v1/servers/c/health')
        
        # Assert
        app.server_c_client.health_check.assert_called_once_with(timeout=5)


class TestErrorHandlers:
    """Tests for error handlers"""
    
    def test_404_not_found(self, client):
        """Test 404 error handler for blueprint routes"""
        response = client.get('/api/v1/nonexistent')
        
        assert response.status_code == 404
        # Blueprint error handlers may return HTML in default Flask setup
        # Just verify the 404 status code
    
    def test_404_returns_proper_status(self, client):
        """Test that non-existent endpoints return 404"""
        response = client.get('/api/v1/invalid_endpoint')
        
        assert response.status_code == 404
    
    def test_500_internal_error_handling(self, app, client):
        """Test 500 error handler by forcing an exception in existing endpoint"""
        # Disable testing mode temporarily so Flask handles exceptions normally
        app.config['TESTING'] = False
        
        # Force an exception in an existing endpoint
        app.frontend_client.get_estimations.side_effect = Exception("Test internal error")
        
        # This should trigger the 500 error handler
        response = client.get('/api/v1/estimations')
        
        # Verify we get a 500 error (Flask will catch the exception)
        assert response.status_code == 500
        
        # Re-enable testing mode
        app.config['TESTING'] = True


class TestBlueprintConfiguration:
    """Tests for blueprint configuration"""
    
    def test_blueprint_url_prefix(self, app):
        """Test that blueprint has correct URL prefix"""
        # The blueprint should be registered with /api/v1 prefix
        rules = [rule.rule for rule in app.url_map.iter_rules()]
        
        assert '/api/v1/health' in rules
        assert '/api/v1/estimations' in rules
        assert '/api/v1/algorithms' in rules
    
    def test_all_endpoints_registered(self, app):
        """Test that all expected endpoints are registered"""
        rules = [rule.rule for rule in app.url_map.iter_rules()]
        
        expected_endpoints = [
            '/api/v1/health',
            '/api/v1/estimations',
            '/api/v1/estimations/basic',
            '/api/v1/formulas',
            '/api/v1/algorithms',
            '/api/v1/estimations/top',
            '/api/v1/servers/c/health'
        ]
        
        for endpoint in expected_endpoints:
            assert endpoint in rules


class TestHTTPMethods:
    """Tests for HTTP method restrictions"""
    
    def test_endpoints_only_accept_get(self, app, client):
        """Test that endpoints only accept GET requests"""
        # Setup mock returns for all client methods
        app.frontend_client.get_estimations.return_value = ({"status": "success"}, 200)
        app.frontend_client.get_estimations_without_algorithms.return_value = ({"status": "success"}, 200)
        app.frontend_client.get_formulas_info.return_value = ({"status": "success"}, 200)
        app.frontend_client.get_algorithms_info.return_value = ({"status": "success"}, 200)
        app.frontend_client.get_top_performers.return_value = ({"status": "success"}, 200)
        app.server_c_client.health_check.return_value = ({"status": "ok"}, 200)
        
        endpoints = [
            '/api/v1/health',
            '/api/v1/estimations',
            '/api/v1/estimations/basic',
            '/api/v1/formulas',
            '/api/v1/algorithms',
            '/api/v1/estimations/top',
            '/api/v1/servers/c/health'
        ]
        
        for endpoint in endpoints:
            # GET should work (might return error from mock but should not be 405)
            get_response = client.get(endpoint)
            assert get_response.status_code != 405, f"GET should be allowed for {endpoint}"
            
            # POST should not be allowed
            post_response = client.post(endpoint)
            assert post_response.status_code == 405, f"POST should not be allowed for {endpoint}"
            
            # PUT should not be allowed
            put_response = client.put(endpoint)
            assert put_response.status_code == 405, f"PUT should not be allowed for {endpoint}"
            
            # DELETE should not be allowed
            delete_response = client.delete(endpoint)
            assert delete_response.status_code == 405, f"DELETE should not be allowed for {endpoint}"


class TestIntegrationScenarios:
    """Integration-style tests for common workflows"""
    
    def test_successful_data_retrieval_flow(self, app, client):
        """Test a successful flow of retrieving all data types"""
        # Arrange - setup all mocks to return success
        app.frontend_client.get_estimations.return_value = ({"status": "success"}, 200)
        app.frontend_client.get_algorithms_info.return_value = ({"status": "success"}, 200)
        app.frontend_client.get_formulas_info.return_value = ({"status": "success"}, 200)
        app.server_c_client.health_check.return_value = ({"server_c_status": "ok"}, 200)
        
        # Act & Assert - check each endpoint
        assert client.get('/api/v1/health').status_code == 200
        assert client.get('/api/v1/estimations').status_code == 200
        assert client.get('/api/v1/algorithms').status_code == 200
        assert client.get('/api/v1/formulas').status_code == 200
        assert client.get('/api/v1/servers/c/health').status_code == 200
    
    def test_multiple_requests_same_endpoint(self, app, client):
        """Test multiple requests to the same endpoint"""
        # Arrange
        mock_data = {"status": "success", "data": {"estimations": []}}
        app.frontend_client.get_estimations.return_value = (mock_data, 200)
        
        # Act - make multiple requests
        for _ in range(5):
            response = client.get('/api/v1/estimations')
            assert response.status_code == 200
        
        # Assert - client method should be called 5 times
        assert app.frontend_client.get_estimations.call_count == 5