#include "pi.h"

typedef long double (*CalculatePi)(long long);

void printNum(CalculatePi func, const char* name) {
    srand(time(NULL));
   
    long long iterations = 50;
    clock_t start, end;
    double cpu_time_used;
    long double pi_estimate;
    int calibration_attempts = 0;
    const int MAX_CALIBRATION_ATTEMPTS = 50;
    const long long MAX_ITERATIONS = 100000000LL; // 100 million
   
    printf("\n=== Calibrating %s algorithm ===\n", name);
   
    // Calibration phase
    while(calibration_attempts < MAX_CALIBRATION_ATTEMPTS) {
        calibration_attempts++;
        
        start = clock();
        pi_estimate = func(iterations);
        end = clock();
        cpu_time_used = ((double)(end - start)) / CLOCKS_PER_SEC;
       
        printf("Attempt %d: %lld iterations in %.6f seconds\n", 
               calibration_attempts, iterations, cpu_time_used);
       
        // Success condition
        if(cpu_time_used >= 0.8 && cpu_time_used <= 1.2) {
            break;
        }
        
        // Exit if we reach maximum iterations
        if(iterations >= MAX_ITERATIONS) {
            printf("⚠️  Reached maximum iteration limit (%lld)\n", MAX_ITERATIONS);
            break;
        }
        
        // Adjust iterations
        if(cpu_time_used < 0.001) {
            // Extremely fast
            iterations *= 10;
        } else if(cpu_time_used < 0.01) {
            // Very fast
            iterations *= 5;
        } else if(cpu_time_used < 0.5) {
            // Fast
            iterations *= 2;
        } else if(cpu_time_used < 0.8) {
            // Close but still fast
            iterations = (long long)(iterations * (1.0 / cpu_time_used));
        } else if(cpu_time_used > 1.2) {
            // Too slow, reduce
            iterations = (long long)(iterations * 0.8);
        }
        
        // Ensure we don't exceed maximum
        if(iterations > MAX_ITERATIONS) {
            iterations = MAX_ITERATIONS;
        }
    }
   
    // Final measurement with calibrated iteration count
    start = clock();
    pi_estimate = func(iterations);
    end = clock();
    cpu_time_used = ((double)(end - start)) / CLOCKS_PER_SEC;
   
    printf("\n=== FINAL RESULT ===\n");
    printf("Algorithm: %s\n", name);
    printf("Iterations: %lld\n", iterations);
    printf("Actual time: %.6f seconds\n", cpu_time_used);
    printf("Iterations/second: %.0f\n", iterations / cpu_time_used);
    printf("Estimated Pi: %.15Lf\n", pi_estimate);
    printf("Actual Pi:     %.15f\n", M_PI);
    
    long double error = fabsl(M_PI - pi_estimate);
    printf("Absolute error: %.2Le\n", error);
    
    if(error > 0 && error < 1.0) {
        printf("Approximate correct digits: %d\n", (int)(-log10(error)));
    } else if(error == 0) {
        printf("Correct digits: 15+ (maximum precision)\n");
    } else {
        printf("Error too large to calculate correct digits\n");
    }
    printf("========================\n");
}

int main() {
    printNum(ramanujan_fast, "ramanujan_fast");
    return 0;
}