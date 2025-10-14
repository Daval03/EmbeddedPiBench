#include "pi.h"
#include "server.h"
#include <stdio.h>
#include <signal.h>

Server server;  // Global server instance

// Handler for Ctrl+C
void signal_handler(int sig) {
    printf("\n\nStopping server...\n");
    server.running = 0;
    server_cleanup(&server);
    exit(0);
}

int main() {
    // Configure signal handler
    signal(SIGINT, signal_handler);
    
    // Initialize server on port 8080
    if (server_init(&server, PORT) < 0) {
        fprintf(stderr, "Error initializing server\n");
        return 1;
    }
    // Start server
    server_start(&server);
    // Cleanup resources
    server_cleanup(&server);   
    return 0;
}

////printCalculation(pi_coprimes, "pi_coprimes");