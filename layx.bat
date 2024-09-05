@ECHO OFF
SETLOCAL EnableDelayedExpansion

:: Layx version 0.1 alpha
ECHO Layx version 0.1 alpha

:: Set directory variables
CALL :SetDirectories

:: Check for command-line arguments
IF NOT "%~1"=="" (
    CALL :ProcessArguments %*
) ELSE (
    CALL :ShowMenu
)

GOTO :EOF

:SetDirectories
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
GOTO :EOF

:ProcessArguments
FOR %%A IN (%*) DO (
    IF /I "%%A"=="build" ( CALL :Build
    ) ELSE IF /I "%%A"=="unbuild" ( CALL :Unbuild
    ) ELSE IF /I "%%A"=="create" ( CALL :Create
    ) ELSE IF /I "%%A"=="optimage" ( CALL :OptimizeImages
    ) ELSE IF /I "%%A"=="noconfig" ( CALL :NoConfig
    ) ELSE IF /I "%%A"=="install" ( CALL :Install
    ) ELSE IF /I "%%A"=="uninstall" ( CALL :Uninstall
    ) ELSE (
        ECHO Available options are "build", "unbuild", "create", "optimage", "noconfig", "install" and "uninstall".
        IF NOT "%CURRENT_DIR%"=="%PROGRAM_DIR%" (
            ECHO Forwarding cmd to config.js
            CALL :ExecuteNode "%USE_DIR%%CONFIG_DIR%config.js" %*
        ) ELSE (
            ECHO Cannot perform this action here "%FR_CURRENT_DIR%"
        )
    )
)
GOTO :EOF

:ShowMenu
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

IF "%choice%"=="1" ( CALL :Build
) ELSE IF "%choice%"=="2" ( CALL :Unbuild
) ELSE IF "%choice%"=="3" ( CALL :Create
) ELSE IF "%choice%"=="4" ( CALL :NoConfig
) ELSE IF "%choice%"=="5" ( CALL :OptimizeImages
) ELSE IF "%choice%"=="6" ( CALL :Install
) ELSE IF "%choice%"=="7" ( CALL :Uninstall
) ELSE IF "%choice%"=="8" ( GOTO :EOF
) ELSE (
    ECHO Please choose a valid option.
    GOTO :ShowMenu
)
GOTO :EOF

:Build
ECHO Building...
CALL :CheckNode
IF NOT "%CURRENT_DIR%"=="%PROGRAM_DIR%" (
    CALL :ExecuteNode "%USE_DIR%%CONFIG_DIR%config.js" "build"
) ELSE (
    ECHO Cannot perform this action here "%FR_CURRENT_DIR%"
)
GOTO :EOF

:Unbuild
ECHO Unbuilding...
CALL :CheckNode
IF NOT "%CURRENT_DIR%"=="%PROGRAM_DIR%" (
    CALL :ExecuteNode "%USE_DIR%%CONFIG_DIR%config.js" "unbuild"
) ELSE (
    ECHO Cannot perform this action here "%FR_CURRENT_DIR%"
)
GOTO :EOF

:Create
IF EXIST "%PROGRAM_DIR%" (
    Xcopy "%PROGRAM_DIR%" "%CURRENT_DIR%" /Y /E /S /V /I 
    ECHO Layx project created in current directory.
) ELSE (
    ECHO Please install layx first.
)
GOTO :EOF

:NoConfig
IF NOT "%CURRENT_DIR%"=="%PROGRAM_DIR%" (
    IF EXIST "%PROGRAM_DIR%" (
        ECHO Removing Config Files.
        rmdir "%CURRENT_DIR%%CONFIG_DIR%" /S /Q
        DEL "%CURRENT_DIR%/layx.bat" /S /Q
        ECHO Removed Config Files.
    ) ELSE (
        ECHO Please install layx first.
    )
) ELSE (
    ECHO Cannot perform this action here "%FR_CURRENT_DIR%"
)
GOTO :EOF

:OptimizeImages
FOR /R "%CURRENT_DIR%%IMAGES_DIR%" %%D IN (*.png *.jpg) DO (
    ECHO %%D | FINDSTR /V /I "orginal_images_dir" >NUL && (
        CALL :ProcessImage "%%D"
    )
)
GOTO :EOF

