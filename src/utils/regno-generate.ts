import SeriesServices from '../services/SeriesServerice';
import UserServices from '../services/UserServices';
import { ITypeName } from '../types/user';
export default class PinGenerate {

    static generateRegNo = async () => {
        // Check if the current year exists in the serial table
        const currentDate = new Date();
        const currentMonth = currentDate.getMonth();
        let Year;
        if (currentMonth >= 0 && currentMonth <= 9) {
          Year = currentDate.getFullYear();
        } else {
           Year = currentDate.getFullYear() + 1;
        }
        const typeName = 'registrationNo';
        const rangeStart = await SeriesServices.checkSerialExists(Year, typeName as ITypeName);

        if (rangeStart !== null) {

            const latestRegNo = await UserServices.getLatestRegistrationNumber( Number(rangeStart?.Year));
            let nextRegNo;

            if (latestRegNo === '100001') {
                nextRegNo = rangeStart?.StartRange;
            } else {
                const parsedLatestRegNo = parseInt(String(latestRegNo));
                const parsedStartRange = parseInt(rangeStart?.StartRange || '0');
                if (parsedLatestRegNo === parsedStartRange) {
                    // If the latest serial number is within the specified range, increment it.
                    nextRegNo = parsedLatestRegNo + 1;
                } else {
                    nextRegNo = parsedLatestRegNo + 1;
                }
            }
            return nextRegNo;
        }
    };
}