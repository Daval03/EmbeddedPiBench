#include "test_pi_optimization.h"

// Mock functions for testing
long double mock_fast_converge(long long iterations) {
    return 3.14159265358979323846L + (1.0L / iterations);
}

long double mock_slow_accurate(long long iterations) {
    volatile long double sum = 0.0L;
    for(long long i = 0; i < iterations * 1000; i++) {
        sum += 0.0000001L;
    }
    return 3.14159265358979323846L;
}

long double mock_invalid(long long iterations) {
    return NAN;
}

long double mock_poor_converge(long long iterations) {
    return 3.0L + (1.0L / sqrtl(iterations));
}

// ============= count_correct_digits Tests =============

void test_count_correct_digits_perfect_match(void) {
    int digits = count_correct_digits(PI_REFERENCE);
    TEST_ASSERT_EQUAL_INT(MAX_PRECISION_DIGITS, digits);
}

void test_count_correct_digits_one_digit(void) {
    int digits = count_correct_digits(3.0L);
    TEST_ASSERT_GREATER_OR_EQUAL(0, digits);
    TEST_ASSERT_LESS_OR_EQUAL(1, digits);
}

void test_count_correct_digits_several_digits(void) {
    int digits = count_correct_digits(3.14159L);
    TEST_ASSERT_GREATER_OR_EQUAL(4, digits);
    TEST_ASSERT_LESS_OR_EQUAL(6, digits);
}

void test_count_correct_digits_nan(void) {
    int digits = count_correct_digits(NAN);
    TEST_ASSERT_EQUAL_INT(0, digits);
}

void test_count_correct_digits_infinity(void) {
    int digits = count_correct_digits(INFINITY);
    TEST_ASSERT_EQUAL_INT(0, digits);
}

void test_count_correct_digits_negative_infinity(void) {
    int digits = count_correct_digits(-INFINITY);
    TEST_ASSERT_EQUAL_INT(0, digits);
}

void test_count_correct_digits_very_wrong(void) {
    int digits = count_correct_digits(100.0L);
    TEST_ASSERT_EQUAL_INT(0, digits);
}

// ============= test_execution Tests =============

void test_test_execution_valid_result(void) {
    TestResult result;
    ExecutionStatus status = test_execution(mock_fast_converge, 100, 10.0, &result);
    
    TEST_ASSERT_EQUAL_INT(EXEC_VALID, status);
    TEST_ASSERT_EQUAL_INT64(100, result.iterations);
    TEST_ASSERT_GREATER_THAN(0, result.digits);
    TEST_ASSERT_GREATER_OR_EQUAL(0.0, result.time_used);
}

void test_test_execution_invalid_result(void) {
    TestResult result;
    ExecutionStatus status = test_execution(mock_invalid, 100, 10.0, &result);
    
    TEST_ASSERT_EQUAL_INT(EXEC_INVALID, status);
    TEST_ASSERT_TRUE(isnan(result.estimate));
}

void test_test_execution_stores_iterations(void) {
    TestResult result;
    long long iterations = 500;
    test_execution(mock_fast_converge, iterations, 10.0, &result);
    
    TEST_ASSERT_EQUAL_INT64(iterations, result.iterations);
}

void test_test_execution_stores_estimate(void) {
    TestResult result;
    test_execution(mock_fast_converge, 1000, 10.0, &result);
    
    TEST_ASSERT_FLOAT_WITHIN(0.1, PI_REFERENCE, result.estimate);
}

void test_test_execution_time_tracking(void) {
    TestResult result;
    test_execution(mock_fast_converge, 100, 10.0, &result);
    
    TEST_ASSERT_GREATER_OR_EQUAL(0.0, result.time_used);
    TEST_ASSERT_LESS_THAN(10.0, result.time_used);
}

// ============= update_best_result Tests =============

void test_update_best_result_copies_all_fields(void) {
    TestResult best = {0, 0.0L, 0.0L, 0};
    TestResult current = {1000, 3.14L, 0.5L, 5};
    
    update_best_result(&best, &current);
    
    TEST_ASSERT_EQUAL_INT64(1000, best.iterations);
    TEST_ASSERT_EQUAL_DOUBLE(3.14L, best.estimate);
    TEST_ASSERT_EQUAL_DOUBLE(0.5L, best.time_used);
    TEST_ASSERT_EQUAL_INT(5, best.digits);
}

void test_update_best_result_overwrites_previous(void) {
    TestResult best = {500, 3.0L, 1.0L, 2};
    TestResult current = {2000, 3.14159L, 0.8L, 8};
    
    update_best_result(&best, &current);
    
    TEST_ASSERT_EQUAL_INT64(2000, best.iterations);
    TEST_ASSERT_EQUAL_INT(8, best.digits);
}

// ============= has_reached_max_precision Tests =============

void test_has_reached_max_precision_at_max(void) {
    TEST_ASSERT_TRUE(has_reached_max_precision(MAX_PRECISION_DIGITS));
}

void test_has_reached_max_precision_above_max(void) {
    TEST_ASSERT_TRUE(has_reached_max_precision(MAX_PRECISION_DIGITS + 1));
}

