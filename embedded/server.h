#ifndef SERVER_H
#define SERVER_H

#define PORT 8080
#define BUFFER_SIZE 4096
#define IP_ADDRESS "192.168.18.40" 

// Struct for server configuration
typedef struct {
    int socket_fd;
    int port;
    int running;
} Server;

// Initialize server
int server_init(Server *srv, int port);

// Start server and listen for connections
void server_start(Server *srv);

// Handle client connection
void server_handle_client(int client_fd);

// Send JSON response
void server_send_json(int client_fd, const char *json_body, int status_code);

// Free server resources
void server_cleanup(Server *srv);

#endif // SERVER_H