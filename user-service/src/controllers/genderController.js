const { Gender } = require('../config/db').models;

exports.createGender = async (req, res) => {
  try {
    const gender = await Gender.create(req.body);
    res.status(201).json(gender);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getAllGenders = async (req,res) => {
  try{
    const genders = await Gender.findAll({
      attributes: ['id', 'name'],
    });
    res.status(200).json(genders);
  } catch (error) {
    res.status(400).json({error : error.message});
  }
};