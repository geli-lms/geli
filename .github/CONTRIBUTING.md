# How to Contribute?

## Project members
- Create an issue
- Create a branch for that issue with the naming: 
  `feature/{ticket-no}-{description-separated-by-dashes}`
- Develop your code
- Commit and push in regular intervalls
- Run the tests locally
- Add a line to the [CHANGELOG.md](https://github.com/geli-lms/geli/blob/develop/CHANGELOG.md) under the "NEXT" section in the form `- a short text to describe [#123](https://github.com/geli-lms/geli/issues/123)`
- Open a Pull-Request
- If CI/Coverage give their OK we can merge
- The PR gets merged to `develop`, which will push a new Docker-Image-Version with the tag `develop` and `latest`
- The staging-system will then be updated to the latest Image from Docker-Hub
- If we have enough features we will merge the `develop` into the `master` branch, which will add 
  a new 'stable' image on Docker-Hub. Before we do this, the new version needs to be updated in several `package.json`s and the `CHANGELOG.md`.
  The livesysten then pulls that new image and starts up with the latest stable version

If we have small bugfixes we create a `bugfix/{descriptive-name}` and open a PR, issues are not required 
for that. But it's important to have a good description of the bugfix in the PR-Comment.
If it is not a small bug please create a issue for it so we can decide the importance of it.


## Branching model
We are using a slightly modified [GitFlow](https://datasift.github.io/gitflow/IntroducingGitFlow.html) branching strategy.


## Commit messages
Please adhere to the principles described [here](https://chris.beams.io/posts/git-commit/) for 
writing commit messages.
