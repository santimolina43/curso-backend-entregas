import RouterClass from '../router.js';
import { getUsersProfileView } from '../../controllers/user.controller.js';

export default class ProfileRouter extends RouterClass {
    init() {

        /************************************/   
        /************** VISTAS **************/   
        /************************************/ 

        /********* PROFILE *********/   
        this.get('/', ["USER", "ADMIN", "PREMIUM"], 'jwt', {}, getUsersProfileView)
    }
}
