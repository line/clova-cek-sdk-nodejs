# Clova CEK SDK Nodejs

[![Build Status](https://travis-ci.org/line/clova-cek-sdk-nodejs.svg?branch=master)](https://travis-ci.org/line/clova-cek-sdk-nodejs)

## Getting Started

### Installing

```bash
$ npm install @line/clova-cek-sdk-nodejs
```

### Example

```js
const clova = require('@line/clova-cek-sdk-nodejs');
const express = require('express');
const bodyParser = require('body-parser');

const clovaSkillHandler = clova.Client
  .configureSkill()
  .onLaunchRequest(responseHelper => {
    responseHelper.setSimpleSpeech({
      lang: 'ja',
      type: 'PlainText',
      value: 'おはよう',
    });
  })
  .onIntentRequest(async responseHelper => {
    const intent = responseHelper.getIntentName();
    const sessionId = responseHelper.getSessionId();

    switch (intent) {
      case 'Clova.YesIntent':
        // Build speechObject directly for response
        responseHelper.setSimpleSpeech({
          lang: 'ja',
          type: 'PlainText',
          value: 'はいはい',
        });
        break;
      case 'Clova.NoIntent':
        // Or build speechObject with SpeechBuilder for response
        responseHelper.setSimpleSpeech(
          clova.SpeechBuilder.createSpeechText('いえいえ')
        );
        break;
    }
  })
  .onSessionEndedRequest(responseHelper => {
    const sessionId = responseHelper.getSessionId();

    // Do something on session end
  })
  .handle();

const app = new express();
const clovaMiddleware = clova.Middleware({ applicationId: "YOUR_APPLICATION_ID" });
// Use `clovaMiddleware` if you want to verify signature and applicationId.
// Please note `applicationId` is required when using this middleware.
app.post('/clova', clovaMiddleware, clovaSkillHandler);

// Or you can simply use `bodyParser.json()` to accept any request without verifying, e.g.,
app.post('/clova', bodyParser.json(), clovaSkillHandler);
```

> **NOTE:** `async/await` is part of ECMAScript 2017 and is not supported some browsers, so use with caution.

### Documentation

* [Clova Platform Guide](https://clova-developers.line.me/guide/)

## Contributing

Please check [CONTRIBUTING](CONTRIBUTING.md).

### npm scripts

 - `npm test`: Run test suite
 - `npm start`: Run `npm run build` in watch mode
 - `npm run test:watch`: Run test suite in [interactive watch mode](http://facebook.github.io/jest/docs/cli.html#watch)
 - `npm run test:prod`: Run linting and generate coverage
 - `npm run build`: Generate bundles and typings, create docs
 - `npm run lint`: Lints code
