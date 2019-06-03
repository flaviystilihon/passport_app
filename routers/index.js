const express = require('express');
const router = express.Router();


const {ensureAuthenticated} = require('../config/auth');

router.get('/', (req, res, next) => {res.render("Welcome")});
// Dashboard
router.get('/dashboard', ensureAuthenticated, (req, res, next) => {res.render("dashboard", {
    user: req.user
})});

module.exports = router;