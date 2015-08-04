import request from 'request'
import auth from '../auth.js'

/**
 * Iterate over the data files for the font and parse
 * out the URLs for the METADATA.json file, description,
 * and all download links
 * @param  {object} font
 * @return {Promise}
 */

export default function structure(font) {

  return new Promise(function(resolve, reject) {

    if (!font) return
    if (!font.downloads) font.downloads = {}
    if (!font.filenames) font.filenames = []

    font.dataFiles.forEach((data) => {

      /* If the file is a TTF font file, cache it's name and URL */
      if (data.path.match(/\.ttf$/)) {
        font.downloads[data.name] = data.download_url
        font.filenames.push(data.name)
      }

      /* Parse the METADATA.json files */
      if (data.name === 'METADATA.json') {
        font.metadataURL = data.url
      }

      if (data.name === 'DESCRIPTION.en_us.html') {
        font.descriptionURL = data.url
      }
    })

    if (font.metadataURL) resolve(font)
    else reject(font)

  })
}
