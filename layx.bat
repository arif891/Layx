@ECHO OFF

SET "CURRENT_DIR=%CD%\"
SET "SCRIPT_DIR=%~dp0"
SET "CONFIG_DIR=config\"
SET "IMAGES_DIR=assets\images\"
SET "NODE_EXE=%CURRENT_DIR%%CONFIG_DIR%node.exe"
SET "WEBP_EXE=%CURRENT_DIR%%CONFIG_DIR%webp.exe"
SET "PROGRAM_DIR=C:\Program Files\layx\"
SET "FR_CURRENT_DIR=%CURRENT_DIR:\=/%"

IF "%SCRIPT_DIR%"=="%PROGRAM_DIR%" (
    SET "USE_DIR=%SCRIPT_DIR%"
    ) ELSE (
    SET "USE_DIR=%CURRENT_DIR%"
)

ECHO Layx version 0.1 alpha

IF NOT EXIST "%NODE_EXE%" (
    ECHO Local folder Node.js not found.

    IF EXIST "%PROGRAM_DIR%%CONFIG_DIR%node.exe" (
        SET "NODE_EXE=%PROGRAM_DIR%%CONFIG_DIR%node.exe"
        SET "WEBP_EXE=%PROGRAM_DIR%%CONFIG_DIR%webp.exe"
        ECHO Using program Node.js .
    ) ELSE ( 
    ECHO Program Node.js also not found.   
    node -v >nul 2>&1
    IF ERRORLEVEL 1 (
        ECHO Node.js is not installed.
    ) ELSE (
        ECHO Node.js found globally.
        SET "NODE_EXE=node"
    )
    )
)

IF NOT "%~1"=="" (
    FOR %%A IN (%*) DO (
        IF /I "%%A"=="build" (
            GOTO build 
        ) ELSE IF /I "%%A"=="unbuild" (
            GOTO unbuild 
        ) ELSE IF /I "%%A"=="create" (
            GOTO create
        ) ELSE IF /I "%%A"=="optimage" (
            GOTO optimizeImages
        ) ELSE IF /I "%%A"=="noconfig" (
            GOTO noconfig
        ) ELSE IF /I "%%A"=="install" (
            GOTO install
        ) ELSE IF /I "%%A"=="uninstall" (
            GOTO uninstall
        ) ELSE (
            ECHO Available options are "build", "unbuild", "create","optimage", "noconfig", "install" and "uninstall".
            IF NOT "%CURRENT_DIR%"=="%PROGRAM_DIR%" (
               ECHO Forwading cmd to config.mjs
               "%NODE_EXE%" "%USE_DIR%%CONFIG_DIR%config.mjs"  %*
            ) ELSE (
               ECHO Can not perform this action here "%FR_CURRENT_DIR%"
            )
        )
    )
    GOTO end
) ELSE (
    GOTO option
)

GOTO end

:build
ECHO Building...
ECHO Using Node: "%NODE_EXE%"
"%NODE_EXE%" -v
IF ERRORLEVEL 1 (
    ECHO Failed to execute Node.js. Please check the path and installation.
    GOTO end
)

IF NOT "%CURRENT_DIR%"=="%PROGRAM_DIR%" (
  "%NODE_EXE%" "%USE_DIR%%CONFIG_DIR%config.mjs" "build"
) ELSE (
    ECHO Can not perform this action here "%FR_CURRENT_DIR%"
)

GOTO end

:unbuild
ECHO Unbuilding...
ECHO Using Node: "%NODE_EXE%"
"%NODE_EXE%" -v
IF ERRORLEVEL 1 (
    ECHO Failed to execute Node.js. Please check the path and installation.
    GOTO end
)

IF NOT "%CURRENT_DIR%"=="%PROGRAM_DIR%" (
  "%NODE_EXE%" "%USE_DIR%%CONFIG_DIR%config.mjs" "unbuild"
) ELSE (
    ECHO Can not perform this action here "%FR_CURRENT_DIR%"
)

GOTO end

:create
IF EXIST "%PROGRAM_DIR%"  (
 Xcopy "%PROGRAM_DIR%" "%CURRENT_DIR%" /Y /E /S /V /I 
) ELSE (
 ECHO Please first install layx
)

ECHO Layx project created in current directory.

GOTO end

