#include "pi_calculations.h"

///////////////// Probability /////////////////
long double monte_carlo(long long iterations) {
    long long circle_points = 0;
    srandom(time(NULL));
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

long double buffon(long long needles){
    long long crosses = 0;
    
    srandom(time(NULL));

    for(long long i=0; i < needles; ++i){
        long double center = (long double)rand() / RAND_MAX * 0.5L;
        long double angle = (long double)rand() / RAND_MAX * (M_PI/2.0L);
        if(center <= 0.5L * sin(angle)){
            crosses++;
        }   
    }
    if(crosses==0){
        return 0.0L;
    }
    long double pi = (2.0L * (long double)needles) / (long double)crosses;
    return pi;
}

long double pi_coprimes(long long pairs) {
    auto gcd = [](long long a, long long b) {
        return b == 0 ? a : gcd(b, a % b);
    };
    
    long long coprimes = 0;
    srand(time(NULL));
    
    for(long long i = 0; i < pairs; i++) {
        long long a = rand() % 1000000 + 1;
        long long b = rand() % 1000000 + 1;
        if(gcd(a, b) == 1) coprimes++;
    }
    
    return sqrtl(6.0L / ((long double)coprimes / pairs));
}
///////////////// Infinite series /////////////////
long double leibniz(long long terms){
    long double sum=0.0L;
    for(long long k=0; k < terms; ++k){
        sum += powl(-1, k)/ (2*k+1); 
    }
    return 4*sum;
}

long double euler(long long terms){
    long double sum=0.0L;
    for(long long k= 1; k < terms; ++k){
        sum += 1.0L/(k*k); 
    }
    return sqrtl(6*sum);
}

long double euler_kahan(long long terms) {
    long double sum = 0.0L;
    long double compensation = 0.0L;
    
    for(long long k = 1; k <= terms; ++k) {
        long double term = 1.0 / (k * k);
        long double y = term - compensation;
        long double t = sum + y;
        compensation = (t - sum) - y;
        sum = t;
    }
    
    return sqrtl(6.0 * sum);
}

long double nilakantha(long long terms){
    long double sum=0;
    for(long long k=1; k < terms; ++k){
        sum += powl(-1, k+1)/ ((2*k)*(2*k+1)*(2*k+2)); 
    }
    return 4*sum + 3;
}

long double ramanujan_fast(long long terms) {
    if (terms <= 0) return 0.0L;
   
    const long double constant_factor = (2.0L * sqrtl(2.0L)) / 9801.0L;
    long double sum = 1103.0L;
   
    const long double base_396_4 = 396.0L * 396.0L * 396.0L * 396.0L;
   
    long double factorial_ratio = 1.0L;
    long double inv_power_396 = 1.0L;
   
    for (long long k = 1; k < terms; ++k) {
        factorial_ratio *= (4*k - 3) * (4*k - 2) * (4*k - 1) * (4*k);
        factorial_ratio /= (k * k * k * k);
       
        inv_power_396 /= base_396_4;
       
        long double term = factorial_ratio * inv_power_396 * (1103.0L + 26390.0L * k);
        sum += term;
    }
   
    sum *= constant_factor;
    return 1.0L / sum;
}

long double chudnovsky_fast(long long terms) {
    if (terms <= 0) return 0.0L;
    const long double C = 426880.0L * sqrtl(10005.0L);
    long double sum = 0.0L;
    const long double base_640320_3 = 640320.0L * 640320.0L * 640320.0L;
    long double factorial_ratio = 1.0L;
    long double inv_power = 1.0L;
    long long sign = 1;
   
    for (long long k = 0; k < terms; ++k) {
        if (k > 0) {
            factorial_ratio *= (6*k - 5) * (6*k - 4) * (6*k - 3) * (6*k - 2) * (6*k - 1) * (6*k);
            factorial_ratio /= ((3*k - 2) * (3*k - 1) * (3*k) * k * k * k);
           
            inv_power /= base_640320_3;
            sign = -sign;
        }
        long double term = sign * factorial_ratio * inv_power * (13591409.0L + 545140134.0L * k);
        sum += term;  
    }
    return C / sum;
}

///////////////// Numerical methods /////////////////
long double gauss_legendre(long long iterations) {
    long double a = 1.0L;
    long double b = 1.0L / sqrtl(2.0L);
    long double t = 0.25L;
    long double p = 1.0L;
    
    for(long long i = 0; i < iterations; ++i) {
        long double a_next = (a + b) / 2.0L;
        long double b_next = sqrtl(a*b);
        t = t - p * (a - a_next) * (a - a_next);  
        p *= 2.0L;
        a = a_next; 
        b = b_next; 
    }
    long double sum=a+b;
    return sum*sum/(4.0L * t);
}

long double bbp(long long iterations){
    long double pi = 0.0L;
    long double power_16 = 1.0L;
    for(long long k = 0; k < iterations; ++k) {
        long double k8 = 8.0L * k;
        long double term = power_16 * (
            4.0L / (k8 + 1.0L) -
            2.0L / (k8 + 4.0L) -
            1.0L / (k8 + 5.0L) -
            1.0L / (k8 + 6.0L)
        );
        pi += term;
        power_16 /= 16.0L;
    }
    return pi;
}

long double borwein(long long iterations){
    long double y = sqrtl(2.0L) - 1.0L;
    long double a = 6.0L - 4*sqrtl(2.0L);

    for(long long n = 0; n < iterations; ++n) {
        long double y_next = (1 - powl(1 - powl(y, 4), 0.25L)) / (1 + powl(1 - powl(y, 4), 0.25L));
        long double a_next = a*powl(1 + y_next, 4.0L) - powl(2.0L, 2*n+3) * y_next*(1+y_next+y_next*y_next);
        y = y_next; 
        a = a_next; 
    }
    return 1.0L/a;
}
