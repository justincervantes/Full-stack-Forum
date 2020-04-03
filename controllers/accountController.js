/*------------------------------------------------------------------------------------------------------------------
-- FILE: accountController.js
--
-- DATE: March 31, 2020
--
-- REVISIONS: 
--
-- DESIGNER:    Sam Lee
--
-- PROGRAMMER:  Sam Lee
--
-- NOTES:
-- This file manages sign in, sign up and sign out with validation.
----------------------------------------------------------------------------------------------------------------------*/
const profileData = require("../models/profileData");

//check if the user is already logged in and if so, redirect to the 'home' page
exports.sessionCheck = (req, res, next) =>{
  if(req.body.user == undefined || req.body.user.length == 0){
    res.render("login", { loginhbs: true});
  } else {
    res.redirect(`/user/${req.body.user.userid}/home`);
  }
}
exports.signin = (req, res, next) => {
  if(!emptyFieldCheck(req.body)){
    console.log('request is wrong');
    res.render("login", { loginhbs: true, signinFail: true });
    return;
  }
  let email = req.body.email;
  let password = req.body.password;
  let result = profileData.auth(email, password);
  result.then((data) => {
    if (data.rows.length == 0) {
      res.render("login", { loginhbs: true, signinFail: true });
    }
    else if (password === data.rows[0].password) {
      let promise = profileData.getProfile(email);
      let userObj;
      promise.then((data)=>{
        if(data.rows.length != 0) userObj = data.rows[0];
        req.session.user = userObj;
        res.redirect(`/user/${userObj.userid}/home`);
      });
    }
    else{
      res.render("login", { loginhbs: true, signinFail: true });
    }
  });
}

exports.signup = (req, res, next) => {
  if(!emptyFieldCheck(req.body)){
    res.render("login", { loginhbs: true, signupFail: "Fill all the input box" });
    return;
  } 
  let result = profileData.getProfile(req.body.email);
  result.then((data)=>{
    if(data.rows.length != 0 ){
      res.render("login", { loginhbs: true, signupFail: "That email is not available to use" });
    } else{
      profileData.add(req.body);
      res.render('signup', { signuphbs: true });
    }
  });
}

//i need a model function to add the additional info 
exports.signup_additionalInfo = (req, res, next) => {
  res.render('signup', { signuphbs: true });
}

exports.signout = (req, res, next) => {
  req.session.destroy();
  res.redirect('/');
}

function emptyFieldCheck(obj){
  for (let key in obj) {
    if (obj[key].length == 0) {
      console.log("values empty")
      return false;
    }
  }
  return true;
}

