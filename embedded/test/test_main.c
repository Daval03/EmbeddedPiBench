#include "../libs/Unity/src/unity.h"
#include <stdio.h>
#include "test_pi_calculations.h"

void run_pi_calculations_tests(void) {
    printf("\n=== PI CALCULATIONS TESTS ===\n");
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
int main(void) {
    printf("Starting All Unit Tests...\n");
    
    UNITY_BEGIN();
    
    run_pi_calculations_tests();
    
    printf("\n=== ALL TESTS COMPLETED ===\n");
    return UNITY_END();
}