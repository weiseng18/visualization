# visualization
visualization of sorting algorithms and etc. through javascript canvas animations



## commit messages

For organization, all commits will have the following format:

`[scope] description`

where `scope` will be one of the following items:

* `bug-fix` for bug fixes
* `menu` for adding of new menu items or buttons
* `feature` for general new features added/revised
* `feature prep` for changes made that prepare for the introduction of a feature
  * as such, such commits may create new, unresponsive areas, but these commits will not be pushed to master until the whole feature is complete
    * examples include adjustments in CSS properties / introduction of new HTML elements
  * another type would be addition to helper functions/modification of current functions in such a way that does not affect the end result, but allows more flexibility to incorporate future features
* `code` for
  * improvements in code efficiency
  * addition/revision of comments
  * changes in variable names
* `external` for commits that only add/link external libraries
* `css` for commits changing .css files
  * renaming of class names
  * creating classes to set CSS attributes of javascript-created elements
* `README` for updating this `README.md` file
* `init` for the very first commit which initializes the repository
* if necessary, or to condense very minor changes, `scope1 + scope2` can be used

The above list is not exhaustive and will be revised when necessary. This is to ensure that each commit tries to work on one item at a time, so that changes can be seen more clearly.

