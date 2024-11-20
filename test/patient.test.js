import chai from 'chai';
import chaiHttp from 'chai-http';
import { app } from '../index.js'; // Importa la instancia exportada de 'index.js'

chai.use(chaiHttp);
const { expect } = chai;

describe('Pruebas de API para PhysioCare', () => {
    it('Debe devolver un mensaje de bienvenida en la ruta raíz', (done) => {
        chai.request(app)
            .get('/')
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.text).to.equal('Bienvenido a PhysioCare API');
                done();
            });
    });
});
