// Load dotenv package
require('dotenv').config();

// Load the NPM Package inquirer
const inquirer = require('inquirer');

// Load the NPM Package Axios
const axios = require('axios');

// Load the NPM Package node-spotify-api
const Spotify = require('node-spotify-api');

// Import the keys.js
const keys = require('./keys.js');

console.log('connected');

// Ask which command
inquirer
  .prompt([
    // Here we create a basic text prompt.
    {
      type: 'input',
      message: 'What is your name?',
      name: 'username',
    },
    // Here we create a basic password-protected text prompt.
    {
      type: 'password',
      message: 'Set your password',
      name: 'userPassword',
    },
    // Here we give the user a list to choose from.
    {
      type: 'list',
      message: 'What is your favorite movie?',
      choices: ['The Matrix', 'Star Wars', 'A Star is Born'],
      name: 'movie',
    },
    // Here we give the user a checkbox to choose from.
    {
      type: 'checkbox',
      message: 'What is your 2nd favorite movie?',
      choices: ['The Godfather', 'Cool Hand Luke', 'Shawshank Redemption'],
      name: 'movie2',
    },
    // Here we ask the user to confirm.
    {
      type: 'confirm',
      message: 'Are you sure:',
      name: 'confirm',
      default: true,
    },
  ])
  .then((inquirerResponse) => {
    // If the inquirerResponse confirms, we displays the inquirerResponse's username and pokemon from the answers.
    if (inquirerResponse.confirm) {
      console.log(`\nWelcome ${inquirerResponse.username}`);

      if (inquirerResponse.userPassword === password) {
        console.log(`${inquirerResponse.movie} is a Great Choice!\n`);
        console.log(`${inquirerResponse.movie2} is Also a Great Choice!\n`);
      } else {
        console.log('Wrong Password, try Again!');
      }
    } else {
      console.log(
        `\nThat's okay ${inquirerResponse.username}, come again when you are more sure.\n`,
      );
    }
  });

// Create a new Spotify object
const spotify = new Spotify(keys.spotify);

spotify
  .search({ type: 'track', query: 'Courageous', limit: 1 })
  .then((response) => {
    // console.log(response.tracks.items);
    // console.log(response.tracks.items[0].album);

    console.log(`Artist Name: ${response.tracks.items[0].album.artists[0].name}`);
    console.log(`Song Name: ${response.tracks.items[0].name}`);
    console.log(`Preview: ${response.tracks.items[0].preview_url}`);
    console.log(`Album Name: ${response.tracks.items[0].album.name}`);
  })
  .catch((err) => {
    console.log(err);
  });

// We then run the request with axios module on a URL with a JSON
// axios
//   .get('http://www.omdbapi.com/?t=remember+the+titans&y=&plot=short&apikey=trilogy')
//   .then((response) => {
//     // Then we print out the imdbRating
//     console.log(`The movie's rating is: ${response.data.imdbRating}`);
//   });
