@echo off
REM ===============================
REM Start Service-Seeker on port 19000
REM ===============================
start cmd /k "cd Service-seeker\SS\project && npx expo start --port 19000"

REM ===============================
REM Start Service-Shops on port 19001
REM ===============================
start cmd /k "cd \"service-shops\Service Shops\project\" && npx expo start --port 19001"


REM ===============================
REM Start Admin-web (Vite)
REM ===============================
start cmd /k "cd Admin-web\Admin\project && npm run dev"

pause
