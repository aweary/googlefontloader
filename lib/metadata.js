
/**
 * getMetaData
 * @param  {Object} font font details
 */
module.exports = function getMetadata(repo, font) {

  if (!font.downloads) font.downloads = {};
  if (!font.filenames) font.filenames = [];

  repo.contents(font.path, function(err, contents) {
    if (err) console.log(err);

    /* Go through each file and find the TTF files */
    contents.forEach((data) => {
      console.log(data);
      if (data.name.match(/\.ttf$/)) {
        font.downloads[data.name] = data.download_url;
        font.filenames.push(data.name);

      }

      if (data.name === "METADATA.json") {
        font.metadataURL = data.download_url;
      }
    })

  })

};
