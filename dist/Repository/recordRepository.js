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
class RecordRepository {
    createRecord(record) {
        return __awaiter(this, void 0, void 0, function* () {
            const newRecord = yield recordModel_1.default
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
        });
    }
    getAllRecords(record) {
        return __awaiter(this, void 0, void 0, function* () {
            /* const record: RecordType = */ recordModel_1.default.find().exec;
            return record;
        });
    }
}
exports.default = RecordRepository;
