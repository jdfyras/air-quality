/**
 * @module airQualityController
 */
const axios = require('axios')
const AirQualityModel = require('../models/airQualityModel')

module.exports = {
    /**
     * Récupère la qualité de l'air pour une position géographique donnée.
     *
     * @async
     * @function
     * @param {object} req - L'objet de requête Express.
     * @param {object} res - L'objet de réponse Express.
     * @param {function} next - La fonction de middleware suivant.
     */
    getAirQuality: async (req, res, next) => {
        try {
            const { latitude, longitude } = req.query

            if (!latitude || !longitude) {
                return res.status(400).json({
                    success: false,
                    statusCode: 400,
                    message: 'Les coordonnées GPS (latitude et longitude) sont requises.'
                })
            }
            if (latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) {
                return res.status(400).json({
                    success: false,
                    statusCode: 400,
                    message:
                        'Les coordonnées GPS (latitude et longitude) doivent être comprises entre -90 et 90 degrés pour la latitude et entre -180 et 180 degrés pour la longitude.'
                })
            }
            let params = new URLSearchParams()
            params.append('lat', req.params.lat)
            params.append('lon', req.params.lon)
            params.append('key', process.env.API_KEY)
            let config = {
                method: 'get',
                maxBodyLength: Infinity,
                url: `${process.env.URL}/v2/nearest_city`,
                params
            }

            let response = await axios.request(config)

            const airQualityData = {
                result: {
                    pollution: {
                        ts: response.data.data.current.weather.ts,
                        aqius: response.data.data.current.pollution.aqius,
                        mainus: response.data.data.current.pollution.mainus,
                        aqicn: response.data.data.current.pollution.aqicn,
                        maincn: response.data.data.current.pollution.maincn
                    }
                }
            }

            return res.json(airQualityData)
        } catch (err) {
            console.error(err)
            return next({
                message:
                    "Une erreur s'est produite lors de la récupération de la qualité de l'air.",
                status: 500
            })
        }
    },

    /**
     * Récupère les données de qualité de l'air les plus polluées.
     *
     * @async
     * @function
     * @param {object} req - L'objet de requête Express.
     * @param {object} res - L'objet de réponse Express.
     * @param {function} next - La fonction de middleware suivant.
     */
    getMostPolluted: async (req, res, next) => {
        try {
            const mostPollutedData = await AirQualityModel.findOne({}).sort({
                aqius: -1,
                timestamp: -1
            })

            if (!mostPollutedData) {
                return res.status(404).json({ message: 'No air quality data found.' })
            }

            res.json(mostPollutedData.timestamp)
        } catch (err) {
            console.error('Error in GET /most-polluted-time:', err)
            return next({
                message: 'Internal server error',
                status: 500
            })
        }
    },
    /**
     * Un travail planifié (cron job) pour récupérer les données de qualité de l'air pour une localisation spécifique (par exemple, Paris).
     *
     * @async
     * @function
     */
    airQualityCronJob: async () => {
        try {
            let params = new URLSearchParams()
            params.append('lat', 48.856613)
            params.append('lon', 2.352222)
            params.append('key', process.env.API_KEY)
            let config = {
                method: 'get',
                maxBodyLength: Infinity,
                url: `${process.env.URL}/v2/nearest_city`,
                params
            }

            let response = await axios.request(config)

            const airQualityData = {
                city: 'Paris',
                latitude: 48.856613,
                longitude: 2.352222,
                timestamp: new Date(),
                aqius: response.data.data.current.pollution.aqius,
                mainus: response.data.data.current.pollution.mainus,
                aqicn: response.data.data.current.pollution.aqicn,
                maincn: response.data.data.current.pollution.maincn
            }

            const airQuality = new AirQualityModel(airQualityData)
            await airQuality.save()

            console.log(
                "Données de qualité de l'air de Paris enregistrées avec succès.",
                airQualityData
            )
        } catch (error) {
            console.error("Erreur lors de la récupération de la qualité de l'air de Paris :", error)
        }
    }
}
