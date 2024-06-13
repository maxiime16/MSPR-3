const AdvertisementModel = require("../models/advertisementModel");
const advertisementSchema = require("../schemas/advertisementSchema");

const formatAdvertisement = (advertisement) => ({
  type: "advertisements",
  id: advertisement.id,
  attributes: {
    title: advertisement.title,
    start_date: advertisement.start_date,
    end_date: advertisement.end_date,
    id_user: advertisement.id_user,
    id_address: advertisement.id_address,
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
    if (!advertisement) {
      return res
        .status(404)
        .json({ errors: [{ message: "Advertisement not found" }] });
    }
    res.status(200).json({ data: formatAdvertisement(advertisement) });
  } catch (err) {
    console.error(`Error fetching advertisement by ID: ${err.message}`);
    res.status(500).json({ errors: [{ message: "Server Error" }] });
  }
};

exports.getAdvertisementByUserId = async (req, res) => {
  const userId = req.params.user_id;
  console.log(userId)
  if (!userId) {
    return res.status(400).json({ errors: [{ message: "Missing user ID" }] });
  }
  try {
    const advertisements = await AdvertisementModel.getByUserId(userId);
    if (advertisements.length === 0) {
      return res.status(404).json({
        errors: [{ message: "Advertisements not found for this user" }],
      });
    }
    const responseData = advertisements.map(formatAdvertisement);
    res.status(200).json({ data: responseData });
  } catch (err) {
    console.error(`Error fetching advertisements by user ID: ${err.message}`);
    res.status(500).json({ errors: [{ message: "Server Error" }] });
  }
};


exports.getAdvertisementByAddressId = async (req, res) => {
  const addressId = req.params.address_id;
  if (!addressId) {
    return res
      .status(400)
      .json({ errors: [{ message: "Missing address ID" }] });
  }
  try {
    const advertisements = await AdvertisementModel.getByAddressId(addressId);
    if (advertisements.length === 0) {
      return res.status(404).json({
        errors: [{ message: "Advertisements not found for this address" }],
      });
    }
    const responseData = advertisements.map(formatAdvertisement);
    res.status(200).json({ data: responseData });
  } catch (err) {
    console.error(
      `Error fetching advertisements by address ID: ${err.message}`
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

  const { title, start_date, end_date, id_user, id_address } = req.body;

  try {
    const newAdvertisement = await AdvertisementModel.create({
      title,
      start_date,
      end_date,
      id_user,
      id_address,
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
    const deletedAdvertisement = await AdvertisementModel.delete(
      advertisementId
    );
    if (!deletedAdvertisement) {
      return res
        .status(404)
        .json({ errors: [{ message: "Advertisement not found" }] });
    }
    res
      .status(204)
      .json({ data: { message: "Advertisement deleted successfully." } });
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

  const { title, start_date, end_date, id_user, id_address } = req.body;

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
        start_date,
        end_date,
        id_user,
        id_address,
      }
    );

    if (!updatedAdvertisement) {
      return res
        .status(404)
        .json({ errors: [{ message: "Advertisement not found" }] });
    }

    res.status(200).json({ data: formatAdvertisement(updatedAdvertisement) });
  } catch (err) {
    console.error(`Error updating advertisement: ${err.message}`);
    res.status(500).json({ errors: [{ message: "Server Error" }] });
  }
};

exports.getAdvertisementDetails = async (req, res) => {
  try {
    const advertisementDetails =
      await AdvertisementModel.getAdvertisementDetails();

    // Convertir les images Buffer en base64
    const convertedAds = advertisementDetails.map((ad) => {
      if (ad.firstimage) {
        ad.firstimage = ad.firstimage.toString("base64");
      }
      return ad;
    });

    res.status(200).json({ data: convertedAds });
  } catch (err) {
    console.error(`Error fetching advertisement details: ${err.message}`);
    res.status(500).json({ errors: [{ message: "Server Error" }] });
  }
};

exports.getAdvertisementDetailsById = async (req, res) => {
  const advertisementId = req.params.id;
  if (!advertisementId) {
    return res
      .status(400)
      .json({ errors: [{ message: "Missing advertisement ID" }] });
  }
  try {
    const advertisementDetails =
      await AdvertisementModel.getAdvertisementDetailsById(advertisementId);
    if (!advertisementDetails) {
      return res
        .status(404)
        .json({ errors: [{ message: "Advertisement not found" }] });
    }

    res.status(200).json({ data: advertisementDetails });
  } catch (err) {
    console.error(`Error fetching advertisement details by ID: ${err.message}`);
    res.status(500).json({ errors: [{ message: "Server Error" }] });
  }
};
