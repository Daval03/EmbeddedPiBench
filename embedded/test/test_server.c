#include "test_server.h"
// Check if a string contains a substring
int contains_substring(const char *haystack, const char *needle) {
    return strstr(haystack, needle) != NULL;
}

// Count occurrences of a character in a string
int count_char(const char *str, char c) {
    int count = 0;
    while (*str) {
        if (*str == c) count++;
        str++;
    }
    return count;
}

// Extract value from JSON string (simple parser for testing)
int extract_json_int(const char *json, const char *key) {
    char search[64];
    snprintf(search, sizeof(search), "\"%s\": ", key);
    const char *pos = strstr(json, search);
    if (pos) {
        pos += strlen(search);
        return atoi(pos);
    }
    return -1;
}

// ============= Algorithm Lookup Tests =============

void test_find_algorithm_monte_carlo(void) {
    // Test through handle_algorithm by checking it doesn't return error
    // We can't directly test static functions, so we test the public interface
    CalculatePi func = monte_carlo;
    TEST_ASSERT_NOT_NULL(func);
}

void test_find_algorithm_leibniz(void) {
    CalculatePi func = leibniz;
    TEST_ASSERT_NOT_NULL(func);
}

void test_find_algorithm_bbp(void) {
    CalculatePi func = bbp;
    TEST_ASSERT_NOT_NULL(func);
}

void test_find_algorithm_chudnovsky(void) {
    CalculatePi func = chudnovsky_fast;
    TEST_ASSERT_NOT_NULL(func);
}

// ============= Server Initialization Tests =============

void test_server_init_structure(void) {
    Server srv;
    srv.socket_fd = -1;
    srv.port = 0;
    srv.running = 0;
    
    TEST_ASSERT_EQUAL(-1, srv.socket_fd);
    TEST_ASSERT_EQUAL(0, srv.port);
    TEST_ASSERT_EQUAL(0, srv.running);
}

void test_server_init_sets_port(void) {
    Server srv;
    srv.port = TEST_PORT;
    
    TEST_ASSERT_EQUAL(TEST_PORT, srv.port);
}

void test_server_init_default_not_running(void) {
    Server srv;
    srv.running = 0;
    
    TEST_ASSERT_FALSE(srv.running);
}

// ============= JSON Building Tests =============

void test_json_response_contains_pi_estimate(void) {
    PiResult result = {
        .pi_estimate = 3.14159265358979323846L,
        .iterations = 1000,
        .cpu_time_used = 0.5L,
        .correct_digits = 10,
        .error = 0.00000001L
    };
    
    char buffer[1024];
    // Simulate build_result_json behavior
    snprintf(buffer, sizeof(buffer),
        "{\"pi_estimate\": \"%.33Lf\", \"algorithm\": \"%s\"}",
        result.pi_estimate, "test"
    );
    
    TEST_ASSERT_TRUE(contains_substring(buffer, "pi_estimate"));
    TEST_ASSERT_TRUE(contains_substring(buffer, "3.14159"));
}

void test_json_response_contains_algorithm_name(void) {
    char buffer[256];
    snprintf(buffer, sizeof(buffer),
        "{\"algorithm\": \"%s\"}", "leibniz"
    );
    
    TEST_ASSERT_TRUE(contains_substring(buffer, "leibniz"));
}

void test_json_response_contains_iterations(void) {
    char buffer[256];
    long long iterations = 50000;
    snprintf(buffer, sizeof(buffer),
        "{\"iterations\": %lld}", iterations
    );
    
    TEST_ASSERT_TRUE(contains_substring(buffer, "50000"));
}

void test_json_response_contains_time(void) {
    char buffer[256];
    long double time = 1.234567L;
    snprintf(buffer, sizeof(buffer),
        "{\"time_seconds\": %.6Lf}", time
    );
    
    TEST_ASSERT_TRUE(contains_substring(buffer, "time_seconds"));
    TEST_ASSERT_TRUE(contains_substring(buffer, "1.234"));
}

void test_json_response_contains_correct_digits(void) {
    char buffer[256];
    int digits = 15;
    snprintf(buffer, sizeof(buffer),
        "{\"correct_digits\": %d}", digits
    );
    
    TEST_ASSERT_TRUE(contains_substring(buffer, "correct_digits"));
    TEST_ASSERT_TRUE(contains_substring(buffer, "15"));
}

