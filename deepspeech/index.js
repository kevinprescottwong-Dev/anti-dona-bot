const {
  deepspeechHostname: HOSTNAME,
  deepspeechPort: PORT,
} = require("../config.json");
const FormData = require("form-data");
const fs = require("fs");

function deepspeech(filename) {
  const fileStream = fs.createReadStream(filename);
  const formData = new FormData();
  formData.append("file", fileStream);

  const options = {
    method: "POST",
    hostname: HOSTNAME,
    port: PORT,
    path: "/",
    headers: formData.getHeaders(),
  };

  const result = formData.submit(options);

  const promise = new Promise((resolve, reject) => {
    const chunks = [];

    result.on("data", (chunk) => {
      chunks.push(chunk);
    });

    result.on("end", () => {
      try {
        const body = chunks.join();
        console.log({ body });
        const jsonResult = JSON.parse(body);
        resolve(jsonResult);
      } catch (err) {
        console.error(err);
        reject(err);
      }
    });
  });

  return promise;
}

function deepspeechWithMetaDataAsync(filename) {
  const fileStream = fs.createReadStream(filename);
  const formData = new FormData();
  formData.append("file", fileStream);

  const options = {
    method: "POST",
    hostname: HOSTNAME,
    port: PORT,
    path: "/metadata",
    headers: formData.getHeaders(),
  };

  const chunks = [];

  const promise = new Promise((resolve, reject) => {
    formData.submit(options, (err, res) => {
      if (!res) return;

      res.setEncoding("utf8");
      res.on("data", function (chunk) {
        chunks.push(chunk);
      });

      res.on("end", () => {
        try {
          const body = chunks.join();
          console.log({ body });
          const jsonResult = JSON.parse(body);
          resolve(jsonResult);
        } catch (err) {
          console.error(err);
          reject(err);
        }
      });
    });
  });
  return promise;
}

module.exports = {
  deepspeech,
  deepspeechWithMetaDataAsync,
};
