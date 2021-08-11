import request from 'supertest';
import mongoose from 'mongoose';
import { Session } from '../models';
import app from '../server';

const courseId = '3fa85f64-5717-4562-b3fc-2c963f66afa6';
const sessionId = '3fa85f64-5717-4562-b3fc-2c963f66afa6';

const createSession = async (
  sessionId,
  courseId,
  totalModulesStudied,
  averageScore,
  timeStudied
) => {
  await Session.create({
    sessionId: sessionId,
    courseId: courseId,
    totalModulesStudied: totalModulesStudied,
    averageScore: averageScore,
    timeStudied: timeStudied,
  });
};

beforeEach((done) => {
  mongoose.connect(
    'mongodb://localhost:27017/JestDB',
    { useNewUrlParser: true, useUnifiedTopology: true },
    () => done()
  );
});

afterEach((done) => {
  mongoose.connection.db.dropDatabase(() => {
    mongoose.connection.close(() => done());
  });
});

describe('/courses', () => {
  describe('GET /courses/:courseId', () => {
    it('should return status 400 when courseId is invalid', async () => {
      const { body, status } = await request(app).get(`/courses/invalid`);

      expect(status).toBe(400);
      expect(body).toEqual({
        detail: 'Invalid courseId',
      });
    });

    it('should return status 404 when course does not exist or have any sessions', async () => {
      const { body, status } = await request(app).get(
        `/courses/44a85f64-5717-4562-b3fc-21163f26afa1`
      );

      expect(status).toBe(404);
      expect(body).toEqual({
        detail: 'courseId does not exist',
      });
    });

    it('should return status 200 when course has existing sessions', async () => {
      await createSession(
        '3fa85f64-5717-4562-b3fc-2c963f66afa1',
        courseId,
        10,
        50,
        33
      );
      await createSession(
        '3fa85f64-5717-4562-b3fc-2c963f66a2a1',
        courseId,
        5,
        26,
        22
      );

      const { body, status } = await request(app).get(`/courses/${courseId}`);

      expect(status).toBe(200);
      expect(body.totalModulesStudied).toBe(15);
      expect(body.averageScore).toBe(38);
      expect(body.timeStudied).toBe(55);
    });
  });

  describe('GET /courses/:courseId/sessions/:sessionId', () => {
    it('should return status 200 when course exists and session exists', async () => {
      await createSession(
        sessionId,
        courseId,
        5,
        26,
        22
      );

      const { status, body } = await request(app).get(
        `/courses/${courseId}/sessions/${sessionId}`
      );

      expect(status).toBe(200);
      expect(body.sessionId).toBe(sessionId);
      expect(body.totalModulesStudied).toBe(5);
      expect(body.averageScore).toBe(26);
      expect(body.timeStudied).toBe(22);
    });

    it('should return status 404 when courseId does not exist', async () => {
      await createSession(
        sessionId,
        "3fa85f64-5717-4562-123c-2c963f66a2a1",
        5,
        26,
        22
      );

      const {status, body } = await request(app).get(
        `/courses/${courseId}/sessions/${sessionId}`
      );

      expect(status).toBe(404);
      expect(body.detail).toEqual('courseId or sessionId does not exist');
    });

    it('should return status 404 when sessionId does not exist', async () => {
      await createSession(
        "3fa85f64-5717-4562-123c-2c963f66a2a1",
        sessionId,
        5,
        26,
        22
      );

      const {status, body } = await request(app).get(
        `/courses/${courseId}/sessions/${sessionId}`
      );

      expect(status).toBe(404);
      expect(body.detail).toEqual('courseId or sessionId does not exist');
    });
  });

  describe('POST /courses/:courseId', () => {
    describe('should fail with 400 Bad Request', () => {
      it('when payload is missing totalModulesStudied', async () => {
        const payload = {
          sessionId: sessionId,
          averageScore: 2,
          timeStudied: 3,
        };

        const { body, status } = await request(app)
          .post(`/courses/${courseId}`)
          .send(payload);

        expect(status).toEqual(400);
        expect(body.detail).toEqual('Missing required data');
      });

      it('when payload is missing averageScore', async () => {
        const payload = {
          sessionId: sessionId,
          totalModulesStudied: 1,
          timeStudied: 3,
        };

        const { body, status } = await request(app)
          .post(`/courses/${courseId}`)
          .send(payload);

        expect(status).toEqual(400);
        expect(body.detail).toEqual('Missing required data');
      });

      it('when payload is missing timeStudied', async () => {
        const payload = {
          sessionId: sessionId,
          totalModulesStudied: 1,
          averageScore: 2,
        };

        const { body, status } = await request(app)
          .post(`/courses/${courseId}`)
          .send(payload);

        expect(status).toEqual(400);
        expect(body.detail).toEqual('Missing required data');
      });

      it('when courseId is invalid', async () => {
        const payload = {
          sessionId: sessionId,
          averageScore: 2,
          timeStudied: 3,
        };

        const { body, status } = await request(app)
          .post(`/courses/invalid`)
          .send(payload);

        expect(status).toEqual(400);
        expect(body.detail).toEqual('Invalid courseId or sessionId');
      });

      it('when sessionId is invalid', async () => {
        const payload = {
          sessionId: "invalid",
          averageScore: 2,
          timeStudied: 3,
        };

        const { body, status } = await request(app)
          .post(`/courses/${courseId}`)
          .send(payload);

        expect(status).toEqual(400);
        expect(body.detail).toEqual('Invalid courseId or sessionId');
      });
    });

    it('should return 201 and create a new session for course', async () => {
      const payload = {
        sessionId: sessionId,
        totalModulesStudied: 1,
        averageScore: 2,
        timeStudied: 3,
      };

      const { status } = await request(app).post(`/courses/${courseId}`).send(payload);

      expect(status).toEqual(201);
    });
  });
});
