// #include "../embedded/pi/pi_optimization.h"
// #include "../embedded/server/server.h"
// #include <stdio.h>
// #include <signal.h>


// Server server;  // Global server instance

// // Handler for Ctrl+C
// void signal_handler(int sig) {
//     printf("\n\nStopping server...\n");
//     server.running = 0;
//     server_cleanup(&server);
//     exit(0);
// }
// int main() {
//     // Configure signal handler
//     signal(SIGINT, signal_handler);
    
//     // Initialize server on port 8080
//     if (server_init(&server, PORT) < 0) {
//         fprintf(stderr, "Error initializing server\n");
//         return 1;
//     }
//     // Start server
//     server_start(&server);
//     // Cleanup resources
//     server_cleanup(&server);   
//     return 0;
// }

#include <stdio.h>
#include <limits.h>
#include "../embedded/fib/fib_calculations.h"

int main() {
    printf("Máximos valores para tipos enteros:\n");
    unsigned long long fib_1 = fib_recursive(20);
    unsigned long long fib_2 = fib_iterative(20);
    unsigned long long fib_3 = fib_memo(20);
    printf("%lld \n%lld \n%lld \n", fib_1, fib_2, fib_3 );
    
    return 0;
}