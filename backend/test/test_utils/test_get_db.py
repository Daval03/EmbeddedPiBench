import os, sys, json, sqlite3, pytest
from unittest.mock import patch, MagicMock

sys.path.insert(0, os.path.join(os.path.dirname(__file__), '../..'))
# Adjust import path if needed
from utils.get_db import *

class TestDatabaseQueries:

    def test_execute_query_success(self, tmp_path):
        """Test successful SQL execution with temporary DB."""
        
        # Create temporary sqlite DB
        db_file = tmp_path / "test.db"
        conn = sqlite3.connect(db_file)
        cursor = conn.cursor()
        cursor.execute("CREATE TABLE test_table (id INTEGER, name TEXT)")
        cursor.execute("INSERT INTO test_table VALUES (1, 'pi')")
        conn.commit()
        conn.close()

        # Patch DB_PATH to use the temporary DB
        with patch("utils.get_db.DB_PATH", str(db_file)):
            result = execute_query("SELECT * FROM test_table;")

        assert result == [(1, "pi")]

    
    def test_execute_query_failure(self):
        """Test SQL error handling; expect None result."""
        
        with patch("utils.get_db.DB_PATH", "/invalid/path/db.sqlite"):
            result = execute_query("SELECT * FROM unknown_table;")
        
        assert result is None


    def test_fetch_all_estimations_query_call(self):
        """Ensure fetch_all_estimations calls execute_query correctly."""
        with patch("utils.get_db.execute_query") as mock_exec:
            fetch_all_estimations()
            mock_exec.assert_called_once_with("SELECT * FROM pi_estimations;")


    def test_fetch_all_type_query_call(self):
        """Ensure fetch_all_type triggers correct SQL query."""
        with patch("utils.get_db.execute_query") as mock_exec:
            fetch_all_type()
            mock_exec.assert_called_once_with("SELECT algorithm, type FROM pi_estimations;")


    def test_top_elements_query(self):
        """Validate LIMIT query is correctly formatted."""
        with patch("utils.get_db.execute_query") as mock_exec:
            top_elements(5)
            mock_exec.assert_called_once()
            query, args = mock_exec.call_args[0]
            assert "LIMIT ?" in query
            assert args == (5,)


class TestJsonLoading:

    def test_load_algorithms_reads_file(self, tmp_path):
        """Ensure JSON algorithms file loads correctly."""
        
        mock_file = tmp_path / "algo.json"
        sample = [{"id": "mc", "name": "Monte Carlo"}]
        mock_file.write_text(json.dumps(sample))

        assert load_algorithms(mock_file) == sample


    def test_get_algorithm_details_by_id(self):
        """Match algorithm by ID."""
        mock_list = [
            {"id": "test1", "name": "Test Algorithm"}
        ]

        with patch("utils.get_db.load_algorithms", return_value=mock_list):
            result = get_algorithm_details("test1")
            assert result == mock_list[0]


    def test_get_algorithm_details_by_name(self):
        """Match algorithm by name when ID mismatch."""
        mock_list = [
            {"id": "algo1", "name": "Chudnovsky"}
        ]

        with patch("utils.get_db.load_algorithms", return_value=mock_list):
            result = get_algorithm_details("chudnovsky")
            assert result == mock_list[0]


    def test_get_algorithm_details_not_found(self):
        """Test graceful error when algorithm missing."""
        mock_list = [
            {"id": "id1", "name": "Test"}
        ]

        with patch("utils.get_db.load_algorithms", return_value=mock_list):
            result = get_algorithm_details("unknown")

        assert "Algorithm 'unknown' not found" in result
        assert "id1" in result


    def test_get_all_formula_description(self):
        """Ensure batch algorithm lookup uses get_algorithm_details."""
        ids = ["a", "b", "c"]

        with patch("utils.get_db.get_algorithm_details", return_value="OK") as mock_lookup:
            result = get_all_formula_description(ids)
            assert result == ["OK", "OK", "OK"]
            assert mock_lookup.call_count == len(ids)
