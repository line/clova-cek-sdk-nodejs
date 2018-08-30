# How to contribute to LINE CEK SDK for Node.js

First of all, thank you so much for taking your time to contribute! LINE CEK SDK
for Node.js is not very different from any other open source projects. It will
be fantastic if you help us by doing any of the following:

- File an issue in [the issue tracker](https://github.com/line/clova-cek-sdk-nodejs/issues)
  to report bugs and propose new features and improvements.
- Ask a question using [the issue tracker](https://github.com/line/clova-cek-sdk-nodejs/issues).
- Contribute your work by sending [a pull request](https://github.com/line/clova-cek-sdk-nodejs/pulls).

## Development

You can freely fork the project, clone the forked repository, and start editing.

Here are each top-level directory explained:

* `src`: TypeScript source code. You may modify files under this directory.
* `test`: Jest test suites. Please add tests for modification if possible.
* `examples`: Example projects using this SDK

Also, you may use the following npm scripts for development:

* `npm run test`: Run test suites in `test`.
* `npm run build`: Build TypeScript code into JavaScript. The built files will
  be placed in `dist/`.

We test, lint and build on CI, but it is always nice to check them before uploading a pull request.

## Contributor license agreement

When you are sending a pull request and it's a non-trivial change beyond fixing typos, please sign
[the ICLA (individual contributor license agreement)](https://cla-assistant.io/line/clova-cek-sdk-nodejs).
Please [contact us](mailto:dl_oss_dev@linecorp.com) if you need the CCLA (corporate contributor license agreement).