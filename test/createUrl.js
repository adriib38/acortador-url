const {Url} = require("../src/Models/models")
const { v4: uuidv4 } = require('uuid');

const createUrl = async () => {
    await Url.create({
        uuid: uuidv4(),
        long: "test",
        short: "test",
        createdAt: new Date(),
    });
}

createUrl()