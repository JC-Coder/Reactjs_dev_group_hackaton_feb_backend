const Pusher = require("pusher");

const pusher = new Pusher({
  appId: "1555529",
  key: "564d257a0600fa9948fc",
  secret: "1c18440e30892c05f6f9",
  cluster: "eu",
  useTLS: true,
  retry: {
    maxAttempts: 10,
    timeout: 600000,
    backoffDelay: 1000,
    maxBackoffDelay: 30000,
    retryOnNetworkFailure: true,
  },
});

const triggerPusher = (event, data) => {
  try {
    pusher
      .trigger("gd-channel", event, { data })
      .catch((err) => console.log(err));
    console.log("pusher triggered");
  } catch (e) {
    console.log(e.message);
  }
};

module.exports = { triggerPusher };
