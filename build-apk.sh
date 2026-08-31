#!/bin/bash
set -e

echo "======================================================="
echo "         NeedHub Android Release APK Builder           "
echo "======================================================="
echo ""

echo "[1/4] Building latest web production bundle..."
npm run build

echo "[2/4] Syncing web assets to native Android project..."
npx cap sync android

echo "[3/4] Checking Release Keystore..."
if [ ! -f "android/app/needhub-release-key.jks" ]; then
    echo "Generating release keystore (needhub-release-key.jks)..."
    keytool -genkeypair -v -storetype JKS -keystore android/app/needhub-release-key.jks -alias needhub -keyalg RSA -keysize 2048 -validity 10000 -storepass needhub123 -keypass needhub123 -dname "CN=NeedHub, OU=Mobile, O=NeedHub, L=Lahore, S=Punjab, C=PK"
fi

echo "[4/4] Building Release APK via Gradle..."
cd android
chmod +x gradlew
./gradlew assembleRelease
cd ..

echo ""
echo "======================================================="
echo "[SUCCESS] Release APK built successfully!"
echo "Output APK Location: android/app/build/outputs/apk/release/app-release.apk"
echo "======================================================="
