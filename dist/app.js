"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const database_1 = __importDefault(require("./Config/database"));
const Routes_1 = __importDefault(require("./Routes"));
const appError_1 = require("./Utilities/Errors/appError");
const errorHandler_1 = __importDefault(require("./Utilities/Errors/errorHandler"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = Number(process.env.PORT);
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
// Route
app.use("/cmf", Routes_1.default);
app.all('*', (req, res, next) => {
    next(new appError_1.AppError(`can't find ${req.originalUrl} on server!`, 404));
});
app.use(errorHandler_1.default);
app.get('/', (req, res) => {
    res.send('<h1> Welcome to Cedar-crest Medical Center! </h1>');
});
(0, database_1.default)()
    .catch((err) => console.error(err));
app.listen(port, () => {
    console.log(`server is listening on port ${port}`);
});
exports.default = app;
