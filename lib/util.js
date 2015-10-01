/**
* create a Buffer object from the data.content property
* and decode the base64 content
* @param  {[type]} data [description]
* @return {[type]}      [description]
*/

export function decodeBufferContent(data) {
  let parsed = JSON.parse(data)
  let buff = Buffer(data.content, 'base64').toString()
  return JSON.parse(buff)
}

export function formatURL(urls) {
  return urls.map(url => {
    return `https://api.github.com/repos/google/fonts/contents/${url}?ref=master`
  })
}
