import pytest
import sys
import os
from unittest.mock import patch 
# Add the project root to Python path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

### Test_get_algorithm_url ###
@pytest.fixture
def mock_requests():
    """Fixture for mocking requests"""
    with patch('utils.get_algorithm_url.requests.get') as mock_get:
        yield mock_get
