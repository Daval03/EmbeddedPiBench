# Compilador y flags
CXX ?= gcc
CXXFLAGS = -O2 
TEST_CXXFLAGS = -g -O0

# Nombres
TARGET = pi_server
TEST_RUNNER = test_runner
BUILD_DIR = build

# Archivos fuente
SRCS = src/main.c src/pi/pi_calculations.c src/pi/pi_optimization.c src/server/server.c
# Excluir main.c para tests
SRCS_WITHOUT_MAIN = src/pi/pi_calculations.c src/pi/pi_optimization.c src/server/server.c
TEST_SRCS = test/test_main.c test/test_pi_calculations.c
UNITY_SRC = libs/Unity/src/unity.c

# Build principal
all: $(BUILD_DIR)/$(TARGET)

$(BUILD_DIR)/$(TARGET): $(SRCS)
	$(CXX) -o $@ $(SRCS) $(CXXFLAGS)

# Build pruebas - EXCLUIR src/main.c
$(BUILD_DIR)/$(TEST_RUNNER): $(TEST_SRCS) $(SRCS_WITHOUT_MAIN) $(UNITY_SRC)
	$(CXX) -o $@ $(TEST_SRCS) $(SRCS_WITHOUT_MAIN) $(UNITY_SRC) $(CXXFLAGS)

test: $(BUILD_DIR)/$(TEST_RUNNER)
	./$(BUILD_DIR)/$(TEST_RUNNER)

clean:
	rm -f $(BUILD_DIR)/$(TARGET) $(BUILD_DIR)/$(TEST_RUNNER)

run: $(BUILD_DIR)/$(TARGET)
	./$(BUILD_DIR)/$(TARGET)

.PHONY: all clean run test