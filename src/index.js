'use strict'
import authRoute from './components/auth/authRouter.js';
import hr from './components/hr/index.js';
export default (app)=>{
    authRoute(app)
    hr(app)
 
}