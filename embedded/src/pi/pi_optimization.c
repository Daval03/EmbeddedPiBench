#include "pi_optimization.h"


// Count correct digits in pi estimate
int count_correct_digits(long double estimate) {
    if (isnan(estimate) || isinf(estimate))
        return 0;

    long double error = fabsl(estimate - PI_REFERENCE);
    if (error < LDBL_MIN) error = LDBL_MIN;

    int digits = (int)floorl(-log10l(error));

    if (digits < 0) digits = 0;
    if (digits > MAX_PRECISION_DIGITS) digits = MAX_PRECISION_DIGITS;

    return digits;
}

// Test a pi calculation function with iteration count and time limit
ExecutionStatus test_execution(CalculatePi func, long long iterations, 
                              double time_limit, TestResult *test_result) {
    clock_t start = clock();
    long double estimate = func(iterations);
    clock_t end = clock();
    
    test_result->time_used = (long double)(end - start) / CLOCKS_PER_SEC;
    test_result->estimate = estimate;
    test_result->iterations = iterations;
    test_result->digits = count_correct_digits(estimate);
    
    if (isnan(estimate) || isinf(estimate)) {
        return EXEC_INVALID;
    }
    
    if (test_result->time_used > time_limit) {
        return EXEC_TIMEOUT;
    }
    
    return EXEC_VALID;
}

// Update best result with current result
void update_best_result(TestResult *best, const TestResult *current) {
    best->iterations = current->iterations;
    best->estimate = current->estimate;
    best->time_used = current->time_used;
    best->digits = current->digits;
}

// Check if maximum precision has been reached
int has_reached_max_precision(int digits) {
    return digits >= MAX_PRECISION_DIGITS;
}

// Calculate next iteration count based on time used
long long calculate_next_iteration(long long current, double time_used, double time_limit) {
    if (time_used < time_limit * 0.1) {
        return current * 5;
    } else if (time_used < time_limit * 0.3) {
        return current * 2;
    } else if (time_used < time_limit * 0.6) {
        return (long long)(current * 1.3);
    }
    return current;
}

// Phase 1: Test small fixed iteration values
int phase1_initial_search(CalculatePi func, double time_limit, TestResult *best) {
    long long test_values[] = {1, 2, 3, 4, 5, 10, 20, 50, 100, 200, 500, 1000};
    int num_tests = sizeof(test_values) / sizeof(test_values[0]);
    
    for (int i = 0; i < num_tests; i++) {
        TestResult current;
        ExecutionStatus status = test_execution(func, test_values[i], time_limit, &current);
        
        if (status == EXEC_INVALID || status == EXEC_TIMEOUT) {
            break;
        }
        
        update_best_result(best, &current);
        
        if (has_reached_max_precision(current.digits)) {
            return 1;
        }
    }
    
    return 0;
}

// Phase 2: Exponential search for optimal iterations
int phase2_exponential_search(CalculatePi func, double time_limit, 
                             long long start_iter, TestResult *best) {
    long long current = start_iter * 2;
    int no_improvement = 0;
    
    while (no_improvement < NO_IMPROVEMENT_THRESHOLD) {
        TestResult current_result;
        ExecutionStatus status = test_execution(func, current, time_limit, &current_result);
        
        if (status == EXEC_INVALID || status == EXEC_TIMEOUT) {
            break;
        }
        
        if (current_result.digits >= best->digits) {
            update_best_result(best, &current_result);
            no_improvement = 0;
            
            if (has_reached_max_precision(current_result.digits)) {
                return 1;
            }
        } else {
            no_improvement++;
        }
        
        long long next = calculate_next_iteration(current, current_result.time_used, time_limit);
        if (next == current || next > MAX_ITERATIONS) {
            break;
        }
        current = next;
    }
    
    return 0;
}

// Phase 3: Fine-tune around best iteration count
void phase3_fine_refinement(CalculatePi func, double time_limit, TestResult *best) {
    if (best->digits >= MAX_PRECISION_DIGITS - 3 || best->time_used >= time_limit * 0.7) {
        return;
    }
    
    long long increment = best->iterations / 4;
    if (increment < 1) increment = 1;
    
    for (int attempt = 0; attempt < 10; attempt++) {
        long long try_iter = best->iterations + increment;
        
        TestResult current;
        ExecutionStatus status = test_execution(func, try_iter, time_limit, &current);
        
        if (status != EXEC_VALID) {
            increment /= 2;
            if (increment == 0) break;
            continue;
        }
        
        if (current.digits >= best->digits) {
            update_best_result(best, &current);
            
            if (has_reached_max_precision(current.digits)) {
                break;
            }
        } else {
            increment /= 2;
            if (increment == 0) break;
        }
    }
}

// Main optimization function - find best pi precision within time limit
PiResult optimize_pi_precision(CalculatePi func, const char* func_name, double time_limit) {
    TestResult best = {1, 0.0L, 0.0L, 0};
    
    // Phase 1: Initial search with small values
    int early_complete = phase1_initial_search(func, time_limit, &best);
    
    // Phase 2: Exponential search
    if (!early_complete) {
        early_complete = phase2_exponential_search(func, time_limit, best.iterations, &best);
    }
    
    // Phase 3: Fine refinement
    if (!early_complete) {
        phase3_fine_refinement(func, time_limit, &best);
    }
    
    // Convert to final result
    PiResult result = {
        .pi_estimate = best.estimate,
        .iterations = best.iterations,
        .cpu_time_used = best.time_used,
        .correct_digits = best.digits,
        .error = fabsl(best.estimate - PI_REFERENCE)
    };
    
    return result;
}