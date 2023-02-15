const router = require("express").Router();
const User = require("../models/User");
const MusicRequest = require("../models/MusicRequests");
const { AppResponse, AppError } = require("../utils");

// get all music requests
router.get("/requests", async (req, res) => {
  const requests = await MusicRequest.find();

  return new AppResponse(res, requests, 200);
});

// update music status 
router.put('/requests', async (req, res) => {
    const {id, status} = req.body;

    if(!id && !status){
        return new AppError(res, "Id and status required", 400);
    }

    try {
        const request = await MusicRequest.updateOne({id}, {
            status
        });

        return new AppResponse(res, "request status updated", 200);
        
    } catch (e) {
        return new AppError(res, e.message, 404);
    }
})

module.exports = router;
