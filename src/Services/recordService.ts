import { Request, Response, NextFunction } from 'express';
import { RequestHandler } from 'express';
import Record from "../Models/recordModel";
import RecordType from '../Interface/recordType';
import QueryTypes from '../Interface/queryTypes';
import RecordRepository from "../Repository/recordRepository";

const recordRepository = new RecordRepository();

export default class RecordService {
    public async createRecordService(req: Request, res: Response, next: NextFunction) {
        try {
            const {fullName, age, regNumber, phoneNumber, sex, 
                bloodPressure, diagnosis, appointmentDate, prescription} = req.body ;

            const newRecord: RecordType = {
                fullName,
                age,
                regNumber,
                phoneNumber,
                sex,
                bloodPressure,
                diagnosis,
                appointmentDate,
                prescription
            };    
            const record: any = await recordRepository.createRecord(newRecord);
            record.save();
            return res.status(200).json({
                record,
                success: true,
                message: 'Registration successful'
            });

        } catch (error) {
            res.status(400).json({message: 'registration failed'})
        }

    };

    public async getAllRecords(req: Request, res: Response, next: NextFunction) {
       try {
         const { page = 1, limit = 10 } = (req.query as any)
        const records = await Record.find()
        .limit(limit)
        .skip((page - 1) * limit) 
        .exec();
        const count = await Record.countDocuments()
        res.status(200).json({
            Result: records,
            totalPage: Math.ceil(count / limit),
            currentPage: page
        });
       }
catch (error) {
           res.status(400).json({ message: 'failed operation' })

        }
    }

    public async getAllByName(req: Request, res: Response, next: NextFunction) {
    try {
        const record =
            await Record.find({ price: { $gt: 5000 } })
                .sort('price')
                .select('name price')
        res.status(200).json({ data: record })
    }
     catch (error) {
        console.log(error)
        res.status(500).json({msg: error})
    }
}
}
