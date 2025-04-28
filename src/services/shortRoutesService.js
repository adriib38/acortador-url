const { v4: uuidv4 } = require("uuid");
const Url = require("../models/Url.js");
const getQrFromUrl = require("../services/qrGenerator.js");
const URL_BASE_SHORT = process.env.URL_BASE_SHORT;

require("dotenv").config();

const getUrlShorted = async (url, user) => {
  try {
    const urlUuid = uuidv4();
    const ext = urlUuid.split("-")[0];

    const shortUrl = `${URL_BASE_SHORT}/${ext}`;
    const qr = await getQrFromUrl(shortUrl, ext);

    await Url.create({
      uuid: urlUuid,
      long: url,
      short: shortUrl,
      qrFileName: qr,
      user: user,
    });
    return {
      short: shortUrl,
      qrFileName: qr,
    };
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
    console.error("Error retrieving URL:", short, error);
    throw new Error("Error retrieving URL");
  }
};

module.exports = {
  getUrlShorted,
  getUrlByShort
}