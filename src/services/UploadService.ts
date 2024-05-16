import { AppDataSource } from '../data-source';
import User from '../entity/User';
const UserRepository = AppDataSource.getRepository(User);
export class UploadServices {

  /**
   * @author Moin
   * @description This function is used to update the profile image.
   */
  public static updateImage = async (userId: number, imagesName: string) => {
    const updateResult = await UserRepository.createQueryBuilder()
      .update(User)
      .set({ imagesName: imagesName })
      .where('id = :id', { id: userId })
      .execute();
    return updateResult;
  };
  /**
   * @author Moin
   * @description This function is used to delete the profile picture by ID.
   */
  public static deleteUserImage = async (id: number) => {
    const updateResult = await UserRepository.createQueryBuilder()
      .update(User)
      .set({ imagesName: '' })
      .where('id = :id', { id: id })
      .execute();
    return updateResult;
  };

}
