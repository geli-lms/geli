# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## [NEXT] 
### Fixed
- refactoring of unit-remove-function [#682]
- fix the pre-hook of unit-model


### Fixed
- Fixed wasteful course data usage #654 via specialized course model interfaces.
- Fixed a broken documentation link #583.
- Limited the first- and lastname to 64 characters in registration- and edit page. [#585](https://github.com/h-da/geli/issues/585)
- add correct E-Mail validator to edit-profile and register component [#564]

### Security
- Fixed multiple severe course related security issues #594, #653.


## [0.6.0] - 2018-03-31 - Introduces MediaManager and some minor changes
### Added
- MediaManager for file management in courses


## [0.5.0] - 2018-03-24 - WS 17/18 intermediate Release
### Added
- selective download of the course
- progress dashboard for teacher
- translateable frontend with i18n
- notification system added
- introduces new error message system
- dark theme option
- introducing an api documentation
- courses are ordered by last visit
- user password edit
- adds imprint


## [0.4.0] - 2017-12-04 - WS 17/18 Second feature release
### Added
- Responsivness improved
- leave course function
- delete course
- import/export course function
- free text mail to students
- dragging content between lectures
- consistent save and abort btns in units
- progress component
- duplication of lectures
- randomize tasks after validation


## [0.3.1] - 2017-11-05 - Dynamic db name update
### Added
- The possibility to use a other database name then 'test'


## [0.3.0] - 2017-11-02
### Added
- a lot of major bugfixes and optimizations


## [0.2.2] - 2017-10-19 - Security improvements
### Added 
- security for free courses


## [0.2.1] - 2017-10-03 - First Live-Ready release
### Added
- first live functionality


## [0.2.0] - 2017-06-29 - Almost production ready
### Added
- Many new feature for production


## [0.1.0] - 2017-05-11 - Basics implemented
### Added
- Many basic implementations of ground functionality
