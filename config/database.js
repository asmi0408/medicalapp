if(process.env.NODE_ENV === 'production'){
  module.exports = {mongoURI: 'cloud mongo database'}
} else {
  module.exports = {mongoURI: 'mongodb://localhost:27017/medicalapp'}
}