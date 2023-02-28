import { Router } from 'express';
import authRoute from './authRoute';
/* import orderRouter from './order/orderRoute';
import swaggerDoc from 'swagger-ui-express';
import swaggerDocumentation from '../Docs/swagger.config'; */

const router = Router();

router.use('/auth', authRoute);
/* router.use('/orders', orderRouter);
router.use('/documentation', swaggerDoc.serve);
router.use('/documentation', swaggerDoc.setup(swaggerDocumentation)); */
export default router;