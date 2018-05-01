// TODO move to shared folder
export const errorCodes = {
  mail: {
    duplicate: {
      code: 'duplicate mail',
      text: 'That email address is already in use'
    },
    noTeacher: {
      code: 'no teacher',
      text: 'You are not allowed to register as teacher',
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
  user: {
    invalidCurrentUserRole: {
      code: 'invalidCurrentUserRole',
      text: 'Invalid current user role.'
    },
    cantChangeOwnRole: {
      code: 'cantChangeOwnRole',
      text: 'You can\'t change your own role.'
    },
    emailAlreadyInUse: {
      code: 'emailAlreadyInUse',
      text: 'This email address is already in use.'
    },
    invalidOldUserRole: {
      code: 'invalidOldUserRole',
      text: 'Invalid old user role.'
    },
    invalidNewUserRole: {
      code: 'invalidNewUserRole',
      text: 'Invalid update role.'
    },
    cantChangeUserWithHigherRole: {
      code: 'cantChangeUserWithHigherRole',
      text: 'You don\'t have the authorization to change a user of this role.'
    },
    onlyAdminsCanChangeRoles: {
      code: 'onlyAdminsCanChangeRoles',
      text: 'Only users with admin privileges can change roles.'
    },
    onlyAdminsCanChangeUids: {
      code: 'onlyAdminsCanChangeUids',
      text: 'Only users with admin privileges can change uids.'
    },
    invalidPassword: {
      code: 'invalidPassword',
      text: 'Invalid current password!'
    }
  },
  whitelist: {
    duplicateWhitelistUser: {
      code: 'duplicate uid',
      text: 'That matriculation number is already in use for this course.'
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
  save: {
    couldNotSaveImprint: {
      code: 'coldNotSaveImprint',
      text: 'Could not save Imprint'
    }
  },
  query: {
    empty: {
      code: 'emptyQuery',
      text: 'Query was empty.'
    }
  }
};
