const router = require("express").Router();
const User = require("../models/User");
const MusicRequest = require("../models/MusicRequests");
const { AppResponse, AppError } = require("../utils");
const Notification = require("../models/Notification");
const { triggerPusher } = require("../config/pusher");

// get all music requests
router.get("/requests", async (req, res) => {
  try {
    const requests = await MusicRequest.find();

    return new AppResponse(res, requests, 200);
  } catch (e) {
    return new AppError(res, e.message, 500);
  }
});

// update music status
router.put("/requests", async (req, res) => {
  const { id, status } = req.body;

  if (!id && !status) {
    return new AppError(res, { message: "Id and status required" }, 400);
  }

  try {
    let request = await MusicRequest.findById(id);
    request.status = status;
    request = await request.save();

    const statusMessage = (status) => {
      if (status == "played") {
        return "has been played";
      } else if (status == "unavailable") {
        return "is not available";
      }
    };

    // create new notification for user
    const notification = await Notification.create({
      userId: request.userId,
      title: "Music Request Update",
      message: `Your music request ${request.name} by ${
        request.artist
      } ${statusMessage(status)}`,
    });

    // trigger pusher
    triggerPusher("user-new-notification", notification);

    return new AppResponse(res, { message: "request status updated" }, 200);
  } catch (e) {
    return new AppError(res, e.message, 404);
  }
});

// get all dj notifications
router.get("/notifications", async (req, res) => {
  try {
    const notifications = await Notification.find({
      access: "dj",
    }).sort({ createdAt: -1 });

    return new AppResponse(res, notifications, 200);
  } catch (e) {
    return new AppError(res, e.message, 500);
  }
});

// set now playing song
router.post("/now-playing", async (req, res) => {
  let nowPlaying = {};

  try {
    const { name, artist } = req.body;

    if (!name || !artist) {
      return new AppError(res, { message: "name and artist is required" }, 500);
    }

    nowPlaying.name = name;
    nowPlaying.artist = artist;

    // trigger pusher
    triggerPusher("now-playing", nowPlaying);

    return new AppResponse(res, { data: nowPlaying, message: "Success" }, 200);
  } catch (e) {
    return new AppError(res, e.message, 500);
  }
});

module.exports = router;
