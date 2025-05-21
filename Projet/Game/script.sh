#!/usr/bin/env bash

# Script: add_gitkeep_empty_dirs.sh
# Description: Finds all empty directories in the current Git repository (excluding .git)
#              and adds a .gitkeep file to each, so that Git can track them.

# Exit immediately if a command exits with a non-zero status
set -e

# Base directory (default is current directory)
BASE_DIR="${1:-.}"

# Find empty directories (excluding the .git directory) and add .gitkeep
# Using find to locate directories that have no entries (including hidden)
# -mindepth 1 to skip the base directory itself
# -type d for directories
# -exec sh -c '...' \; to run a shell expression for each

find "$BASE_DIR" -mindepth 1 -type d ! -path '*/.git*' \
    -exec sh -c '
        dir="$1";
        # Check if directory is empty (no files, including hidden)
        if [ -z "$(ls -A "$dir")" ]; then
            touch "$dir/.gitkeep"
            echo "Added .gitkeep to: $dir"
        fi
    ' _ {} \;

# Stage all new .gitkeep files
git add "$(git rev-parse --show-toplevel)"

echo -e "\nAll empty directories have been initialized with .gitkeep and staged."

echo "Now you can commit with:"
echo "  git commit -m 'Add .gitkeep to empty directories'"
echo "  git push"
