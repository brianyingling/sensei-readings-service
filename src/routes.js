import createReading from './handlers/createReading';
import getReadings from './handlers/getReadings';
import getReadingsByLocation from './handlers/getReadingsByLocation';
import getLatestReadingsByLocation from './handlers/getLatestReadingsByLocation';

const routes = (app) => {
  app.get('/helloworld', (req, res, next) => res.send('hello world'));

  app.get('/readings', getReadings);
  app.post('/readings', createReading);
  app.get('/locations/:id/readings', getReadingsByLocation);
  app.get('/locations/readings/latest', getLatestReadingsByLocation);
};

export default routes;
