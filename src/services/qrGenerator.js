const fs = require("fs");
const path = require("path");
const QRCode = require("qrcode");

const getQrFromUrl = async (url, slug) => {
    try {
        const qrCode = await QRCode.toDataURL(url);
        //Return the QR code as a base64 string
        let base64Data = qrCode.replace(/^data:image\/png;base64,/, "");
        let name = `qr${slug}`;
        let filePath = path.join(__dirname, "..", "..", "public", "qrs", `${name}.png`);

        fs.writeFileSync(filePath, base64Data, "base64", function (err) {
            console.log(err);
        });
        console.log("QR code saved to file:", filePath);

        return `${name}.png`;
    } catch (err) {
        console.error(err);
        throw new Error("Failed to generate QR code");
    }
}

//Test

getQrFromUrl("https://www.google.com", "test")
    .then((qr) => {
        console.log("QR code generated:", qr);
    })
    .catch((err) => {
        console.error("Error generating QR code:", err);
    });

module.exports = getQrFromUrl;
