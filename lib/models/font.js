import mongoose from 'mongoose'
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
  dataFiles: Object
})

export default mongoose.model('Font', fontSchema);
