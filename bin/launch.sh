#!/bin/bash

# List of commands to run in separate panes with custom titles
commands=(
    "echo 'Webserver is starting ...'; python backend.py"
    "echo 'Twitch ChatBOT starting ...'; python bot.py"
)

# Loop through the commands and open each in a new iTerm window
for i in "${!commands[@]}"; do
    cmd="${commands[i]}"
    
    osascript -e "tell application \"iTerm\"
        activate
        set newWindow to (create window with default profile)
        tell newWindow
            tell current session
                write text \"$cmd\"
            end tell
        end tell
    end tell"
done
