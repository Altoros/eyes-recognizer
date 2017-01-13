# Eyes Recognizer API

## Setup
* Install dependencies with `npm install`
* Create Visual Recognition service in Bluemix and copy its credentials
* Create `.env` file based on a contents of `.env.sample`
* Copy `.zip` archives for traning into `/src/tasks` directory
* Train the classifier with `npm run train`. Adjust `.env` with the new Classifier ID
* Run development version of the api with `npm run dev`
