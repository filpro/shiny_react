import User from '../models/User';
import AbstractService from './IService';

class UserService extends AbstractService<User> {
    saveUser = (user: User): User => {
        const result = this.postMethod(user);
        return result;
    };
}

export default new UserService();
