const AdvertisementModel = require("../models/advertisementModel");

exports.getAllAdvertisements = async (req, res) => {
  try {
    const advertisements = await AdvertisementModel.getAll();
    const responseData = advertisements.map((advertisement) => ({
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
    }));
    res.status(200).json({ data: responseData });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

exports.getAdvertisementById = async (req, res) => {
  const advertisementId = req.params.id;
  try {
    const advertisement = await AdvertisementModel.getById(advertisementId);
    const responseData = {
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
    };
    res.status(200).json({ data: responseData });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

exports.getAdvertisementByIdUser = async (req, res) => {
  const userId = req.params.user_id;
  try {
    const advertisements = await AdvertisementModel.getByIdUser(userId);
    const responseData = advertisements.map((advertisement) => ({
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
    }));
    res.status(200).json({ data: responseData });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

exports.getAdvertisementByIdCategory = async (req, res) => {
  const categoryId = req.params.category_id;
  try {
    const advertisements = await AdvertisementModel.getByIdCategory(categoryId);
    const responseData = advertisements.map((advertisement) => ({
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
    }));
    res.status(200).json({ data: responseData });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

exports.createAdvertisement = async (req, res) => {
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

    res.status(201).json({ data: newAdvertisement });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ errors: [{ message: "Server Error" }] });
  }
};

exports.deleteAdvertisement = async (req, res) => {
  const advertisementId = req.params.id;

  try {
    await AdvertisementModel.delete(advertisementId);

    res.status(204).send();
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ errors: [{ message: "Server Error" }] });
  }
};

exports.updateAdvertisement = async (req, res) => {
  const advertisementId = req.params.id;
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

    res.status(200).json({ data: updatedAdvertisement });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ errors: [{ message: "Server Error" }] });
  }
};
