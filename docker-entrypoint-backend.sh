#!/bin/sh
set -e

# Dynamically bind ASP.NET Core listener to Render's injected $PORT
export PORT="${PORT:-10000}"
export ASPNETCORE_URLS="http://+:${PORT}"

exec "$@"
