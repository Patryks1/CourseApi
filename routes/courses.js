import { Router } from 'express';
import { Session, Course } from '../models';
import { dictionary } from '../dictionary';
import { isValidUUID } from '../helper/validation';

const router = Router();

router.post('/', async (req, res) => {
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({
      detail: dictionary.missingRequiredData,
    });
  }

  // TODO: Check if course name already exists

  const courseDocument = new Course({
    name: name,
  });

  return courseDocument
    .save()
    .then((document) => {
      return res.status(201).json({
        detail: dictionary.saved,
        id: document._id
      });
    })
    .catch((err) => {
      return res.status(500).json({
        detail: dictionary.failedToSaveInDatabase,
      });
    });
});

router.post('/:courseId', async (req, res) => {
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

  const courseDocument = await Course.findById(courseId);

  if (!courseDocument) {
    return res.status(404).json({
      detail: dictionary.courseDoesNotExist,
    });
  }

  const sessionDocument = new Session({
    _id: sessionId,
    courseId: courseDocument._id,
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
      // Duplicate uuid error code
      if (err.code === 11000) {
        return res.status(409).json({
          detail: dictionary.recordAlreadyExists,
        });
      }

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
    _id: sessionId,
    courseId: courseId,
  });

  if (!session) {
    return res.status(404).json({
      detail: dictionary.courseIdoOrSessionIdDoesNotExist,
    });
  }

  const responsePayload = {
    sessionId: session._id,
    totalModulesStudied: session.totalModulesStudied,
    averageScore: session.averageScore,
    timeStudied: session.timeStudied,
  };

  return res.status(200).json(responsePayload);
});

export default router;
