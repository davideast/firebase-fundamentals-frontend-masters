# Seeding the database

This part of the repo is contains files needed to seed the database for exercises. You don't need to run them directly, as they are included in the commands in the `start` and `final` folders.

### This is cool though, how does it work?
This data seeding system uses the `firebase-admin` node.js SDK to read JSON data generated from [Mockaroo](https://mockaroo.com), and write it into different data structures in the Firestore Emulator (not prod!) to run different types of queries.

The scripts are designed to run against the Firestore Emulator so everything works locally.
