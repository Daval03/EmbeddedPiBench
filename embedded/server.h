#ifndef SERVER_H
#define SERVER_H

#define PORT 8080
#define BUFFER_SIZE 4096
#define IP_ADDRESS "192.168.18.40" 
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <unistd.h>
#include <sys/socket.h>
#include <netinet/in.h>
#include <arpa/inet.h>
#include <time.h>
#include <math.h>
#include "pi.h"

// Struct for server configuration
typedef struct {
    int socket_fd;
    int port;
    int running;
} Server;

// Algorithm lookup table
typedef struct {
    const char *name;
    CalculatePi func;
} AlgorithmEntry;

static const AlgorithmEntry ALGORITHMS[] = {
    {"monte_carlo", monte_carlo},
    {"leibniz", leibniz},
    {"nilakantha", nilakantha},
    {"coprimes", pi_coprimes},
    {"buffon", buffon},
    {"euler", euler},
    {"euler_kahan", euler_kahan},
    {"ramanujan", ramanujan_fast},
    {"chudnovsky", chudnovsky_fast},
    {"gauss_legendre", gauss_legendre},
    {"bbp", bbp},
    {"borwein", borwein},
    {NULL, NULL}  // Sentinel
};

// Initialize server
int server_init(Server *srv, int port);

// Start server and listen for connections
void server_start(Server *srv);

// Handle client connection
void server_handle_client(int client_fd);

// Handle algorithm calculation request
void server_handle_algorithm(int client_fd, const char *algorithm);

// Send JSON response
void server_send_json(int client_fd, const char *json_body, int status_code);

// Free server resources
void server_cleanup(Server *srv);
#endif // SERVER_H