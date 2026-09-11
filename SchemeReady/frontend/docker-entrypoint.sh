#!/bin/sh
set -e

# Default to 10000 (Render default) if PORT is unset
export PORT="${PORT:-10000}"

# Substitute dynamic ${PORT} in Nginx config template
envsubst '$PORT' < /etc/nginx/templates/default.conf.template > /etc/nginx/conf.d/default.conf

exec "$@"
