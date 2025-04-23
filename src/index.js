const app = require('./app');

async function init() {
  try {
    const port = process.env.PORT ?? 3030;
    await app.listen(port);

  } catch (error) {
    console.error("Error starting server: ", error);
  }
}

init();

