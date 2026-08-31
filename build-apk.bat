@echo off
echo =======================================================
echo          NeedHub Android Release APK Builder
echo =======================================================
echo.

echo [1/4] Building latest web production bundle...
call npm run build
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Web build failed.
    pause
    exit /b %ERRORLEVEL%
)

echo [2/4] Syncing web assets to native Android project...
call npx cap sync android
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Capacitor sync failed.
    pause
    exit /b %ERRORLEVEL%
)

echo [3/4] Checking Release Keystore...
if not exist "android\app\needhub-release-key.jks" (
    echo Generating release keystore (needhub-release-key.jks)...
    keytool -genkeypair -v -storetype JKS -keystore android\app\needhub-release-key.jks -alias needhub -keyalg RSA -keysize 2048 -validity 10000 -storepass needhub123 -keypass needhub123 -dname "CN=NeedHub, OU=Mobile, O=NeedHub, L=Lahore, S=Punjab, C=PK"
)

echo [4/4] Building Release APK via Gradle...
cd android
call gradlew.bat assembleRelease
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Gradle release build failed. Please ensure JDK 17+ and Android SDK are installed.
    cd ..
    pause
    exit /b %ERRORLEVEL%
)
cd ..

echo.
echo =======================================================
echo [SUCCESS] Release APK built successfully!
echo Output APK Location:
echo android\app\build\outputs\apk\release\app-release.apk
echo =======================================================
echo.
pause
