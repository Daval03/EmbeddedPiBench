#ifndef PI_H
#define PI_H

#include <stdio.h>
#include <sys/time.h>

long long fib(int n);

double monte_carlo(long long iterations);

double leibniz(long long terms);

double nilakantha(long long terms);

double gauss_legendre(int iterations);

double bbp(int iterations);

double archimedes(int sides);

double euler(long long terms);

double buffon(long long needles);


void compare_pi_methods(long long param);

#endif 