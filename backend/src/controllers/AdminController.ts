import {getRepository} from "typeorm";
import {User} from "../entities/User";
import bcrypt from "bcrypt";

export const createAdminIfNotExists = async () => {
  try {
    const userRepository = getRepository(User);

    const login = process.env.ADMIN_LOGIN;
    // Searching for a user by login
    const user = await userRepository.findOneBy({ login });
    if (user) {
      return;
    }

    const hashedPassword: string = await bcrypt.hash(process.env.ADMIN_PWD!, 10);

    const newUser = userRepository.create({
      login,
      passwordHash: hashedPassword!,
      role: 'admin',
    });

    // Saving a user to DB
    await userRepository.save(newUser);
  } catch (error) {
    console.error(error);
  }
}
