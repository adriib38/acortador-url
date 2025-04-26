require("dotenv").config();
const { v4: uuidv4 } = require("uuid");
const Url = require("../models/Url.js");

const URL_BASE_SHORT = process.env.URL_BASE_SHORT;

const getUrlShorted = async (url, user) => {
  try {
    const _uuid = uuidv4();
    const ext = _uuid.split("-")[0];

    const shortUrl = `${URL_BASE_SHORT}/${ext}`;

    await Url.create({
      uuid: _uuid,
      long: url,
      short: shortUrl,
      user: user,
    });
    return shortUrl;
  } catch (error) {
    throw new Error("Error creating short URL");
  }
};

const getUrlByShort = async (short) => {
  try {

    const url = await Url.findOne({
      where: {
        short: short,
      },
    });
    if (!url) {
      throw new Error("URL not found");
    }
    return url;
  } catch (error) {
    throw new Error("Error retrieving URL");
  }
};

module.exports = {
  getUrlShorted,
  getUrlByShort
}