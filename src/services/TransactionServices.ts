import { AppDataSource } from '../data-source';
import Transaction from '../entity/Transaction';
const TransactionRepository = AppDataSource.getRepository(Transaction);

export default class TransactionServices {  
    public static saveTransactionData = async (data: Transaction) => {
        return await TransactionRepository.save(data);
    };

    public static getTransactionByOrderId= async (orderId: string) => {
        return await TransactionRepository.findOne({ where: { orderId } });
    };
}