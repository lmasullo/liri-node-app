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

//Load the NPM package File System (FS)
const fs =require('fs');

// Import the keys.js
const keys = require('./keys.js');

console.log('connected');


//! Functions******************************
function searchConcert(artist){
  // Search bands in town for concert using axios
  //let artist = inquirerResponse.concert;         
  axios
    .get("https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp")
    .then((response) => {
      //console.log(response.data[0]);
      console.log('Venue: ' + response.data[0].venue.name);
      console.log('Location: ' + response.data[0].venue.city + ", " + response.data[0].venue.region);
      console.log('Date: ' + moment(response.data[0].datetime).format('MM/DD/YYYY'));
    });             
}

function searchSong(song){
  // Create a new Spotify object
  const spotify = new Spotify(keys.spotify);

  //Do Spotify Query and return results
  spotify
    .search({ type: 'track', query: song, limit: 1 })
    .then((response) => {
      console.log(`Artist Name: ${response.tracks.items[0].album.artists[0].name}`);
      console.log(`Song Name: ${response.tracks.items[0].name}`);
      console.log(`Preview: ${response.tracks.items[0].preview_url}`);
      console.log(`Album Name: ${response.tracks.items[0].album.name}`);
    })
    .catch((err) => {
      console.log(err);
    });
}

function searchMovie(movie){
  // Search OMDB for Movie using axios
  //let movie = ''
  if (movie){
    movie = movie;
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
      console.log('Actors: ' + response.data.Actors);
    });        
}

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
            //Call the search concert function
            searchConcert(inquirerResponse.concert);
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
            //Call the search song function
            searchSong(inquirerResponse.song);
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
            //Call the search movie function
            searchMovie(inquirerResponse.movie);
          });   
          break;
        case'Run Text File Command':
          fs.readFile('./random.txt','utf8', function(err,data){
            if(err) throw err;
            console.log(data);
            let cmdArr = data.split(',');
            console.log(cmdArr);
            //todo Use the switch to call the appropriate function
            
          });
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
