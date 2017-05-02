let bcrypt = require('bcrypt-nodejs');

exports.User = {
    user0: {
        email: "0@test.geli",
        password: generateHash("0"),
        profile: {
          firstName: "0",
          lastName: "0"
        },
        role: "admin"
    },
    user1: {
        email: "1@test.geli",
        password: generateHash("1"),
        profile: {
          firstName: "1",
          lastName: "1"
        },
        role: "teacher"
    },
    user2: {
        email: "2@test.geli",
        password: generateHash("2"),
        profile: {
          firstName: "2",
          lastName: "2"
        },
        role: "teacher"
    },
    user3: {
        email: "3@test.geli",
        password: generateHash("3"),
        profile: {
          firstName: "3",
          lastName: "3"
        },
        role: "tutor"
    },
    user4: {
        email: "4@test.geli",
        password: generateHash("4"),
        profile: {
          firstName: "4",
          lastName: "4"
        },
        role: "tutor"
    },
    user5: {
        email: "5@test.geli",
        password: generateHash("5"),
        profile: {
          firstName: "5",
          lastName: "5"
        },
        role: "tutor"
    },
    user6: {
        email: "6@test.geli",
        password: generateHash("6"),
        profile: {
          firstName: "6",
          lastName: "6"
        },
        role: "student"
    },
    user7: {
        email: "7@test.geli",
        password: generateHash("7"),
        profile: {
          firstName: "7",
          lastName: "7"
        },
        role: "student"
    },
    user8: {
        email: "8@test.geli",
        password: generateHash("8"),
        profile: {
          firstName: "8",
          lastName: "8"
        },
        role: "student"
    },
    user9: {
        email: "9@test.geli",
        password: generateHash("9"),
        profile: {
          firstName: "9",
          lastName: "9"
        },
        role: "student"
    }
};

function generateHash (password) {
    this.SALT_FACTOR = 5;
    bcrypt.genSalt(this.SALT_FACTOR, function (err, salt) {
        if (err) return "";

        bcrypt.hash(password, salt, null, function (err, hash) {
            if (err) return "";
            return hash;
        });
    });
};
