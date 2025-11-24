// test_server.h
#ifndef TEST_SERVER_H
#define TEST_SERVER_H

#include "test_server.h"
#include "../libs/Unity/src/unity.h"
#include "../src/server/server.h"
#include "../src/pi/pi_calculations.h"
#include <string.h>
#include <unistd.h>
#include <sys/socket.h>
#include <netinet/in.h>
#include <arpa/inet.h>

// Mock socket file descriptor for testing
#define MOCK_SOCKET_FD 100
#define TEST_PORT 9999

void run_server_tests(void);

#endif
