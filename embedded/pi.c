#include "pi.h"

///////////////// Probability /////////////////
long double monte_carlo(long long iterations) {
    long long circle_points = 0.0L;
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
    long long crosses = 0.0L;
    
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
    //pi = (2*L*N)/(d*C)
    //L=d=1 pi= 2*N/C
    long double pi = (2.0L * (long double)needles) / (long double)crosses;
    return pi;
}
long long gcd(long long a, long long b) {
    return b == 0 ? a : gcd(b, a % b);
}

long double pi_coprimes(long long pairs) {
    long long coprimes = 0;
    for(long long i = 0; i < pairs; i++) {
        long long a = rand() % 1000000 + 1;
        long long b = rand() % 1000000 + 1;
        if(gcd(a, b) == 1) coprimes++;
    }
    double prob = (double)coprimes / pairs;
    return sqrtl(6.0L / prob);
}

///////////////// Inf series /////////////////
long double leibniz(long long terms){
    long double sum=0.0L;
    for(long long k=0; k < terms; ++k){
        sum += powl(-1, k)/ (2*k+1); 
    }
    return 4*sum;
}
long double euler(long long terms){
    long double sum=0;
    for(long long k= 1; k < terms; ++k){
        sum += 1/(k*k); 
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
long double gauss_legendre(long long iterations) {
    if (iterations > 10) {
        iterations = 10;
    }
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
    if (iterations > 200) {
        iterations = 200;
    }
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
//Utils
void printCalculation(CalculatePi func, const char* name) {
    srand(time(NULL));
   
    long long iterations = 50;
    clock_t start, end;
    double cpu_time_used;
    long double pi_estimate;
    int calibration_attempts = 0;
    const int MAX_CALIBRATION_ATTEMPTS = 50;
    const long long MAX_ITERATIONS = 100000000LL; // 100 million
   
    printf("\n=== Calibrating %s algorithm ===\n", name);
   
    // Calibration phase
    while(calibration_attempts < MAX_CALIBRATION_ATTEMPTS) {
        calibration_attempts++;
        
        start = clock();
        pi_estimate = func(iterations);
        end = clock();
        cpu_time_used = ((double)(end - start)) / CLOCKS_PER_SEC;
       
        printf("Attempt %d: %lld iterations in %.6f seconds\n", 
               calibration_attempts, iterations, cpu_time_used);
       
        // Success condition
        if(cpu_time_used >= 0.8 && cpu_time_used <= 1.2) {
            break;
        }
        
        // Exit if we reach maximum iterations
        if(iterations >= MAX_ITERATIONS) {
            printf("⚠️  Reached maximum iteration limit (%lld)\n", MAX_ITERATIONS);
            break;
        }
        
        // Adjust iterations
        if(cpu_time_used < 0.001) {
            // Extremely fast
            iterations *= 10;
        } else if(cpu_time_used < 0.01) {
            // Very fast
            iterations *= 5;
        } else if(cpu_time_used < 0.5) {
            // Fast
            iterations *= 2;
        } else if(cpu_time_used < 0.8) {
            // Close but still fast
            iterations = (long long)(iterations * (1.0 / cpu_time_used));
        } else if(cpu_time_used > 1.2) {
            // Too slow, reduce
            iterations = (long long)(iterations * 0.8);
        }
        
        // Ensure we don't exceed maximum
        if(iterations > MAX_ITERATIONS) {
            iterations = MAX_ITERATIONS;
        }
    }
   
    // Final measurement with calibrated iteration count
    start = clock();
    pi_estimate = func(iterations);
    end = clock();
    cpu_time_used = ((double)(end - start)) / CLOCKS_PER_SEC;
   
    printf("\n=== FINAL RESULT ===\n");
    printf("Algorithm: %s\n", name);
    printf("Iterations: %lld\n", iterations);
    printf("Actual time: %.6f seconds\n", cpu_time_used);
    printf("Iterations/second: %.0f\n", iterations / cpu_time_used);
    printf("Estimated Pi: %.15Lf\n", pi_estimate);
    printf("Actual Pi:     %.15f\n", M_PI);
    
    long double error = fabsl(M_PI - pi_estimate);
    printf("Absolute error: %.2Le\n", error);
    
    if(error > 0 && error < 1.0) {
        printf("Approximate correct digits: %d\n", (int)(-log10(error)));
    } else if(error == 0) {
        printf("Correct digits: 15+ (maximum precision)\n");
    } else {
        printf("Error too large to calculate correct digits\n");
    }
    printf("========================\n");
}
