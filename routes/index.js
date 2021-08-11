import { Router } from 'express';
import courses from './courses';

const router = Router();

router.use('/courses', courses);

export default router;
