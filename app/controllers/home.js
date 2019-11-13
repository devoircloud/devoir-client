const express = require('express');
const bcrypt = require('bcryptjs');
const passport = require('passport');

const router = express.Router();

const Todo = require('../models/todo');
const User = require('../models/user');
const Utils = require('../helpers/utils');

const { ensureAuthenticated } = require('../../config/auth');

// get home page
router.get('/', (req, res, next) => {
  // generate a new name
  const name = Utils.randomString(5);

  // new todo model
  const newTodo = new Todo({ name, done: false });

  newTodo.save()
    .then((todo) => { console.log(`Success! ${todo.name} saved! \n${todo}`); })
    .catch((err) => { console.log(err); });

  console.log("\n\n\n\n\n\n");
  console.log(req.app.get('views'));

  res.render('index', { title: 'Express' });
});

// get register page
router.get('/register', (req, res, next) => {
  // generate a new name
  const name = Utils.randomString(5);

  // new todo model
  // const newTodo = new Todo({ name, done: false });

  // newTodo.save()
    // .then((todo) => { console.log(`Success! ${todo.name} saved! \n${todo}`); })
    // .catch((err) => { console.log(err); });

  res.render('register', { title: 'Express' });
});

// register handle
router.post('/register', (req, res) => {
  const { name, email, password } = req.body;
  let errors = [];

  if (!name || !email || !password) {
    errors.push({msg: 'Please fill in all fields'});
  }

  if (password.length < 6) {
    errors.push({msg: 'Password length must be greater than 6'});
  }
  
  if (errors.length) {
    res.render('register', { errors: errors, name: name, email: email });
  }
  else {
    // Validation passed
    // console.log(User);
    User.findOne({ email: email })
      .then(user => {
        if (user) {
          errors.push({msg: 'Email already registered'});
          res.render('register', { errors: errors, name: name, email: email });
        }
        else {
          const newUser = new User({
            name,
            email,
            password
          });

          // hash password
          bcrypt.genSalt(10, (err, salt) => bcrypt.hash(
            newUser.password, salt, (err, hash) => {
              if (err) throw err;

              // update password
              newUser.password = hash;

              console.log(newUser);

              // save user
              newUser.save()
                .then(user => {
                  req.flash('success_msg', 'You are now registered and can log in');
                  res.redirect('/login');
                })
                .catch(err => console.error(err));
            }
          ));
        }
      })
      .catch(err => console.err(err));
  }
});

// get login page
router.get('/login', (req, res, next) => {
  // generate a new name
  const name = Utils.randomString(5);

  // new todo model
  const newTodo = new Todo({ name, done: false });

  newTodo.save()
    .then((todo) => { console.log(`Success! ${todo.name} saved! \n${todo}`); })
    .catch((err) => { console.log(err); });

  res.render('login', { title: 'Login' });
});

// login handle
router.post('/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/content-manager', 
    failureRedirect: '/login',
    failureFlash: true
  })(req, res, next);
});

router.get('/logout', (req, res, next) => {
  req.logout();
  req.flash('success_msg', 'You are logged out');
  res.redirect('/login');
});

// get plan selection page
router.get('/1-select-plan', (req, res, next) => {
  // generate a new name
  const name = Utils.randomString(5);

  // new todo model
  const newTodo = new Todo({ name, done: false });

  newTodo.save()
    .then((todo) => { console.log(`Success! ${todo.name} saved! \n${todo}`); })
    .catch((err) => { console.log(err); });

  res.render('1_plan', { title: '1/4 Select plan' });
});

// get server selection page
router.get('/2-select-server/:plan', (req, res, next) => {
  let plan = req.params.plan;
  if (plan != 'small-plan' && plan != 'medium-plan') {
    res.redirect('/1-select-plan');
  }
  else {
    res.render('2_server', { title: '2/4 Select servers', plan: plan });
  }
});

