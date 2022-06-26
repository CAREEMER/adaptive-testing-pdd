const _app = require('./app');

const port = process.env.PORT || 3000;
_app.listen(port, () => {
  console.log(`Listening: http://localhost:${port}`);
});