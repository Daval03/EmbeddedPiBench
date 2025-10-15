#include "server.h"
int server_init(Server *srv, int port) {
    srv->port = port;
    srv->running = 0;
    
    // Create socket
    srv->socket_fd = socket(AF_INET, SOCK_STREAM, 0);
    if (srv->socket_fd == -1) {
        perror("Error creating socket");
        return -1;
    }
    
    // Allow address reuse
    int opt = 1;
    if (setsockopt(srv->socket_fd, SOL_SOCKET, SO_REUSEADDR, &opt, sizeof(opt)) < 0) {
        perror("Error in setsockopt");
        close(srv->socket_fd);
        return -1;
    }
    
    // Configure server address
    struct sockaddr_in address;
    address.sin_family = AF_INET;
    address.sin_addr.s_addr = inet_addr(IP_ADDRESS);
    address.sin_port = htons(port);
    
    // Bind
    if (bind(srv->socket_fd, (struct sockaddr *)&address, sizeof(address)) < 0) {
        perror("Error in bind");
        close(srv->socket_fd);
        return -1;
    }
    
    // Listen
    if (listen(srv->socket_fd, 10) < 0) {
        perror("Error in listen");
        close(srv->socket_fd);
        return -1;
    }
    
    printf("Server initialized on port %d\n", port);
    return 0;
}

void server_send_json(int client_fd, const char *json_body, int status_code) {
    char response[BUFFER_SIZE];
    const char *status_text = (status_code == 200) ? "OK" : "Error";
    
    snprintf(response, sizeof(response),
        "HTTP/1.1 %d %s\r\n"
        "Content-Type: application/json\r\n"
        "Content-Length: %ld\r\n"
        "Connection: close\r\n"
        "Access-Control-Allow-Origin: *\r\n"
        "\r\n"
        "%s",
        status_code, status_text, strlen(json_body), json_body
    );
    
    send(client_fd, response, strlen(response), 0);
}

void server_handle_algorithm(int client_fd, const char *algorithm) {
    char json_response[1024];
    CalculatePi func = NULL;
    
    // Seleccionar la función del algoritmo
    if (strcmp(algorithm, "monte_carlo") == 0) {
        func = monte_carlo;
    } 
    else if (strcmp(algorithm, "leibniz") == 0) {
        func = leibniz;
    }
    else if (strcmp(algorithm, "nilakantha") == 0) {
        func = nilakantha;
    }
    else if (strcmp(algorithm, "coprimes") == 0) {
        func = pi_coprimes;
    }
    else if (strcmp(algorithm, "buffon") == 0) {
        func = buffon;
    }
    else if (strcmp(algorithm, "euler") == 0) {
        func = euler;
    }
    else if (strcmp(algorithm, "euler_kahan") == 0) {
        func = euler_kahan;
    }
    else if (strcmp(algorithm, "ramanujan") == 0) {
        func = ramanujan_fast;
    }
    else if (strcmp(algorithm, "chudnovsky") == 0) {
        func = chudnovsky_fast;
    }
    else if (strcmp(algorithm, "gauss_legendre") == 0) {
        func = gauss_legendre;
    }
    else if (strcmp(algorithm, "bbp") == 0) {
        func = bbp;
    }
    else if (strcmp(algorithm, "borwein") == 0) {
        func = borwein;

    }
    else {
        // Algoritmo no reconocido
        char json_error[256];
        snprintf(json_error, sizeof(json_error),
            "{\"error\": \"Unknown algorithm\", \"algorithm\": \"%s\"}",
            algorithm
        );
        server_send_json(client_fd, json_error, 400);
        return;
    }
    
    // Ejecutar calibración y cálculo usando la función de pi.c
    //
    PiResult result = optimize_pi_precision(func, algorithm, 1.0);
    
    // Construir respuesta JSON con todos los detalles
    snprintf(json_response, sizeof(json_response),
        "{"
        "\"pi_estimate\": %.19Lf, "
        "\"algorithm\": \"%s\", "
        "\"iterations\": %lld, "
        "\"time_seconds\": %.6f, "
        "\"iterations_per_second\": %.0f, "
        "\"correct_digits\": %d, "
        "\"absolute_error\": %.2Le, "
        "\"actual_pi\": %.19f"
        "}",
        result.pi_estimate,
        algorithm,
        result.iterations,
        result.cpu_time_used,
        result.iterations / result.cpu_time_used,
        result.correct_digits,
        result.error,
        M_PI
    );
    
    server_send_json(client_fd, json_response, 200);
}

void server_handle_client(int client_fd) {
    char buffer[BUFFER_SIZE] = {0};
    
    // Read client request
    int bytes_read = read(client_fd, buffer, BUFFER_SIZE - 1);
    if (bytes_read < 0) {
        perror("Error reading request");
        close(client_fd);
        return;
    }
    
    printf("\n=== New request ===\n%s\n", buffer);
    
    // Parse method and path
    char method[16], path[256];
    sscanf(buffer, "%s %s", method, path);
    
    printf("Method: %s, Path: %s\n", method, path);
    
    // Respond based on route
    if (strcmp(path, "/api/hello") == 0 || strcmp(path, "/") == 0) {
        char json_response[256];
        snprintf(json_response, sizeof(json_response),
            "{\"message\": \"Hello World from C server\", "
            "\"status\": \"success\", "
            "\"timestamp\": %ld}",
            time(NULL)
        );
        server_send_json(client_fd, json_response, 200);
    }
    else if (strncmp(path, "/api/pi/", 8) == 0) {
        // Extraer el nombre del algoritmo de la ruta
        const char *algorithm = path + 8;  // Saltar "/api/pi/"
        server_handle_algorithm(client_fd, algorithm);
    }
    else {
        char json_error[128];
        snprintf(json_error, sizeof(json_error),
            "{\"error\": \"Route not found\", \"path\": \"%s\"}",
            path
        );
        server_send_json(client_fd, json_error, 404);
    }
    
    close(client_fd);
}

void server_start(Server *srv) {
    srv->running = 1;
    printf("Server listening on http://%s:%d\n", IP_ADDRESS, srv->port);
    printf("Press Ctrl+C to stop\n\n");
    
    struct sockaddr_in client_addr;
    socklen_t client_len = sizeof(client_addr);
    
    while (srv->running) {
        int client_fd = accept(srv->socket_fd, 
                              (struct sockaddr *)&client_addr, 
                              &client_len);
        
        if (client_fd < 0) {
            perror("Error accepting connection");
            continue;
        }
        
        printf("Client connected from %s:%d\n",
               inet_ntoa(client_addr.sin_addr),
               ntohs(client_addr.sin_port));
        
        server_handle_client(client_fd);
    }
}

void server_cleanup(Server *srv) {
    if (srv->socket_fd != -1) {
        close(srv->socket_fd);
        printf("\nServer closed successfully\n");
    }
}