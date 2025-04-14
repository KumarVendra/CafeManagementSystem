const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('./server'); // Make sure server.js exports your Express app
const mongoose = require('mongoose');

chai.use(chaiHttp);
const expect = chai.expect;


describe('Cafe Management - CRUD Tests', () => {

  let createdChefId = null; // will be used for update and delete

  // 1. Create - Valid
  it('should create a new chef with valid data', done => {
    chai.request(app)
      .post('/api/staff')
      .send({
        name: "Test Chef",
        email: "testchef@example.com",
        phone: "1234567890",
        age: 35,
        specialItems: "Tandoori",
        price: 250,
        description: "Specialist in Indian cuisine"
      })
      .end((err, res) => {
        expect(res).to.have.status(201);
        expect(res.body).to.have.property('_id');
        createdChefId = res.body._id;
        done();
      });
  });

  // 2. Create - Duplicate Email
  it('should not allow duplicate email', done => {
    chai.request(app)
      .post('/api/staff')
      .send({
        name: "Duplicate Chef",
        email: "testchef@example.com",
        phone: "9999999999",
        age: 30,
        specialItems: "Burger",
        price: 150,
        description: "Fast food chef"
      })
      .end((err, res) => {
        expect(res).to.have.status(400);
        done();
      });
  });

  // 3. Create - Missing Fields
  it('should not create chef with missing fields', done => {
    chai.request(app)
      .post('/api/staff')
      .send({
        email: "incomplete@example.com"
      })
      .end((err, res) => {
        expect(res).to.have.status(400);
        done();
      });
  });

  // 4. Read - Get All
  it('should return an array of chefs', done => {
    chai.request(app)
      .get('/api/staff')
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('array');
        done();
      });
  });

  // 5. Read - Get By Email
  it('should return a chef by email', done => {
    chai.request(app)
      .get('/api/staff/testchef@example.com')
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.email).to.equal("testchef@example.com");
        done();
      });
  });

  // 6. Read - Invalid Email
  it('should return 404 for non-existing email', done => {
    chai.request(app)
      .get('/api/staff/notfound@example.com')
      .end((err, res) => {
        expect(res).to.have.status(404);
        done();
      });
  });

  // 7. Update - Valid
  it('should update chef details', done => {
    chai.request(app)
      .put(`/api/staff/${createdChefId}`)
      .send({ price: 300, description: "Updated chef description" })
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.price).to.equal(300);
        done();
      });
  });

  // 8. Update - Invalid ID
  it('should return 404 for update with invalid ID', done => {
    chai.request(app)
      .put('/api/staff/invalidid123456')
      .send({ name: "Invalid Update" })
      .end((err, res) => {
        expect(res).to.have.status(500); // or 400 depending on your error handling
        done();
      });
  });

  // 9. Delete - Valid
  it('should delete chef by ID', done => {
    chai.request(app)
      .delete(`/api/staff/${createdChefId}`)
      .end((err, res) => {
        expect(res).to.have.status(200);
        done();
      });
  });

  // 10. Delete - Already Deleted
  it('should return 404 if deleting same chef again', done => {
    chai.request(app)
      .delete(`/api/staff/${createdChefId}`)
      .end((err, res) => {
        expect(res).to.have.status(404);
        done();
      });
  });

  // Optional: Close DB after tests
  after(() => {
    mongoose.connection.close();
  });
});
