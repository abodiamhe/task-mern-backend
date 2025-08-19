const express = require('express')
const router = express.Router()

//prettier-ignore
const {getTasks, setTask, updateTask, deleteTask} = require("../controllers/taskController")
const { protect } = require('../middleware/authMiddleware')

//Route for getting all tasks
router.get('/', protect, getTasks)

//Route for posting a task
router.post('/', protect, setTask)

//Route for updating a task
router.put('/:id', protect, updateTask)

//Route for deleting task
router.delete('/:id', protect, deleteTask)

module.exports = router
