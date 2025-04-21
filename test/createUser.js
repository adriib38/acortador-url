const {User} = require("../src/Models/AuthModels")
const { v4: uuidv4 } = require('uuid');

const createUser = async () => {
    await User.create({
        uuid: uuidv4(),
        username: "test",
        password: "test"
    });
}

createUser()