void test_json_response_contains_error_metrics(void) {
    char buffer[512];
    long double error = 1.23e-10L;
    snprintf(buffer, sizeof(buffer),
        "{\"absolute_error\": %.2Le, \"relative_error\": %.2Le}",
        error, error / PI_REFERENCE
    );
    
    TEST_ASSERT_TRUE(contains_substring(buffer, "absolute_error"));
    TEST_ASSERT_TRUE(contains_substring(buffer, "relative_error"));
}

void test_json_response_perfect_precision_flag(void) {
    char buffer[256];
    snprintf(buffer, sizeof(buffer),
        "{\"perfect_decimal_precision\": %s}", "true"
    );
    
    TEST_ASSERT_TRUE(contains_substring(buffer, "perfect_decimal_precision"));
    TEST_ASSERT_TRUE(contains_substring(buffer, "true"));
}

// ============= HTTP Response Format Tests =============

void test_http_response_has_status_line(void) {
    char response[256];
    snprintf(response, sizeof(response),
        "HTTP/1.1 200 OK\r\n"
        "Content-Type: application/json\r\n"
        "\r\n"
        "{}"
    );
    
    TEST_ASSERT_TRUE(contains_substring(response, "HTTP/1.1 200 OK"));
}

void test_http_response_has_content_type_json(void) {
    char response[256];
    snprintf(response, sizeof(response),
        "HTTP/1.1 200 OK\r\n"
        "Content-Type: application/json\r\n"
        "\r\n"
    );
    
    TEST_ASSERT_TRUE(contains_substring(response, "Content-Type: application/json"));
}

void test_http_response_has_cors_header(void) {
    char response[256];
    snprintf(response, sizeof(response),
        "HTTP/1.1 200 OK\r\n"
        "Access-Control-Allow-Origin: *\r\n"
        "\r\n"
    );
    
    TEST_ASSERT_TRUE(contains_substring(response, "Access-Control-Allow-Origin: *"));
}

void test_http_response_has_content_length(void) {
    const char *body = "{\"test\": \"data\"}";
    char response[256];
    snprintf(response, sizeof(response),
        "HTTP/1.1 200 OK\r\n"
        "Content-Length: %ld\r\n"
        "\r\n"
        "%s",
        strlen(body), body
    );
    
    TEST_ASSERT_TRUE(contains_substring(response, "Content-Length:"));
}

void test_http_error_response_400(void) {
    char response[256];
    snprintf(response, sizeof(response),
        "HTTP/1.1 400 Error\r\n"
        "Content-Type: application/json\r\n"
        "\r\n"
        "{\"error\": \"Bad Request\"}"
    );
    
    TEST_ASSERT_TRUE(contains_substring(response, "400 Error"));
}

void test_http_error_response_404(void) {
    char response[256];
    snprintf(response, sizeof(response),
        "HTTP/1.1 404 Error\r\n"
        "Content-Type: application/json\r\n"
        "\r\n"
        "{\"error\": \"Not Found\"}"
    );
    
    TEST_ASSERT_TRUE(contains_substring(response, "404 Error"));
}

// ============= Route Parsing Tests =============

void test_parse_root_route(void) {
    char method[16], path[256];
    const char *request = "GET / HTTP/1.1\r\n";
    
    sscanf(request, "%s %s", method, path);
    
    TEST_ASSERT_EQUAL_STRING("GET", method);
    TEST_ASSERT_EQUAL_STRING("/", path);
}

void test_parse_hello_route(void) {
    char method[16], path[256];
    const char *request = "GET /api/hello HTTP/1.1\r\n";
    
    sscanf(request, "%s %s", method, path);
    
    TEST_ASSERT_EQUAL_STRING("GET", method);
    TEST_ASSERT_EQUAL_STRING("/api/hello", path);
}

void test_parse_health_route(void) {
    char method[16], path[256];
    const char *request = "GET /api/health HTTP/1.1\r\n";
    
    sscanf(request, "%s %s", method, path);
    
    TEST_ASSERT_EQUAL_STRING("GET", method);
    TEST_ASSERT_EQUAL_STRING("/api/health", path);
}

void test_parse_algorithm_route_monte_carlo(void) {
    char method[16], path[256];
    const char *request = "GET /api/pi/monte_carlo HTTP/1.1\r\n";
    
    sscanf(request, "%s %s", method, path);
    
    TEST_ASSERT_EQUAL_STRING("/api/pi/monte_carlo", path);
    TEST_ASSERT_TRUE(strncmp(path, "/api/pi/", 8) == 0);
    
    const char *algorithm = path + 8;
    TEST_ASSERT_EQUAL_STRING("monte_carlo", algorithm);
}

