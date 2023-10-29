const mongoose = require('mongoose')
/**
 * Modèle de données pour la qualité de l'air.
 *
 * @typedef {Object} AirQuality
 * @property {string} city - Le nom de la ville.
 * @property {number} latitude - La latitude de la ville.
 * @property {number} longitude - La longitude de la ville.
 * @property {Date} timestamp - Horodatage des données.
 * @property {number} aqius - Indice de qualité de l'air aux États-Unis.
 * @property {string} mainus - Catégorie principale de la qualité de l'air aux États-Unis.
 * @property {number} aqicn - Indice de qualité de l'air en Chine.
 * @property {string} maincn - Catégorie principale de la qualité de l'air en Chine.
 */

const airQualitySchema = new mongoose.Schema({
    city: String,
    latitude: Number,
    longitude: Number,
    timestamp: Date,
    aqius: Number,
    mainus: String,
    aqicn: Number,
    maincn: String
})

airQualitySchema.set('toJSON', {
    virtuals: true
})

const airQualityModel = mongoose.model('AirQuality', airQualitySchema)

module.exports = airQualityModel
