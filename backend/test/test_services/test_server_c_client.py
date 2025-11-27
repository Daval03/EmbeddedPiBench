
import pytest,os,sys, requests
from unittest.mock import patch, Mock, MagicMock
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '../..'))
from services.server_c_client import ServerCClient


class TestServerCClientInit:
    """Tests for ServerCClient initialization"""
    
    def test_init_with_default_timeout(self):
        """Test initialization with default timeout"""
        client = ServerCClient("http://localhost:8080")
        assert client.base_url == "http://localhost:8080"
        assert client.default_timeout == 30
        assert client.session is not None
    
    def test_init_with_custom_timeout(self):
        """Test initialization with custom timeout"""
        client = ServerCClient("http://localhost:8080", default_timeout=45)
        assert client.default_timeout == 45
    
    def test_init_strips_trailing_slash(self):
        """Test that trailing slash is removed from base_url"""
        client = ServerCClient("http://localhost:8080/")
        assert client.base_url == "http://localhost:8080"


class TestHealthCheck:
    """Tests for health_check method"""
    
    def test_health_check_success(self):
        """Test successful health check"""
        # Arrange
        client = ServerCClient("http://localhost:8080")
        mock_response = Mock()
        mock_response.status_code = 200
        mock_response.json.return_value = {"status": "healthy", "uptime": 3600}
        
        with patch.object(client.session, 'get', return_value=mock_response):
            # Act
            response, status_code = client.health_check()
            
            # Assert
            assert status_code == 200
            assert response['server_c_status'] == 'ok'
            assert 'details' in response
            assert response['details']['status'] == 'healthy'
    
    def test_health_check_non_200_response(self):
        """Test health check with non-200 status code"""
        client = ServerCClient("http://localhost:8080")
        mock_response = Mock()
        mock_response.status_code = 503
        
        with patch.object(client.session, 'get', return_value=mock_response):
            response, status_code = client.health_check()
            
            assert status_code == 500
            assert response['server_c_status'] == 'error'
            assert response['code'] == 503
    
    def test_health_check_timeout(self):
        """Test health check timeout"""
        client = ServerCClient("http://localhost:8080")
        
        with patch.object(client.session, 'get', side_effect=requests.exceptions.Timeout):
            response, status_code = client.health_check()
            
            assert status_code == 504
            assert response['server_c_status'] == 'timeout'
            assert 'timeout' in response['error'].lower()
    
    def test_health_check_connection_error(self):
        """Test health check connection error"""
        client = ServerCClient("http://localhost:8080")
        
        with patch.object(client.session, 'get', side_effect=requests.exceptions.ConnectionError):
            response, status_code = client.health_check()
            
            assert status_code == 503
            assert response['server_c_status'] == 'unreachable'
            assert 'conectar' in response['error'].lower() or 'connect' in response['error'].lower()
    
    def test_health_check_unexpected_error(self):
        """Test health check with unexpected error"""
        client = ServerCClient("http://localhost:8080")
        
        with patch.object(client.session, 'get', side_effect=Exception("Unexpected error")):
            response, status_code = client.health_check()
            
            assert status_code == 500
            assert response['server_c_status'] == 'error'
            assert 'Unexpected error' in response['error']
    
    def test_health_check_custom_timeout(self):
        """Test health check with custom timeout parameter"""
        client = ServerCClient("http://localhost:8080")
        mock_response = Mock()
        mock_response.status_code = 200
        mock_response.json.return_value = {"status": "ok"}
        
        with patch.object(client.session, 'get', return_value=mock_response) as mock_get:
            client.health_check(timeout=5)
            
            mock_get.assert_called_once()
            assert mock_get.call_args[1]['timeout'] == 5


