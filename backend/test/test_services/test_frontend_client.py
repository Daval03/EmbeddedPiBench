import pytest,os,sys
from unittest.mock import patch, MagicMock, Mock
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '../..'))
from services.frontend_client import FrontEndClient

class TestFrontEndClientInit:
    """Tests for FrontEndClient initialization"""
    
    def test_init_with_default_timeout(self):
        """Test initialization with default timeout"""
        client = FrontEndClient("http://localhost:5000")
        assert client.base_url == "http://localhost:5000"
        assert client.default_timeout == 30
        assert client.session is not None
    
    def test_init_with_custom_timeout(self):
        """Test initialization with custom timeout"""
        client = FrontEndClient("http://localhost:5000", default_timeout=60)
        assert client.default_timeout == 60
    
    def test_init_strips_trailing_slash(self):
        """Test that trailing slash is removed from base_url"""
        client = FrontEndClient("http://localhost:5000/")
        assert client.base_url == "http://localhost:5000"


class TestGetTopPerformers:
    """Tests for get_top_performers method"""
    
    @patch('services.frontend_client.top_elements')
    def test_get_top_performers_success(self, mock_top_elements):
        """Test successful retrieval of top performers"""
        # Arrange
        mock_top_elements.return_value = [
            ('monte_carlo', 0.5, 4),
            ('leibniz', 1.2, 3),
            ('buffon', 2.0, 2)
        ]
        client = FrontEndClient("http://localhost:5000")
        
        # Act
        response, status_code = client.get_top_performers(top_n=3)
        
        # Assert
        assert status_code == 200
        assert response['status'] == 'success'
        assert len(response['data']['estimations']) == 3
        assert response['data']['estimations'][0]['algorithm'] == 'monte_carlo'
        assert response['data']['estimations'][0]['time_seconds'] == 0.5
        assert response['data']['metadata']['count'] == 3
        assert response['data']['metadata']['top_n'] == 3
    
    @patch('services.frontend_client.top_elements')
    def test_get_top_performers_default_top_n(self, mock_top_elements):
        """Test default top_n parameter"""
        mock_top_elements.return_value = [('test', 1.0, 5)]
        client = FrontEndClient("http://localhost:5000")
        
        response, status_code = client.get_top_performers()
        
        mock_top_elements.assert_called_once_with(4)
    
    @patch('services.frontend_client.top_elements')
    def test_get_top_performers_error(self, mock_top_elements):
        """Test error handling when top_elements fails"""
        mock_top_elements.side_effect = Exception("Database error")
        client = FrontEndClient("http://localhost:5000")
        
        response, status_code = client.get_top_performers()
        
        assert status_code == 500
        assert response['status'] == 'error'
        assert 'Error retrieving top performers' in response['error']['message']


class TestGetAlgorithmsInfo:
    """Tests for get_algorithms_info method"""
    
    @patch('services.frontend_client.fetch_all_type')
    @patch('services.frontend_client.get_all_formula_description')
    @patch('services.frontend_client.extract_all_algorithm')
    def test_get_algorithms_info_success(self, mock_extract, mock_get_formulas, mock_fetch_type):
        """Test successful retrieval of algorithms info"""
        # Arrange
        mock_extract.return_value = {
            'monte_carlo': 'long double monte_carlo() { return 3.14; }',
            'leibniz': 'long double leibniz() { return 3.14; }'
        }
        mock_get_formulas.return_value = [
            {'id': 'monte_carlo', 'description': 'Monte Carlo method'},
            {'id': 'leibniz', 'description': 'Leibniz formula'}
        ]
        mock_fetch_type.return_value = [
            ('monte_carlo', 'probabilistic'),
            ('leibniz', 'series')
        ]
        client = FrontEndClient("http://localhost:5000")
        
        # Act
        response, status_code = client.get_algorithms_info()
        
        # Assert
        assert status_code == 200
        assert response['status'] == 'success'
        assert 'monte_carlo' in response['data']['algorithms']
        assert 'leibniz' in response['data']['algorithms']
        assert response['data']['algorithms']['monte_carlo']['description'] == 'Monte Carlo method'
        assert response['data']['algorithms']['monte_carlo']['type'] == 'probabilistic'
        assert response['data']['metadata']['total_algorithms'] == 2
    
    @patch('services.frontend_client.extract_all_algorithm')
    def test_get_algorithms_info_error(self, mock_extract):
        """Test error handling in get_algorithms_info"""
        mock_extract.side_effect = Exception("Connection error")
        client = FrontEndClient("http://localhost:5000")
        
        response, status_code = client.get_algorithms_info()
        
        assert status_code == 500
        assert response['status'] == 'error'
        assert 'Error retrieving algorithms information' in response['error']['message']


class TestGetEstimationsWithoutAlgorithms:
    """Tests for get_estimations_without_algorithms method"""
    
    @patch('services.frontend_client.fetch_all_estimations')
    def test_get_estimations_without_algorithms_success(self, mock_fetch):
        """Test successful retrieval of estimations without algorithms"""
        # Arrange
        mock_fetch.return_value = [
            (1, 3.14159, 'monte_carlo', 1000, 0.5, 2000, 5, None, True, 0.001, 0.0001, None, 'probabilistic'),
            (2, 3.14, 'leibniz', 500, 1.0, 500, 3, None, False, 0.01, 0.001, None, 'series')
        ]
        client = FrontEndClient("http://localhost:5000")
        
        # Act
        response, status_code = client.get_estimations_without_algorithms()
        
        # Assert
        assert status_code == 200
        assert response['status'] == 'success'
        assert len(response['data']['estimations']) == 2
        assert response['data']['estimations'][0]['algorithm'] == 'monte_carlo'
        assert response['data']['estimations'][0]['pi_estimate'] == 3.14159
        assert response['data']['estimations'][0]['perfect_decimal_precision'] is True
        assert response['data']['metadata']['total_estimations'] == 2
    
    @patch('services.frontend_client.fetch_all_estimations')
    def test_get_estimations_without_algorithms_error(self, mock_fetch):
        """Test error handling"""
        mock_fetch.side_effect = Exception("Database error")
        client = FrontEndClient("http://localhost:5000")
        
        response, status_code = client.get_estimations_without_algorithms()
        
        assert status_code == 500
        assert response['status'] == 'error'


