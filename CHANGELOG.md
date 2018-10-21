# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

<!--
################################################################################
### PLEASE LINK THE ISSUES IF THERE IS ONE, OTHERWISE LINK THE PULL-REQUESTS ###
################################################################################
-->

## [Unreleased]
### Added
- Cookie information banner. [#565](https://github.com/geli-lms/geli/pull/565)
- Course progress can now be exported as a CSV-file. [#766](https://github.com/geli-lms/geli/pull/766)
- More EN/DE translations. [#753](https://github.com/geli-lms/geli/issues/753)
- Use i18n for new course view. [#763](https://github.com/geli-lms/geli/pull/763)
- `FileIconService`. [#607](https://github.com/geli-lms/geli/issues/607)
- Legal notice and privacy declaration. [#768](https://github.com/geli-lms/geli/issues/768)
- More `NotificationController` tests. [#772](https://github.com/geli-lms/geli/pull/772)
- Anonymous forum. [#46](https://github.com/geli-lms/geli/issues/46) [#857](https://github.com/geli-lms/geli/issues/857)
- Unit-specific comments. [#761](https://github.com/geli-lms/geli/issues/761)
- Simple E2E test for login. [#795](https://github.com/geli-lms/geli/pull/795)
- Checkboxes for accepting our terms of use and privacy declarations while registering. [#778](https://github.com/geli-lms/geli/issues/778)
- PDF course content download functionality. [#720](https://github.com/geli-lms/geli/pull/720)
- User data deletion functionality for EU-GDPR compliance. [#775](https://github.com/geli-lms/geli/issues/775)
- Personal data export functionality for EU-GDPR compliance. [#805](https://github.com/geli-lms/geli/issues/805)
- Guided dialog for adding a whitelist. [#727](https://github.com/geli-lms/geli/issues/727) [#509](https://github.com/geli-lms/geli/issues/509)
- `JwtPipe` to easily append `'mediaToken'`s to file URLs. [#729](https://github.com/geli-lms/geli/issues/729)
- `FileComponent` to flexibly display a single file e.g. in a new tab. [#729](https://github.com/geli-lms/geli/issues/729)
- More `DownloadController` unit tests, including a new `DeleteCache` `admin`-only API. [#729](https://github.com/geli-lms/geli/issues/729)
- `'Misc.'` front-end admin sub-component with cache-clearing control re. the `DeleteCache` API. [#729](https://github.com/geli-lms/geli/issues/729)
- E2E test for invalid email & password input. [#825](https://github.com/geli-lms/geli/pull/825)
- Search function for available courses. [#723](https://github.com/geli-lms/geli/issues/723)
- Form validation before submit when creating a new course. [#724](https://github.com/geli-lms/geli/pull/724)
- ID validation of the `CourseController` `/api/courses/:id` route. [#724](https://github.com/geli-lms/geli/pull/724)
- Possibility to add files directly in the file unit. [#728](https://github.com/geli-lms/geli/issues/728)
- Execute npm rebuild in docker. [#855](https://github.com/geli-lms/geli/pull/855)
- Sentry reporting for missing translations. [#858](https://github.com/geli-lms/geli/issues/858)
- Migration for `visible` field. [#890](https://github.com/geli-lms/geli/pull/890)

### Changed
- Minor fixes and adaptations and merge-failure fixes. [#785](https://github.com/geli-lms/geli/issues/785)
- Reworked existing translations. [#753](https://github.com/geli-lms/geli/issues/753)
- Migrate `MatSnackBar` to `SnackBarService`. [#724](https://github.com/geli-lms/geli/pull/724) [#730](https://github.com/geli-lms/geli/pull/730)
- Reload user list after deleting an account. [#724](https://github.com/geli-lms/geli/pull/724)
- `getNotificationSettings` does not create new notification settings. [#731](https://github.com/geli-lms/geli/issues/731)
- Refactored save mechanism of unit edit form. [#532](https://github.com/geli-lms/geli/issues/532)
- Moved the 'create course' button into a `MatDialog`. [#725](https://github.com/geli-lms/geli/issues/725)
- Update `bcrypt` dependency. [#774](https://github.com/geli-lms/geli/pull/774)
- Use `path`-module to extract extensions from filenames. [#773](https://github.com/geli-lms/geli/pull/773)
- Update validator dependency. [#791](https://github.com/geli-lms/geli/pull/791)
- Appended `'mediaToken'` to various file URLs via `JwtPipe`. [#729](https://github.com/geli-lms/geli/issues/729)
- Moved all URL etc. from `utetrapp/geli` and `h-da/geli` to current repo `geli-lms/geli`. [#849](https://github.com/geli-lms/geli/pull/849)
- Adjusted `nginx` config in web-frontend for `ws-chat`. [#839](https://github.com/geli-lms/geli/issues/839)
- Update insecure dependencies. [#816](https://github.com/geli-lms/geli/issues/816)
- Updated frontend to `Angular 6`. [#716](https://github.com/geli-lms/geli/pull/766)
- Update `Node.js` version to `10.8.0`. [#821](https://github.com/geli-lms/geli/pull/821)
- Update `README.md` with latest information. [#845](https://github.com/geli-lms/geli/pull/845)
- Exit build when no change to `CHANGELOG.md`. [#880](https://github.com/geli-lms/geli/pull/880)

### Removed
- `isCourseTeacherOrAdmin` and `isMemberOfCourse` from `UserService`. [#731](https://github.com/geli-lms/geli/issues/731)
- `fs-extra` dependency. [#780](https://github.com/geli-lms/geli/pull/780)
- `winston` dependency. [#806](https://github.com/geli-lms/geli/pull/806)

### Fixed
- Unit export. [#42](https://github.com/geli-lms/geli/issues/42)
- Notification settings. [#731](https://github.com/geli-lms/geli/issues/731)
- API-doc. [#737](https://github.com/geli-lms/geli/issues/737)
- `tutor` role is now disabled. [#710](https://github.com/geli-lms/geli/issues/710)
- Notifications on hidden units. [#733](https://github.com/geli-lms/geli/issues/733)
- User input validation for notication settings API. [#771](https://github.com/geli-lms/geli/issues/771)
- Identification only via matriculation number. [#685](https://github.com/geli-lms/geli/issues/685)
- Typo in `UserProfileDialog` component. [#782](https://github.com/geli-lms/geli/pull/782)
- Missing capitalization typo for `common.users` EN-translation. [#729](https://github.com/geli-lms/geli/issues/729)
- Broken badge links after repository migration. [#783](https://github.com/geli-lms/geli/pull/783) [#892](https://github.com/geli-lms/geli/pull/892)
- Invalid response for dependency. [#787](https://github.com/geli-lms/geli/pull/787)
- Travis usages after `Angular 6` update. [#789](https://github.com/geli-lms/geli/pull/789)
- Build with source maps. [#797](https://github.com/geli-lms/geli/pull/797)
- Missing import for `RxJS` operators. [#808](https://github.com/geli-lms/geli/issues/808)
- Wrong image URL in profile export. [#811](https://github.com/geli-lms/geli/issues/811)
- `picture.path` backslash issue / regression. [#729](https://github.com/geli-lms/geli/issues/729)
- Remaining hard-coded `'upload'` strings in the API, now replaced with `config.uploadFolder`. [#729](https://github.com/geli-lms/geli/issues/729)
- Missing `@UseBefore` middleware in `MediaController`. [#729](https://github.com/geli-lms/geli/issues/729)
- Make E2E login test more stable. [#823](https://github.com/geli-lms/geli/pull/823) [#824](https://github.com/geli-lms/geli/pull/824)
- `sentry.sh` build warning regarding invalid `-eq` usage. [#830](https://github.com/geli-lms/geli/pull/830) [#832](https://github.com/geli-lms/geli/pull/832)
- PDF download fix if text is empty + added path to local `PhantomJS`. [#833](https://github.com/geli-lms/geli/issues/833)
- Wrong reset password translation. [#836](https://github.com/geli-lms/geli/issues/836)
- Various flawed code kata translations. [#886](https://github.com/geli-lms/geli/issues/886)
- Fix migrations for adding chatrooms to course and unit. [#888](https://github.com/geli-lms/geli/issues/888)
- Fix maxium width of main content area [#893](https://github.com/geli-lms/geli/issues/893)
- `AuthController` `addWhitelistedUserToCourses` broken condition & typos. [#895](https://github.com/geli-lms/geli/issues/895)
- `ChatRoomController` internal data leak. [#897](https://github.com/geli-lms/geli/issues/897)

### Security
- Secured the static `'uploads'` route by introducing a special `'mediaToken'` with new JWT strategy & middleware. [#729](https://github.com/geli-lms/geli/issues/729)
- Secured `DownloadController` → `getArchivedFile` → `id` input usage. [#729](https://github.com/geli-lms/geli/issues/729)
- _(Scrapped experiment of a `@Controller`-based replacement for the static `'uploads'` route: `UploadsController`. [#729](https://github.com/geli-lms/geli/issues/729))_

## [[0.7.0](https://github.com/geli-lms/geli/releases/tag/v0.7.0)] - 2018-05-05 - SS 18 intermediate Release
### Added
- Added a dedicated `FileViewComponent` and restyled the course section. [#599](https://github.com/geli-lms/geli/issues/599)
- Added the possibility to sort all courses alphabetically. [#567](https://github.com/geli-lms/geli/issues/567)
- Added a box for information on the homescreen. [#216](https://github.com/geli-lms/geli/issues/216)
- Added an account activation resend feature. [#601](https://github.com/geli-lms/geli/issues/601)
- Added `SnackBarService` as wrapper for `MatSnackBar`. [#574](https://github.com/geli-lms/geli/issues/574)
- Added new course & user API unit tests. [#654](https://github.com/geli-lms/geli/issues/654) [#691](https://github.com/geli-lms/geli/issues/691)
- Added details of courseAdmin and teacher to course detail view. on click profiles are shown.[#598](https://github.com/geli-lms/geli/issues/598)
- Added small auto linting scripts to package.json [#688](https://github.com/geli-lms/geli/issues/688)
- Added changed size of drop down arrows for better usability. [#686](https://github.com/geli-lms/geli/issues/686)
- Added new contributors [#624](https://github.com/geli-lms/geli/issues/624)
- Added the date and the teacher under each unit [#582](https://github.com/geli-lms/geli/issues/582)
- Added E-Mail validation to reset password [#597](https://github.com/geli-lms/geli/issues/597)
- Added Language code to header [#554](https://github.com/geli-lms/geli/issues/554)
- Added icon for access key [#547](https://github.com/geli-lms/geli/issues/574)
- Unit visibility toggle [#582](https://github.com/geli-lms/geli/issues/582)
- Add bootstrap grid system [#613](https://github.com/geli-lms/geli/issues/613)
- Added changeable picture to course [#702](https://github.com/geli-lms/geli/issues/702)
- Added a responsive image service [#546](https://github.com/geli-lms/geli/issues/546)

### Changed
- Refactored or slightly altered various course & user related APIs. [#654](https://github.com/geli-lms/geli/issues/654) [#691](https://github.com/geli-lms/geli/issues/691)
- Removed firstname from resend activation feature and changed button positioning. [#711](https://github.com/geli-lms/geli/issues/711)
- Refactored register and resend activation to use geli email validator with top level domain check. [#713](https://github.com/geli-lms/geli/issues/713)
- Refactored the unitCreator with a forsafe user object. [#717](https://github.com/geli-lms/geli/pull/717)
- Changed the text in download course[#718](https://github.com/geli-lms/geli/pull/718)
- Refactored register and resend activation to use geli email validator with top level domain check. [#713](https://github.com/geli-lms/geli/issues/713)
- Refactored the uploadform [#693](https://github.com/geli-lms/geli/issues/693)

### Fixed
- Fixed route `/users/roles` [#204](https://github.com/geli-lms/geli/issues/204)
- Fixed profile picture will be deleted after changing any other profile data [#504](https://github.com/geli-lms/geli/issues/504)
- Fixed some UI issues in create code kata unit [#543](https://github.com/geli-lms/geli/issues/543)
- Fixed reading wrong error message across the whole application [#572](https://github.com/geli-lms/geli/issues/572)
- Fixed admin can changed his own role [#606](https://github.com/geli-lms/geli/issues/606)
- Fixed a typo in admin panel [#533](https://github.com/geli-lms/geli/issues/533)
- Fixed an admin cannot delete any courses [#647](https://github.com/geli-lms/geli/issues/647)
- Fixed some issues with download a course [#659](https://github.com/geli-lms/geli/issues/659)
- Fixed an issue with deleting a course and the notification was not triggered [#642](https://github.com/geli-lms/geli/issues/543)
- Fixed Course progress mechanism [#593](https://github.com/geli-lms/geli/issues/593)
- Fixed wasteful course data usage via specialized course model interfaces. [#654](https://github.com/geli-lms/geli/issues/654)
- Fixed a broken documentation link. [#583](https://github.com/geli-lms/geli/issues/583)
- Limited the first and last name to 64 characters in the registration- and edit page. [#585](https://github.com/geli-lms/geli/issues/585)
- Added a correct email validator to the `user-edit` and `register` components. [#564](https://github.com/geli-lms/geli/issues/564)
- Upload of profile pictures now prevents files with forbidden extensions. [#581](https://github.com/geli-lms/geli/issues/581)
- Fixed empty course downloads. [#659](https://github.com/geli-lms/geli/issues/659)
- Videos in the course now get sized equally and can't grow too big in mobile views. [#534](https://github.com/geli-lms/geli/issues/534)
- Fixed missing background on the password reset page. [#673](https://github.com/geli-lms/geli/issues/673)
- Fixed notification icon spacing in the navbar for students. [#696](https://github.com/geli-lms/geli/issues/696)
- Repair Angular CLI code generation. [#701](https://github.com/geli-lms/geli/pull/701)
- Fixed `tsconfig.spec.ts` for `ng test`. [#656](https://github.com/geli-lms/geli/pull/656)
- Fixed `.travis.yml`. [#706](https://github.com/geli-lms/geli/pull/706)
- Fixed wording of progress display on profile page. [#715](https://github.com/geli-lms/geli/issues/715)
- Fixed form validator in create task [#579](https://github.com/geli-lms/geli/issues/579)
- Fixed Mongoose pre hook usage [#680](https://github.com/geli-lms/geli/issues/680) [#677](https://github.com/geli-lms/geli/issues/677)
- Fixed broken code kata validation. [#834](https://github.com/geli-lms/geli/issues/834)

### Security
- Fixed numerous severe user related security issues. [#691](https://github.com/geli-lms/geli/issues/691) [#709](https://github.com/geli-lms/geli/pull/709)
- Fixed multiple severe course related security issues. [#594](https://github.com/geli-lms/geli/issues/594) [#653](https://github.com/geli-lms/geli/issues/653) [#691](https://github.com/geli-lms/geli/issues/691)
- Updated the dependencies for security. [#661](https://github.com/geli-lms/geli/issues/661)

## [[0.6.0](https://github.com/geli-lms/geli/releases/tag/v0.6.0)] - 2018-03-31 - Introduces MediaManager and some minor changes
### Added
- MediaManager for file management in courses


## [[0.5.0](https://github.com/geli-lms/geli/releases/tag/v0.5.0)] - 2018-03-24 - WS 17/18 intermediate Release
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


## [[0.4.0](https://github.com/geli-lms/geli/releases/tag/v0.4.0)] - 2017-12-04 - WS 17/18 Second feature release
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


## [[0.3.1](https://github.com/geli-lms/geli/releases/tag/v0.3.1)] - 2017-11-05 - Dynamic db name update
### Added
- The possibility to use a other database name then 'test'


## [[0.3.0](https://github.com/geli-lms/geli/releases/tag/v0.3.0)] - 2017-11-02
### Added
- a lot of major bugfixes and optimizations


## [[0.2.2](https://github.com/geli-lms/geli/releases/tag/v0.2.2)] - 2017-10-19 - Security improvements
### Added 
- security for free courses


## [[0.2.1](https://github.com/geli-lms/geli/releases/tag/v0.2.1)] - 2017-10-03 - First Live-Ready release
### Added
- first live functionality


## [[0.2.0](https://github.com/geli-lms/geli/releases/tag/v0.2.0)] - 2017-06-29 - Almost production ready
### Added
- Many new feature for production


## [[0.1.0](https://github.com/geli-lms/geli/releases/tag/v0.1.0)] - 2017-05-11 - Basics implemented
### Added
- Many basic implementations of ground functionality
