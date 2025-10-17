#include "fib_calculations.h"
unsigned long long fib_recursive(int n){
    if(n <= 1) return n;

    return fib_recursive(n-2) + fib_recursive(n-1);
}
unsigned long long fib_iterative(int n) {
    if (n <= 1) return n;
    
    unsigned long long a = 0, b = 1, c;
    for (int i = 2; i <= n; i++) {
        c = a + b;
        a = b;
        b = c;
    }
    return b;
}
unsigned long long memo[MAX_MEMO];

unsigned long long fib_memo(int n) {
    for (int i = 0; i < MAX_MEMO; i++) memo[i] = 0;

    if (n <= 1) return n;
    if (memo[n] != 0) return memo[n];
    
    memo[n] = fib_memo(n-1) + fib_memo(n-2);
    return memo[n];
}


//Utils
void init_memo() {
    for (int i = 0; i < MAX_MEMO; i++) memo[i] = 0;
}