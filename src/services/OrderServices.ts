
import { AppDataSource } from '../data-source';
import Order from '../entity/Order';
import { IAdmissionType } from '../types/user';
const OrderRepository = AppDataSource.getRepository(Order);

export default class OrderServices {
    public static getAllOrders = async () => {
        return await OrderRepository.find();
    };

    public static saveOrderTableData = async (data: Order) => {


        return await OrderRepository.save(data);
    };

    public static getLatestSerialNumber = async (admissionType: IAdmissionType) => {
        const latestSerial = await OrderRepository.findOne(
            {
                where: {
                    admissionType: admissionType
                },
                order: {
                    serialNo: 'DESC'
                }
            }
        );

        if (latestSerial) {
            return latestSerial.serialNo;
        }
        return '000000';
    };

    public static getOrderBySerialNo = async (serialNo: string) => {
        return await OrderRepository.findOneBy({ serialNo });
    };

    public static updateStatus = async (serialNo: string, status: number) => {
        return await OrderRepository.createQueryBuilder()
            .update(Order)
            .set({ status: status })
            .where('serialNo = :serialNo', { serialNo: serialNo })
            .execute();
    };

    /**
  * @author: Rutuja Patil
  * @description This function is used to get data form order table using user_id
  */
    public static getOrderData = async (userId: number) => {
        return await OrderRepository.findOneBy({ userId });
    };
}