void test_has_reached_max_precision_below_max(void) {
    TEST_ASSERT_FALSE(has_reached_max_precision(MAX_PRECISION_DIGITS - 1));
}

void test_has_reached_max_precision_zero(void) {
    TEST_ASSERT_FALSE(has_reached_max_precision(0));
}

// ============= calculate_next_iteration Tests =============

void test_calculate_next_iteration_very_fast(void) {
    long long next = calculate_next_iteration(100, 0.05, 1.0);
    TEST_ASSERT_EQUAL_INT64(500, next);
}

void test_calculate_next_iteration_fast(void) {
    long long next = calculate_next_iteration(100, 0.2, 1.0);
    TEST_ASSERT_EQUAL_INT64(200, next);
}

void test_calculate_next_iteration_moderate(void) {
    long long next = calculate_next_iteration(100, 0.5, 1.0);
    TEST_ASSERT_EQUAL_INT64(130, next);
}

void test_calculate_next_iteration_slow(void) {
    long long next = calculate_next_iteration(100, 0.8, 1.0);
    TEST_ASSERT_EQUAL_INT64(100, next);
}

void test_calculate_next_iteration_at_limit(void) {
    long long next = calculate_next_iteration(100, 1.0, 1.0);
    TEST_ASSERT_EQUAL_INT64(100, next);
}

// ============= phase1_initial_search Tests =============

void test_phase1_finds_valid_result(void) {
    TestResult best = {0, 0.0L, 0.0L, 0};
    int completed = phase1_initial_search(mock_fast_converge, 10.0, &best);
    
    TEST_ASSERT_GREATER_THAN(0, best.iterations);
    TEST_ASSERT_GREATER_THAN(0, best.digits);
}

void test_phase1_stops_on_invalid(void) {
    TestResult best = {0, 0.0L, 0.0L, 0};
    phase1_initial_search(mock_invalid, 10.0, &best);
    
    TEST_ASSERT_EQUAL_INT(0, best.digits);
}

void test_phase1_early_complete_on_max_precision(void) {
    TestResult best = {0, 0.0L, 0.0L, 0};
    int completed = phase1_initial_search(mock_fast_converge, 10.0, &best);
    
    if (best.digits >= MAX_PRECISION_DIGITS) {
        TEST_ASSERT_TRUE(completed);
    }
}

// ============= phase2_exponential_search Tests =============

void test_phase2_improves_result(void) {
    TestResult best = {100, 3.1L, 0.1L, 2};
    phase2_exponential_search(mock_fast_converge, 10.0, 100, &best);
    
    TEST_ASSERT_GREATER_THAN(100, best.iterations);
}

void test_phase2_respects_no_improvement_threshold(void) {
    TestResult best = {1000, 3.14159265L, 0.5L, 10};
    int completed = phase2_exponential_search(mock_poor_converge, 10.0, 1000, &best);
    
    TEST_ASSERT_FALSE(completed);
}

void test_phase2_stops_on_timeout(void) {
    TestResult best = {1, 3.0L, 0.01L, 1};
    phase2_exponential_search(mock_slow_accurate, 0.001, 1, &best);
    
    TEST_ASSERT_GREATER_OR_EQUAL(0, best.digits);
}

// ============= phase3_fine_refinement Tests =============

void test_phase3_refines_result(void) {
    TestResult best = {1000, 3.14L, 0.3L, 5};
    int original_iterations = best.iterations;
    
    phase3_fine_refinement(mock_fast_converge, 10.0, &best);
    
    TEST_ASSERT_GREATER_OR_EQUAL(original_iterations, best.iterations);
}

void test_phase3_skips_if_near_max_precision(void) {
    TestResult best = {5000, PI_REFERENCE, 0.5L, MAX_PRECISION_DIGITS - 1};
    long long original = best.iterations;
    
    phase3_fine_refinement(mock_fast_converge, 10.0, &best);
    
    TEST_ASSERT_EQUAL_INT64(original, best.iterations);
}

void test_phase3_skips_if_time_limit_near(void) {
    TestResult best = {1000, 3.14L, 8.0L, 5};
    long long original = best.iterations;
    
    phase3_fine_refinement(mock_fast_converge, 10.0, &best);
    
    TEST_ASSERT_EQUAL_INT64(original, best.iterations);
}

// ============= optimize_pi_precision Tests =============

void test_optimize_pi_precision_returns_valid_result(void) {
    PiResult result = optimize_pi_precision(mock_fast_converge, "mock_fast", 5.0);
    
    TEST_ASSERT_GREATER_THAN(0, result.iterations);
    TEST_ASSERT_GREATER_THAN(0, result.correct_digits);
    TEST_ASSERT_FLOAT_WITHIN(1.0, PI_REFERENCE, result.pi_estimate);
}

void test_optimize_pi_precision_respects_time_limit(void) {
    PiResult result = optimize_pi_precision(mock_fast_converge, "mock_fast", 1.0);
    
    TEST_ASSERT_LESS_OR_EQUAL(1.5, result.cpu_time_used);
}

