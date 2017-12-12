// TODO move to shared folder
export const errorCodes = {
  mail: {
    duplicate: {
      code: 'duplicate mail',
      text: 'That email address is already in use'
    },
    noTeacher: {
      code: 'no teacher',
      text: 'You are not allowed to register as teacher'
    },
    notSend: {
      code: 'email not send',
      text: 'Could not send E-Mail'
    }
  },
  duplicateUid: {
    code: 'duplicate uid',
    text: 'That matriculation number is already in use'
  },
  course: {
    duplicateName: {
      code: 'duplicate course name',
      text: 'Course name already in use.'
    },
    notOnWhitelist: {
      code: 'notOnWhiteList',
      text: 'Not allowed to join, you are not on whitelist.'
    },
    accessKey: {
      code: 'incorrectAccessKey',
      text: 'Incorrect or missing access key'
    }
  },
  password: {
    regex: {
      code: '',
      text: 'Password must have at least 8 characters which contain one special character or digit',
      regex: '^(?=.*[a-zA-Z])(?=.*[$%&§=#!?*()|0-9]).{8,}$'
    }
  },
  upload: {
    type: {
      notCSV: {
        code: 'wrongTypeCSV',
        text: 'Wrong type allowed are just csv files.'
      }
    }
  },
  save:{
    couldNotSaveImprint:{
      code: 'coldNotSaveImprint',
      text: 'Could not save Imprint'
    }
  }
};