class TestGetFormulasInfo:
    """Tests for get_formulas_info method"""
    
    @patch('services.frontend_client.get_all_formula_description')
    @patch('services.frontend_client.extract_all_algorithm')
    def test_get_formulas_info_success(self, mock_extract, mock_get_formulas):
        """Test successful retrieval of formulas info"""
        # Arrange
        mock_extract.return_value = {
            'monte_carlo': 'code here',
            'leibniz': 'code here'
        }
        mock_get_formulas.return_value = [
            {
                'id': 'monte_carlo',
                'name': 'Monte Carlo',
                'formula': 'π ≈ 4 * (points_in_circle / total_points)',
                'description': 'Probabilistic method',
                'deepExplanation': 'Deep explanation here',
                'convergence': 'O(1/√n)',
                'applications': 'Simulation',
                'complexity': 'Simple'
            }
        ]
        client = FrontEndClient("http://localhost:5000")
        
        # Act
        response, status_code = client.get_formulas_info()
        
        # Assert
        assert status_code == 200
        assert response['status'] == 'success'
        assert 'monte_carlo' in response['data']['formulas']
        assert response['data']['formulas']['monte_carlo']['name'] == 'Monte Carlo'
        assert response['data']['formulas']['monte_carlo']['convergence'] == 'O(1/√n)'
        assert response['data']['metadata']['total_formulas'] == 1
    
    @patch('services.frontend_client.extract_all_algorithm')
    def test_get_formulas_info_error(self, mock_extract):
        """Test error handling in get_formulas_info"""
        mock_extract.side_effect = Exception("Network error")
        client = FrontEndClient("http://localhost:5000")
        
        response, status_code = client.get_formulas_info()
        
        assert status_code == 500
        assert response['status'] == 'error'


class TestGetEstimations:
    """Tests for get_estimations method"""
    
    @patch('services.frontend_client.extract_all_algorithm')
    @patch('services.frontend_client.fetch_all_estimations')
    def test_get_estimations_success(self, mock_fetch, mock_extract):
        """Test successful retrieval of estimations with algorithms"""
        # Arrange
        mock_fetch.return_value = [
            (1, 3.14159, 'monte_carlo', 1000, 0.5, 2000, 5, None, True, 0.001, 0.0001, None, 'probabilistic')
        ]
        mock_extract.return_value = {
            'monte_carlo': 'long double monte_carlo() { return 3.14; }'
        }
        client = FrontEndClient("http://localhost:5000")
        
        # Act
        response, status_code = client.get_estimations()
        
        # Assert
        assert status_code == 200
        assert response['status'] == 'success'
        assert len(response['data']['estimations']) == 1
        assert 'monte_carlo' in response['data']['available_algorithms']
        assert 'monte_carlo' in response['data']['algorithm_implementations']
        assert response['data']['metadata']['total_estimations'] == 1
        assert response['data']['metadata']['total_algorithms'] == 1
    
    @patch('services.frontend_client.fetch_all_estimations')
    def test_get_estimations_error(self, mock_fetch):
        """Test error handling in get_estimations"""
        mock_fetch.side_effect = Exception("Database connection failed")
        client = FrontEndClient("http://localhost:5000")
        
        response, status_code = client.get_estimations()
        
        assert status_code == 500
        assert response['status'] == 'error'


class TestHelperMethods:
    """Tests for helper methods"""
    
    def test_create_error_response_with_details(self):
        """Test error response creation with details"""
        client = FrontEndClient("http://localhost:5000")
        
        error_response = client._create_error_response(
            "Test error",
            "Detailed error message"
        )
        
        assert error_response['status'] == 'error'
        assert error_response['error']['message'] == 'Test error'
        assert error_response['error']['code'] == 'INTERNAL_ERROR'
        assert error_response['error']['details'] == 'Detailed error message'
    
    def test_create_error_response_without_details(self):
        """Test error response creation without details"""
        client = FrontEndClient("http://localhost:5000")
        
        error_response = client._create_error_response("Test error")
        
        assert error_response['status'] == 'error'
        assert error_response['error']['message'] == 'Test error'
        assert 'details' not in error_response['error']
    
    def test_find_algorithm_description_found(self):
        """Test finding algorithm description"""
        client = FrontEndClient("http://localhost:5000")
        descriptions = [
            "MONTE_CARLO: Probabilistic method",
            "LEIBNIZ: Series method"
        ]
        
        result = client._find_algorithm_description("monte_carlo", descriptions)
        
        assert result == "Probabilistic method"
    
    def test_find_algorithm_description_not_found(self):
        """Test default description when not found"""
        client = FrontEndClient("http://localhost:5000")
        descriptions = ["OTHER: Some method"]
        
        result = client._find_algorithm_description("monte_carlo", descriptions)
        
        assert "Implementation of monte_carlo algorithm" in result
    
    def test_close_session(self):
        """Test closing the session"""
        client = FrontEndClient("http://localhost:5000")
        client.session = Mock()
        
        client.close()
        
        client.session.close.assert_called_once()