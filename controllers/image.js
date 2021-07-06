const Clarifai = require('clarifai');

// API used to detect faces
const app = new Clarifai.App({
  // apiKey: process.env.API_CLARIFAI
  apiKey: '8ae99686d6794b1a8847f0ebdca3359b'
});

const handleApiCall = (req, res) => {
  app.models
    .predict(
      Clarifai.FACE_DETECT_MODEL, 
      req.body.input)
    .then(data => {
      res.json(data);
    })
    .catch(err => res.status(400).json('unable to call API'))
}

const handleImage = (req, res, db) => {
  const { id } = req.body;
  db('users').where('id', '=', id)
    .increment('entries', 1)
    .returning('entries')
    .then(entries => {
      res.json(entries);
    })
    .catch(err => {
      res.status(400).json('unable to get entry count');
    })
}

module.exports = {
  handleApiCall,
  handleImage
};