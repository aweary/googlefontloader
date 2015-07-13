const failedRequests = [];

setInterval(function() { console.log(failedRequests) }, 3000);

module.exports = function handleFailedRequest(err, font) {
  font.error = err;
  if (failedRequests.indexOf(font) !== -1) failedRequests.push(font);
}
