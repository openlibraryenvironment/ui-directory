# Change history for ui-directory

## [1.2.0](https://github.com/openlibraryenvironment/ui-directory/tree/v1.2.0) (IN PROGRESS)

* Hide "New" and "Add unit" buttons from Directory if user does not have `ui-directory.create` permission. Fixes PR-834.
* Support `ui-directory.edit-local` permission ("edit the local fields of directory entries"). The *Edit* button is shown for all records if the user has this permission, but on the edit page only the *Local information* tab is available when editing a non-managed record if the user does not also have either `ui-directory.edit-all` or `ui-directory.edit-local`. Fixes PR-835.

## [1.1.0](https://github.com/openlibraryenvironment/ui-directory/tree/v1.1.0) (2020-08-24)

* Initial release

## 0.1.0 (NEVER RELEASED)

* New app created with stripes-cli
