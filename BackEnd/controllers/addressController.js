const AddressModel = require("../models/addressModel");
const addressSchema = require("../schemas/addressSchema");

const formatAddress = (address) => ({
  type: "addresses",
  id: address.id,
  attributes: {
    city: address.city,
    postal_code: address.postal_code,
    longitude: address.longitude,
    latitude: address.latitude,
  },
});

exports.getAllAddresses = async (req, res) => {
  try {
    const addresses = await AddressModel.getAll();
    const responseData = addresses.map(formatAddress);
    res.status(200).json({ data: responseData });
  } catch (err) {
    console.error(`Error fetching addresses: ${err.message}`);
    res.status(500).json({ errors: [{ message: "Server Error" }] });
  }
};

exports.getAddressById = async (req, res) => {
  const addressId = req.params.id;
  if (!addressId) {
    return res
      .status(400)
      .json({ errors: [{ message: "Missing address ID" }] });
  }
  try {
    const address = await AddressModel.getById(addressId);
    if (!address) {
      return res
        .status(404)
        .json({ errors: [{ message: "Address not found" }] });
    }
    res.status(200).json({ data: formatAddress(address) });
  } catch (err) {
    console.error(`Error fetching address by ID: ${err.message}`);
    res.status(500).json({ errors: [{ message: "Server Error" }] });
  }
};

exports.createAddress = async (req, res) => {
  const { error } = addressSchema.validate(req.body);
  if (error) {
    return res
      .status(400)
      .json({ errors: [{ message: error.details[0].message }] });
  }

  const { city, postal_code, longitude, latitude } = req.body;

  try {
    const newAddress = await AddressModel.create({
      city,
      postal_code,
      longitude,
      latitude,
    });
    res.status(201).json({ data: formatAddress(newAddress) });
  } catch (err) {
    console.error(`Error creating address: ${err.message}`);
    res.status(500).json({ errors: [{ message: "Server Error" }] });
  }
};

exports.deleteAddress = async (req, res) => {
  const addressId = req.params.id;

  if (!addressId) {
    return res
      .status(400)
      .json({ errors: [{ message: "Missing address ID" }] });
  }

  try {
    const deletedAddress = await AddressModel.delete(addressId);
    if (!deletedAddress) {
      return res
        .status(404)
        .json({ errors: [{ message: "Address not found" }] });
    }
    res
      .status(204)
      .json({ data: { message: "Address deleted successfully." } });
  } catch (err) {
    console.error(`Error deleting address: ${err.message}`);
    res.status(500).json({ errors: [{ message: "Server Error" }] });
  }
};

exports.updateAddress = async (req, res) => {
  const addressId = req.params.id;
  const { error } = addressSchema.validate(req.body);
  if (error) {
    return res
      .status(400)
      .json({ errors: [{ message: error.details[0].message }] });
  }

  const { city, postal_code, longitude, latitude } = req.body;

  if (!addressId) {
    return res
      .status(400)
      .json({ errors: [{ message: "Missing address ID" }] });
  }

  try {
    const updatedAddress = await AddressModel.update(addressId, {
      city,
      postal_code,
      longitude,
      latitude,
    });

    if (!updatedAddress) {
      return res
        .status(404)
        .json({ errors: [{ message: "Address not found" }] });
    }

    res.status(200).json({ data: formatAddress(updatedAddress) });
  } catch (err) {
    console.error(`Error updating address: ${err.message}`);
    res.status(500).json({ errors: [{ message: "Server Error" }] });
  }
};
