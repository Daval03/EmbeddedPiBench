# π Distributed Calculator

A distributed system for computing π using multiple algorithms on Raspberry Pi 4. Features a Flask backend, React frontend, and comprehensive performance comparison.

## 📋 Overview

Calculates π using optimized C algorithms on Raspberry Pi 4, with results stored in SQLite3. The system includes a Flask proxy backend and a React + TypeScript frontend for visualization and comparison.

### Key Features

- Multiple algorithm implementations (probability, infinite series, numerical methods)
- Performance benchmarking and comparison
- Interactive visualization with KaTeX formula rendering
- Distributed architecture with health monitoring

## 🏗️ Architecture

```
┌─────────────────┐      ┌──────────────────┐      ┌─────────────────┐
│   React SPA     │─────▶│  Flask Backend   │─────▶│   C Server      │
│   (Frontend)    │◀─────│    (Proxy)       │◀─────│  (Raspberry Pi) │
└─────────────────┘      └──────────────────┘      └─────────────────┘
                                  │
                                  ▼
                         ┌─────────────────┐
                         │    SQLite3      │
                         │   (Database)    │
                         └─────────────────┘
```

### Components

1. **C Computation Layer** (Raspberry Pi 4)
   - Optimized C implementations of π algorithms
   - High-performance calculations with precision tracking
   - Results stored in SQLite3 database

2. **Flask Backend** (Python)
   - Application Factory pattern for modular configuration
   - RESTful API with versioned endpoints
   - Dual client system: local database and external C server communication
   - Resilient error handling with configurable timeouts

3. **React Frontend** (TypeScript)
   - Single Page Application with React Router
   - Responsive design using Tailwind CSS + React Bootstrap
   - KaTeX integration for mathematical formula rendering
   - Advanced filtering and sorting capabilities

## 🚀 Getting Started

### Prerequisites

- Python 3.8+
- Node.js 16+ and npm
- Raspberry Pi 4 (for C server)
- SQLite3

### Backend Setup

```bash
# Clone the repository
git clone https://github.com/yourusername/pi-distributed-calculator.git
cd pi-distributed-calculator/backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Configure environment variables
cp .env.example .env
# Edit .env with your configuration

# Run the Flask server
python app.py
```

### Frontend Setup

```bash
cd ../frontend

# Install dependencies
npm install

# Configure API endpoint
# Edit src/services/algorithmService.ts with your backend URL

# Start development server
npm start
```

### C Server Setup (Raspberry Pi 4)

```bash
cd ../c-server

# Compile C algorithms
make all

# Run the computation server
./pi_server
```

## 📊 API Endpoints

### Core Endpoints

- `GET /api/v1/health` - Flask server health check
- `GET /api/v1/servers/c/health` - C server health verification
- `GET /api/v1/estimations` - Complete estimations with algorithm metadata
- `GET /api/v1/estimations/basic` - Basic estimation data only
- `GET /api/v1/estimations/top` - Top 4 performing algorithms
- `GET /api/v1/algorithms` - Algorithm implementations and descriptions
- `GET /api/v1/formulas` - Mathematical formulas with LaTeX representations

### Response Format

```json
{
  "status": "success",
  "data": {
    "estimations": [...],
    "metadata": {
      "total": 10,
      "timestamp": "2025-11-16T10:30:00Z"
    }
  }
}
```

## 🎯 Features

### Algorithm Comparison

- **Filtering**: By algorithm type (Probability, Infinite Series, Numerical Methods)
- **Sorting**: Multi-dimensional sorting by speed, precision, efficiency
- **Metrics Tracking**:
  - Execution time (μs/ms/s automatic conversion)
  - Decimal precision and correct digits
  - Absolute and relative error
  - Iterations count

### Formula Visualization

- Interactive formula cards with modal expansion
- LaTeX rendering via KaTeX
- Detailed explanations including:
  - Mathematical formulas
  - Convergence analysis
  - Practical applications
  - Computational complexity

### Performance Optimization

- Memoized filtering and sorting operations
- Reusable HTTP sessions for external communication
- Differentiated timeouts per operation type
- Lazy loading of modal components

## 🛠️ Technical Stack

### Backend
- **Framework**: Flask (Python)
- **Database**: SQLite3
- **HTTP Client**: requests library with session pooling
- **Testing**: pytest (100% coverage)
- **Patterns**: Application Factory, Service Layer, Repository Pattern

### Frontend
- **Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS + React Bootstrap
- **Routing**: React Router v6
- **Math Rendering**: KaTeX
- **Icons**: Lucide React
- **HTTP Client**: Fetch API

### Computation Layer
- **Language**: C (optimized for embedded systems)
- **Platform**: Raspberry Pi 4
- **Database**: SQLite3
- **Architecture**: Object-Oriented Programming in C

## 📈 Development Methodology

This project follows **Agile (Kanban)** methodology with:
- Weekly progress tracking via GitHub Projects
- WIP (Work In Progress) limits
- CI/CD pipeline with GitHub Actions
- Comprehensive documentation in Markdown


## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 👤 Author

**Aldo Cambronero Ureña**
- Email: cambroneroaldo03@gmail.com
- LinkedIn: [aldo-cambronero-ureña](https://linkedin.com/in/aldo-cambronero-ureña-56b525244)
- GitHub: [@Daval03](https://github.com/Daval03)

