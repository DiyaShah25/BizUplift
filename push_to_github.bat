@echo off
echo Adding changes to Git...
git add .

echo Committing changes...
git commit -m "Refactored backend for Vercel deployment"

echo Pushing to GitHub...
git push

echo.
echo Push complete! Press any key to exit.
pause > nul
