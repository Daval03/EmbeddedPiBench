#ifndef PI_H
#define PI_H

#include <stdio.h>
#include <sys/time.h> 
#include <ctime>
#include <limits.h>
#include <math.h>

//Probability
double monte_carlo(long long iterations);
double buffon(long long needles);

//Inf series
double leibniz(long long terms);
double nilakantha(long long terms);
double euler(long long terms);

//Numerical methods
double gauss_legendre(int iterations);
double bbp(int iterations);



#endif 