import Record from '../Models/recordModel';
import RecordType from '../Interface/recordType';
import { ObjectId } from 'mongoose';



export default class RecordRepository {
    async createRecord(record: RecordType): Promise<RecordType> {
        const newRecord: any = await Record
            .create({
                fullName: record.fullName,
                age: record.age,
                regNumber: record.regNumber,
                phoneNumber: record.phoneNumber,
                sex: record.sex,
                bloodPressure: record.bloodPressure,
                diagnosis: record.diagnosis,
                appointmentDate: record.appointmentDate,
                prescription: record.prescription
            });
        return newRecord;
    }

    public async getAllRecords(record : RecordType ): Promise<RecordType>  {
        /* const record: RecordType = */ Record.find().exec;
        return record;
    }

}