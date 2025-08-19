const express = require('express')
const router = express.Router()

const { protect } = require('../middleware/authMiddleware')

//prettier-ignore
const {registerUser, loginUser, getCurrentUser} = require('../controllers/userController')

//Route for creating new user
router.post('/', registerUser)
//Route to login user
router.post('/login', loginUser)
//Protecting the route to get current user
router.get('/current', protect, getCurrentUser)

module.exports = router
