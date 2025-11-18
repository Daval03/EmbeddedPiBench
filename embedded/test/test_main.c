#include "../libs/Unity/src/unity.h"
#include "test_pi_calculations.h"
#include "test_pi_optimization.h"
#include <stdio.h>


int main(void) {
    printf("Starting All Unit Tests...\n");
    
    UNITY_BEGIN();
    
    run_pi_calculations_tests();
    run_pi_optimization_tests();
    
    printf("\n=== ALL TESTS COMPLETED ===\n");
    return UNITY_END();
}