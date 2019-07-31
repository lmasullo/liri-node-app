// Load dotenv package
require('dotenv').config();

// Load the NPM Package inquirer
const inquirer = require('inquirer');

// Load the NPM Package Axios
const axios = require('axios');

// Load the NPM Package node-spotify-api
const Spotify = require('node-spotify-api');

// Load the NPM Package moment.js
const moment = require('moment');

// Load the NPM package File System (FS)
const fs = require('fs');

// Import the keys.js
const keys = require('./keys.js');

console.log('connected');

//! Functions ******************************

// Function to log to txt file
function logTxt(strLog) {
  fs.appendFile('log.txt', strLog, (err) => {
    if (err) throw err;
    console.log('Saved!');
  });
} // End log txt function

// Function to search for ac concert
function searchConcert(artist) {
  // Search bands in town for concert using axios
  axios
    .get(`https://rest.bandsintown.com/artists/${artist}/events?app_id=codingbootcamp`)
    .then((response) => {
      // console.log(response.data[0]);
      console.log(`Venue: ${response.data[0].venue.name}`);
      console.log(`Location: ${response.data[0].venue.city}, ${response.data[0].venue.region}`);
      console.log(`Date: ${moment(response.data[0].datetime).format('MM/DD/YYYY')}`);

      // Create the string to send to the log.txt
      const strLog = `\n\nVenue: ${response.data[0].venue.name}\nLocation: ${
        response.data[0].venue.city
      }, ${response.data[0].venue.region}\nDate: ${moment(response.data[0].datetime).format(
        'MM/DD/YYYY',
      )}`;
      // Call the log to txt file function
      logTxt(strLog);
    });
}

// Function to search for a song
function searchSong(song) {
  // Create a new Spotify object
  const spotify = new Spotify(keys.spotify);

  // Set default song if user doesn't enter one
  if (song === '') {
    song = 'The Sign';
  }

  // Do Spotify Query and return results
  spotify
    .search({ type: 'track', query: song, limit: 1 })
    .then((response) => {
      console.log(`Artist Name: ${response.tracks.items[0].album.artists[0].name}`);
      console.log(`Song Name: ${response.tracks.items[0].name}`);
      console.log(`Preview: ${response.tracks.items[0].preview_url}`);
      console.log(`Album Name: ${response.tracks.items[0].album.name}`);

      // Create the string to send to the log.txt
      const strLog = `\n\nArtist Name: ${
        response.tracks.items[0].album.artists[0].name
      }\nSong Name: ${response.tracks.items[0].name}\nPreview: ${
        response.tracks.items[0].preview_url
      }\nAlbum Name: ${response.tracks.items[0].album.name}`;

      // Call the log to txt file function
      logTxt(strLog);
    })
    .catch((err) => {
      console.log(err);
    });
}

// Function to search for a movie
function searchMovie(movie) {
  // Search OMDB for Movie using axios

  // Set Default movie
  if (movie === '') {
    movie = 'Mr. Nobody';
  }

  // Axios call to omdb api for a movie
  axios.get(`http://www.omdbapi.com/?apikey=trilogy&t=${movie}`).then((response) => {
    // console.log(response.data);
    console.log(`Title: ${response.data.Title}`);
    console.log(`Year Released: ${response.data.Year}`);
    console.log(`Rating: ${response.data.Rated}`);
    // Returns an array of objects
    // console.log(response.data.Ratings);
    // Need to find just the Rotten Tomatoes
    const objRotten = response.data.Ratings.find(o => o.Source === 'Rotten Tomatoes');
    // console.log(objRotten)
    console.log(`${objRotten.Source} Rating: ${objRotten.Value}`);
    console.log(`Country: ${response.data.Country}`);
    console.log(`Language: ${response.data.Language}`);
    console.log(`Plot: ${response.data.Plot}`);
    console.log(`Actors: ${response.data.Actors}`);

    // Create the string to send to the log.txt
    const strLog = `\n\nTitle: ${response.data.Title}\nYear Released: ${
      response.data.Year
    }\nRating: ${response.data.Rated}\n${objRotten.Source} Rating: ${objRotten.Value}\nCountry: ${
      response.data.Country
    }\nLanguage: ${response.data.Language}\nPlot: ${response.data.Plot}\nActors: ${
      response.data.Actors
    }`;

    // Call the log to txt file function
    logTxt(strLog);
  });
}

// Ask which command
inquirer
  .prompt([
    // List of Commands
    {
      type: 'list',
      message: 'What would you like to do?',
      choices: [
        'Search for a Concert',
        'Search for a Song',
        'Search for a Movie',
        'Run Text File Command',
      ],
      name: 'command',
    },
    // Confirm Choice
    {
      type: 'confirm',
      message: 'Are you sure:',
      name: 'confirm',
      default: true,
    },
  ])
  .then((inquirerResponse) => {
    // If the inquirerResponse confirms, look up choice on switch command
    if (inquirerResponse.confirm) {
      switch (inquirerResponse.command) {
        case 'Search for a Concert':
          // Prompt for Concert
          inquirer
            .prompt([
              {
                type: 'input',
                message: 'What Concert would like to find?',
                name: 'concert',
              },
            ])
            .then((inquirerResponse) => {
              // Call the search concert function
              searchConcert(inquirerResponse.concert);
            });
          break;
        case 'Search for a Song':
          // Prompt for song
          inquirer
            .prompt([
              {
                type: 'input',
                message: 'What Song would like to find?',
                name: 'song',
              },
            ])
            .then((inquirerResponse) => {
              // Call the search song function
              searchSong(inquirerResponse.song);
            });
          break;
        case 'Search for a Movie':
          // Prompt for Movie
          inquirer
            .prompt([
              {
                type: 'input',
                message: 'What Movie would like to find?',
                name: 'movie',
              },
            ])
            .then((inquirerResponse) => {
              // Call the search movie function
              searchMovie(inquirerResponse.movie);
            });
          break;
        case 'Run Text File Command':
          // Read the random.txt file
          fs.readFile('./random.txt', 'utf8', (err, data) => {
            if (err) throw err;
            const cmdArr = data.split(',');
            // Use the switch to call the appropriate function
            switch (cmdArr[0]) {
              case 'Search for a Concert':
                // Call Search for a Concert function
                searchConcert(cmdArr[1]);
                break;
              case 'Search for a Song':
                // Call Search for a Song function
                searchSong(cmdArr[1]);
                break;
              case 'Search for a Movie':
                // Call Search for a Movie function
                searchMovie(cmdArr[1]);
                break;
              default:
                console.log('Sorry, no default');
            } // End Switch
          });
          break;
        default:
          console.log('Sorry, no default');
      }
    } else {
      console.log("\nThat's okay, come again when you are more sure.\n");
    }
  });
