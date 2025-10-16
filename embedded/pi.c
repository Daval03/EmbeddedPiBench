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

//Utils
// Count correct digits in pi estimate
int count_correct_digits(long double estimate) {

    if (isnan(estimate) || isinf(estimate))
        return 0;

    long double error = fabsl(estimate - PI_REFERENCE);
    if (error < LDBL_MIN) error = LDBL_MIN;  // evita underflow

    int digits = (int)floorl(-log10l(error));

    if (digits < 0) digits = 0;
    if (digits > MAX_PRECISION_DIGITS) digits = MAX_PRECISION_DIGITS;

    return digits;
}

// Test a pi calculation function with iteration count and time limit
static ExecutionStatus test_execution(CalculatePi func, long long iterations, 
                                      double time_limit, TestResult *test_result) {
    clock_t start = clock();
    long double estimate = func(iterations);
    clock_t end = clock();
    
    test_result->time_used = (long double)(end - start) / CLOCKS_PER_SEC;
    test_result->estimate = estimate;
    test_result->iterations = iterations;
    test_result->digits = count_correct_digits(estimate);
    
    if (isnan(estimate) || isinf(estimate)) {
        return EXEC_INVALID;
    }
    
    if (test_result->time_used > time_limit) {
        return EXEC_TIMEOUT;
    }
    
    return EXEC_VALID;
}

// Update best result with current result
static void update_best_result(TestResult *best, const TestResult *current) {
    best->iterations = current->iterations;
    best->estimate = current->estimate;
    best->time_used = current->time_used;
    best->digits = current->digits;
}

// Check if maximum precision has been reached
static int has_reached_max_precision(int digits) {
    return digits >= MAX_PRECISION_DIGITS;
}

// PHASE IMPLEMENTATIONS

// Phase 1: Test small fixed iteration values
static int phase1_initial_search(CalculatePi func, double time_limit, TestResult *best) {
    long long test_values[] = {1, 2, 3, 4, 5, 10, 20, 50, 100, 200, 500, 1000};
    int num_tests = sizeof(test_values) / sizeof(test_values[0]);
    
    for (int i = 0; i < num_tests; i++) {
        TestResult current;
        ExecutionStatus status = test_execution(func, test_values[i], time_limit, &current);
        
        if (status == EXEC_INVALID || status == EXEC_TIMEOUT) {
            break;
        }
        
        update_best_result(best, &current);
        
        if (has_reached_max_precision(current.digits)) {
            return 1; // Early completion
        }
    }
    
    return 0;
}

// Calculate next iteration count based on time used
static long long calculate_next_iteration(long long current, double time_used, double time_limit) {
    if (time_used < time_limit * 0.1) {
        return current * 5;
    } else if (time_used < time_limit * 0.3) {
        return current * 2;
    } else if (time_used < time_limit * 0.6) {
        return (long long)(current * 1.3);
    }
    return current;
}

// Phase 2: Exponential search for optimal iterations
static int phase2_exponential_search(CalculatePi func, double time_limit, 
                                     long long start_iter, TestResult *best) {
    long long current = start_iter * 2;
    int no_improvement = 0;
    
    while (no_improvement < NO_IMPROVEMENT_THRESHOLD) {
        TestResult current_result;
        ExecutionStatus status = test_execution(func, current, time_limit, &current_result);
        
        if (status == EXEC_INVALID || status == EXEC_TIMEOUT) {
            break;
        }
        
        if (current_result.digits >= best->digits) {
            update_best_result(best, &current_result);
            no_improvement = 0;
            
            if (has_reached_max_precision(current_result.digits)) {
                return 1;
            }
        } else {
            no_improvement++;
        }
        
        long long next = calculate_next_iteration(current, current_result.time_used, time_limit);
        if (next == current || next > MAX_ITERATIONS) {
            break;
        }
        current = next;
    }
    
    return 0;
}

// Phase 3: Fine-tune around best iteration count
static void phase3_fine_refinement(CalculatePi func, double time_limit, TestResult *best) {
    if (best->digits >= MAX_PRECISION_DIGITS - 3 || best->time_used >= time_limit * 0.7) {
        return;
    }
    
    long long increment = best->iterations / 4;
    if (increment < 1) increment = 1;
    
    for (int attempt = 0; attempt < 10; attempt++) {
        long long try_iter = best->iterations + increment;
        
        TestResult current;
        ExecutionStatus status = test_execution(func, try_iter, time_limit, &current);
        
        if (status != EXEC_VALID) {
            increment /= 2;
            if (increment == 0) break;
            continue;
        }
        
        if (current.digits >= best->digits) {
            update_best_result(best, &current);
            
            if (has_reached_max_precision(current.digits)) {
                break;
            }
        } else {
            increment /= 2;
            if (increment == 0) break;
        }
    }
}

// Main optimization function - find best pi precision within time limit
PiResult optimize_pi_precision(CalculatePi func, const char* func_name, double time_limit) {
    
    
    TestResult best = {1, 0.0L, 0.0L, 0};
    
    // Phase 1: Initial search with small values
    int early_complete = phase1_initial_search(func, time_limit, &best);
    
    // Phase 2: Exponential search
    if (!early_complete) {
        early_complete = phase2_exponential_search(func, time_limit, best.iterations, &best);
    }
    
    // Phase 3: Fine refinement
    if (!early_complete) {
        phase3_fine_refinement(func, time_limit, &best);
    }
    
    // Convert to final result
    PiResult result = {
        .pi_estimate = best.estimate,
        .iterations = best.iterations,
        .cpu_time_used = best.time_used,
        .correct_digits = best.digits,
        .error = fabsl(best.estimate - PI_REFERENCE)
    };
    printf("\n Finish !!! \n");
    return result;
}