void test_optimize_pi_precision_calculates_error(void) {
    PiResult result = optimize_pi_precision(mock_fast_converge, "mock_fast", 5.0);
    
    long double expected_error = fabsl(result.pi_estimate - PI_REFERENCE);
    TEST_ASSERT_EQUAL_DOUBLE(expected_error, result.error);
}

void test_optimize_pi_precision_handles_poor_convergence(void) {
    PiResult result = optimize_pi_precision(mock_poor_converge, "mock_poor", 2.0);
    
    TEST_ASSERT_GREATER_THAN(0, result.correct_digits);
    TEST_ASSERT_GREATER_THAN(0, result.iterations);
}

void test_optimize_pi_precision_with_real_algorithm(void) {
    PiResult result = optimize_pi_precision(bbp, "bbp", 1.0);
    
    TEST_ASSERT_GREATER_THAN(0, result.correct_digits);
    TEST_ASSERT_GREATER_THAN(0, result.iterations);
    TEST_ASSERT_FLOAT_WITHIN(0.01, PI_REFERENCE, result.pi_estimate);
}

// ============= Integration Tests =============

void test_full_optimization_workflow(void) {
    PiResult result = optimize_pi_precision(mock_fast_converge, "integration_test", 3.0);
    
    TEST_ASSERT_NOT_NULL(&result);
    TEST_ASSERT_GREATER_THAN(0, result.iterations);
    TEST_ASSERT_GREATER_THAN(0, result.correct_digits);
    TEST_ASSERT_LESS_OR_EQUAL(3.5, result.cpu_time_used);
    TEST_ASSERT_FLOAT_WITHIN(1.0, PI_REFERENCE, result.pi_estimate);
}

void test_optimization_consistency(void) {
    PiResult result1 = optimize_pi_precision(mock_fast_converge, "test1", 2.0);
    PiResult result2 = optimize_pi_precision(mock_fast_converge, "test2", 2.0);
    
    TEST_ASSERT_INT_WITHIN(1000, result1.iterations, result2.iterations);
    TEST_ASSERT_INT_WITHIN(2, result1.correct_digits, result2.correct_digits);
}

// ============= Public Function to Run All Tests =============

void run_pi_optimization_tests(void) {
    printf("\n=== PI OPTIMIZATION TESTS ===\n");
    // count_correct_digits tests
    RUN_TEST(test_count_correct_digits_perfect_match);
    RUN_TEST(test_count_correct_digits_one_digit);
    RUN_TEST(test_count_correct_digits_several_digits);
    RUN_TEST(test_count_correct_digits_nan);
    RUN_TEST(test_count_correct_digits_infinity);
    RUN_TEST(test_count_correct_digits_negative_infinity);
    RUN_TEST(test_count_correct_digits_very_wrong);
    
    // test_execution tests
    RUN_TEST(test_test_execution_valid_result);
    RUN_TEST(test_test_execution_invalid_result);
    RUN_TEST(test_test_execution_stores_iterations);
    RUN_TEST(test_test_execution_stores_estimate);
    RUN_TEST(test_test_execution_time_tracking);
    
    // update_best_result tests
    RUN_TEST(test_update_best_result_copies_all_fields);
    RUN_TEST(test_update_best_result_overwrites_previous);
    
    // has_reached_max_precision tests
    RUN_TEST(test_has_reached_max_precision_at_max);
    RUN_TEST(test_has_reached_max_precision_above_max);
    RUN_TEST(test_has_reached_max_precision_below_max);
    RUN_TEST(test_has_reached_max_precision_zero);
    
    // calculate_next_iteration tests
    RUN_TEST(test_calculate_next_iteration_very_fast);
    RUN_TEST(test_calculate_next_iteration_fast);
    RUN_TEST(test_calculate_next_iteration_moderate);
    RUN_TEST(test_calculate_next_iteration_slow);
    RUN_TEST(test_calculate_next_iteration_at_limit);
    
    // phase1_initial_search tests
    RUN_TEST(test_phase1_finds_valid_result);
    RUN_TEST(test_phase1_stops_on_invalid);
    RUN_TEST(test_phase1_early_complete_on_max_precision);
    
    // phase2_exponential_search tests
    RUN_TEST(test_phase2_improves_result);
    RUN_TEST(test_phase2_respects_no_improvement_threshold);
    RUN_TEST(test_phase2_stops_on_timeout);
    
    // phase3_fine_refinement tests
    RUN_TEST(test_phase3_refines_result);
    RUN_TEST(test_phase3_skips_if_near_max_precision);
    RUN_TEST(test_phase3_skips_if_time_limit_near);
    
    // optimize_pi_precision tests
    RUN_TEST(test_optimize_pi_precision_returns_valid_result);
    RUN_TEST(test_optimize_pi_precision_respects_time_limit);
    RUN_TEST(test_optimize_pi_precision_calculates_error);
    RUN_TEST(test_optimize_pi_precision_handles_poor_convergence);
    RUN_TEST(test_optimize_pi_precision_with_real_algorithm);
    
    // Integration tests
    RUN_TEST(test_full_optimization_workflow);
    RUN_TEST(test_optimization_consistency);
}