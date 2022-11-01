#!/bin/bash
set -e

# Populate the environment variables
cd /app
./import-meta-env -x .env.example.public

cd /app/dist
nginx -g "daemon off;"
