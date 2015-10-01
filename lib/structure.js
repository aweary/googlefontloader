import request from 'request'
import auth from '../auth.js'

/**
 * Iterate over the data files for the font and parse
 * out the URLs for the METADATA.json file, description,
 * and all download links
 * @param  {object} font
 * @return {Promise}
 */

export default function structure(fonts) {

  return new Promise(function(resolve, reject) {

    let length = fonts.length

    fonts.forEach(font => {

      if (!font) return
      if (!font.downloads) font.downloads = []
      if (!font.filenames) font.filenames = []
      let index = fonts.indexOf(font)

      font.dataFiles.forEach((data) => {

        /* If the file is a TTF font file, cache it's name and URL */
        if (data.path.match(/\.ttf$/)) {
          let obj = {name: data.name, download: data.download_url}
          font.downloads.push(obj)
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

      if (index === length - 1) resolve(fonts)

    })
  })
}
