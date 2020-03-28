/**
 * O ProfillerController serve para retornar casos específicos de uma ong
 * foi criado pois, segundo o padrao MVC, caso seja necessário realizar mais
 * de uma funçao do mesmo tipo (nesse casso index) elas devem estar em controllers
 * distintos. Visto que cada controller só deve possuir apenas um index, update,
 * create e delete
 */

const connection = require('../database/connection');

module.exports = {
    async index(request, response) {
        const ong_id = request.headers.authorization;

        const incidents = await connection('incidents')
            .where('ong_id', ong_id)
            .select('*');

        return response.json(incidents);
    }
}