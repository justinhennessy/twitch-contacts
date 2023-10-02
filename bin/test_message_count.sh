#!/bin/bash

username=$1 && shift

if ! curl -X POST -H "Content-Type: application/json" -d '{"username": "'${username}'"}' http://localhost:3000/message_count; then
    echo "The request failed!"
    exit 1
fi