:noconfig
IF NOT "%CURRENT_DIR%"=="%PROGRAM_DIR%" (
    IF EXIST "%PROGRAM_DIR%" (
    ECHO Removing Config Files.
    rmdir "%CURRENT_DIR%%CONFIG_DIR%" /S /Q
    DEL "%CURRENT_DIR%layx.bat" /S /Q
    ECHO Removed Config Files.
    ) ELSE (
      ECHO Please first install layx
    )
) ELSE (
    ECHO Can not perform this action here "%FR_CURRENT_DIR%"
)

GOTO end

:optimizeImages

for /r "%CURRENT_DIR%%IMAGES_DIR%" %%d in (*.png *.jpg) do (
    echo %%d | findstr /v /i "orginal_images_dir" > nul && (
        SET "IMAGE_DIR=%%~dpd"
        SET "IMAGE_NAME=%%~nd"
        
        ECHO Processing %%~nxd

        "%WEBP_EXE%" "%%d" -o "%%~dpd%%~nd.webp" -q 90 -af  -progress -short

        IF NOT EXIST "%%~dpdorginal_images_dir\" (
            mkdir "%%~dpdorginal_images_dir\"
        )
        move "%%d" "%%~dpdorginal_images_dir\"

        ECHO Processed: %%~nxd at %%~dpd
    )
)

GOTO end


:install
net session >nul 2>&1
IF ERRORLEVEL 1 (
    ECHO Requesting Administrator privileges...
    powershell start-process -verb runas -filepath "%~0 install"
    EXIT /B
)

IF EXIST "%PROGRAM_DIR%" (

    IF "%CURRENT_DIR%"=="%PROGRAM_DIR%" (
        ECHO Program already installated.
        GOTO pause
    )

    SET /P choice="Program directory already exists, would you like to update or replace? ('Y' or 'N'): "
    IF /I "%choice%"=="y" (
        ECHO Continuing...
    ) ELSE IF /I "%choice%"=="n" (
        GOTO end
    ) ELSE (
        ECHO Please choose a valid option.
        GOTO install
    )
)

ECHO Installing...
ECHO Copying Files.
Xcopy "%SCRIPT_DIR%" "%PROGRAM_DIR%" /Y /E /S /V /I 
Xcopy "%SCRIPT_DIR%%CONFIG_DIR%syntax\layx.code-snippets" "C:\Users\%username%\AppData\Roaming\Code\User\snippets\" /Y /E /S /V /I 

ECHO %PATH% | FIND /I "%PROGRAM_DIR%" >nul
IF ERRORLEVEL 1 (
    ECHO Adding "%PROGRAM_DIR%" to PATH
    setx PATH "%PATH%;%PROGRAM_DIR%"
) ELSE (
    ECHO "%PROGRAM_DIR%" is already in the PATH
)

ECHO Installation completed.

GOTO pause

:uninstall
net session >nul 2>&1
IF ERRORLEVEL 1 (
    ECHO Requesting Administrator privileges...
    powershell start-process -verb runas -filepath "%~0 uninstall"
    EXIT /B
)

ECHO Uninstalling...

IF EXIST "%PROGRAM_DIR%" (
    rmdir "%PROGRAM_DIR%" /S /Q
) ELSE (
    ECHO "%PROGRAM_DIR%" not found.
)

ECHO Uninstallation completed.

GOTO end

:option
ECHO Please choose an option:
ECHO 1. Build
ECHO 2. Unbuild
ECHO 3. Create
ECHO 4. Remove Config
ECHO 5. Optimize Images
ECHO 6. Install
ECHO 7. Uninstall
ECHO 8. Exit

SET /P choice="Enter your choice (1-8): "

IF "%choice%"=="1" (
    GOTO build 
) ELSE IF "%choice%"=="2" (
    GOTO unbuild 
) ELSE IF "%choice%"=="3" (
    GOTO create
) ELSE IF "%choice%"=="4" (
    GOTO noconfig  
) ELSE IF "%choice%"=="5" (
    GOTO optimizeImages 
) ELSE IF "%choice%"=="6" (
    GOTO install
) ELSE IF "%choice%"=="7" (
    GOTO uninstall
) ELSE IF "%choice%"=="8" (
    GOTO end
) ELSE (
    ECHO Please choose a valid option.
    GOTO option
)

:pause
PAUSE

:end
ECHO Script completed.