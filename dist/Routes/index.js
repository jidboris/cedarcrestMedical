"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authRoute_1 = __importDefault(require("./authRoute"));
/* import orderRouter from './order/orderRoute';
import swaggerDoc from 'swagger-ui-express';
import swaggerDocumentation from '../Docs/swagger.config'; */
const router = (0, express_1.Router)();
router.use('/auth', authRoute_1.default);
/* router.use('/orders', orderRouter);
router.use('/documentation', swaggerDoc.serve);
router.use('/documentation', swaggerDoc.setup(swaggerDocumentation)); */
exports.default = router;
