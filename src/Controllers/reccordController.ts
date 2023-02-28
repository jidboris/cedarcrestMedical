import express, { Request, Response, NextFunction } from 'express';
import RecordService from "../Services/recordService"

const recordService = new RecordService() 
export default class recordController {
    public async create(req: Request, res: Response, next: NextFunction) {
        return await recordService.createRecordService (req, res, next);
    }
    public async getAll(req: Request, res: Response, next: NextFunction) {
        return await recordService.getAllRecords(req, res, next);
    }
}