#ifndef FIB_CALCULATIONS_H
#define FIB_CALCULATIONS_H

#include "../constants.h"

//O(2ⁿ)
unsigned long long fib_recursive(int n);
//O(n)
unsigned long long fib_iterative(int n);
unsigned long long fib_memo(int n);



//Util
void init_memo();



#endif