// get payment selection page
router.get('/3-select-algorithm', (req, res, next) => {
  // generate a new name
  const name = Utils.randomString(5);

  // new todo model
  const newTodo = new Todo({ name, done: false });

  newTodo.save()
    .then((todo) => { console.log(`Success! ${todo.name} saved! \n${todo}`); })
    .catch((err) => { console.log(err); });

  res.render('3_algorithm', { title: '3/4 Select plan' });
});

// get after payment page
router.get('/4-payment', (req, res, next) => {
  // generate a new name
  const name = Utils.randomString(5);

  // new todo model
  const newTodo = new Todo({ name, done: false });

  newTodo.save()
    .then((todo) => { console.log(`Success! ${todo.name} saved! \n${todo}`); })
    .catch((err) => { console.log(err); });

  res.render('4_payment', { title: '4/4 Payment' });
});


// get server selection page
router.get('/5-after-payment', (req, res, next) => {
  // generate a new name
  const name = Utils.randomString(5);

  // new todo model
  const newTodo = new Todo({ name, done: false });

  newTodo.save()
    .then((todo) => { console.log(`Success! ${todo.name} saved! \n${todo}`); })
    .catch((err) => { console.log(err); });

  res.render('5_after_payment', { title: 'After payment...' });
});


// get content manager page
router.get('/content-manager', ensureAuthenticated, (req, res) => {
  res.render('manager_content', { title: 'Content Manager',
  // user: req.user });
  user: 'CDN' });
});

// get server manager page
router.get('/server-manager', (req, res, next) => {
  // generate a new name
  const name = Utils.randomString(5);

  // new todo model
  const newTodo = new Todo({ name, done: false });

  newTodo.save()
    .then((todo) => { console.log(`Success! ${todo.name} saved! \n${todo}`); })
    .catch((err) => { console.log(err); });

  res.render('manager_server', { title: 'Servers Manager' });
});


// get algorithm manager page
router.get('/algorithm-manager', (req, res, next) => {
  // generate a new name
  const name = Utils.randomString(5);

  // new todo model
  const newTodo = new Todo({ name, done: false });

  newTodo.save()
    .then((todo) => { console.log(`Success! ${todo.name} saved! \n${todo}`); })
    .catch((err) => { console.log(err); });

  res.render('manager_algorithm', { title: 'Algorithms Manager' });
});


// get Domain Name manager page
router.get('/domain-name-manager', (req, res, next) => {
  // generate a new name
  const name = Utils.randomString(5);

  // new todo model
  const newTodo = new Todo({ name, done: false });

  newTodo.save()
    .then((todo) => { console.log(`Success! ${todo.name} saved! \n${todo}`); })
    .catch((err) => { console.log(err); });

  res.render('manager_domain_name', { title: 'Domain Names Manager' });
});

// get payments manager page
router.get('/payment-manager', (req, res, next) => {
  // generate a new name
  const name = Utils.randomString(5);

  // new todo model
  const newTodo = new Todo({ name, done: false });

  newTodo.save()
    .then((todo) => { console.log(`Success! ${todo.name} saved! \n${todo}`); })
    .catch((err) => { console.log(err); });

  res.render('manager_payment', { title: 'Payments Manager' });
});


// get stats page
router.get('/stats-manager', (req, res, next) => {
  // generate a new name
  const name = Utils.randomString(5);

  // new todo model
  const newTodo = new Todo({ name, done: false });

  newTodo.save()
    .then((todo) => { console.log(`Success! ${todo.name} saved! \n${todo}`); })
    .catch((err) => { console.log(err); });

  res.render('manager_stats', { title: 'Stats' });
});

// get settings page
router.get('/settings-manager', (req, res, next) => {
  // generate a new name
  const name = Utils.randomString(5);

  // new todo model
  const newTodo = new Todo({ name, done: false });

  newTodo.save()
    .then((todo) => { console.log(`Success! ${todo.name} saved! \n${todo}`); })
    .catch((err) => { console.log(err); });

  res.render('manager_settings', { title: 'Settings' });
});


module.exports = router;
