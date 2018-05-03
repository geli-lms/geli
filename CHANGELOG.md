# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## [NEXT] 
### Added
- Added the possibility to sort all courses alphabetically. [#567](https://github.com/h-da/geli/issues/567)
- Added a box for information on the homescreen. [#216](https://github.com/h-da/geli/issues/216)
- Added an account activation resend feature. [#601](https://github.com/h-da/geli/issues/601)
- Added `SnackBarService` as wrapper for `MatSnackBar`. [#574](https://github.com/h-da/geli/issues/574)
- Added new course & user API unit tests. [#654](https://github.com/h-da/geli/issues/654) [#691](https://github.com/h-da/geli/issues/691)
- Added details of courseAdmin and teacher to course detail view. on click profiles are shown.[#598] (https://github.com/h-da/geli/issues/598)
- Added changed size of drop down arrows for better usability. [#686] (https://github.com/h-da/geli/issues/686)

### Changed
- Refactored or slightly altered various course & user related APIs. [#654](https://github.com/h-da/geli/issues/654) [#691](https://github.com/h-da/geli/issues/691)

### Fixed
- Fixed wasteful course data usage via specialized course model interfaces. [#654](https://github.com/h-da/geli/issues/654)
- Fixed a broken documentation link. [#583](https://github.com/h-da/geli/issues/583)
- Limited the first and last name to 64 characters in the registration- and edit page. [#585](https://github.com/h-da/geli/issues/585)
- Added a correct email validator to the `user-edit` and `register` components. [#564](https://github.com/h-da/geli/issues/564)
- Upload of profile pictures now prevents files with forbidden extensions. [#581](https://github.com/h-da/geli/issues/581)
- Fixed empty course downloads. [#659](https://github.com/h-da/geli/issues/659)
- Videos in the course now get sized equally and can't grow too big in mobile views. [#534](https://github.com/h-da/geli/issues/534)
- Fixed missing background on the password reset page. [#673](https://github.com/h-da/geli/issues/673)
- Fixed notification icon spacing in the navbar for students. [#696](https://github.com/h-da/geli/issues/696)
- Repair Angular CLI code generation. [#701](https://github.com/h-da/geli/pull/701)
- Fixed `tsconfig.spec.ts` for `ng test`. [#656](https://github.com/h-da/geli/pull/656)

### Security
- Fixed numerous severe user related security issues. [#691](https://github.com/h-da/geli/issues/691)
- Fixed multiple severe course related security issues. [#594](https://github.com/h-da/geli/issues/594) [#653](https://github.com/h-da/geli/issues/653) [#691](https://github.com/h-da/geli/issues/691)
- Updated the dependencies for security. [#661](https://github.com/h-da/geli/issues/661)

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
