#!/bin/sh
set -e

PORT="${PORT:-10000}"

# If Render assigns a different port than 10000, adjust nginx configuration
if [ "$PORT" != "10000" ]; then
    sed -i "s/listen 10000/listen $PORT/g" /etc/nginx/conf.d/default.conf 2>/dev/null || true
fi

exec "$@"
