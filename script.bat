@echo off

if "%~1"=="save" (
  git add .
  git commit -m "bot: auto saving today's the progress."
  git push --all
)


if "%~1"=="restore" (
  git pull
  yarn install
)



:: Cleans the android gradle
::
:: script clean

if "%~1"=="clean" (
  cd "android"
  gradlew clean
  cd "../"
)


:: Builds the release version of android app (.apk file)
::
:: script build [-c] [-i]
::
:: -c cleans the android gradle
:: -i install the apk in connected devices

if "%~1"=="build" (
  cd "android"

  for %%a in (%*) do (
    if "%%a"=="-c" (
      gradlew clean
    )
  )

  :: "Build release apk"
  gradlew assembleRelease
  cd "../"

  copy "android/app/build/outputs/apk/release\app-release.apk" "app-release.apk"
  del "attendence.apk"
  rename "app-release.apk" "attendence.apk"

  for %%a in (%*) do (
    if "%%a"=="-i" (
      adb install "attendence.apk"
    )
  )
)
