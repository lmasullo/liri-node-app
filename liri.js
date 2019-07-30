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

// Import the keys.js
const keys = require('./keys.js');

console.log('connected');

// Ask which command
inquirer
  .prompt([
    // List of Commands
    {
      type: 'list',
      message: 'What would you like to do?',
      choices: ['Search for a Concert', 'Search for a Song', 'Search for a Movie', 'Run Text File Command'],
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

      //console.log(inquirerResponse.command);

      switch(inquirerResponse.command) {
        case 'Search for a Concert':
          //Prompt for Concert
          inquirer
            .prompt([{
            type: 'input',
            message: 'What Concert would like to find?',
            name: 'concert',
          },])
          .then((inquirerResponse) => {
            // Search bands in town for concert using axios
            let artist = inquirerResponse.concert;         
            axios
              .get("https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp")
              .then((response) => {
                //console.log(response.data[0]);
                console.log('Venue: ' + response.data[0].venue.name);
                console.log('Location: ' + response.data[0].venue.city + ", " + response.data[0].venue.region);
                console.log('Date: ' + moment(response.data[0].datetime).format('MM/DD/YYYY'));
              });        
          });     
          break;
        case'Search for a Song':
          //Prompt for song
          inquirer
            .prompt([{
            type: 'input',
            message: 'What Song would like to find?',
            name: 'song',
          },])
          .then((inquirerResponse) => {
            // Create a new Spotify object
            const spotify = new Spotify(keys.spotify);

            //Do Spotify Query and return results
            spotify
              .search({ type: 'track', query: inquirerResponse.song, limit: 1 })
              .then((response) => {
                console.log(`Artist Name: ${response.tracks.items[0].album.artists[0].name}`);
                console.log(`Song Name: ${response.tracks.items[0].name}`);
                console.log(`Preview: ${response.tracks.items[0].preview_url}`);
                console.log(`Album Name: ${response.tracks.items[0].album.name}`);
              })
              .catch((err) => {
                console.log(err);
              });
          });     
          break;
        case'Search for a Movie':
          //Prompt for Movie
          inquirer
            .prompt([{
            type: 'input',
            message: 'What Movie would like to find?',
            name: 'movie',
          },])
          .then((inquirerResponse) => {
            // Search OMDB for Movie using axios
            let movie = ''
            if (inquirerResponse.movie){
              movie = inquirerResponse.movie;
            }else{
              movie = 'Mr. Nobody';
            }
                     
            axios
              .get("http://www.omdbapi.com/?apikey=trilogy&t="+movie)
              .then((response) => {
                //console.log(response.data);
                console.log('Title: ' + response.data.Title);
                console.log('Year Released: ' +response.data.Year);
                console.log('Rating: ' + response.data.Rated);
                //Returns an array of objects
                //console.log(response.data.Ratings);
                //Need to find just the Rotten Tomatoes
                let objRotten = response.data.Ratings.find(o => o.Source === 'Rotten Tomatoes');
                //console.log(objRotten)
                console.log(objRotten.Source + " Rating: " + objRotten.Value);            
                console.log('Country: ' + response.data.Country);
                console.log('Language: '+ response.data.Language);
                console.log('Plot: '+ response.data.Plot);
                console.log('Actors: ' + response.data.Actors);\
              });        
          });   
          break;
        case'Run Text File Command':
          // code block
          console.log('File');
          break;
        default:
          // code block
      }
    } else {
      console.log(
        `\nThat's okay, come again when you are more sure.\n`,
      );
    }
  });
