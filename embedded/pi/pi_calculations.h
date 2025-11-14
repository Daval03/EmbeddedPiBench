#ifndef PI_CALCULATIONS_H
#define PI_CALCULATIONS_H

#include <stdio.h>
#include <stdlib.h>
#include <math.h>
#include <time.h>
#include "../constants.h"

///////////////// Probability /////////////////
long double monte_carlo(long long iterations);
long double buffon(long long needles);
long long gcd(long long a, long long b);
long double pi_coprimes(long long pairs);

///////////////// Infinite series /////////////////
long double leibniz(long long terms);
long double euler(long long terms);
long double euler_kahan(long long terms);
long double nilakantha(long long terms);
long double ramanujan_fast(long long terms);
long double chudnovsky_fast(long long terms);

///////////////// Numerical methods /////////////////
long double gauss_legendre(long long iterations);
long double bbp(long long iterations);
long double borwein(long long iterations);

#endif