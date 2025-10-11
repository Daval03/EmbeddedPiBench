
# Compilador y flags
CXX ?= g++
CXXFLAGS = -O2 

# Nombre del ejecutable
TARGET = pi
BUILD_DIR = build

# Archivos fuente (lista explícita para mejor control)
SRCS = main.c pi.c

# build all
all: $(BUILD_DIR)/$(TARGET)

$(BUILD_DIR)/$(TARGET): $(SRCS)
	$(CXX) $(CXXFLAGS) -o $@ $(SRCS)

clean:
	rm -f $(BUILD_DIR)/$(TARGET)

run: $(BUILD_DIR)/$(TARGET)
	./$(BUILD_DIR)/$(TARGET)

debug: CXXFLAGS += -g
debug: $(BUILD_DIR)/$(TARGET)

.PHONY: all clean run debug

