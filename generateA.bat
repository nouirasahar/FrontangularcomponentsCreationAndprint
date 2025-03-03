@echo off
echo ===== Setting up Angular Frontend =====

:: Enable delayed variable expansion for dynamic variables inside loops
setlocal enabledelayedexpansion

:: Define the Angular project folder
set projectDir=%~dp0angular-project
set projectName=angular-project

:: Fetch the JSON response from the API and save it to a temporary file
set apiUrl=http://localhost:3000/api/tablenames
set jsonFile=%temp%\tablenames.json

curl -s %apiUrl% > "%jsonFile%"
if errorlevel 1 (
    echo Failed to retrieve data from the API!
    exit /b
)

:: Initialize the items list
set items=

:: Parse the JSON to extract table names (assuming the response is an array)
for /f "delims=" %%i in ('findstr /r /c:"\".*\"" "%jsonFile%"') do (
    set name=%%i
    set name=!name:"=!
    :: Remove square brackets from the table name
    set name=!name:[=!
    set name=!name:]=!
    set items=!items! !name!
)

:: Check if the list is empty
if "%items%"=="" (
    echo Failed to parse table names from the API!
    del "%jsonFile%"
    exit /b
)

:: Remove the temporary JSON file
del "%jsonFile%"

:: Create the Angular project if it doesn't exist
if not exist "%projectDir%" (
    echo Creating Angular project...
    ng new %projectName% --routing --style=scss --skip-install --defaults
    if errorlevel 1 (
        echo Failed to create Angular project!
        exit /b
    )
    echo Angular project "%projectName%" created successfully.
    cd "%projectDir%"

    :: Generate components based on the list
    echo ===== Generating components based on the list =====
    for %%i in (%items%) do (
        echo Generating component %%i
        ng g c %%i --standalone
        if errorlevel 1 (
            echo Failed to generate component %%i
            exit /b
        )
    )

    :: Create the shared service for all components
    echo ===== Creating shared service for components =====
    ng g s services/shared
    if errorlevel 1 (
        echo Failed to generate the shared service!
        exit /b
    )

    :: Install dependencies after generation
    echo ===== Installing dependencies... This may take some time... =====
    npm install
    if errorlevel 1 (
        echo Failed to install dependencies!
        exit /b
    )

) else (
    echo Angular project already exists!
    cd "%projectDir%"

    :: Generate components based on the list
    echo ===== Generating components based on the list =====
    for %%i in (%items%) do (
        echo Generating component %%i
        ng g c %%i --standalone
        if errorlevel 1 (
            echo Failed to generate component %%i
            exit /b
        )
    )

    :: Ensure the shared service exists
    if not exist "%projectDir%\src\app\services\shared.service.ts" (
        echo ===== Creating shared service for components =====
        ng g s services/shared
        if errorlevel 1 (
            echo Failed to generate the shared service!
            exit /b
        )
    )
)

echo ===== All components and shared service generated successfully! =====
endlocal
