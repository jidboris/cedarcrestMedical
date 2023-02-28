import mongoose, { Schema } from "mongoose";
import RecordType from "../Interface/recordType";

const recordSchema = new Schema<RecordType>(
    {
        fullName: { type: String, required: true },
        age: { type: Number, required: true },
        regNumber: { type: Number, required: true },
        phoneNumber: { type: Number, required: true },
        sex: { type: String, required: true },
        bloodPressure: { type: Number, required: true},
        diagnosis: { type: String, required: true },
        appointmentDate: { type: Date, required: true },
        prescription: { type: String, required: true }
    },
    { 
        timestamps: true 
    }
);

const Record = mongoose.model("record", recordSchema);
export default Record;
