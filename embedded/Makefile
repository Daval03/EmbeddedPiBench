
# Compilador y flags
CXX ?= gcc
CXXFLAGS = -O2 

# Nombre del ejecutable
TARGET = pi
BUILD_DIR = build

# Archivos fuente (lista explícita para mejor control)
SRCS = main.c pi/pi_calculations.c pi/pi_optimization.c fib/fib_calculations.c server/server.c

# build all
all: $(BUILD_DIR)/$(TARGET)

$(BUILD_DIR)/$(TARGET): $(SRCS)
	$(CXX) -o $@ $(SRCS) $(CXXFLAGS)

clean:
	rm -f $(BUILD_DIR)/$(TARGET)

run: $(BUILD_DIR)/$(TARGET)
	./$(BUILD_DIR)/$(TARGET)

debug: CXXFLAGS += -g
debug: $(BUILD_DIR)/$(TARGET)

.PHONY: all clean run debug

