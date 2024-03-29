const router = require('express').Router();
const { Photo, User } = require('../../models');
const withAuth = require('../../utils/auth');
const { initializeApp } = require('firebase/app');
const { getStorage, ref, getDownloadURL, uploadBytesResumable } = require('firebase/storage');
const multer = require('multer');
const firebaseConfig = require('../../config/firebase');

const firebase = initializeApp(firebaseConfig);

const storage = getStorage();
const upload = multer({ storage: multer.memoryStorage() })

// router.post('/test', upload.single("filename"), async (req, res) => {
//   try {
//       const storageRef = ref(storage, `files/${req.file.originalname}`);

//       //type of file
//       const metadata = {
//           contentType: req.file.mimetype
//       };
//       const snapshot = await uploadBytesResumable(storageRef, req.file.buffer, metadata);
//       const downloadURL = await getDownloadURL(snapshot.ref);

//       console.log('File successfully uploaded');
//       return res.send({
//           message: 'file uploaded to Firebase',
//           name: req.file.originalname,
//           type: req.file.mimetype,
//           downloadURL: downloadURL
//       });

//   } catch (err) {
//       return res.status(400).send(err.message);
//   }
// });


//file upload route
router.post('/', upload.single("file"), async (req, res) => {
  try {
    //this is where we are storing the files
    const storageRef = ref(storage, `files/${req.file.originalname}`);

    //type of file
    const metadata = {
        contentType: req.file.mimetype
    };
    const snapshot = await uploadBytesResumable(storageRef, req.file.buffer, metadata);
    const downloadURL = await getDownloadURL(snapshot.ref);

    console.log('File successfully uploaded');

    //adding photo to our DB
    const post = await Photo.create({
      photo_data: downloadURL,
      user_id: req.session.user_id,
    })

    res.redirect('/profile');
    return;

} catch (err) {
    return res.status(400).send(err.message);
}

});


//put route for updating photos
router.put('/:id', withAuth, async (req, res) => {
  console.log("right before route");
  try {
    const postData = await Photo.update({
        ...req.body,
        where: {
          id: req.params.id,
        },
    });

    console.log("after update call");

    res.status(200).json(postData);
  } catch (err) {
    res.status(400).json(err);
  }
});

//delete photo route
router.delete('/:id', withAuth, async (req, res) => {
  try {
    const postData = await Photo.destroy({
      where: {
        id: req.params.id,
        user_id: req.session.user_id,
      },
    });

    if (!postData) {
      res.status(404).json({ message: 'No project found with this id!' });
      return;
    }
    res.redirect('/profile');
    return;
    
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});


module.exports = router;
