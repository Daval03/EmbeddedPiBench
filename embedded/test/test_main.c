#include "../libs/Unity/src/unity.h"
#include "test_pi_calculations.h"
#include "test_pi_optimization.h"
#include "test_server.h"
#include <stdio.h>


int main(void) {
    printf("Starting All Unit Tests...\n");
    
    UNITY_BEGIN();

    printf("\n=== PI CALCULATIONS TESTS ===\n");
    run_pi_calculations_tests();
    printf("\n=== PI OPTIMIZATION TESTS ===\n");
    run_pi_optimization_tests();
    printf("\n=== SERVER TESTS ===\n");
    run_server_tests();
    printf("\n=== ALL TESTS COMPLETED ===\n");
    return UNITY_END();
}