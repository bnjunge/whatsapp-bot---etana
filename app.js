const express = require("express");
const axios = require('axios')
const http = require("http"); // https/http2
require("dotenv").config();

const app = express();
app.use(express.json({ limit: "50mb" }));
// configure axios headers
const ax = axios.create({
  headers: {
    'x-api-key': process.env.API_KEY
  }
})

app
  .get("/", (req, res) => {
    res.json({ status: "running" });
  })

  .post("/incoming", async (req, res) => {
    const {message, fromname, from} = req.body
    const msg = message.toLowerCase()

    let response = ''
    if(msg.includes('.hi')){
      response = `Hello ${fromname}! I am _etana_, a virtual agent from *SurvTech*, how can I help you with today?`
    }

    if(response != ''){
      const apiResponse = await replyMsg(from, response)
      console.log(apiResponse)
    }
    console.log("Original Msg", req.body);
    res.send('ok')
  });

const replyMsg = async (to, msg) => {
  try {
    const reply = await ax.post(`${process.env.API_URL}/send-message`,
    {
      recipients: to,
      message: msg
    })
    return reply.data
  } catch (error) {
    return error.message
  }
}

const server = http.createServer(app);
const port = process.env.PORT || 3000;
server.listen(port, (err) => {
  if (err) {
    console.log(error.message);
  }
  console.log(`Server listening on port ${port}`);
});
