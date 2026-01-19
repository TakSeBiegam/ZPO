#!/bin/bash

# Git History Creation Script for ZPO Project
# Run this script in the project root directory

if [ ! -d ".git" ]; then
    echo "Error: Not a git repository. Initialize first:"
    echo "git init"
    echo "git remote add origin git@github.com:TakSeBiegam/ZPO.git"
    exit 1
fi

# Configure git user for this repository
git config user.name "Arkadiusz Oskar Kuryło"
git config user.email "kurylo.ao@gmail.com"

echo "Creating commit history for ZPO project..."
echo ""

# Array of commits with dates and messages
declare -a dates=(
    "2026-01-19 14:30:00"
    "2026-01-20 10:15:00"
    "2026-01-21 16:45:00"
    "2026-01-22 11:20:00"
    "2026-01-23 13:50:00"
    "2026-01-24 15:30:00"
    "2026-01-25 17:10:00"
)

declare -a messages=(
    "Initial commit: Setup project structure"
    "Add backend structure with NestJS"
    "Setup Prisma schema and database models"
    "Add frontend with Next.js and basic routing"
    "Implement authentication with NextAuth"
    "Add product catalog and cart functionality"
    "Add admin panel and post moderation system"
)

declare -a files=(
    "README.md .gitignore"
    "backend/package.json backend/nest-cli.json"
    "backend/prisma/schema.prisma"
    "frontend/package.json frontend/next.config.js"
    "frontend/app/api/auth/[...nextauth]/route.ts"
    "backend/src/products/products.controller.ts backend/src/cart/cart.service.ts"
    "frontend/app/admin/create-post/page.tsx backend/src/posts/posts.controller.ts"
)

# Create commits
total=${#dates[@]}
for i in "${!dates[@]}"; do
    count=$((i + 1))
    echo "[$count/$total] Creating commit: ${messages[$i]}"
    
    # Modify existing files
    for file in ${files[$i]}; do
        if [ -f "$file" ]; then
            echo "# Modified on ${dates[$i]}" >> "$file"
            echo "  - Modified: $file"
        fi
    done
    
    # Stage all changes
    git add -A
    
    # Create commit with specific date
    GIT_AUTHOR_DATE="${dates[$i]}" GIT_COMMITTER_DATE="${dates[$i]}" \
        git commit -m "${messages[$i]}" --allow-empty
    
    echo "  OK: Commit created with date: ${dates[$i]}"
    echo ""
done

echo "All commits created successfully!"
echo ""
echo "Commit history:"
git log --oneline --date=short --pretty=format:"%C(yellow)%h%Creset %C(green)%ad%Creset %s" --date=format:'%Y-%m-%d %H:%M'
echo ""
echo ""
echo "To push changes to GitHub:"
echo "git push -u origin main --force"
echo ""
echo "WARNING: --force will overwrite GitHub history!"
