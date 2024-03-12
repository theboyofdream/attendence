@echo off

if "%~1"=="save" (
  set date = date /t
  set time = time /t
  git add .
  git commit -m "bot: saving progress. date-%date%, time-%time%"
)


if "%~1"=="pull" (
  git pull --all
  yarn install
)

if "%~1"=="push" (
  set date = date /t
  set time = time /t
  git add .
  git commit -m "bot: saving progress. date-%date%, time-%time%"
  git push --all
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
