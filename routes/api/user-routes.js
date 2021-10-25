const router = require('express').Router();
const {
    getAllUsers,
    getOneUser,
    createUser,
    updateUser,
    deleteUser
} = require('../../controllers/user-controller');

router
   .route('/')
   .get(getAllUsers)
   .post(createUser);

router
   .route('/:userId')
   .get(getOneUser)
   .put(updateUser)
   .delete(deleteUser);

module.exports = router;