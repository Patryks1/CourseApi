import { Router } from 'express';
import { Session } from '../models';

const router = Router();

const uuidRegEx =
  /[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89aAbB][a-f0-9]{3}-[a-f0-9]{12}/;

const isValidUUID = (val) => {
  return uuidRegEx.test(val);
};

const dictionary = {
  missingRequiredData: 'Missing required data',
  invalidCourseOrSessionId: 'Invalid courseId or sessionId',
  invalidCourseId: 'Invalid courseId',
  courseIdDoesNotExist: 'courseId does not exist',
  courseIdoOrSessionIdDoesNotExist: 'courseId or sessionId does not exist',
  saved: 'Saved!',
  failedToSaveInDatabase: 'Failed to save session in database',
};

router.post('/:courseId', (req, res) => {
  const { sessionId, totalModulesStudied, averageScore, timeStudied } =
    req.body;
  const { courseId } = req.params;

  if (!isValidUUID(courseId) || !isValidUUID(sessionId)) {
    return res.status(400).json({
      detail: dictionary.invalidCourseOrSessionId,
    });
  }

  if (!totalModulesStudied || !averageScore || !timeStudied) {
    return res.status(400).json({
      detail: dictionary.missingRequiredData,
    });
  }

  const sessionDocument = new Session({
    sessionId: sessionId,
    courseId: courseId,
    totalModulesStudied: totalModulesStudied,
    averageScore: averageScore,
    timeStudied: timeStudied,
  });

  return sessionDocument
    .save()
    .then(() => {
      return res.status(201).json({
        detail: dictionary.saved,
      });
    })
    .catch((err) => {
      return res.status(500).json({
        detail: dictionary.failedToSaveInDatabase,
      });
    });
});

router.get('/:courseId', async (req, res) => {
  const { courseId } = req.params;

  if (!isValidUUID(courseId)) {
    return res.status(400).json({
      detail: dictionary.invalidCourseId,
    });
  }

  const sessions = await Session.find({ courseId: courseId });

  if (!sessions || sessions.length === 0) {
    return res.status(404).json({
      detail: dictionary.courseIdDoesNotExist,
    });
  }

  const totalModulesStudied = sessions
    .map((session) => session.totalModulesStudied)
    .reduce((a, b) => a + b);
  const timeStudied = sessions
    .map((session) => session.timeStudied)
    .reduce((a, b) => a + b);

  const averageScores = sessions.map((session) => session.averageScore);
  const averageScoresSum = averageScores.reduce((a, b) => a + b);
  const averageScore = averageScoresSum / averageScores.length;

  const responsePayload = {
    totalModulesStudied: totalModulesStudied,
    averageScore: Math.round(averageScore),
    timeStudied: timeStudied,
  };

  return res.status(200).json(responsePayload);
});

router.get('/:courseId/sessions/:sessionId', async (req, res) => {
  const { courseId, sessionId } = req.params;

  if (!isValidUUID(courseId) || !isValidUUID(sessionId)) {
    return res.status(400).json({
      detail: dictionary.invalidCourseOrSessionId,
    });
  }

  const session = await Session.findOne({
    courseId: courseId,
    sessionId: sessionId,
  });

  if (!session) {
    return res.status(404).json({
      detail: dictionary.courseIdoOrSessionIdDoesNotExist,
    });
  }

  const responsePayload = {
    sessionId: session.sessionId,
    totalModulesStudied: session.totalModulesStudied,
    averageScore: session.averageScore,
    timeStudied: session.timeStudied,
  };

  return res.status(200).json(responsePayload);
});

export default router;