:ProcessImage
SET "IMAGE_PATH=%~1"
SET "IMAGE_DIR=%~dp1"
SET "IMAGE_NAME=%~n1"
SET "IMAGE_EXT=%~x1"

ECHO Processing %IMAGE_NAME%%IMAGE_EXT%

"%WEBP_EXE%" "%IMAGE_PATH%" -o "%IMAGE_DIR%%IMAGE_NAME%.webp" -q 90 -af -progress -short

IF NOT EXIST "%IMAGE_DIR%orginal_images_dir\" (
    MKDIR "%IMAGE_DIR%orginal_images_dir\"
)
MOVE "%IMAGE_PATH%" "%IMAGE_DIR%orginal_images_dir\"

ECHO Processed: %IMAGE_NAME%%IMAGE_EXT% at %IMAGE_DIR%
GOTO :EOF

:Install
NET SESSION >NUL 2>&1
IF %ERRORLEVEL% NEQ 0 (
    ECHO Requesting Administrator privileges...
    PowerShell -Command "Start-Process -Verb RunAs -FilePath '%0' -ArgumentList 'install'"
    EXIT /B
)

IF EXIST "%PROGRAM_DIR%" (
    IF "%CURRENT_DIR%"=="%PROGRAM_DIR%" (
        ECHO Program already installed.
        GOTO :EOF
    )

    SET /P choice="Program directory already exists, would you like to update or replace? (Y/N): "
    IF /I NOT "%choice%"=="Y" GOTO :EOF
)

ECHO Installing...
CALL :CopyFiles
CALL :UpdatePath
ECHO Installation completed.
ECHO Please add "C:/Preferences/" to your VS code Emmet extensions Path for layx syntax.
PAUSE
GOTO :EOF

:Uninstall
NET SESSION >NUL 2>&1
IF %ERRORLEVEL% NEQ 0 (
    ECHO Requesting Administrator privileges...
    PowerShell -Command "Start-Process -Verb RunAs -FilePath '%0' -ArgumentList 'uninstall'"
    EXIT /B
)

ECHO Uninstalling...
IF EXIST "%PROGRAM_DIR%" (
    RMDIR "%PROGRAM_DIR%" /S /Q
) ELSE (
    ECHO "%PROGRAM_DIR%" not found.
)
ECHO Uninstallation completed.
GOTO :EOF

:CopyFiles
ECHO Copying Files.
Xcopy "%SCRIPT_DIR%" "%PROGRAM_DIR%" /Y /E /S /V /I 
Xcopy "%SCRIPT_DIR%%CONFIG_DIR%preference\" "C:\Preferences\" /Y /E /S /V /I 
GOTO :EOF

:UpdatePath
ECHO %PATH% | FIND /I "%PROGRAM_DIR%" >NUL
IF %ERRORLEVEL% NEQ 0 (
    ECHO Adding "%PROGRAM_DIR%" to PATH
    SETX PATH "%PATH%;%PROGRAM_DIR%"
) ELSE (
    ECHO "%PROGRAM_DIR%" is already in the PATH
)
GOTO :EOF

:CheckNode
IF NOT EXIST "%NODE_EXE%" (
    ECHO Local folder Node.js not found.
    IF EXIST "%PROGRAM_DIR%%CONFIG_DIR%node.exe" (
        SET "NODE_EXE=%PROGRAM_DIR%%CONFIG_DIR%node.exe"
        SET "WEBP_EXE=%PROGRAM_DIR%%CONFIG_DIR%webp.exe"
        ECHO Using program Node.js.
    ) ELSE ( 
        ECHO Program Node.js also not found.   
        node -v >NUL 2>&1
        IF %ERRORLEVEL% NEQ 0 (
            ECHO Node.js is not installed.
            EXIT /B 1
        ) ELSE (
            ECHO Node.js found globally.
            SET "NODE_EXE=node"
        )
    )
)
GOTO :EOF

:ExecuteNode
ECHO Using Node: "%NODE_EXE%"
"%NODE_EXE%" -v
IF %ERRORLEVEL% NEQ 0 (
    ECHO Failed to execute Node.js. Please check the path and installation.
    EXIT /B 1
)
"%NODE_EXE%" %*
GOTO :EOF