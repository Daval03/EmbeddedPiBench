#ifndef TEST_PI_CALCULATIONS_H
#define TEST_PI_CALCULATIONS_H

#include "../libs/Unity/src/unity.h"
#include "../src/pi/pi_calculations.h"


void test_leibniz_basic(void);
void test_monte_carlo_basic(void);
void test_euler_basic(void);
void test_euler_kahan_basic(void);
void test_nilakantha_basic(void);
void test_gauss_legendre_basic(void);
void test_bbp_basic(void);
void test_pi_coprimes_basic(void);
void test_buffon_basic(void);
void test_ramanujan_fast_basic(void);
void test_chudnovsky_fast_basic(void);
void test_borwein_basic(void);
void test_methods_consistency(void);
void test_zero_iterations(void);
void test_single_iteration(void);

#endif