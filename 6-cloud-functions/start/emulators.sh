export FIREBASE_AUTH_EMULATOR_HOST="127.0.0.1:9099"
export FIRESTORE_EMULATOR_HOST="localhost:8080"
npx firebase emulators:start --only firestore,functions,auth --import=./local
