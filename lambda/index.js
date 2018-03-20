var Alexa = require("alexa-sdk");
// data
var alexaMeetups = require("./data/alexameetups");
// helper functions array convert
var convertArrayToSentence = require("./helpers/covertArray");

exports.handler = function(event, context, callback) {
  var alexa = Alexa.handler(event, context);
  alexa.dynamoDBTableName = "MouseDevsUsers";
  alexa.registerHandlers(handlers);
  alexa.execute();
};

var handlers = {
  // New session handler
  // getting personal with the user
  NewSession: function() {
    // check to see if username has been saved to db
    var username = this.attributes["username"];
    // welcome back the user
    if (username) {
      this.emit(
        ":ask",
        `Welcome back ${username}! You can ask me about the various Alexa meetups around the world or listen to the Alexa Dev Chat podcast.`,
        "What would you like to do?"
      );
    } else {
    this.emit(
      ":ask",
      `Welcome to Mouse Devs, The skill that gives you information about the Alexa Developer Community. You can ask me about the various alexa meetups around the world, or listen to the Alexa Dev chart podcasts. But first I'd would like to get to know you better. Tell me your name by saying: My name is, and then your name`,
      "Tell me your name by saying: My name is, and then your name"
    );
   }
  },

  // Name capture event handler
  NameCapture: function() {
    // get the slot values
    var USFirstNameSlot = this.event.request.intent.slots.USFirstName.value;
    var UKFirstNameSlot = this.event.request.intent.slots.UKFirstName.value;
    // get the name
    var name;
    if (USFirstNameSlot) {
      name = USFirstNameSlot;
    } else if (UKFirstNameSlot) {
      name = UKFirstNameSlot;
    }
    // save the name in session attribute
    if (name) {
      this.attributes["username"] = name;
      this.emit(
        ":ask",
        `Okay ${name},  tell me what country you are from,  by saying: I'm from, then the name of your country.`,
        "Tell me what country you are from by saying: I'm from, and then the name of your country."
      );
    } else {
      this.emit(
        ":ask",
        `Sorry I did not get your name. Please tell me your name by saying: My name is, and then your name.`,
        "Please tell me your name by saying: My name is, and then your name."
      );
    }
  },

  CountryCapture: function() {
    // get the slots
    var country = this.event.request.intent.slots.Country.value;
    // capture the username from session
    var username = this.attribute["username"];
    // save the country name in session attr
    if (country) {
      this.attribute["country"] = country;
      this.emit(
        ":ask",
        `Okay ${username} you are from ${country}, you can ask me about the various alexa developer meetups around the world, or listen to the alexa dev chart podcast. What would like to do ?`,
        "What would you like to do?"
      );
    } else {
      this.emit(
        ":ask",
        `Sorry I did not recognise that country. Please tell me your country by saying: I am from, then the name of your country`,
        "Please tell me your country by saying: I am from, then the name of your country."
      );
    }
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
  AlexaMeetUpOrganiserChecker: function() {
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
        this.emit(
          ":ask",
          `The organiser for ${city} Alexa Developer Meetup is ${
            cityOrganiser[0]
          }`,
          "How can I help!"
        );
        // multiper organisers
      } else {
        this.emit(
          ":ask",
          `The organisers for ${city} Alexa Developer Meetup are ${convertArrayToSentence(
            cityOrganiser
          )}`,
          "How can I help!"
        );
      }
    } else {
      this.emit(
        ":ask",
        `Sorry looks like we don't have an Alexa meet up for ${city}`,
        "How can I help!"
      );
    }
  },
  'AMAZON.StopIntent': function () {
    // state automatically saved 
     this.emit(":tell", "")
  },
  // saving the state after exiting
  'SessionEndedRequest': function () {
    this.emit("saveState", true)
  }
};
