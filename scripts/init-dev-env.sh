#!/bin/bash

# Script to initialize/reset the development environment

# Remove auth database
if [ -f "auth.db" ]; then
    rm auth.db
    echo "Removed auth.db"
fi

# Remove Flask session cache
if [ -d "/tmp/flask_session" ]; then
    rm -rf /tmp/flask_session/*
    echo "Cleared /tmp/flask_session"
fi

# Remove Flask session cache
if [ -d "/tmp/flask_cache/" ]; then
    rm -rf /tmp/flask_cache/*
    echo "Cleared /tmp/flask_cache/"
fi

# Remove MLflow runs
if [ -d "mlruns" ]; then
    rm -rf mlruns
    echo "Removed mlruns directory"
fi

# Optional: Recreate necessary directories
mkdir -p /tmp/flask_session
mkdir -p /tmp/flask_cache/

echo "Environment initialization complete."