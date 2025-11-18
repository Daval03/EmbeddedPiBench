#ifndef PI_OPTIMIZATION_H
#define PI_OPTIMIZATION_H

#include "pi_calculations.h"
#include "../constants.h"
#include <float.h>
#include <time.h>


typedef long double (*CalculatePi)(long long);

typedef struct {
    long double pi_estimate;
    long long iterations;
    long double cpu_time_used;
    int correct_digits;
    long double error;
} PiResult;

typedef enum {
    EXEC_VALID = 1,
    EXEC_INVALID = 0,
    EXEC_TIMEOUT = -1
} ExecutionStatus;

typedef struct {
    long long iterations;
    long double estimate;
    long double time_used;
    int digits;
} TestResult;

// Utility functions
int count_correct_digits(long double estimate);
ExecutionStatus test_execution(CalculatePi func, long long iterations, double time_limit, TestResult *test_result);
void update_best_result(TestResult *best, const TestResult *current);
int has_reached_max_precision(int digits);
long long calculate_next_iteration(long long current, double time_used, double time_limit);
int phase1_initial_search(CalculatePi func, double time_limit, TestResult *best);
int phase2_exponential_search(CalculatePi func, double time_limit, long long start_iter, TestResult *best);
void phase3_fine_refinement(CalculatePi func, double time_limit, TestResult *best);
PiResult optimize_pi_precision(CalculatePi func, const char* func_name, double time_limit);

#endif