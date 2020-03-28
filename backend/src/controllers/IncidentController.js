const connection = require('../database/connection');

module.exports = {
    // selecionar todos os campos de todos os registros da tabela casos
    async index(request, response) {
        const { page = 1 } = request.query;

        const [count] = await connection('incidents').count();

        const incidents = await connection('incidents')
            .join('ongs', 'ongs.id', '=', 'incidents.ong_id')
            .limit(5)
            .offset((page - 1) * 5)
            .select([
                'incidents.*',
                'ongs.name',
                'ongs.email',
                'ongs.whatsapp',
                'ongs.city',
                'ongs.uf'
            ]);

        response.header('X-Total-Count', count['count(*)']);
    
        return response.json(incidents);
    },
    
    // cadastrar um caso
    async create(request, response) {
        const {	title, description, value } = request.body;
        const ong_id = request.headers.authorization;

        const [id] = await connection('incidents').insert({
            title,
            description,
            value,
            ong_id,
        });

        return response.json({ id });
    },

    // remove um caso específico
    async delete(request, response) {
        const { id } = request.params;
        const ong_id = request.headers.authorization;

        const incident = await connection('incidents')
            .where('id', id)
            .select('ong_id')
            .first(); //seleciona o primeiro elemento DOM conhecidente

        if(incident.ong_id != ong_id) {
            return response.status(401).json({ error: 'Operation not permitted. '}); //401 é o estado de nao autorizado
        }

        await connection('incidents').where('id',id).delete();

        return response.status(204).send();
    }
};