import express from 'express';
import { submitMonitoringReport } from '../controllers/reportController.js';
import { upload } from '../middleware/upload.js';

const router = express.Router();

router.post('/submit', submitMonitoringReport);
//router.post('/submit', upload.array('files', 5), submitMonitoringReport);

export default router;
