# Contributing to node-sonos

We love your input! We want to make contributing to this project as easy and transparent as possible, whether it's:

- Reporting a bug
- Discussing the current state of the code
- Submitting a fix
- Proposing new features
- Becoming a maintainer

We advise to start small, as big changes tend to take more time to be merged. For starters you could have a look at the ['help-wanted' issues](https://github.com/bencevans/node-sonos/labels/help-wanted) to start contributing.

## We Develop with Github

We use github to host code, to track issues and feature requests, as well as accept pull requests.

## We Use [Github Flow](https://guides.github.com/introduction/flow/index.html), So All Code Changes Happen Through Pull Requests

Pull requests are the best way to propose changes to the codebase (we use [Github Flow](https://guides.github.com/introduction/flow/index.html)). We actively welcome your pull requests:

1. Fork the repo and create your branch from `master`.
2. Run `npm install` to make sure you got the current version of the packages installed.
3. If you've added code that should be tested, add tests.
4. Add jsdoc to all new prototyped functions and update the documentation `npm run docs`
5. Ensure the test suite passes. `npm run test` or `SONOS_HOST=1.2.3.4 npm run test` for real device testing.
6. Make sure your code lints. `npm run lint` or `standard --fix` to auto fix most lint errors.
7. Issue that pull request! All pull-requests are automatically checked by [Travis](https://travis-ci.org/bencevans/node-sonos/pull_requests).
8. Respond to possible review comments.
9. :tada: :confetti_ball: Once merged, a new version will be published to NPM.

## Any contributions you make will be under the MIT Software License

In short, when you submit code changes, your submissions are understood to be under the same [MIT License](http://choosealicense.com/licenses/mit/) that covers the project. Feel free to contact the maintainers if that's a concern.

## Report bugs using Github's [issues](https://github.com/bencevans/node-sonos/issues)

We use GitHub issues to track public bugs. Report a bug by [opening a new issue](https://github.com/bencevans/node-sonos/issues/new); it's that easy!

## Write bug reports with detail, background, and sample code

We like bug reports that state some example code, what your output is and what output you would expect. Possibly with the part of the library that causes the issue.

**Great Bug Reports** tend to have:

- A quick summary and/or background
- Version of this package.
- Steps to reproduce
  - Be specific!
  - Give sample code if you can. [A stackoverflow question](http://stackoverflow.com/q/12488905/180626) includes sample code that *anyone* with a base R setup can run to reproduce what I was seeing
- What you expected would happen
- What actually happens
- Notes (possibly including why you think this might be happening, or stuff you tried that didn't work)

People *love* thorough bug reports. I'm not even kidding.

## Use a Consistent Coding Style

We're again borrowing these from [Facebook's Guidelines](https://github.com/facebook/draft-js/blob/a9316a723f9e918afde44dea68b5f9f39b7d9b00/CONTRIBUTING.md)

- 2 spaces for indentation rather than tabs
- You can try running `npm run lint` for style unification

## License

By contributing, you agree that your contributions will be licensed under its MIT License.

## References

Thanks [@briandk](https://github.com/briandk) for this [template](https://gist.github.com/briandk/3d2e8b3ec8daf5a27a62).

This document was adapted from the open-source contribution guidelines for [Facebook's Draft](https://github.com/facebook/draft-js/blob/a9316a723f9e918afde44dea68b5f9f39b7d9b00/CONTRIBUTING.md)
