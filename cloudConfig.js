const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');


cloudinary.config({ 
    cloud_name: 'dlccvkytw', 
    api_key: '656119136267377', 
    api_secret: 'GD5hAm6pu9t4iCXZl9LwDKXMa3I' // Click 'View API Keys' above to copy your API secret
});

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: 'TravelingWebsiteStorage',
      allowerdFormate : ["jpg","png","jpeg"],
      
    },
  });

module.exports ={
    cloudinary,
    storage
};