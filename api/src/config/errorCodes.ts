// TODO move to Sharedfolder
export const errorCodes = {
  mail: {
    duplicate : {
      code: 'duplicate mail',
      text: 'That email address is already in use'
    },
    noTeacher : {
      code: 'no teacher',
      text: 'You are not allowed to register as teacher'
    }
  },
  duplicateUid : {
    code: 'duplicate uid',
    text: 'That matriculation number is already in use'
  },
  course: {
    duplicateName: {
      code: 'duplicate course name',
      text: 'Course name already in use.'
    }
  },
  password: {
    regex: {
      code: '',
      text: 'Password must have at least 8 characters which contain one special character or digit',
      regex: '^(?=.*[a-zA-Z])(?=.*[$%&§=#!?*()|0-9]).{8,}$'
    }
  }
};
