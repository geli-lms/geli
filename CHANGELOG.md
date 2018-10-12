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
### Updates
- Update insecure dependencies [#816](https://github.com/geli/issues/816)
- Updated Frontend to angular6 [#716](https://github.com/utetrapp/geli/pull/766)
- update node version to 10.8.0 [#821](https://github.com/utetrapp/geli/pull/821)

### Added
- Add cookie information [#565]
- Course Progress can now be extracted into a csv-file. [#766](https://github.com/utetrapp/geli/pull/766)
- Added more EN/DE translation [#753](https://github.com/utetrapp/geli/issues/753)
- Use i18n for new course view [#763](https://github.com/utetrapp/geli/pull/763)
- Added service for FileIcon [#607](https://github.com/utetrapp/geli/issues/607)
- Added legal notice and privacy declaration [#768](https://github.com/utetrapp/geli/issues/768)
- Add more tests notification ctrl [#772](https://github.com/utetrapp/geli/pull/772)
- Added more EN/DE translation [#753](https://github.com/utetrapp/geli/issues/753)
- Add anonymous forum [#46](https://github.com/utetrapp/geli/issues/46)
- Add unit-specific comments [#761](https://github.com/utetrapp/geli/issues/761)
- Simple e2e test for login [#795](https://github.com/utetrapp/geli/pull/795)
- Added checkboxes for accepting our terms of use and privacy declarations whil registering [#778](https://github.com/utetrapp/geli/issues/778)
- Quickfixed the Import/Export [#42](https://github.com/utetrapp/geli/issues/42)
- Added PDF download of Coursecontent [#720](https://github.com/utetrapp/geli/pull/720)
- Export personal data for gdpr [#805](https://github.com/utetrapp/geli/issues/805)
- Add a guided dialog for adding a whitelist [#727](https://github.com/utetrapp/geli/issues/727) [#509](https://github.com/utetrapp/geli/issues/509)
- Added a `JwtPipe` to easily append `'mediaToken'`s to file URLs. [#729](https://github.com/utetrapp/geli/issues/729)
- Added a `FileComponent` to flexibly display a single file e.g. in a new tab. [#729](https://github.com/utetrapp/geli/issues/729)
- Added more `DownloadController` unit tests, including a new `DeleteCache` `admin`-only API. [#729](https://github.com/utetrapp/geli/issues/729)
- Added `'Misc.'` front-end admin sub-component with cache-clearing control re. the `DeleteCache` API. [#729](https://github.com/utetrapp/geli/issues/729)
- Added dsgvo delete user data [#775](https://github.com/utetrapp/geli/issues/775)
- Add Test if error when invalid user/pass [#825](https://github.com/utetrapp/geli/pull/825)

### Changed
- Minor Fixes and Adaptations and Mergefailure fixes. [#785] (https://github.com/utetrapp/geli/issues/785)
- rework existing translation
- add vars to html-files
- add translations to resource files
- include translation for components
- Migrate MatSnackBar to SnackBarService. [#724](https://github.com/utetrapp/geli/pull/724)
- Reload user list after deleting an account. [#724](https://github.com/utetrapp/geli/pull/724)
- Validate form before submit when creating a new course. [#724](https://github.com/utetrapp/geli/pull/724)
- Validate :id for CourseController details route. [#724](https://github.com/utetrapp/geli/pull/724)
- Added search function for available courses. [#723](https://github.com/utetrapp/geli/issues/723)
- Another MatSnackBar to SnackBarService migration. [#730](https://github.com/utetrapp/geli/pull/730)
- `getNotificationSettings` does not create new notification settings. [#731](https://github.com/utetrapp/geli/issues/731)
- Remove `isCourseTeacherOrAdmin` and `isMemberOfCourse`from UserService. [#731](https://github.com/utetrapp/geli/issues/731)
- Refactored save mechanism of unit edit form. [#532](https://github.com/utetrapp/geli/issues/532)
- Moved the 'create course' into a Dialog. [#725](https://github.com/utetrapp/geli/issues/725)
- Update bcrypt dependency. [#774](https://github.com/utetrapp/geli/pull/774)
- Remove fs-extra dependency. [#780](https://github.com/utetrapp/geli/pull/780)
- Use Path-Lib to extract extension from filename. [#773](https://github.com/utetrapp/geli/pull/773)
- Add the possibility to add files directly in the file unit [#728](https://github.com/utetrapp/geli/issues/728)
- Update validator dependency. [#791](https://github.com/utetrapp/geli/pull/791)
- Appended `'mediaToken'` to various file URLs via `JwtPipe`. [#729](https://github.com/utetrapp/geli/issues/729)
- Remove winston dependency. [#806](https://github.com/utetrapp/geli/pull/806)

### Fixed
- Fixed broken notification settings. [#731](https://github.com/utetrapp/geli/issues/731)
- Fixed broken Apidoc [#737](https://github.com/utetrapp/geli/issues/737)
- Disabled `tutor` role. [#710](https://github.com/utetrapp/geli/issues/710)
- Fixed notifications on hidden units. [#733](https://github.com/utetrapp/geli/issues/733)
- Validate user input for notication settings api. [#771](https://github.com/utetrapp/geli/issues/771)
- Identification only via matriculation number. [#685](https://github.com/utetrapp/geli/issues/685)
- Fixed Typo in User-Profile-Dialog. [#782](https://github.com/utetrapp/geli/pull/782)
- Fixed missing capitalization typo for `common.users` EN-translation. [#729](https://github.com/utetrapp/geli/issues/729)
- Fixed broken badge links after repository migration. [#783](https://github.com/utetrapp/geli/pull/783)
- Fix invalid response for dependency [#787](https://github.com/utetrapp/geli/pull/787)
- Fixed travis usages after angular 6 update [#789](https://github.com/utetrapp/geli/pull/789)
- Build with source-maps [#797](https://github.com/utetrapp/geli/pull/797)
- Add missing import for rxjs operators [#808](https://github.com/utetrapp/geli/issues/808)
- Fixed wrong Image URL in profile export [#811](https://github.com/utetrapp/geli/issues/811)
- Fixed `picture.path` backslash issue / regression. [#729](https://github.com/utetrapp/geli/issues/729)
- Replaced hard-coded `'upload'` strings in the API with `config.uploadFolder`. [#729](https://github.com/utetrapp/geli/issues/729)
- Fixed missing `@UseBefore` middleware in `MediaController`. [#729](https://github.com/utetrapp/geli/issues/729)
- Make e2e login test more stable. [#823](https://github.com/utetrapp/geli/pull/823) & [#824](https://github.com/utetrapp/geli/pull/824)
- Remove warning from build (sentry.sh). [#830](https://github.com/utetrapp/geli/pull/830)
- Fix broken condition (sentry.sh). [#832](https://github.com/utetrapp/geli/pull/832)
- PDF Download Fix if text is empty + added path to local phantomJS. [#833](https://github.com/geli-lms/geli/issues/833)

### Security
- Secured the static `'uploads'` route by introducing a special `'mediaToken'` with new JWT strategy & middleware. [#729](https://github.com/utetrapp/geli/issues/729)
- Secured `DownloadController` → `getArchivedFile` → `id` input usage. [#729](https://github.com/utetrapp/geli/issues/729)
- (Scrapped experiment of a `@Controller`-based replacement for the static `'uploads'` route: `UploadsController`. [#729](https://github.com/utetrapp/geli/issues/729))

## [[0.7.0](https://github.com/utetrapp/geli/releases/tag/v0.7.0)] - 2018-05-05 - SS 18 intermediate Release
### Added
- Added a Dedicated Filefiew and restyled the Course section. [#599] (https://github.com/utetrapp/geli/issues/599)
- Added the possibility to sort all courses alphabetically. [#567](https://github.com/utetrapp/geli/issues/567)
- Added a box for information on the homescreen. [#216](https://github.com/utetrapp/geli/issues/216)
- Added an account activation resend feature. [#601](https://github.com/utetrapp/geli/issues/601)
- Added `SnackBarService` as wrapper for `MatSnackBar`. [#574](https://github.com/utetrapp/geli/issues/574)
- Added new course & user API unit tests. [#654](https://github.com/utetrapp/geli/issues/654) [#691](https://github.com/utetrapp/geli/issues/691)
- Added details of courseAdmin and teacher to course detail view. on click profiles are shown.[#598](https://github.com/utetrapp/geli/issues/598)
- Added small auto linting scripts to package.json [#688](https://github.com/utetrapp/geli/issues/688)
- Added changed size of drop down arrows for better usability. [#686](https://github.com/utetrapp/geli/issues/686)
- Added new contributors [#624](https://github.com/utetrapp/geli/issues/624)
- Added the date and the teacher under each unit [#582](https://github.com/utetrapp/geli/issues/582)
- Added E-Mail validation to reset password [#597](https://github.com/utetrapp/geli/issues/597)
- Added Language code to header [#554](https://github.com/utetrapp/geli/issues/554)
- Added icon for access key [#547](https://github.com/utetrapp/geli/issues/574)
- Unit visibility toggle [#582](https://github.com/utetrapp/geli/issues/582)
- Add bootstrap grid system [#613](https://github.com/utetrapp/geli/issues/613)
- Added changeable picture to course [#702](https://github.com/utetrapp/geli/issues/702)
- Added a responsive image service [#546](https://github.com/utetrapp/geli/issues/546)

### Changed
- Refactored or slightly altered various course & user related APIs. [#654](https://github.com/utetrapp/geli/issues/654) [#691](https://github.com/utetrapp/geli/issues/691)
- Removed firstname from resend activation feature and change button positioning. [#711](https://github.com/utetrapp/geli/issues/711)
- Refactored register and resend activation to use geli email validator with top level domain check. [#713](https://github.com/utetrapp/geli/issues/713)
- Refactored the unitCreator with a forsafe user object. [#717](https://github.com/utetrapp/geli/pull/717)
- Changed the text in download course[#718](https://github.com/utetrapp/geli/pull/718)
- Removed firstname from resend activation feature and change button positioning. [#711](https://github.com/utetrapp/geli/issues/711)
- Refactored register and resend activation to use geli email validator with top level domain check. [#713](https://github.com/utetrapp/geli/issues/713)
- Refactored the uploadform [#693] (https://github.com/utetrapp/geli/issues/693)

### Fixed
- Fixed route `/users/roles` [#204](https://github.com/utetrapp/geli/issues/204)
- Fixed profile picture will be deleted after changing any other profile data [#504](https://github.com/utetrapp/geli/issues/504)
- Fixed some UI issues in create code kata unit [#543](https://github.com/utetrapp/geli/issues/543)
- Fixed reading wrong error message across the whole application [#572](https://github.com/utetrapp/geli/issues/572)
- Fixed admin can changed his own role [#606](https://github.com/utetrapp/geli/issues/606)
- Fixed a typo in admin panel [#533](https://github.com/utetrapp/geli/issues/533)
- Fixed an admin cannot delete any courses [#647](https://github.com/utetrapp/geli/issues/647)
- Fixed some issues with download a course [#659](https://github.com/utetrapp/geli/issues/659)
- Fixed an issue with deleting a course and the notification was not triggered [#642](https://github.com/utetrapp/geli/issues/543)
- Fixed Course progress mechanism [#593](https://github.com/utetrapp/geli/issues/593)
- Fixed wasteful course data usage via specialized course model interfaces. [#654](https://github.com/utetrapp/geli/issues/654)
- Fixed a broken documentation link. [#583](https://github.com/utetrapp/geli/issues/583)
- Limited the first and last name to 64 characters in the registration- and edit page. [#585](https://github.com/utetrapp/geli/issues/585)
- Added a correct email validator to the `user-edit` and `register` components. [#564](https://github.com/utetrapp/geli/issues/564)
- Upload of profile pictures now prevents files with forbidden extensions. [#581](https://github.com/utetrapp/geli/issues/581)
- Fixed empty course downloads. [#659](https://github.com/utetrapp/geli/issues/659)
- Videos in the course now get sized equally and can't grow too big in mobile views. [#534](https://github.com/utetrapp/geli/issues/534)
- Fixed missing background on the password reset page. [#673](https://github.com/utetrapp/geli/issues/673)
- Fixed notification icon spacing in the navbar for students. [#696](https://github.com/utetrapp/geli/issues/696)
- Repair Angular CLI code generation. [#701](https://github.com/utetrapp/geli/pull/701)
- Fixed `tsconfig.spec.ts` for `ng test`. [#656](https://github.com/utetrapp/geli/pull/656)
- Fixed `.travis.yml`. [#706](https://github.com/utetrapp/geli/pull/706)
- Fixed wording of progress display on profile page. [#715](https://github.com/utetrapp/geli/issues/715)
- Fixed form validator in create task [#579](https://github.com/utetrapp/geli/issues/579)
- Fixed Mongoose pre hook usage [#680](https://github.com/utetrapp/geli/issues/680) [#677](https://github.com/utetrapp/geli/issues/677)

### Security
- Fixed numerous severe user related security issues. [#691](https://github.com/utetrapp/geli/issues/691) [#709](https://github.com/utetrapp/geli/pull/709)
- Fixed multiple severe course related security issues. [#594](https://github.com/utetrapp/geli/issues/594) [#653](https://github.com/utetrapp/geli/issues/653) [#691](https://github.com/utetrapp/geli/issues/691)
- Updated the dependencies for security. [#661](https://github.com/utetrapp/geli/issues/661)

## [[0.6.0](https://github.com/utetrapp/geli/releases/tag/v0.6.0)] - 2018-03-31 - Introduces MediaManager and some minor changes
### Added
- MediaManager for file management in courses


## [[0.5.0](https://github.com/utetrapp/geli/releases/tag/v0.5.0)] - 2018-03-24 - WS 17/18 intermediate Release
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


## [[0.4.0](https://github.com/utetrapp/geli/releases/tag/v0.4.0)] - 2017-12-04 - WS 17/18 Second feature release
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


## [[0.3.1](https://github.com/utetrapp/geli/releases/tag/v0.3.1)] - 2017-11-05 - Dynamic db name update
### Added
- The possibility to use a other database name then 'test'


## [[0.3.0](https://github.com/utetrapp/geli/releases/tag/v0.3.0)] - 2017-11-02
### Added
- a lot of major bugfixes and optimizations


## [[0.2.2](https://github.com/utetrapp/geli/releases/tag/v0.2.2)] - 2017-10-19 - Security improvements
### Added 
- security for free courses


## [[0.2.1](https://github.com/utetrapp/geli/releases/tag/v0.2.1)] - 2017-10-03 - First Live-Ready release
### Added
- first live functionality


## [[0.2.0](https://github.com/utetrapp/geli/releases/tag/v0.2.0)] - 2017-06-29 - Almost production ready
### Added
- Many new feature for production


## [[0.1.0](https://github.com/utetrapp/geli/releases/tag/v0.1.0)] - 2017-05-11 - Basics implemented
### Added
- Many basic implementations of ground functionality
