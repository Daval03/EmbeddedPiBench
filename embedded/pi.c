#include "pi.h"

///////////////// Probability /////////////////
double monte_carlo(long long iterations) {
    long long circle_points = 0;
    for(long long i = 0; i < iterations; i++) {
        double rand_x = (double)rand() / RAND_MAX;
        double rand_y = (double)rand() / RAND_MAX;
        
        double origin = rand_x * rand_x + rand_y * rand_y;
        
        if(origin <= 1.0) {
            circle_points++;
        }
    }
    double pi = (4.0 * circle_points) / iterations;
    return pi;
}
double buffon(long long needles){return 0.0;}

///////////////// Inf series /////////////////
long double leibniz(long long terms){
    long double sum=0;
    for(long long k=0; k < terms; ++k){
        sum += pow(-1, k)/ (2*k+1); 
    }
    return 4*sum;
}
long double euler(long long terms){
    long double sum=0;
    for(long long k= 1; k < terms; ++k){
        sum += 1/(k*k); 
    }
    return sqrt(6*sum);
}

long double euler_kahan(long long terms) {
    long double sum = 0.0;
    long double compensation = 0.0;
    
    for(long long k = 1; k <= terms; ++k) {
        long double term = 1.0 / (k * k);
        long double y = term - compensation;
        long double t = sum + y;
        compensation = (t - sum) - y;
        sum = t;
    }
    
    return sqrt(6.0 * sum);
}
long double nilakantha(long long terms){
    long double sum=0;
    for(long long k=1; k < terms; ++k){
        sum += pow(-1, k+1)/ ((2*k)*(2*k+1)*(2*k+2)); 
    }
    return 4*sum + 3;
}
long double ramanujan_fast(long long terms) {
    if (terms <= 0) return 0.0L;
   
    const long double constant_factor = (2.0L * sqrtl(2.0L)) / 9801.0L;
    long double sum = 1103.0L; // k = 0 term
   
    const long double base_396_4 = 396.0L * 396.0L * 396.0L * 396.0L;
   
    long double factorial_ratio = 1.0L;    // (4k)! / (k!)^4
    long double inv_power_396 = 1.0L;      // 1 / 396^(4k)
   
    for (long long k = 1; k < terms; ++k) {
        // Update factorial ratio
        factorial_ratio *= (4*k - 3) * (4*k - 2) * (4*k - 1) * (4*k);
        factorial_ratio /= (k * k * k * k);
       
        // Update inverse power of 396
        inv_power_396 /= base_396_4;
       
        // Calculate and add term
        long double term = factorial_ratio * inv_power_396 * (1103.0L + 26390.0L * k);
        sum += term;
        
        // Optional: early termination if term becomes negligible
        if (term < 1e-18L * sum) break;
    }
   
    sum *= constant_factor;
    return 1.0L / sum;
}

long double chudnovsky_fast(long long terms) {
    if (terms <= 0) return 0.0L;
    const long double C = 426880.0L * sqrtl(10005.0L);  // Multiplicative constant
    long double sum = 0.0L;
    // Precompute 640320^3 for recursive use
    const long double base_640320_3 = 640320.0L * 640320.0L * 640320.0L;
    long double factorial_ratio = 1.0L;    // (6k)! / ((3k)! * (k!)^3)
    long double inv_power = 1.0L;          // 1 / 640320^(3k)
    long long sign = 1;                     // (-1)^k
   
    for (long long k = 0; k < terms; ++k) {
        if (k > 0) {
            // Update factorial_ratio recursively
            // (6k)! / ((3k)! * (k!)^3) = [(6k-5)(6k-4)(6k-3)(6k-2)(6k-1)(6k)] / [(3k-2)(3k-1)(3k) * k^3] * previous_ratio
            factorial_ratio *= (6*k - 5) * (6*k - 4) * (6*k - 3) * (6*k - 2) * (6*k - 1) * (6*k);
            factorial_ratio /= ((3*k - 2) * (3*k - 1) * (3*k) * k * k * k);
           
            // Update power of 640320
            inv_power /= base_640320_3;
           
            // Alternate sign
            sign = -sign;
        }
        // Calculate current term
        long double term = sign * factorial_ratio * inv_power * (13591409.0L + 545140134.0L * k);
        sum += term;  
        // Early termination if term is negligible
        if (fabsl(term) < 1e-25L * fabsl(sum) && k > 0) break;
    }
    return C / sum;
}

///////////////// Numerical methods /////////////////
double gauss_legendre(int iterations){return 0.0;}
double bbp(int iterations){return 0.0;}
