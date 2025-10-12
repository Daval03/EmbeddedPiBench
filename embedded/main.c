#include "pi.h"

typedef double (*CalculatePi)(long long);

void printNum(CalculatePi func, const char* name) {
    // Inicializar generador aleatorio UNA VEZ
    srand(time(NULL));
    
    long long iterations = 1000000;
    clock_t start, end;
    double cpu_time_used;
    double pi_estimate;
    
    printf("\n=== Calibrando algoritmo %s ===\n", name);
    
    // Fase de calibración: encontrar cuántas iteraciones caben en ~1 segundo
    while(1) {
        start = clock();
        pi_estimate = func(iterations);
        end = clock();
        cpu_time_used = ((double)(end - start)) / CLOCKS_PER_SEC;
        
        printf("Prueba: %lld iteraciones en %.3f segundos\n", iterations, cpu_time_used);
        
        if(cpu_time_used >= 0.8 && cpu_time_used <= 1.2) {
            // Estamos cerca de 1 segundo
            break;
        } else if(cpu_time_used < 0.5) {
            // Muy rápido, aumentar más agresivamente
            iterations *= 3;
        } else if(cpu_time_used < 0.8) {
            // Cerca pero todavía rápido
            iterations = (long long)(iterations * (1.0 / cpu_time_used));
        } else {
            // Nos pasamos, reducir
            iterations = (long long)(iterations * 0.7);
        }
    }
    
    printf("\n=== RESULTADO FINAL ===\n");
    printf("Algoritmo: %s\n", name);
    printf("Iteraciones en ~1 segundo: %lld\n", iterations);
    printf("Tiempo real: %.3f segundos\n", cpu_time_used);
    printf("Pi estimado: %.15f\n", pi_estimate);
    printf("Error: %.15f\n", fabs(M_PI - pi_estimate));
    printf("Dígitos correctos aproximados: %d\n", 
           (int)(-log10(fabs(M_PI - pi_estimate))));
}

int main() {
    printNum(monte_carlo, "Monte Carlo");
    return 0;
}