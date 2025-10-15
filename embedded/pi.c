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
// Función para contar dígitos correctos
int count_correct_digits(long double estimate) {
    const long double PI_REFERENCE = 3.141592653589793238462643383279502884197L;
    const int MAX_DIGITS = 18; // fuerza límite realista
    if (isnan(estimate) || isinf(estimate)) return 0;

    long double error = fabsl(estimate - PI_REFERENCE);
    if (error < 1e-18L) error = 1e-18L; // evita 0.0 o valores ínfimos

    int digits = (int)floorl(-log10l(error) + 1e-12L);
    if (digits < 0) digits = 0;
    if (digits > MAX_DIGITS) digits = MAX_DIGITS;
    return digits;
}


// Probar una ejecución y verificar si es válida
int test_execution(CalculatePi func, long long iterations, double time_limit,
                   long double *result, double *time_used, int *digits) {
    clock_t start = clock();
    long double estimate = func(iterations);
    clock_t end = clock();
    
    *time_used = (double)(end - start) / CLOCKS_PER_SEC;
    *result = estimate;
    *digits = count_correct_digits(estimate);
    
    // Verificar validez
    if (isnan(estimate) || isinf(estimate)) {
        return 0; // Inválido
    }
    
    if (*time_used > time_limit) {
        return -1; // Tiempo excedido
    }
    
    return 1; // Válido
}

// Función principal optimizada sin goto
PiResult optimize_pi_precision(CalculatePi func, const char* func_name, double time_limit) {
    const long double PI_REFERENCE = 3.141592653589793238462643383279502884197L;
    
    PiResult result = {0.0L, 0, 0.0, 0, 0.0L};
    
    long long best_iterations = 1;
    long double best_estimate = 0.0L;
    double best_time = 0.0;
    int best_digits = 0;
    
    printf("Optimizando %s con límite de tiempo: %.2fs\n", func_name, time_limit);
    printf("─────────────────────────────────────────────────────\n");
    
    // FASE 1: Encontrar rango seguro con valores pequeños
    printf("Fase 1: Búsqueda inicial\n");
    
    long long test_values[] = {1, 2, 3, 4, 5, 10, 20, 50, 100, 200, 500, 1000};
    int num_tests = 12;
    long long last_valid = 1;
    
    for (int i = 0; i < num_tests; i++) {
        long double estimate;
        double time_used;
        int digits;
        
        int status = test_execution(func, test_values[i], time_limit, 
                                   &estimate, &time_used, &digits);
        
        if (status == 0) {
            printf("  ⚠ NaN en %lld iter - límite numérico alcanzado\n", test_values[i]);
            break;
        }
        
        if (status == -1) {
            printf("  ⏱ Tiempo excedido en %lld iter\n", test_values[i]);
            break;
        }
        
        // Actualizar mejor resultado
        best_iterations = test_values[i];
        best_estimate = estimate;
        best_time = time_used;
        best_digits = digits;
        last_valid = test_values[i];
        
        printf("  ✓ %4lld iter: %d dígitos (%.6fs)\n", 
               test_values[i], digits, time_used);
        
        // Si ya tenemos máxima precisión, terminar
        if (digits >= 15) {
            printf("  ⭐ Máxima precisión alcanzada\n");
            result.pi_estimate = best_estimate;
            result.iterations = best_iterations;
            result.cpu_time_used = best_time;
            result.error = fabsl(best_estimate - PI_REFERENCE);
            result.correct_digits = best_digits;
            return result;
        }
    }
    
    // FASE 2: Búsqueda exponencial desde último valor válido
    printf("\nFase 2: Búsqueda exponencial (desde %lld iter)\n", last_valid);
    
    long long current = last_valid * 2;
    int no_improvement = 0;
    
    while (no_improvement < 3) {
        long double estimate;
        double time_used;
        int digits;
        
        int status = test_execution(func, current, time_limit, 
                                   &estimate, &time_used, &digits);
        
        if (status == 0) {
            printf("  ⚠ NaN detectado - deteniendo\n");
            break;
        }
        
        if (status == -1) {
            printf("  ⏱ Tiempo límite alcanzado\n");
            break;
        }
        
        // Verificar si hay mejora
        if (digits >= best_digits && time_used <= time_limit) {
            best_iterations = current;
            best_estimate = estimate;
            best_time = time_used;
            best_digits = digits;
            no_improvement = 0;
            
            printf("  ✓ %7lld iter: %d dígitos (%.6fs)\n", 
                   current, digits, time_used);
            
            if (digits >= 15) {
                printf("  ⭐ Máxima precisión alcanzada\n");
                break;
            }
        } else {
            no_improvement++;
        }
        
        // Ajustar siguiente iteración según tiempo usado
        if (time_used < time_limit * 0.1) {
            current *= 5;
        } else if (time_used < time_limit * 0.3) {
            current *= 2;
        } else if (time_used < time_limit * 0.6) {
            current = (long long)(current * 1.3);
        } else {
            // Muy cerca del límite
            break;
        }
        
        // Prevenir valores absurdos
        if (current > 100000000LL) {
            current = best_iterations * 2;
            if (current > 100000000LL) break;
        }
    }
    
    // FASE 3: Refinamiento fino
    if (best_digits < 15 && best_time < time_limit * 0.7) {
        printf("\nFase 3: Refinamiento fino\n");
        
        long long increment = best_iterations / 4;
        if (increment < 1) increment = 1;
        
        for (int attempt = 0; attempt < 10; attempt++) {
            long long try_iter = best_iterations + increment;
            
            long double estimate;
            double time_used;
            int digits;
            
            int status = test_execution(func, try_iter, time_limit, 
                                       &estimate, &time_used, &digits);
            
            if (status != 1) {
                // Si falla, reducir incremento
                increment /= 2;
                if (increment == 0) break;
                continue;
            }
            
            if (digits >= best_digits) {
                best_iterations = try_iter;
                best_estimate = estimate;
                best_time = time_used;
                best_digits = digits;
                
                printf("  ✓ %7lld iter: %d dígitos (%.6fs)\n", 
                       try_iter, digits, time_used);
                
                if (digits >= 15) {
                    printf("  ⭐ Máxima precisión alcanzada\n");
                    break;
                }
                
                // Continuar con mismo incremento si funciona
            } else {
                // Reducir incremento si no mejora
                increment /= 2;
                if (increment == 0) break;
            }
        }
    }
    
    // Preparar resultado final
    result.pi_estimate = best_estimate;
    result.iterations = best_iterations;
    result.cpu_time_used = best_time;
    result.error = fabsl(best_estimate - PI_REFERENCE);
    result.correct_digits = best_digits;
    
    printf("\n╔═══════════════════════════════════════════════════╗\n");
    printf("║              RESULTADO FINAL                      ║\n");
    printf("╠═══════════════════════════════════════════════════╣\n");
    printf("║ Algoritmo:    %-32s║\n", func_name);
    printf("║ Iteraciones:  %-32lld║\n", result.iterations);
    printf("║ Tiempo:       %.6f seg                      ║\n", result.cpu_time_used);
    printf("║ Pi estimado:  %.15Lf        ║\n", result.pi_estimate);
    printf("║ Error:        %.2Le                          ║\n", result.error);
    printf("║ Dígitos OK:   %-32d║\n", result.correct_digits);
    printf("╚═══════════════════════════════════════════════════╝\n\n");
    
    return result;
}

