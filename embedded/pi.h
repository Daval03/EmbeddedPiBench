#ifndef PI_H
#define PI_H

#include <stdio.h>
#include <sys/time.h> 
#include <ctime>
#include <limits.h>
#include <math.h>

//Probability
long double monte_carlo(long long iterations);
double buffon(long long needles);

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


#endif 