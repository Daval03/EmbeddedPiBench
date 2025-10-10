#!/bin/bash

# Matar procesos anteriores si existen
pkill -f "python.*server.py"
pkill -f "vite"

# Iniciar backend
cd backend
python server.py &
BACKEND_PID=$!

# Iniciar frontend
cd ../frontend
npm run dev &
FRONTEND_PID=$!

echo "Backend PID: $BACKEND_PID"
echo "Frontend PID: $FRONTEND_PID"
echo "Presiona Ctrl+C para detener ambos servicios"

# Esperar y capturar Ctrl+C
trap "kill $BACKEND_PID $FRONTEND_PID; exit" INT
wait