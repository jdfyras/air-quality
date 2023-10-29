const express = require('express')
const router = express.Router()
const { getAirQuality, getMostPolluted } = require('../controllers/airQualityController.js')

/**
 * Routes pour la gestion de la qualité de l'air.
 *
 * @namespace airQualityRoute
 */

/**
 * Route pour obtenir la qualité de l'air pour une position géographique donnée.
 *
 * @name GET/air-quality
 * @function    
 */
router.get('/air-quality', getAirQuality)

/**
 * Route pour obtenir les données de qualité de l'air les plus polluées.
 *
 * @name GET/most-polluted-time
 * @function
 */
router.get('/most-polluted-time', getMostPolluted)

module.exports = router
