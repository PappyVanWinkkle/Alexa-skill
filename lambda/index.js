var Alexa = require("alexa-sdk");
// data
var alexaMeetups = require("./data/alexameetups");
// helper functions array convert 
var convertArrayToSentence = require('./helpers/covertArray');

exports.handler = function(event, context, callback) {
  var alexa = Alexa.handler(event, context);
  alexa.registerHandlers(handlers);
  alexa.execute();
};

var handlers = {
  LaunchRequest: function() {
    this.emit(":ask", "Welcome to Voice Devs!", "Try saying hello!");
  },
  Hello: function() {
    this.emit(":tell", "Hi there good afternoon!");
  },
  AlexaMeetUpNumbers: function() {
    var meetUpNumbers = alexaMeetups.length;
    // respond to the user
    this.emit(
      ":ask",
      `I currently know of ${meetUpNumbers} Alexa developer meetups. Check to see if your city is one of them!`,
      "How can I help?"
    );
  },
  AlexaMeetUpCityChecker: function() {
    // get the slot values
    var usCitySlot = this.event.request.intent.slots.USCity.value;
    var europeanCitySlot = this.event.request.intent.slots.EuropeanCity.value;
    // get city
    var city;
    if (usCitySlot) {
      city = usCitySlot;
    } else if (europeanCitySlot) {
      city = europeanCitySlot;
    } else {
      this.emit(
        ":ask",
        "Sorry I don't recognise that city name",
        "How can I help!"
      );
    }
    // check for the city
    var cityMarch = "";
    for (var i = 0; i < alexaMeetups.length; i++) {
      if (alexaMeetups[i].city.toLowerCase() === city.toLowerCase()) {
        cityMarch = alexaMeetups[i].city;
      }
    }
    // respond to the user
    if (cityMarch !== "") {
      this.emit(
        ":ask",
        `Yes! ${city} does have an Alexa Development Meetup`,
        "How can I help?"
      );
    } else {
      this.emit(
        ":ask",
        `Sorry it looks like ${city} doesn't have an Alexa Development Meetup yet - why don't you start one?`,
        "How can I help"
      );
    }
  },
  AlexaMeetUpOrganiserChecker: function () {
    // get the slot values
    var usCitySlot = this.event.request.intent.slots.USCity.value;
    var europeanCitySlot = this.event.request.intent.slots.EuropeanCity.value;
    
    // get city
    var city;
    if (usCitySlot) {
      city = usCitySlot;
    } else if (europeanCitySlot) {
      city = europeanCitySlot;
    } else {
      this.emit(
        ":ask",
        "Sorry I don't recognise that city name",
        "How can I help!"
      );
    }
    // checking for city and organiser 
    var cityMarch = "";
    var cityOrganiser;
    for (var i = 0; i < alexaMeetups.length; i++) {
      if (alexaMeetups[i].city.toLowerCase() === city.toLowerCase()) {
        cityMarch = alexaMeetups[i].city;
        cityOrganiser = alexaMeetups[i].organisers;
      }
    }
    // respond to the user 
    if (cityMarch !== "") {
      if (cityOrganiser.length === 1) {
        this.emit(":ask", `The organiser for ${city} Alexa Developer Meetup is ${cityOrganiser[0]}`, "How can I help!")
      } else if (cityOrganiser.length > 1) {
        this.emit(":ask", `The organisers for ${city} Alexa Developer Meetup are ${cityOrganiser.convertArrayToSentence}`, "How can I help!")
      } else {
        this.emit(":ask", `Sorry Looks like city doesn't have an Alexa Development Meetup`, "How can I help!")
      }
    }
  }
  
  
};
