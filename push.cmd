@echo off
setlocal EnableExtensions
cd /d "%~dp0"
echo.
echo ==============================
echo   MOHA Learning - Git Push
echo ==============================
echo.
where git >nul 2>&1 || (echo ERROR: Git is not installed or not on PATH.& pause & exit /b 1)
git rev-parse --is-inside-work-tree >nul 2>&1 || (echo ERROR: No .git repository here. Read PATCH-INSTALL.md first.& pause & exit /b 1)
git remote get-url origin >nul 2>&1 || (echo ERROR: Git remote origin is missing.& pause & exit /b 1)
echo Remote:
git remote get-url origin
echo.
echo Changes to be staged (including new files):
git status --short
echo.
git status --porcelain | findstr . >nul || (echo Nothing to commit.& pause & exit /b 0)
set /p CONFIRM=Stage ALL listed changes, commit and push to origin? (YES/no): 
if /I not "%CONFIRM%"=="YES" (echo Cancelled. Type YES to proceed.& pause & exit /b 0)
git add -A || (echo Git add failed.& pause & exit /b 1)
set /p MSG=Commit message (Enter for update): 
if "%MSG%"=="" set "MSG=Update MOHA Learning courses"
git commit -m "%MSG%" || (echo Commit failed.& pause & exit /b 1)
echo.
echo Pushing current branch to origin...
git push -u origin HEAD || (echo Push failed. Check login and remote branch.& pause & exit /b 1)
echo.
echo SUCCESS: Changes pushed.
pause
