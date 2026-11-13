@echo off
echo ====================================================
echo Starting Restaurant Management Backend (Spring Boot)
echo ====================================================

set "SCRIPT_DIR=%~dp0"
set "MAVEN_BIN=%SCRIPT_DIR%apache-maven-3.9.6\bin\mvn.cmd"

cd /d "%SCRIPT_DIR%backend"

if exist "%MAVEN_BIN%" (
    echo [INFO] Using included Apache Maven 3.9.6...
    call "%MAVEN_BIN%" spring-boot:run
) else (
    where mvn >nul 2>nul
    if %errorlevel% equ 0 (
        echo [INFO] Using system Maven...
        mvn spring-boot:run
    ) else (
        echo [ERROR] Maven not found.
        pause
    )
)
pause
