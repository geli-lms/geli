export const errorCodes = {
  chat: {
    roomNotFound: {
      code: 'chat room not found',
      text: 'Chat room was not found.',
    },
    parentNotFound: {
      code: 'parent not found',
      text: 'Message parent was not found',
    },
    badParent: {
      code: 'bad parent',
      text: 'Message parent isn\'t in the same room, invalidating the post',
    }
  },
  duplication: {
    targetNotFound: {
      code: 'Target notfound',
      text: 'The specified duplication target could not be found',
    }
  },
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
    },
    noOtherAdmins: {
      code: 'noOtherAdmins',
      text: 'There are no other users with admin privileges.'
    },
    cantDeleteOtherUsers: {
      code: 'cantDeleteOtherUsers',
      text: 'Users can only delete themself.'
    },
    userNotFound: {
      code: 'user not found',
      text: 'User was not found.',
    },
    retryAfter: {
      code: 'retry after',
      text: 'You can only resend the activation every 10 minutes. You can resend again in ',
    },
    userAlreadyActive: {
      code: 'user already active',
      text: 'User is already activated.'
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
  file: {
    forbiddenPath: {
      code: 'forbiddenPath',
      text: 'Access to requested path is forbidden.'
    },
    fileNotFound: {
      code: 'fileNotFound',
      text: 'Could not find requested file.'
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
    couldNotSaveLegalnotice: {
      code: 'coldNotSaveLegalnotice',
      text: 'Could not save legal notice'
    }
  },
  query: {
    empty: {
      code: 'emptyQuery',
      text: 'Query was empty.'
    }
  },
  notification: {
    missingCourseOfLecture: {
      code: 'missingCourseOfLecture',
      text: 'Course of given existing lecture is missing'
    },
    missingCourseOfUnit: {
      code: 'missingCourseOfUnit',
      text: 'Course of given existing unit is missing'
    },
    invalidTargetType: {
      code: 'invalidTargetType',
      text: 'targetType is invalid'
    },
    textOnlyWithoutText: {
      code: 'textOnlyWithoutText',
      text: 'Requested text-only notification creation without supplying any text'
    },
    targetUserNotFound: {
      code: 'targetUserNotFound',
      text: 'Target user not found'
    }
  },
  progress: {
    pastDeadline: {
      code: 'pastDeadline',
      text: 'Past deadline, no further update possible'
    }
  },
  unit: {
    postMissingLectureId: {
      code: 'postMissingLectureId',
      text: 'No lecture ID was submitted.'
    },
    postMissingUnit: {
      code: 'postMissingUnit',
      text: 'No unit was submitted.'
    },
    postMissingCourse: {
      code: 'postMissingCourse',
      text: 'Unit has no _course set'
    }
  }
};
