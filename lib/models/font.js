import mongoose from 'mongoose'
import metadata from '../metadata.js'
import data from '../data.js'

var Schema = mongoose.Schema

const fontSchema = new Schema({
  name: {
    type: String,
    unique: true,
    required: true
  },
  path: {
    type: String,
    unique: true,
    required: true
  },
  url: String,
  sha: String,
  dataFiles: [Object],
  description: String,
  downloads: Object,
  filenames: [Object]
})


const Font = mongoose.model('Font', fontSchema);

fontSchema.pre('save', function(next) {
  let _this = this
  Font.findOne({ name: _this.name }, function(err, doc) {
    if (!doc) next()
  })
})

export default Font
