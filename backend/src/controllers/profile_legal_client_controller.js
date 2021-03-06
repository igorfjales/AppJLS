const connection = require('../database/connection');

module.exports = {
    async index(request, response) {

        const pk_id_legal_client = request.headers.authorization;

        const legal_client = await connection('tb_legal_client')
            .where('pk_id_legal_client', pk_id_legal_client)
            .select('*');

        return response.json(legal_client);
    },

    async update(request, response) {
        const {pk_id_legal_client, cnpj, name, email, whatsapp, city, uf, newEmail, password } = request.body;

        const update_user = await connection('tb_legal_client')
            .where('pk_id_legal_client', pk_id_legal_client)
            .and
            .where('email', email)
            .and
            .where('password', password)
            .update({ cnpj: cnpj, name: name, email: newEmail, whatsapp: whatsapp, city: city, uf: uf });

        return response.json(update_user);
    },

    async delete(request, response) {
        const pk_id_legal_client = request.headers.authorization;
        
        const user = await connection('tb_legal_client')
            .where('pk_id_legal_client', pk_id_legal_client)
            .select('pk_id_legal_client')
            .first();

        if (user.pk_id_legal_client != pk_id_legal_client) {
            return response.status(401).json({ error: 'Operation not permitted' });
        }

        await connection('tb_legal_client').where('pk_id_legal_client', pk_id_legal_client).delete();

        return response.status(204).send();
    }
}

