const QueueService = require("./queueService");
// Responsible for keeping a queue of files to convert
const FileConversionQueue = new QueueService();
module.exports = FileConversionQueue;
