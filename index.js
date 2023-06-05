const app = require("./app");
const startDatabase = require("./config/db");

const port = 8500;

const startServer = async () => {
  try {
    await startDatabase();
    app.listen(port, () => {
      console.log(`servre is running on port : ${port}`);
    });
  } catch (error) {
    console.log(error);
  }
};

startServer();