// Función para probar un algoritmo individual
void test_algorithm(CalculatePi func, const char* name) {
    optimize_pi_precision(func, name, 1.0);
}

// Comparar todos los algoritmos
void compare_algorithms() {
    printf("\n");
    printf("╔══════════════════════════════════════════════════════════════════╗\n");
    printf("║       COMPARACIÓN DE ALGORITMOS π - LÍMITE 1 SEGUNDO            ║\n");
    printf("╚══════════════════════════════════════════════════════════════════╝\n\n");
    
    typedef struct {
        const char* name;
        CalculatePi func;
    } AlgorithmInfo;
    
    AlgorithmInfo algorithms[] = {
        {"Gauss-Legendre", gauss_legendre},
        {"BBP", bbp},
        {"Chudnovsky", chudnovsky_fast},
        {"Ramanujan", ramanujan_fast},
        {"Borwein", borwein},
        {"Nilakantha", nilakantha},
        {"Leibniz", leibniz},
        {"Euler-Kahan", euler_kahan},
        {"Monte Carlo", monte_carlo},
        {"Buffon", buffon}
    };
    
    int num_algorithms = 10;
    PiResult results[10];
    
    // Ejecutar todos los algoritmos
    for (int i = 0; i < num_algorithms; i++) {
        results[i] = optimize_pi_precision(algorithms[i].func, algorithms[i].name, 1.0);
    }
    
    // Tabla resumen
    printf("\n╔══════════════════╦═══════════╦══════════╦══════════╦═══════════╗\n");
    printf("║ Algoritmo        ║ Iterac.   ║ Tiempo   ║ Dígitos  ║ Error     ║\n");
    printf("╠══════════════════╬═══════════╬══════════╬══════════╬═══════════╣\n");
    
    for (int i = 0; i < num_algorithms; i++) {
        printf("║ %-16s ║ %9lld ║ %8.5fs ║    %2d    ║ %.2Le ║\n",
               algorithms[i].name,
               results[i].iterations,
               results[i].cpu_time_used,
               results[i].correct_digits,
               results[i].error);
    }
    
    printf("╚══════════════════╩═══════════╩══════════╩══════════╩═══════════╝\n");
    
    // Encontrar el mejor
    int best_idx = 0;
    for (int i = 1; i < num_algorithms; i++) {
        if (results[i].correct_digits > results[best_idx].correct_digits) {
            best_idx = i;
        }
    }
    
    printf("\n🏆 Mejor algoritmo: %s con %d dígitos correctos\n", 
           algorithms[best_idx].name, results[best_idx].correct_digits);
}