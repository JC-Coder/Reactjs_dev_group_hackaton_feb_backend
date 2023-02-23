const Pusher = require("pusher");

const pusher = new Pusher({
  appId: "1555529",
  key: "564d257a0600fa9948fc",
  secret: "1c18440e30892c05f6f9",
  cluster: "eu",
  useTLS: true,
});

const triggerPusher = (event, data) => {
  try {
    pusher.trigger("gd-channel", event, { data });
    console.log("pusher triggered");
  } catch (e) {
    console.log(e.message);
  }
};

module.exports = { triggerPusher };
