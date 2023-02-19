const MusicRequest = require("../models/MusicRequests");
const stringSimilarity = require("string-similarity");

const helperFunction = {
  // Helper function to get minutes from milliseconds
  convertMilliseconds: (milliseconds) => {
    const minutes = Math.floor(milliseconds / 60000);
    milliseconds %= 60000;
    const seconds = Math.floor(milliseconds / 1000);
    return `${minutes > 9 ? minutes : "0" + minutes}:${
      seconds > 9 ? seconds : "0" + seconds
    }`;
  },

  // Helper function to get similar song names
  getSimilarSongNames: async (name, userId) => {
    console.log("getssn 1");
    // Query the database for previously requested song names
    const previousRequests = await MusicRequest.find(
      {
        userId,
      },
      "name"
    );
    console.log(previousRequests);
    console.log("getssn 2");

    if(previousRequests.length < 1){
      return previousRequests;
    }

    const previousSongNames = previousRequests.map((request) => request.name);

    // Use string-similarity library to get the most similar song names
    const similarityThreshold = 0.6; // can be Adjust as needed
    const similarities = stringSimilarity.findBestMatch(
      name,
      previousSongNames
    );
    const similarSongNames = similarities.ratings
      .filter((rating) => rating.rating > similarityThreshold)
      .map((rating) => rating.target);

    console.log("getssn 3");
    console.log(similarSongNames);

    return similarSongNames;
  },
};

module.exports = helperFunction;
