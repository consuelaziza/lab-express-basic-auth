const router = require("express").Router();
const UserModel = require('../models/User.model')
const bcrypt = require('bcryptjs');




// Handles GET requests to /signup and shows a form
router.get('/signup', (req, res, next) => {
  res.render('auth/signup.hbs')
})

// Handles POST requests to /signup 
router.post('/signup', (req, res, next) => {
    const {username, password} = req.body

    
    
    // VALIDATIONS
    
  
    if (username == '' || password == '') {
        //throw error
        res.render('auth/signup.hbs', {error: 'Please enter all fields'})
        return;
    }

    //Validate if the password is strong
    let passRegEx = /'^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$'/
    if (!passRegEx.test(password)) {
      res.render('auth/signup.hbs', {error: 'Please enter Minimum eight characters, at least one letter and one number for your password'})
      return;
    }

    

    
    // Encryption

    let salt = bcrypt.genSaltSync(10);
    let hash = bcrypt.hashSync(password, salt);

    UserModel.create({username, password: hash})
      .then(() => {
          res.redirect('/')
      })
      .catch((err) => {
        next(err)
      })

})

// Handles GET requests to /signin and shows a form
router.get('/signin', (req, res, next) => {
  res.render('auth/signin.hbs')
})

// Handles POST requests to /signin 
router.post('/signin', (req, res, next) => {
    const {username, password} = req.body
    
    //DO Validations First

    // Find the user email
    // UserModel.find({email})
    //   .then((emailResponse) => {
    //       // if the email exists check the password
    //       if (emailResponse.length) {
    //           //bcrypt decryption 
    //           let userObj = emailResponse[0]

              // check if password matches
              let isMatching = bcrypt.compareSync(password, userObj.password);
              if (isMatching) {
                  // loggedInUser = userObj
                  req.session.myProperty = userObj
                  // req.session.welcome = 'Helllo'

                  res.redirect('/profile')
              }
              else {
                res.render('auth/signin.hbs', {error: 'Password not matching'})
                return;
              }
          // }
          // else {
          //   res.render('auth/signin.hbs', {error: 'User email does not exist'})
          //   return;
          // }
      // })
      // .catch((err) => {
      //   next(err)
      // })
})

router.get('/profile', (req, res, next) => {
    let myUserInfo = req.session.myProperty  
    res.render('auth/profile.hbs', {name: myUserInfo.username})
})


router.get("/logout", (req, res, next)=>{
  req.session.destroy()
  req.app.locals.isLoggedIn = false
  res.redirect("/main")
})


function checkLoggedIn(req, res, next){
  if ( req.session.loggedInUser) {
      next()
  }
  else{
    res.redirect('/signin')
  }
}

router.get("/private", checkLoggedIn, (req, res, next)=>{
  res.render("auth/private.hbs")
})

router.get("/main", (req, res, next)=>{
  res.render("auth/main.hbs")
})

module.exports = router;