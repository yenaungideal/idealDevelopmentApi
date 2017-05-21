'use strict';
var bcrypt = require('bcrypt-nodejs');
var Regex = require("regex");
var SALT_WORK_FACTOR = 10;

exports.getEncryptionPassword = function (option, resultData) {
    var password = option.password;

    // generate a salt
    bcrypt.genSalt(SALT_WORK_FACTOR, function (err, salt) {
  
        // hash the password using our new salt
        bcrypt.hash(password, salt, null, function (err, hash) {
            if (err) return next(err);

            // override the cleartext password with the hashed one
            password = hash;
            //console.log(password);
            resultData(password)
        });
    });
};

exports.comparePassword = function (option, cb) {
    bcrypt.compare(option.candidatePassword, option.encryptedPassword, function (err, isMatch) {
        if (err) return cb(fal);
        cb(isMatch);
    });
};

exports.passwordGenerate = function (resultData) {
    var cpassword;
    createPassword();
    function createPassword() {
        //for passwordLength
        var passwordLength = 12;
        //for upperCase
        var addUpper = true;
        //for number
        var addNumbers = true;
        //for specialCharacter
        var addSymbols = true;

        var lowerCharacters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
        var upperCharacters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
        var numbers = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
        var symbols = ['#', '$', '%', '&', '*', '(', ')'];
        var finalCharacters = lowerCharacters;
        if (addUpper) {
            finalCharacters = finalCharacters.concat(upperCharacters);
        }
        if (addNumbers) {
            finalCharacters = finalCharacters.concat(numbers);
        }
        if (addSymbols) {
            finalCharacters = finalCharacters.concat(symbols);
        }
        var passwordArray = [];
        for (var i = 1; i < passwordLength; i++) {
            passwordArray.push(finalCharacters[Math.floor(Math.random() * finalCharacters.length)]);
        };
        cpassword = passwordArray.join("");
    };
    resultData(cpassword);
}


exports.passwordComplexity = function (option,resultData) {
   //https://www.thepolyglotdeveloper.com/2015/05/use-regex-to-test-password-strength-in-javascript/
   //var regex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})");
    //regex.test("yegfffG1")
    var regexCase = new RegExp("^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])");
    var regexLowerCase = new RegExp("^(?=.*[a-z])");
    var regexPasswordCount = new RegExp("^(?=.{8,})");
    var obj = {};
    obj.passWordComplexityStatus = true;
    obj.passWordComplexityMessage = "";
    if (!regexPasswordCount.test(option.confirmPassword)) {
        obj.passWordComplexityStatus = false;
        obj.passWordComplexityMessage = "Your password must have atleast 8 characters";
    }
    else if (!regexCase.test(option.confirmPassword)) {
        obj.passWordComplexityStatus = false;
        obj.passWordComplexityMessage = "Your password must have Uppercase, Lowercase and Number";
    }
    resultData(obj);
}









