# How to Contribute?

## Project members

- Create an issue
- Create a branch for that issue with the naming: 
  `feature/{ticket-no}-{description-separated-by-dashes}`
- Develop your code
- Commit and push in regular intervalls
- Run the tests locally
- Open a Pull-Request
- If CI/Coverage give their OK we can merge
- The PR gets merged to `develop`, which will push a new Docker-Image-Version with the tag `develop` and `latest`
- The staging-system will then be updated to the latest Image from Docker-Hub
- If we have enough features we will merge the `develop` into the `master` branch, which will add 
  a new 'stable' image on Docker-Hub. 
  The livesysten then pulls that new image and starts up with the latest stable version

If we have bugfixes we create a `bugfix/{descriptive-name}` and open a PR, issues are not required 
for that. But it's important to have a good description of the bugfix in the PR-Comment.


## Branching model

We are using a slightly modified [GitFlow](https://datasift.github.io/gitflow/IntroducingGitFlow.html) branching strategy.


## Commit messages

Please adhere to the principles described [here](https://chris.beams.io/posts/git-commit/) for 
writing commit messages.
