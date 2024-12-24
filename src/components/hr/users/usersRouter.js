import express from "express"
const router=express.Router()
import authenticate from "../../auth/authenticate.js";
import users from "./usersController.js"
const userRouter = (app, API_URL) => {
    router.get('/',  users.getAll)
    router.get('/:type',  users.getAll)    
    router.post('/',  users.add)  
    router.put('/profile', users.editprofile)
    router.put('/changepwd',users.changepwd)
    router.put('/:uuid',  users.edit)
    router.get('/user/:uuid',  users.view)  
    router.delete('/:uuid',  users.deletes)  
    app.use(`${API_URL}/users`, authenticate, router)
}

export default  userRouter;