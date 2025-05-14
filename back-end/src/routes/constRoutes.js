import express from 'express';
import {
  getCosts,
  getCostById,
  createCost,
  updateCost,
  deleteCost,
} from '../controllers/costController.js';
import authMiddleware from '../middlewares/authMiddleware.js';
import isAdminOrAccountant from '../middlewares/isAdminOrAccountant.js';
import { body } from 'express-validator';

const router = express.Router();

router.use(authMiddleware);

router.get('/', getCosts);
router.get('/:id', getCostById);
router.post('/',createCost);
router.put('/:id',updateCost);
router.delete('/:id', deleteCost);


export default router;
