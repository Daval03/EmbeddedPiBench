#ifndef PI_H
#define PI_H

#include <stdio.h>
#include <sys/time.h> 
#include <ctime>
#include <limits.h>
#include <math.h>
#include <string.h>
#include <float.h> 
typedef long double (*CalculatePi)(long long);

typedef struct {
    long double pi_estimate;
    long long iterations;
    double cpu_time_used;
    int correct_digits;
    long double error;
} PiResult;

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
void compare_algorithms();
void test_algorithm(CalculatePi func, const char* name);
PiResult optimize_pi_precision(CalculatePi func, const char* func_name, double time_limit);
int count_correct_digits(long double estimate);

#endif 