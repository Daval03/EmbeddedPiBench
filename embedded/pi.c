#include "pi.h"

//Probability
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

//Inf series
double leibniz(long long terms){return 0.0;}
double euler(long long terms){return 0.0;}
double nilakantha(long long terms){return 0.0;}

//Numerical methods
double gauss_legendre(int iterations){return 0.0;}
double bbp(int iterations){return 0.0;}
