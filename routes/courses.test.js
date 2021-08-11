describe('/courses', () => {
  describe('GET /courses/:courseId', () => {
    it('should return status 400 when courseId is invalid', () => {});

    it('should return status 404 when course does not exist or have any sessions', () => {});

    it('should return status 200 when course has existing sessions', () => {});
  });

  describe('GET /courses/:courseId/sessions/:sessionId', () => {
    it('should return status 200 when course exists and session exists', () => {});

    it('should return status 404 when courseId does not exist', () => {});

    it('should return status 404 when sessionId does not exist', () => {});
  });

  describe('POST /courses/:courseId', () => {
    describe('should fail with 400 Bad Request', () => {
      it('when payload is missing totalModulesStudied', () => {});

      it('when payload is missing averageScore', () => {});

      it('when payload is missing timeStudied', () => {});

      it('when courseId is invalid', () => {});

      it('when sessionId is invalid', () => {});
    });

    it('should return 201 and create a new session for course', () => {});
  });
});
