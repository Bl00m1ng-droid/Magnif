// routes/uploadRoutes.js (or directly in the route handler)
const cloudinary = require('../config/cloudinary');
const fs = require('fs');

router.post('/', requireAuth, requireAdmin, upload.single('image'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }

  try {
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: 'magnif-products',
    });
    fs.unlinkSync(req.file.path); // clean up the temp local file
    res.json({ url: result.secure_url });
  } catch (err) {
    console.error('Cloudinary upload failed:', err);
    res.status(500).json({ message: 'Image upload failed' });
  }
});

module.exports = router;