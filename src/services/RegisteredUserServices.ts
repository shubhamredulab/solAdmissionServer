import { AppDataSource } from "../data-source";
import RegisteredUsers from "../entity/RegisteredUser";
const RegisteredUserRepository = AppDataSource.getRepository(RegisteredUsers);

export default class RegisteredUserServices {
    public static register = async (data: RegisteredUsers) => {
        return await RegisteredUserRepository.save(data);
    };
}