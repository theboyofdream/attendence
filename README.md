yarn add react-native-vector-icons
edit => android/app/build.gradle
dev:  yarn add @types/react-native-vector-icons

yarn add --dev babel-plugin-module-resolver
edit => babel.config.js & tsconfig.json

yarn add @react-navigation/native
yarn add react-native-screens 
yarn add react-native-safe-area-context
yarn add @react-navigation/native-stack

yarn add react-native-mmkv-storage

yarn add zustand

yarn add react-native-vision-camera
yarn add @react-native-community/hooks --using for--> useAppState()

yarn add @react-native-community/geolocation
yarn add react-native-android-location-enabler

yarn add eslint-plugin-react-hooks --dev

yarn add react-native-apk-install
yarn add react-native-fs

### ERRORS
https://stackoverflow.com/questions/24494077/gradle-force-build-tools-version-on-third-party-libraries/25736483#25736483

### CREDITS

<a href="https://www.freepik.com/free-vector/access-control-system-abstract-concept_12085707.htm#query=login&position=0&from_view=search&track=sph&uuid=1f30a61a-b0e1-43e4-8907-37d8323521d3">Image by vectorjuice</a> on Freepik

<a href="https://www.freepik.com/free-vector/access-control-system-abstract-concept-vector-illustration-security-system-authorize-entry-login-credentials-electronic-access-password-passphrase-pin-verification-abstract-metaphor_24070702.htm#fromView=search&term=login&track=sph&regularType=vector&page=1&position=17&uuid=644ec9a5-1fff-47cc-84c7-03b965cb1d2f">Image by vectorjuice</a> on Freepik

<a href="https://www.freepik.com/free-vector/login-concept-illustration_11683784.htm#position=6">Image by storyset</a> on Freepik

notioly.com -> login.jpg







e. Unpaid Leave
f. Week Off
g. In time approval pending
h. Out time approval pending
i. Approval Pending
j. Not marked

CREATE TABLE tbl_attendance_status (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    description VARCHAR(255),
    color VARCHAR(50)
);

INSERT INTO tbl_attendance_status (name, description, color) VALUES
('Absent', '', ''),
('Present', '', ''),
('Half-Day', '', ''),
('Paid Leave', '', ''),
('Unpaid Leave', '', ''),
('Week Off', '', ''),
('In time approval pending', '', ''),
('Out time approval pending', '', ''),
('Approval Pending', '', ''),
('Not marked', '', '');
