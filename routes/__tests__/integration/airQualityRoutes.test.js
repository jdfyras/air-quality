const request = require('supertest')
const app = require('../../../app') // Assurez-vous que vous importez correctement votre application

describe('Air Quality API', function () {
    it('should get air quality data', function (done) {
        request(app)
            .get('/air-quality')
            .expect(200)
            .end(function (err, res) {
                if (err) return done(err)
                // Assurez-vous que la réponse est conforme à vos attentes
                assert.strictEqual(res.body.city, 'Paris')
                assert.strictEqual(res.body.latitude, 48.856613)
                assert.strictEqual(res.body.longitude, 2.352222)
                // Vous pouvez ajouter d'autres assertions ici pour valider les données de qualité de l'air.
                done()
            })
    })
})
