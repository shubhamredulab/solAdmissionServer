import MenuItem from '../entity/MenuItem';
import { AppDataSource } from '../data-source';

const MenuItemRepository = AppDataSource.getRepository(MenuItem);

export default class MenuItemServices {
    /**
     * @author Moin
     * @description This function is used user id wise menu data.
     */

    static getMenuItemByUserId = async (userId: number) => {
        const menuItem = await MenuItemRepository.findOneBy({ userId: userId });
        return menuItem;
    };
}