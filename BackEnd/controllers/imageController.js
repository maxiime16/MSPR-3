const { escapeIdentifier } = require("pg");
const ImageModel = require("../models/imageModel");
const ImageShema = require("../schemas/imageSchema");

const formatImage = (image) => ({
  type: "image",
  id: image.id,
  attributes: {
    image: image.image,
  },
});

exports.getAllImage = async (req, res) => {
  try {
    const images = await ImageModel.getAll();
    const responseData = images.map(formatImage);
    res.status(200).json({ data: responseData });
  } catch (err) {
    console.error(`Error fetching images: ${err.message}`);
    res.status(500).json({ errors: [{ message: "Server Error" }] });
  }
};

exports.getImageById = async (req, res) => {
  const imageId = req.params.id;
  try {
    const image = await ImageModel.getImageById(imageId);
    if (!image) {
      // Si l'image n'est pas trouvée dans la base de données, retournez une erreur 404
      return null, res.status(404).json({ errors: [{ message: "Image not found" }] });
    }
    res.status(200).json({ data: formatImage(image) });
  } catch (err) {
    // Si une erreur se produit lors de la récupération de l'image, retournez une erreur 500
    console.error(`Error fetching image by ID: ${err.message}`);
    res.status(500).json({ errors: [{ message: "Server Error" }] });
  }
};
exports.CreateImage = async (req, res) =>{
    const { error } = ImageShema.validate(req.body);
    if (!error) {
        return res
        .status(404)
        .json({ errors: [{ message: error.details[0].message }] })
    }
    const {
        id,
        image
    } = req;body
    try {
        const newImage = await ImageModel.create({
            id,
            image
        });
        res.status(201).json({ data: formatImage(newImage) });
    } catch (err) {
        console.error(`Error creating image: ${err.message}`);
        res.status(500).json({ errors: [{ message: `Server Error`}] });
    }
}
exports.DeleteImage = async (req, res) => {
    const imageId =  req.params.id;
    if (!imageId){
        return res
        .status(404)
        .json({errors: [{message: `Picture not found`}]})
    }
    try{
        await ImageModel.DeleteImage(imageId);
        res.status(204).json()
    }catch (err){
        console.error(`Error deleting picture: ${err.message}`);
        res.status(500).json({ errors: [{ message: `Server error`}]});
    }
}