const request = require('supertest');
const app = require('../../src/app');
const connection = require('../../src/database/connection');

let ong_id;
let incident_id;

beforeAll(async () => {
    await connection.migrate.rollback();
    await connection.migrate.latest();
});

afterAll(async () =>{
    await connection.destroy();
});

describe('ONG', () => {
    it('should be able to create a new ONG', async () => {
        const response = await request(app)
            .post('/ongs')
            .send({
                name: "APAD2",
                email: "contato@apad.com.br",
                whatsapp: "4700000000",
                city: "Rio do Sul",
                uf: "SC",
            });

        ong_id = response.body.id;

        expect(response.body).toHaveProperty('id');
        expect(response.body.id).toHaveLength(8);
    });

    it('should be able to display ONG', async () => {
        const response = await request(app)
            .get('/ongs');

        expect(response.status).toBe(200);
    });
});

describe('LOGIN', () => {
    it('should authenticate with valid credentials', async () => {
        const response = await request(app)
            .post('/sessions')
            .send({
                id: ong_id,
            });

        expect(response.status).toBe(200);
    });
});

describe('PROFILE', () => {
    it('should be able to display incident of a profile', async () => {
        const response = await request(app)
            .get('/profile')
            .auth('authorization', ong_id)

        expect(response.status).toBe(200);
    });
});


describe('INCIDENT', () => {
    it('should be able to create a new incident', async () => {
        const response = await request(app)
            .post('/incidents')
            .auth('authorization', ong_id)
            .send({
                title: "Caso teste",
                description: "Detalhes do caso",
                value: 120,
            });

        incident_id = response.body.id;

        expect(response.body).toHaveProperty('id');
    });

    it('should be able to display incident', async () => {
        const response = await request(app)
            .get('/incidents');

        expect(response.status).toBe(200);
    });

    it('should be able to delete a incident', async () => {
        const response = await request(app)
            .delete(`/incidents/${incident_id}`)
            .auth('authorization', ong_id);

        expect(response.status).toBe(204);
    });
});