#ifndef PI_H
#define PI_H

#include <stdio.h>
#include <sys/time.h> 
#include <ctime>
#include <limits.h>
#include <math.h>
#include <string.h>
#include <float.h> 

#define MAX_PRECISION_DIGITS 33
#define MAX_ITERATIONS 100000000LL
#define NO_IMPROVEMENT_THRESHOLD 3

const long double PI_REFERENCE = 3.14159265358979323846264338327950288419716939937510L;

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



//Probability
long double monte_carlo(long long iterations);
long double buffon(long long needles);
long long gcd(long long a, long long b);
long double pi_coprimes(long long pairs);

//Inf series
long double leibniz(long long terms);
long double nilakantha(long long terms);
long double euler(long long terms);
long double euler_kahan(long long terms);
long double ramanujan_fast(long long terms);
long double chudnovsky_fast(long long terms);

//Numerical methods
long double gauss_legendre(long long iterations);
long double bbp(long long iterations);
long double borwein(long long iterations);

//utils
static ExecutionStatus test_execution(CalculatePi func, long long iterations, double time_limit, TestResult *test_result);
static void update_best_result(TestResult *best, const TestResult *current);
static int has_reached_max_precision(int digits);
static long long calculate_next_iteration(long long current, double time_used, double time_limit);
static int phase1_initial_search(CalculatePi func, double time_limit, TestResult *best);
static int phase2_exponential_search(CalculatePi func, double time_limit,long long start_iter, TestResult *best);
static void phase3_fine_refinement(CalculatePi func, double time_limit, TestResult *best);
PiResult optimize_pi_precision(CalculatePi func, const char* func_name, double time_limit);

#endif 