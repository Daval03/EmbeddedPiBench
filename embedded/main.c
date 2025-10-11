#include "pi.h"
int main() {
    struct timeval start, current;
    gettimeofday(&start, NULL);
    
    int n = 0;
    long long result;
    double elapsed = 0;
    
    printf("Calculando Fibonacci por 1 segundo...\n");
    
    while (elapsed < 1.0) {
        result = fib(n);
        n++;
        
        gettimeofday(&current, NULL);
        elapsed = (current.tv_sec - start.tv_sec) + 
                 (current.tv_usec - start.tv_usec) / 1000000.0;
    }
    
    printf("En 1 segundo se llegó a fib(%d) = %lld\n", n-1, result);
    return 0;
}