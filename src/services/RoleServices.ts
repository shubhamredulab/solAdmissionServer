import Roles from '../entity/Roles';
import { AppDataSource } from '../data-source';
const RoleRepository = AppDataSource.getRepository(Roles);

export default class RoleServices {
    static getRoleByRoleName = async (roleName: string) => {
        const role = await RoleRepository.findOne({ where: { roleName: roleName } });
        return role;
    };

    static deleteRoleByRoleName = async (roleName: string) => {
        const role = await this.getRoleByRoleName(roleName);
        if (!role) return null;
        const deleted = await RoleRepository
            .createQueryBuilder()
            .delete()
            .from(Roles)
            .where('roleName = :roleName', { roleName: roleName })
            .execute();
        return deleted;
    };

    static getAllRole = async () => {
        const roles = await RoleRepository.find();
        return roles;
    };

    static addRole = async (roleName: string) => {
        const createRole = await RoleRepository.save({ roleName: roleName });
        return createRole;
    };

    static updateRoleName = async (role: Roles) => {

        const updateRole = await RoleRepository
            .createQueryBuilder()
            .update(Roles)
            .set({ roleName: role.roleName })
            .where({ id: role.id })
            .execute();

        return updateRole;
    };

    static updateRoleId = async (role: Roles) => {

        const updateRole = await RoleRepository
            .createQueryBuilder()
            .update(Roles)
            .set({ roleId: role.roleId })
            .where({ id: role.id })
            .execute();

        return updateRole;
    };
    
    public static getRolesData = async () => {
        return await RoleRepository.find({ select: ['roleName'] });
    };
}