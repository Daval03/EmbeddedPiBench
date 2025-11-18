#include "test_pi_calculations.h"

void test_leibniz_basic(void) {
    long double result = leibniz(1000000);
    TEST_ASSERT_FLOAT_WITHIN(0.1, 3.14159, result);
}

void test_monte_carlo_basic(void) {
    long double result = monte_carlo(100000);
    TEST_ASSERT_FLOAT_WITHIN(0.2, 3.14159, result);
}

void test_euler_basic(void) {
    long double result = euler(100000);
    TEST_ASSERT_FLOAT_WITHIN(0.1, 3.14159, result);
}

void test_euler_kahan_basic(void) {
    long double result = euler_kahan(100000);
    TEST_ASSERT_FLOAT_WITHIN(0.1, 3.14159, result);
}

void test_nilakantha_basic(void) {
    long double result = nilakantha(100000);
    TEST_ASSERT_FLOAT_WITHIN(0.1, 3.14159, result);
}

void test_gauss_legendre_basic(void) {
    long double result = gauss_legendre(10);
    TEST_ASSERT_FLOAT_WITHIN(0.0001, 3.14159, result);
}

void test_bbp_basic(void) {
    long double result = bbp(10);
    TEST_ASSERT_FLOAT_WITHIN(0.1, 3.14159, result);
}

void test_pi_coprimes_basic(void) {
    long double result = pi_coprimes(100000);
    TEST_ASSERT_FLOAT_WITHIN(0.5, 3.14159, result);
}

void test_buffon_basic(void) {
    long double result = buffon(100000);
    TEST_ASSERT_FLOAT_WITHIN(0.5, 3.14159, result);
}

void test_ramanujan_fast_basic(void) {
    long double result = ramanujan_fast(3);
    TEST_ASSERT_FLOAT_WITHIN(0.00001, 3.14159, result);
}

void test_chudnovsky_fast_basic(void) {
    long double result = chudnovsky_fast(3);
    TEST_ASSERT_FLOAT_WITHIN(0.00001, 3.14159, result);
}

void test_borwein_basic(void) {
    long double result = borwein(5);
    TEST_ASSERT_FLOAT_WITHIN(0.0001, 3.14159, result);
}

// Test de comparación entre métodos
void test_methods_consistency(void) {
    long double leibniz_pi = leibniz(10000);
    long double euler_pi = euler(10000);
    
    TEST_ASSERT_FLOAT_WITHIN(0.5, leibniz_pi, euler_pi);
}

// Test de límites
void test_zero_iterations(void) {
    long double result = leibniz(0);
    TEST_ASSERT_EQUAL_FLOAT(0.0, result);
}

void test_single_iteration(void) {
    long double result = leibniz(1);
    TEST_ASSERT_EQUAL_FLOAT(4.0, result); // 4 * (1/1) = 4.0
}

void run_pi_calculations_tests(void) {
    RUN_TEST(test_leibniz_basic);
    RUN_TEST(test_monte_carlo_basic);
    RUN_TEST(test_euler_basic);
    RUN_TEST(test_euler_kahan_basic);
    RUN_TEST(test_nilakantha_basic);
    RUN_TEST(test_gauss_legendre_basic);
    RUN_TEST(test_bbp_basic);
    RUN_TEST(test_pi_coprimes_basic);
    RUN_TEST(test_buffon_basic);
    RUN_TEST(test_ramanujan_fast_basic);
    RUN_TEST(test_chudnovsky_fast_basic);
    RUN_TEST(test_borwein_basic);
    RUN_TEST(test_methods_consistency);
    RUN_TEST(test_zero_iterations);
    RUN_TEST(test_single_iteration);
}