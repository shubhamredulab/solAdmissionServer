

import Series from "../entity/Series";
import { IAdmissionType } from '../types/document';
import { AppDataSource } from "../data-source";
import logger from "../utils/winston";
import { ITypeName } from "../types/user";
const seriesRepository = AppDataSource.getRepository(Series);


export default class SeriesServices {
    public static addOrUPdateSeriesAndRegistrationRange = async (typeName: ITypeName, StartRange: string, admissionType: IAdmissionType, Year: number, rangeId: number) => {
        try {
            // Check if the admission type exists
            const existingSeries = await seriesRepository.findOne({ where: { admissionType, Year, typeName, id: rangeId } });

            if (existingSeries) {
                // Admission type exists, update the series
                const updatedSchedule = await seriesRepository
                    .createQueryBuilder()
                    .update(Series)
                    .set({ typeName, StartRange, Year, admissionType }) // Set the actual values you want to update
                    .where('id = :rangeId ', { rangeId })
                    .execute();

                return updatedSchedule;
            } else {
                const dataExist = await seriesRepository.findOne({ where: { admissionType, Year, typeName } });
                if (dataExist) {
                    const message = 'This year and admission type already exist. Please find the list and update.'; // here i want to send the error massage on ui data is arlready exist
                    return message;
                } else {
                    const newSchedule = seriesRepository.create({ typeName, StartRange, admissionType, Year });
                    const createdSchedule = await seriesRepository.save(newSchedule);
                    return createdSchedule;

                }

            }
        } catch (error) {
            logger.error;
            throw error;
        }
    };

    public static checkSerialExists = async ( Year: number, typeName: ITypeName) => {
        try {
            const existingSeries = await seriesRepository.findOne({ where: { Year, typeName }, select: ['StartRange', 'Year'] });
            return existingSeries;
        } catch (error) {
            logger.error;
            throw error;
        }
    };
    public static deleteSeriesData = async (id: number) => {
        return await seriesRepository
            .createQueryBuilder('master_admission_series')
            .delete()
            .from(Series)
            .where("id = :id", { id: id })
            .execute();
    };

    /**
* @author: moin
* @description this function get the serial table data 
*/
    public static getSeriesAndRegistrationNumberData = async () => {
        const query = `SELECT DISTINCT sir.id, sir.StartRange, sir.typeName, sir.admissionType,sir.Year
         FROM master_admission_series AS sir
 `;
        const ticketData = seriesRepository.query(query);
        return ticketData;
    };

    public static getSeriesAndRegistrationNumberDataWithPagination = async (limit: number, offset: number) => {
        let limitOffset = "";
        if (offset !== undefined && limit !== undefined) {
            limitOffset = " LIMIT " + limit + " OFFSET " + offset;
        }
        const query = `SELECT DISTINCT sir.id, sir.StartRange, sir.typeName, sir.admissionType,sir.Year
         FROM master_admission_series AS sir
 `;
        query + limitOffset;
        const ticketData = seriesRepository.query(query);
        return ticketData;
    };
}