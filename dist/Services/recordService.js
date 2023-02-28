"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const recordModel_1 = __importDefault(require("../Models/recordModel"));
const recordRepository_1 = __importDefault(require("../Repository/recordRepository"));
const recordRepository = new recordRepository_1.default();
class RecordService {
    createRecordService(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { fullName, age, regNumber, phoneNumber, sex, bloodPressure, diagnosis, appointmentDate, prescription } = req.body;
                const newRecord = {
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
                const record = yield recordRepository.createRecord(newRecord);
                record.save();
                return res.status(200).json({
                    record,
                    success: true,
                    message: 'Registration successful'
                });
            }
            catch (error) {
                res.status(400).json({ message: 'registration failed' });
            }
        });
    }
    ;
    getAllRecords(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { page = 1, limit = 10 } = req.query;
                const records = yield recordModel_1.default.find()
                    .limit(limit)
                    .skip((page - 1) * limit)
                    .exec();
                const count = yield recordModel_1.default.countDocuments();
                res.status(200).json({
                    Result: records,
                    totalPage: Math.ceil(count / limit),
                    currentPage: page
                });
            }
            catch (error) {
                res.status(400).json({ message: 'failed operation' });
            }
        });
    }
    getAllByName(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const record = yield recordModel_1.default.find({ price: { $gt: 5000 } })
                    .sort('price')
                    .select('name price');
                res.status(200).json({ data: record });
            }
            catch (error) {
                console.log(error);
                res.status(500).json({ msg: error });
            }
        });
    }
}
exports.default = RecordService;