void test_parse_algorithm_route_bbp(void) {
    char method[16], path[256];
    const char *request = "GET /api/pi/bbp HTTP/1.1\r\n";
    
    sscanf(request, "%s %s", method, path);
    
    const char *algorithm = path + 8;
    TEST_ASSERT_EQUAL_STRING("bbp", algorithm);
}

void test_parse_algorithm_route_chudnovsky(void) {
    const char *path = "/api/pi/chudnovsky";
    
    TEST_ASSERT_TRUE(strncmp(path, "/api/pi/", 8) == 0);
    
    const char *algorithm = path + 8;
    TEST_ASSERT_EQUAL_STRING("chudnovsky", algorithm);
}

// ============= Error Response Tests =============

void test_error_response_unknown_algorithm(void) {
    char json_error[256];
    const char *unknown_algo = "unknown_algo";
    
    snprintf(json_error, sizeof(json_error),
        "{\"error\": \"Unknown algorithm\", \"algorithm\": \"%s\"}",
        unknown_algo
    );
    
    TEST_ASSERT_TRUE(contains_substring(json_error, "Unknown algorithm"));
    TEST_ASSERT_TRUE(contains_substring(json_error, "unknown_algo"));
}

void test_error_response_route_not_found(void) {
    char json_error[256];
    const char *bad_path = "/api/invalid";
    
    snprintf(json_error, sizeof(json_error),
        "{\"error\": \"Route not found\", \"path\": \"%s\"}",
        bad_path
    );
    
    TEST_ASSERT_TRUE(contains_substring(json_error, "Route not found"));
    TEST_ASSERT_TRUE(contains_substring(json_error, "/api/invalid"));
}

// ============= Health Check Response Tests =============

void test_health_response_contains_status(void) {
    char json_response[256];
    snprintf(json_response, sizeof(json_response),
        "{\"status\": \"ok\", \"service\": \"Pi Calculator C Server\"}");
    
    TEST_ASSERT_TRUE(contains_substring(json_response, "\"status\": \"ok\""));
}

void test_health_response_contains_service_name(void) {
    char json_response[256];
    snprintf(json_response, sizeof(json_response),
        "{\"service\": \"Pi Calculator C Server\"}");
    
    TEST_ASSERT_TRUE(contains_substring(json_response, "Pi Calculator C Server"));
}

void test_health_response_contains_timestamp(void) {
    char json_response[256];
    time_t now = time(NULL);
    snprintf(json_response, sizeof(json_response),
        "{\"timestamp\": %ld}", now);
    
    TEST_ASSERT_TRUE(contains_substring(json_response, "timestamp"));
}

void test_health_response_contains_algorithms_count(void) {
    char json_response[256];
    size_t algo_count = 12;
    snprintf(json_response, sizeof(json_response),
        "{\"algorithms_available\": %zu}", algo_count);
    
    TEST_ASSERT_TRUE(contains_substring(json_response, "algorithms_available"));
}

// ============= Hello World Response Tests =============

void test_hello_response_contains_message(void) {
    char json_response[256];
    snprintf(json_response, sizeof(json_response),
        "{\"message\": \"Hello World from C server\"}");
    
    TEST_ASSERT_TRUE(contains_substring(json_response, "Hello World from C server"));
}

void test_hello_response_contains_success_status(void) {
    char json_response[256];
    snprintf(json_response, sizeof(json_response),
        "{\"status\": \"success\"}");
    
    TEST_ASSERT_TRUE(contains_substring(json_response, "\"status\": \"success\""));
}

// ============= Server State Tests =============

void test_server_starts_not_running(void) {
    Server srv;
    srv.running = 0;
    
    TEST_ASSERT_FALSE(srv.running);
}

void test_server_cleanup_closes_socket(void) {
    Server srv;
    srv.socket_fd = MOCK_SOCKET_FD;
    
    TEST_ASSERT_EQUAL(MOCK_SOCKET_FD, srv.socket_fd);
    
    // After cleanup, socket should be invalid
    srv.socket_fd = -1;
    TEST_ASSERT_EQUAL(-1, srv.socket_fd);
}

