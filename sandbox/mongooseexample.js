const utils = require('../utils/utils');
const mongoose = require('mongoose');
const refSchema = require('./ref');
const catSchema = require('./cat');

mongoose.connect('mongodb://localhost:27017/sandbox');

console.log('Connected');
const Cat = mongoose.model('Cat', catSchema);
const Ref = mongoose.model('Ref', refSchema);

console.log('Models created');

const cat = new Cat({
  name: 'Sociology'
});

//FIXME(lietwin) the reference is not saved
const ref = new Ref({
  title: 'Monaco Rocher',
  imgs:[
    { src: 'image1.jpg', alt: 'Monaco Rocher vue de face' },
    { src: 'image2.png', alt: 'Monaco Rocher vue de profil' }
  ],
  cat: 'cat'
});

console.log('Entries created');
cat.save((err, cat) => {
  utils.checkErr(err);
  console.log('Cat found' + JSON.stringify(cat));
});

ref.save((err, ref) => {
  utils.checkErr(err);
  console.log('Ref found' + JSON.stringify(ref));
});

console.log('Entries saved');
process.exit(0);
