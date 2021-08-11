import { Router } from 'express';

const router = Router();

router.post('/:courseId', (req, res) => {
  res.status(201).json({
    detail: 'Test',
  });
});

router.get('/:courseId', async (req, res) => {
  res.status(201).json({
    detail: 'Test',
  });
});

router.get('/:courseId/sessions/:sessionId', async (req, res) => {
  res.status(201).json({
    detail: 'Test',
  });
});

export default router;
