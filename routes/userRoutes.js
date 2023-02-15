const router = require("express").Router();
const User = require("../models/User");
const MusicRequest = require("../models/MusicRequests");
const { AppResponse, AppError } = require("../utils");
const stringSimilarity = require("string-similarity");

// Helper function to get minutes from milliseconds
function convertMilliseconds(milliseconds) {
  const minutes = Math.floor(milliseconds / 60000);
  milliseconds %= 60000;
  const seconds = Math.floor(milliseconds / 1000);
  return `${minutes > 9 ? minutes : "0" + minutes}:${
    seconds > 9 ? seconds : "0" + seconds
  }`;
}

// Helper function to get similar song names
async function getSimilarSongNames(name, userId) {
  // Query the database for previously requested song names
  const previousRequests = await MusicRequest.find({
    userId
  }, "name");
  console.log(previousRequests);
  console.log(previousRequests);
  const previousSongNames = previousRequests.map((request) => request.name);
  console.log(previousSongNames);

  // Use string-similarity library to get the most similar song names
  const similarityThreshold = 0.6; // can be Adjust as needed
  const similarities = stringSimilarity.findBestMatch(name, previousSongNames);
  const similarSongNames = similarities.ratings
    .filter((rating) => rating.rating > similarityThreshold)
    .map((rating) => rating.target);

  return similarSongNames;
}

// create new user
router.post("/new", async (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    return new AppError(res, "userId required", 400);
  }

  // check if user exist with id
  const userExist = await User.findOne({ uniqueId: userId });
  if (userExist) {
    return new AppError(res, `user with id ${userId} already exist`, 400);
  }

  const user = await User.create({ uniqueId: userId });
  return new AppResponse(res, user, 201);
});

// get user profile
router.post("/profile", async (req, res) => {
  const { userId } = req.body;

  const user = await User.findOne({ uniqueId: userId });

  if (!user) {
    return new AppError(res, `No user found with id: ${userId}`, 404);
  }

  return new AppResponse(res, user, 200);
});

// user request music
router.post("/request", async (req, res) => {
  const { name, artist, userId } = req.body;

  const date = new Date();
  const time = date.getTime();
  const timePlus5Minutes = time + 300000;

  if (!name || !artist || !userId) {
    return new AppError(res, `name, artist and userId is required`, 400);
  }

  const user = await User.findOne({
    uniqueId: userId,
  });

  if (!user) {
    return new AppError(res, "no user found", 404);
  }

  // limit user to 1 request every 5 minute
  // if(user.nextMusicRequestTime > time){
  //   const remTime = convertMilliseconds(user.nextMusicRequestTime - time)
  //   return new AppError(res, `you can request in next ${remTime} mins`, 400)
  // }

  // check if user have request the same song within last 30 mins
  const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000);
  const previousRequests = await MusicRequest.find({
    userId,
    name: { $in: [name.toLowerCase(), ...(await getSimilarSongNames(name.toLowerCase(), userId))] },
    artist: artist.toLowerCase(),
    requestedAt: { $gte: thirtyMinutesAgo },
  });

  if (previousRequests.length > 0) {
    return new AppError(
      res,
      {
        mesage: `You have already requested this song within the last 30 minutes.`,
      },
      400
    );
  }

  const request = await MusicRequest.create({
    ...req.body,
    name: name.toLowerCase(),
    artist: artist.toLowerCase(),
  });

  // update user request time
  await User.updateOne(
    { uniqueId: userId },
    {
      lastMusicRequestTime: time,
      nextMusicRequestTime: timePlus5Minutes,
    },
    { new: true }
  );

  return new AppResponse(res, request, 201);
});

// user see all requests
router.get("/requests/:userId", async (req, res) => {
  const { userId } = req.params;

  if (!userId) {
    return new AppError(res, `user id is required`, 400);
  }

  const requests = await MusicRequest.find({
    userId,
  });

  return new AppResponse(res, requests, 200);
});

module.exports = router;
