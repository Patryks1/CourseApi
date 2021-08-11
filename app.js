import mongoose from 'mongoose';
import app from './server';

const mongoDB = process.env.MONGO_DB || 'mongodb://localhost:27017/coursesApi';
const port = process.env.PORT || 3000;

mongoose
  .connect(mongoDB, { useNewUrlParser: true })
	.then(async () => {
    app.listen(port, function(){
      console.log('Listening on port ' + port);
    });
	})