class TestCalculatePi:
    """Tests for run_algorithm method"""
    
    def test_run_algorithm_success(self):
        """Test successful pi calculation"""
        # Arrange
        client = ServerCClient("http://localhost:8080")
        mock_response = Mock()
        mock_response.status_code = 200
        mock_response.json.return_value = {
            "pi_estimate": 3.14159,
            "algorithm": "monte_carlo",
            "iterations": 1000000,
            "time_seconds": 2.5
        }
        
        with patch.object(client.session, 'get', return_value=mock_response):
            # Act
            response, status_code = client.run_algorithm("monte_carlo")
            
            # Assert
            assert status_code == 200
            assert response['pi_estimate'] == 3.14159
            assert response['algorithm'] == 'monte_carlo'
    
    def test_run_algorithm_timeout(self):
        """Test pi calculation timeout"""
        client = ServerCClient("http://localhost:8080")
        
        with patch.object(client.session, 'get', side_effect=requests.exceptions.Timeout):
            response, status_code = client.run_algorithm("chudnovsky_fast")
            
            assert status_code == 504
            assert 'timeout' in response['error'].lower()
            assert response['algorithm'] == 'chudnovsky_fast'
    
    def test_run_algorithm_request_exception(self):
        """Test pi calculation with request exception"""
        client = ServerCClient("http://localhost:8080")
        
        with patch.object(client.session, 'get', side_effect=requests.exceptions.RequestException("Network error")):
            response, status_code = client.run_algorithm("leibniz")
            
            assert status_code == 500
            assert 'error' in response
            assert response['algorithm'] == 'leibniz'
            assert 'Network error' in response['error']
    
    def test_run_algorithm_unexpected_error(self):
        """Test pi calculation with unexpected error"""
        client = ServerCClient("http://localhost:8080")
        
        with patch.object(client.session, 'get', side_effect=Exception("Unexpected")):
            response, status_code = client.run_algorithm("buffon")
            
            assert status_code == 500
            assert 'error' in response
            assert response['algorithm'] == 'buffon'
    
    def test_run_algorithm_uses_correct_endpoint(self):
        """Test that run_algorithm uses correct endpoint URL"""
        client = ServerCClient("http://localhost:8080")
        mock_response = Mock()
        mock_response.status_code = 200
        mock_response.json.return_value = {"pi_estimate": 3.14}
        
        with patch.object(client.session, 'get', return_value=mock_response) as mock_get:
            client.run_algorithm("monte_carlo")
            
            mock_get.assert_called_once()
            call_url = mock_get.call_args[0][0]
            assert call_url == "http://localhost:8080/api/pi/monte_carlo"
    
    def test_run_algorithm_uses_default_timeout(self):
        """Test that run_algorithm uses default timeout from init"""
        client = ServerCClient("http://localhost:8080", default_timeout=60)
        mock_response = Mock()
        mock_response.status_code = 200
        mock_response.json.return_value = {"pi_estimate": 3.14}
        
        with patch.object(client.session, 'get', return_value=mock_response) as mock_get:
            client.run_algorithm("leibniz")
            
            assert mock_get.call_args[1]['timeout'] == 60
    
    def test_run_algorithm_different_algorithms(self):
        """Test run_algorithm with different algorithm names"""
        client = ServerCClient("http://localhost:8080")
        algorithms = ["monte_carlo", "leibniz", "chudnovsky_fast", "buffon"]
        
        for algo in algorithms:
            mock_response = Mock()
            mock_response.status_code = 200
            mock_response.json.return_value = {"algorithm": algo}
            
            with patch.object(client.session, 'get', return_value=mock_response) as mock_get:
                response, status_code = client.run_algorithm(algo)
                
                assert status_code == 200
                expected_url = f"http://localhost:8080/api/pi/{algo}"
                assert mock_get.call_args[0][0] == expected_url


class TestCloseSession:
    """Tests for close method"""
    
    def test_close_session(self):
        """Test closing the session"""
        client = ServerCClient("http://localhost:8080")
        client.session = Mock()
        
        client.close()
        
        client.session.close.assert_called_once()
    
    def test_close_session_multiple_times(self):
        """Test that close can be called multiple times safely"""
        client = ServerCClient("http://localhost:8080")
        client.session = Mock()
        
        client.close()
        client.close()
        
        assert client.session.close.call_count == 2


class TestIntegrationScenarios:
    """Integration-style tests for common usage patterns"""
    
    def test_health_check_then_calculate(self):
        """Test checking health before calculating"""
        client = ServerCClient("http://localhost:8080")
        
        # Mock health check success
        health_response = Mock()
        health_response.status_code = 200
        health_response.json.return_value = {"status": "healthy"}
        
        # Mock calculate success
        calc_response = Mock()
        calc_response.status_code = 200
        calc_response.json.return_value = {"pi_estimate": 3.14159}
        
        with patch.object(client.session, 'get', side_effect=[health_response, calc_response]):
            # Check health first
            health_result, health_status = client.health_check()
            assert health_status == 200
            assert health_result['server_c_status'] == 'ok'
            
            # Then calculate
            calc_result, calc_status = client.run_algorithm("monte_carlo")
            assert calc_status == 200
            assert calc_result['pi_estimate'] == 3.14159
    
    def test_multiple_calculations_same_session(self):
        """Test multiple calculations using same client session"""
        client = ServerCClient("http://localhost:8080")
        
        mock_response = Mock()
        mock_response.status_code = 200
        mock_response.json.return_value = {"pi_estimate": 3.14}
        
        with patch.object(client.session, 'get', return_value=mock_response) as mock_get:
            # Perform multiple calculations
            client.run_algorithm("monte_carlo")
            client.run_algorithm("leibniz")
            client.run_algorithm("buffon")
            
            # Should use same session for all calls
            assert mock_get.call_count == 3
    
    def test_error_recovery_workflow(self):
        """Test handling errors and retrying"""
        client = ServerCClient("http://localhost:8080")
        
        # First call fails
        with patch.object(client.session, 'get', side_effect=requests.exceptions.Timeout):
            response1, status1 = client.run_algorithm("monte_carlo")
            assert status1 == 504
        
        # Second call succeeds
        mock_response = Mock()
        mock_response.status_code = 200
        mock_response.json.return_value = {"pi_estimate": 3.14}
        
        with patch.object(client.session, 'get', return_value=mock_response):
            response2, status2 = client.run_algorithm("monte_carlo")
            assert status2 == 200