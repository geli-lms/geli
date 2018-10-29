// TODO: It would be preferable to use a common file in the project-wide shared directory instead,
// but currently that won't work inside the back-end (i.e. api/*) due to its current build process.

export const allRoles = [
  'student',
  // Currently unused / disabled: 'tutor',
  'teacher',
  'admin',
];

export default {all: allRoles};
