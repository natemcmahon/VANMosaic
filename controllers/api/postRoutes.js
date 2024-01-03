const router = require('express').Router();
const { Photo } = require('../../models');
const withAuth = require('../../utils/auth');

router.post('/', withAuth, async (req, res) => {
  try {
    const newPost = await Photo.create({
      ...req.body,
      user_id: req.session.user_id,
    });

    res.status(200).json(newPost);
  } catch (err) {
    res.status(400).json(err);
  }
});

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

router.delete('/:id', withAuth, async (req, res) => {
  try {
    const postData = await Photo.destroy({
      where: {
        id: req.params.id,
        // user_id: req.session.user_id,
      },
    });

    if (!postData) {
      res.status(404).json({ message: 'No post found with this id!' });
      return;
    }

    res.status(200).json(postData);
  } catch (err) {
    res.status(500).json(err);
  }
  
  res.render('profile', {
    ...user,
    logged_in: true
  });
});

module.exports = router;
