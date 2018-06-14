# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

<!--
################################################################################
### PLEASE LINK THE ISSUES IF THERE IS ONE, OTHERWISE LINK THE PULL-REQUESTS ###
################################################################################
-->

## [NEXT]
###Added
- Added more EN/DE translation [#753](https://github.com/utetrapp/geli/issues/753)

### Added
- Added more EN/DE translation [#753](https://github.com/utetrapp/geli/issues/753)
- Use i18n for new course view [#763](https://github.com/utetrapp/geli/pull/763)
- Added service for FileIcon [#607](https://github.com/utetrapp/geli/issues/607)
 
### Changed
- rework existing translation
- add vars to html-files
- add translations to resource files
- include translation for components
- Migrate MatSnackBar to SnackBarService. [#724](https://github.com/h-da/geli/pull/724)
- Reload user list after deleting an account. [#724](https://github.com/h-da/geli/pull/724)
- Validate form before submit when creating a new course. [#724](https://github.com/h-da/geli/pull/724)
- Validate :id for CourseController details route. [#724](https://github.com/h-da/geli/pull/724)
- Added search function for available courses. [#723](https://github.com/h-da/geli/issues/723)
- Another MatSnackBar to SnackBarService migration. [#730](https://github.com/h-da/geli/pull/730)
- `getNotificationSettings` does not create new notification settings. [#731](https://github.com/h-da/geli/issues/731)
- Remove `isCourseTeacherOrAdmin` and `isMemberOfCourse`from UserService. [#731](https://github.com/h-da/geli/issues/731)
- Refactored save mechanism of unit edit form. [#532](https://github.com/h-da/geli/issues/532)
- Moved the 'create course' into a Dialog. [#725](https://github.com/h-da/geli/issues/725)
- Use Path-Lib to extract extension from filename. [#773](https://github.com/utetrapp/geli/pull/773)
- Add the possibility to add files directly in the file unit [#728](https://github.com/utetrapp/geli/issues/728)

### Fixed
- Fixed broken notification settings. [#731](https://github.com/h-da/geli/issues/731)
- Fixed broken Apidoc [#737](https://github.com/h-da/geli/issues/737)
- Disabled `tutor` role. [#710](https://github.com/h-da/geli/issues/710)
- Fixed notifications on hidden units. [#733](https://github.com/utetrapp/geli/issues/733)
- Validate user input for notication settings api. [#771](https://github.com/utetrapp/geli/issues/771)
- Identification only via matriculation number. [#685](https://github.com/utetrapp/geli/issues/685)

## [[0.7.0](https://github.com/h-da/geli/releases/tag/v0.7.0)] - 2018-05-05 - SS 18 intermediate Release
### Added
- Added a Dedicated Filefiew and restyled the Course section. [#599] (https://github.com/h-da/geli/issues/599)
- Added the possibility to sort all courses alphabetically. [#567](https://github.com/h-da/geli/issues/567)
- Added a box for information on the homescreen. [#216](https://github.com/h-da/geli/issues/216)
- Added an account activation resend feature. [#601](https://github.com/h-da/geli/issues/601)
- Added `SnackBarService` as wrapper for `MatSnackBar`. [#574](https://github.com/h-da/geli/issues/574)
- Added new course & user API unit tests. [#654](https://github.com/h-da/geli/issues/654) [#691](https://github.com/h-da/geli/issues/691)
- Added details of courseAdmin and teacher to course detail view. on click profiles are shown.[#598](https://github.com/h-da/geli/issues/598)
- Added small auto linting scripts to package.json [#688](https://github.com/h-da/geli/issues/688)
- Added changed size of drop down arrows for better usability. [#686](https://github.com/h-da/geli/issues/686)
- Added new contributors [#624](https://github.com/h-da/geli/issues/624)
- Added the date and the teacher under each unit [#582](https://github.com/h-da/geli/issues/582)
- Added E-Mail validation to reset password [#597](https://github.com/h-da/geli/issues/597)
- Added Language code to header [#554](https://github.com/h-da/geli/issues/554)
- Added icon for access key [#547](https://github.com/h-da/geli/issues/574)
- Unit visibility toggle [#582](https://github.com/h-da/geli/issues/582)
- Add bootstrap grid system [#613](https://github.com/h-da/geli/issues/613)
- Added changeable picture to course [#702](https://github.com/utetrapp/geli/issues/702)
- Added a responsive image service [#546](https://github.com/utetrapp/geli/issues/546)

### Changed
- Refactored or slightly altered various course & user related APIs. [#654](https://github.com/h-da/geli/issues/654) [#691](https://github.com/h-da/geli/issues/691)
- Removed firstname from resend activation feature and change button positioning. [#711](https://github.com/h-da/geli/issues/711)
- Refactored register and resend activation to use geli email validator with top level domain check. [#713](https://github.com/h-da/geli/issues/713)
- Refactored the unitCreator with a forsafe user object. [#717](https://github.com/h-da/geli/pull/717)
- Changed the text in download course[#718](https://github.com/h-da/geli/pull/718)
- Removed firstname from resend activation feature and change button positioning. [#711](https://github.com/h-da/geli/issues/711)
- Refactored register and resend activation to use geli email validator with top level domain check. [#713](https://github.com/h-da/geli/issues/713)
- Refactored the uploadform [#693] (https://github.com/h-da/geli/issues/693)

### Fixed
- Fixed route `/users/roles` [#204](https://github.com/h-da/geli/issues/204)
- Fixed profile picture will be deleted after changing any other profile data [#504](https://github.com/h-da/geli/issues/504)
- Fixed some UI issues in create code kata unit [#543](https://github.com/h-da/geli/issues/543)
- Fixed reading wrong error message across the whole application [#572](https://github.com/h-da/geli/issues/572)
- Fixed admin can changed his own role [#606](https://github.com/h-da/geli/issues/606)
- Fixed a typo in admin panel [#533](https://github.com/h-da/geli/issues/533)
- Fixed an admin cannot delete any courses [#647](https://github.com/h-da/geli/issues/647)
- Fixed some issues with download a course [#659](https://github.com/h-da/geli/issues/659)
- Fixed an issue with deleting a course and the notification was not triggered [#642](https://github.com/h-da/geli/issues/543)
- Fixed Course progress mechanism [#593](https://github.com/h-da/geli/issues/593)
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
- Fixed `.travis.yml`. [#706](https://github.com/h-da/geli/pull/706)
- Fixed wording of progress display on profile page. [#715](https://github.com/h-da/geli/issues/715)
- Fixed form validator in create task [#579](https://github.com/h-da/geli/issues/579)
- Fixed Mongoose pre hook usage [#680](https://github.com/h-da/geli/issues/680) [#677](https://github.com/h-da/geli/issues/677)

### Security
- Fixed numerous severe user related security issues. [#691](https://github.com/h-da/geli/issues/691) [#709](https://github.com/h-da/geli/pull/709)
- Fixed multiple severe course related security issues. [#594](https://github.com/h-da/geli/issues/594) [#653](https://github.com/h-da/geli/issues/653) [#691](https://github.com/h-da/geli/issues/691)
- Updated the dependencies for security. [#661](https://github.com/h-da/geli/issues/661)

## [[0.6.0](https://github.com/h-da/geli/releases/tag/v0.6.0)] - 2018-03-31 - Introduces MediaManager and some minor changes
### Added
- MediaManager for file management in courses


## [[0.5.0](https://github.com/h-da/geli/releases/tag/v0.5.0)] - 2018-03-24 - WS 17/18 intermediate Release
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


## [[0.4.0](https://github.com/h-da/geli/releases/tag/v0.4.0)] - 2017-12-04 - WS 17/18 Second feature release
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


## [[0.3.1](https://github.com/h-da/geli/releases/tag/v0.3.1)] - 2017-11-05 - Dynamic db name update
### Added
- The possibility to use a other database name then 'test'


## [[0.3.0](https://github.com/h-da/geli/releases/tag/v0.3.0)] - 2017-11-02
### Added
- a lot of major bugfixes and optimizations


## [[0.2.2](https://github.com/h-da/geli/releases/tag/v0.2.2)] - 2017-10-19 - Security improvements
### Added 
- security for free courses


## [[0.2.1](https://github.com/h-da/geli/releases/tag/v0.2.1)] - 2017-10-03 - First Live-Ready release
### Added
- first live functionality


## [[0.2.0](https://github.com/h-da/geli/releases/tag/v0.2.0)] - 2017-06-29 - Almost production ready
### Added
- Many new feature for production


## [[0.1.0](https://github.com/h-da/geli/releases/tag/v0.1.0)] - 2017-05-11 - Basics implemented
### Added
- Many basic implementations of ground functionality
