const router = require("express").Router();
const MusicRequest = require("../models/MusicRequests");
const { AppResponse, AppError } = require("../utils");
const Notification = require("../models/Notification");
const { triggerPusher } = require("../config/pusher");
require("dotenv").config();

let nowPlaying = {};

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

    let allRequests = await MusicRequest.find();

    // trigger pusher
    triggerPusher("user-new-notification", notification);
    triggerPusher("user-request-update", request);
    triggerPusher("all-requests", allRequests);
    triggerPusher("user-notification-count");

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

// get now playing song
router.get("/now-playing", async (req, res) => {
  try {
    res.status(200).json(nowPlaying);
  } catch (e) {
    return new AppError(res, e.message, 500);
  }
});

// dj auth
router.post("/auth", async (req, res) => {
  const { key } = req.body;
  const DJ_AUTH_KEY = process.env.DJ_AUTH_KEY

  if (!key) {
    return new AppError(res, { message: "Key is required" }, 500);
  }

  try {
    if(key !== DJ_AUTH_KEY) {
      return new AppResponse(res, {message: 'key is invalid'}, 400);
    }

    return new AppResponse(res, {message: 'Success, key  valid'}, 200);
  } catch (e) {
    return new AppError(res, e.message, 500);
  }
});

module.exports = router;
