import { Client, Clova, Middleware, SpeechBuilder } from "@line/clova-cek-sdk-nodejs";
import express from "express";
const APPLICATION_ID: string = (process.env.APPLICATION_ID) as string;

const app = express();

const launchHandler = async (responseHelper: Clova.ClientContext) => {
  responseHelper.setSimpleSpeech(SpeechBuilder.createSpeechText("おはよう"));
};

const intentHandler = async (responseHelper: Clova.ClientContext) => {
  const intent = responseHelper.getIntentName();
  const sessionId = responseHelper.getSessionId();

  switch (intent) {
    case "Clova.YesIntent":
      responseHelper.setSimpleSpeech(SpeechBuilder.createSpeechText("はいはい"));
      break;
    case "Clova.NoIntent":
      responseHelper.setSimpleSpeech(SpeechBuilder.createSpeechText("いえいえ"));
      break;
    default:
      responseHelper.setSimpleSpeech(SpeechBuilder.createSpeechText("なんなん"));
      break;
  }
};

// tslint:disable-next-line:no-empty
const sessionEndedHandler = async (_: Clova.ClientContext) => {};

const clovaHandler = Client.configureSkill()
  .onLaunchRequest(launchHandler)
  .onIntentRequest(intentHandler)
  .onSessionEndedRequest(sessionEndedHandler)
  .handle();

const clovaMiddleware = Middleware({ applicationId: APPLICATION_ID });

// Use `clovaMiddleware` if you want to verify signature and applicationId.
app.post("/clova", clovaMiddleware, clovaHandler);

// Or you can simply use `bodyParser.json()` to accept any request without checking, e.g.,
// `app.post('/clova', bodyParser.json(), clovaHandler);`

const port = process.env.PORT || 3000;
app.listen(port, () => {
  // tslint:disable-next-line:no-console
  console.log(`Server running on ${port}`);
});