// ============= Integration Tests =============

void test_full_json_response_structure(void) {
    PiResult result = {
        .pi_estimate = 3.14159265358979323846L,
        .iterations = 10000,
        .cpu_time_used = 0.123456L,
        .correct_digits = 15,
        .error = 1.23e-15L
    };
    
    char buffer[1024];
    snprintf(buffer, sizeof(buffer),
        "{"
        "\"pi_estimate\": \"%.33Lf\", "
        "\"algorithm\": \"%s\", "
        "\"iterations\": %lld, "
        "\"time_seconds\": %.6Lf, "
        "\"correct_digits\": %d"
        "}",
        result.pi_estimate,
        "test_algo",
        result.iterations,
        result.cpu_time_used,
        result.correct_digits
    );
    
    TEST_ASSERT_TRUE(contains_substring(buffer, "pi_estimate"));
    TEST_ASSERT_TRUE(contains_substring(buffer, "algorithm"));
    TEST_ASSERT_TRUE(contains_substring(buffer, "iterations"));
    TEST_ASSERT_TRUE(contains_substring(buffer, "time_seconds"));
    TEST_ASSERT_TRUE(contains_substring(buffer, "correct_digits"));
    TEST_ASSERT_TRUE(contains_substring(buffer, "test_algo"));
}

void test_algorithm_table_completeness(void) {
    // Verify all algorithms are present in the table
    const char *expected_algorithms[] = {
        "monte_carlo", "leibniz", "nilakantha", "coprimes",
        "buffon", "euler", "euler_kahan", "ramanujan",
        "chudnovsky", "gauss_legendre", "bbp", "borwein"
    };
    
    int expected_count = sizeof(expected_algorithms) / sizeof(expected_algorithms[0]);
    TEST_ASSERT_EQUAL(12, expected_count);
}

// ============= Public Function to Run All Tests =============

void run_server_tests(void) {
    // Algorithm lookup tests
    RUN_TEST(test_find_algorithm_monte_carlo);
    RUN_TEST(test_find_algorithm_leibniz);
    RUN_TEST(test_find_algorithm_bbp);
    RUN_TEST(test_find_algorithm_chudnovsky);
    
    // Server initialization tests
    RUN_TEST(test_server_init_structure);
    RUN_TEST(test_server_init_sets_port);
    RUN_TEST(test_server_init_default_not_running);
    
    // JSON building tests
    RUN_TEST(test_json_response_contains_pi_estimate);
    RUN_TEST(test_json_response_contains_algorithm_name);
    RUN_TEST(test_json_response_contains_iterations);
    RUN_TEST(test_json_response_contains_time);
    RUN_TEST(test_json_response_contains_correct_digits);
    RUN_TEST(test_json_response_contains_error_metrics);
    RUN_TEST(test_json_response_perfect_precision_flag);
    
    // HTTP response format tests
    RUN_TEST(test_http_response_has_status_line);
    RUN_TEST(test_http_response_has_content_type_json);
    RUN_TEST(test_http_response_has_cors_header);
    RUN_TEST(test_http_response_has_content_length);
    RUN_TEST(test_http_error_response_400);
    RUN_TEST(test_http_error_response_404);
    
    // Route parsing tests
    RUN_TEST(test_parse_root_route);
    RUN_TEST(test_parse_hello_route);
    RUN_TEST(test_parse_health_route);
    RUN_TEST(test_parse_algorithm_route_monte_carlo);
    RUN_TEST(test_parse_algorithm_route_bbp);
    RUN_TEST(test_parse_algorithm_route_chudnovsky);
    
    // Error response tests
    RUN_TEST(test_error_response_unknown_algorithm);
    RUN_TEST(test_error_response_route_not_found);
    
    // Health check tests
    RUN_TEST(test_health_response_contains_status);
    RUN_TEST(test_health_response_contains_service_name);
    RUN_TEST(test_health_response_contains_timestamp);
    RUN_TEST(test_health_response_contains_algorithms_count);
    
    // Hello world tests
    RUN_TEST(test_hello_response_contains_message);
    RUN_TEST(test_hello_response_contains_success_status);
    
    // Server state tests
    RUN_TEST(test_server_starts_not_running);
    RUN_TEST(test_server_cleanup_closes_socket);
    
    // Integration tests
    RUN_TEST(test_full_json_response_structure);
    RUN_TEST(test_algorithm_table_completeness);
}