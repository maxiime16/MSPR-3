const AdvertisementModel = require("../models/advertisementModel");
const advertisementSchema = require("../schemas/advertisementSchema");

const formatAdvertisement = (advertisement) => ({
  type: "advertisements",
  id: advertisement.id,
  attributes: {
    title: advertisement.title,
    description: advertisement.description,
    longitude: advertisement.longitude,
    latitude: advertisement.latitude,
    start_date: advertisement.start_date,
    end_date: advertisement.end_date,
    city: advertisement.city,
    postal_code: advertisement.postal_code,
    user_id: advertisement.user_id,
    category_id: advertisement.category_id,
    sub_category_id: advertisement.sub_category_id,
  },
});

exports.getAllAdvertisements = async (req, res) => {
  try {
    const advertisements = await AdvertisementModel.getAll();
    const responseData = advertisements.map(formatAdvertisement);
    res.status(200).json({ data: responseData });
  } catch (err) {
    console.error(`Error fetching advertisements: ${err.message}`);
    res.status(500).json({ errors: [{ message: "Server Error" }] });
  }
};

exports.getAdvertisementById = async (req, res) => {
  const advertisementId = req.params.id;
  if (!advertisementId) {
    return res
      .status(400)
      .json({ errors: [{ message: "Missing advertisement ID" }] });
  }
  try {
    const advertisement = await AdvertisementModel.getById(advertisementId);
    res.status(200).json({ data: formatAdvertisement(advertisement) });
  } catch (err) {
    console.error(`Error fetching advertisement by ID: ${err.message}`);
    res.status(500).json({ errors: [{ message: "Server Error" }] });
  }
};

exports.getAdvertisementByUserId = async (req, res) => {
  const userId = req.params.user_id;
  if (!userId) {
    return res.status(400).json({ errors: [{ message: "Missing user ID" }] });
  }
  try {
    const advertisements = await AdvertisementModel.getByUserId(userId);
    const responseData = advertisements.map(formatAdvertisement);
    res.status(200).json({ data: responseData });
  } catch (err) {
    console.error(`Error fetching advertisements by user ID: ${err.message}`);
    res.status(500).json({ errors: [{ message: "Server Error" }] });
  }
};

exports.getAdvertisementByCategoryId = async (req, res) => {
  const categoryId = req.params.category_id;
  if (!categoryId) {
    return res
      .status(400)
      .json({ errors: [{ message: "Missing category ID" }] });
  }
  try {
    const advertisements = await AdvertisementModel.getByCategoryId(categoryId);
    const responseData = advertisements.map(formatAdvertisement);
    res.status(200).json({ data: responseData });
  } catch (err) {
    console.error(
      `Error fetching advertisements by category ID: ${err.message}`
    );
    res.status(500).json({ errors: [{ message: "Server Error" }] });
  }
};

exports.createAdvertisement = async (req, res) => {
  const { error } = advertisementSchema.validate(req.body);
  if (error) {
    return res
      .status(400)
      .json({ errors: [{ message: error.details[0].message }] });
  }

  const {
    title,
    description,
    longitude,
    latitude,
    start_date,
    end_date,
    city,
    postal_code,
    user_id,
    category_id,
    sub_category_id,
  } = req.body;

  try {
    const newAdvertisement = await AdvertisementModel.create({
      title,
      description,
      longitude,
      latitude,
      start_date,
      end_date,
      city,
      postal_code,
      user_id,
      category_id,
      sub_category_id,
    });

    res.status(201).json({ data: formatAdvertisement(newAdvertisement) });
  } catch (err) {
    console.error(`Error creating advertisement: ${err.message}`);
    res.status(500).json({ errors: [{ message: "Server Error" }] });
  }
};

exports.deleteAdvertisement = async (req, res) => {
  const advertisementId = req.params.id;

  if (!advertisementId) {
    return res
      .status(400)
      .json({ errors: [{ message: "Missing advertisement ID" }] });
  }

  try {
    await AdvertisementModel.delete(advertisementId);
    res.status(204).json();
  } catch (err) {
    console.error(`Error deleting advertisement: ${err.message}`);
    res.status(500).json({ errors: [{ message: "Server Error" }] });
  }
};

exports.updateAdvertisement = async (req, res) => {
  const advertisementId = req.params.id;
  const { error } = advertisementSchema.validate(req.body);
  if (error) {
    return res
      .status(400)
      .json({ errors: [{ message: error.details[0].message }] });
  }

  const {
    title,
    description,
    longitude,
    latitude,
    start_date,
    end_date,
    city,
    postal_code,
    user_id,
    category_id,
    sub_category_id,
  } = req.body;

  if (!advertisementId) {
    return res
      .status(400)
      .json({ errors: [{ message: "Missing advertisement ID" }] });
  }

  try {
    const updatedAdvertisement = await AdvertisementModel.update(
      advertisementId,
      {
        title,
        description,
        longitude,
        latitude,
        start_date,
        end_date,
        city,
        postal_code,
        user_id,
        category_id,
        sub_category_id,
      }
    );

    res.status(200).json({ data: formatAdvertisement(updatedAdvertisement) });
  } catch (err) {
    console.error(`Error updating advertisement: ${err.message}`);
    res.status(500).json({ errors: [{ message: "Server Error" }] });
  }
};
