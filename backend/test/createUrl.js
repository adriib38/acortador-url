const { v4: uuidv4 } = require('uuid');
const { Url } = require("../src/models/models")

const createUrl = async () => {
    await Url.create({
        uuid: uuidv4(),
        long: "test",
        short: "test",
        createdAt: new Date(),
    });
}

createUrl()