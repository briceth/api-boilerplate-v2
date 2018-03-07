let server = require("../server");

var User = require("../models/User");
var factory = require("./00-modelFactory");

var chai = require("chai");
var should = require("chai").should();
var chaiHttp = require("chai-http");
chai.use(chaiHttp);

describe("Recovery of password", function() {
  describe("POST /api/user/forgotten_password", function() {
    beforeEach(done => {
      User.remove({}, err => {
        done();
      });
    });
    it("Returns a message if unknowm email", function(done) {
      let request = {
        email: "wrong@mail.com"
      };
      chai
        .request(server)
        .post(`/api/user/forgotten_password`)
        .send(request)
        .end(function(err, res) {
          // should.not.exist(err);
          res.should.have.status(400);
          res.should.be.a("object");
          res.body.should.have
            .property("error")
            .that.include(
              "We don't have a user with this email in our dataBase"
            );
          done();
        });
    });
    it("Returns a message if no email provided", function(done) {
      let request = {};
      chai
        .request(server)
        .post(`/api/user/forgotten_password`)
        .send(request)
        .end(function(err, res) {
          res.should.have.status(400);
          res.should.be.a("object");
          res.body.should.have
            .property("error")
            .that.include("No email specified");
          done();
        });
    });
    it("Returns a message if email is not confirmed", function(done) {
      factory.user({ emailCheckValid: false }, function(user) {
        let request = {
          email: user.email
        };
        chai
          .request(server)
          .post(`/api/user/forgotten_password`)
          .send(request)
          .end(function(err, res) {
            res.should.have.status(400);
            res.should.be.a("object");
            res.body.should.have
              .property("error")
              .that.include("Your email is not confirmed");
            done();
          });
      });
    });
    it("Sends an email to redefine password", function(done) {
      factory.user({ emailCheckValid: true }, function(validUser) {
        let request = {
          email: validUser.email
        };
        chai
          .request(server)
          .post(`/api/user/forgotten_password`)
          .send(request)
          .end(function(err, res) {
            should.not.exist(err);
            res.should.have.status(200);
            res.should.be.a("object");
            res.body.should.have
              .property("message")
              .that.include(
                "An email has been send with a link to change your password"
              );
            done();
          });
      });
    });
  });

  describe("GET /api/user/reset_password", function() {
    let validEmailUser = null;
    let notValidEmailUser = null;
    let outDatedTokenUser = null;
    let alreadyUsedLinkUser = null;
    before(async function() {
      const initialPassword = "old_password";
      try {
        validEmailUser = await factory.user({
          email: "validEmail@mail.com",
          emailCheckValid: true,
          password: initialPassword,
          passwordChangeValid: true
        });
        notValidEmailUser = await factory.user({
          email: "notValidEmail@mail.com",
          emailCheckValid: false,
          password: initialPassword,
          passwordChangeValid: true
        });
        alreadyUsedLinkUser = await factory.user({
          email: "alreadyUsedLink@mail.com",
          emailCheckValid: true,
          password: initialPassword,
          passwordChangeValid: false
        });
        let threeHoursAgo = new Date();
        threeHoursAgo.setHours(threeHoursAgo.getHours() - 3);
        outDatedTokenUser = await factory.user({
          email: "outDatedToken@mail.com",
          emailCheckValid: true,
          password: initialPassword,
          passwordChangeValid: true,
          passwordChangeCreatedAt: threeHoursAgo
        });
      } catch (e) {
        console.error(e);
      }
    });
    it("Raise error if no email given", function(done) {
      // console.log(notValidEmailUser.email);
      // console.log(validEmailUser.email);
      chai
        .request(server)
        .get(`/api/user/reset_password`)
        .end(function(err, res) {
          res.should.have.status(401);
          res.should.be.a("object");
          res.body.should.have
            .property("error")
            .that.include("No email specified");
          done();
        });
    });
    it("Raise error if no token given", function(done) {
      chai
        .request(server)
        .get(`/api/user/reset_password?email=hello@mail.com`)
        .end(function(err, res) {
          res.should.have.status(401);
          res.should.be.a("object");
          res.body.should.have
            .property("error")
            .that.include("No token specified");
          done();
        });
    });
    it("Raise error if email is not in database", function(done) {
      chai
        .request(server)
        .get(`/api/user/reset_password?email=hello@mail.com&token=some_token`)
        .end(function(err, res) {
          res.should.have.status(401);
          res.should.be.a("object");
          res.body.should.have
            .property("error")
            .that.include("Wrong credentials");
          done();
        });
    });
    it("Raise error if token doen't match users changing password token", function(done) {
      chai
        .request(server)
        .get(
          `/api/user/reset_password?email=${
            validEmailUser.email
          }&token=some_token`
        )
        .end(function(err, res) {
          res.should.have.status(401);
          res.should.be.a("object");
          res.body.should.have
            .property("error")
            .that.include("Wrong credentials");
          done();
        });
    });
    it("Raise error if the change password link has already been used", function(done) {
      chai
        .request(server)
        .get(
          `/api/user/reset_password?email=${alreadyUsedLinkUser.email}&token=${
            alreadyUsedLinkUser.passwordChange.token
          }`
        )
        .end(function(err, res) {
          res.should.have.status(401);
          res.should.be.a("object");
          res.body.should.have
            .property("error")
            .that.include("link has already been used");
          done();
        });
    });
    it("Raise error if user.passwordChange.token is outdated", function(done) {
      chai
        .request(server)
        .get(
          `/api/user/reset_password?email=${outDatedTokenUser.email}&token=${
            outDatedTokenUser.passwordChange.token
          }`
        )
        .end(function(err, res) {
          res.should.have.status(401);
          res.should.be.a("object");
          res.body.should.have.property("error").that.include("Outdated link");
          res.body.should.have
            .property("message")
            .that.include("link is outdated");
          done();
        });
    });
    it("Raise error if user has not validated email", function(done) {
      chai
        .request(server)
        .get(
          `/api/user/reset_password?email=${notValidEmailUser.email}&token=${
            notValidEmailUser.passwordChange.token
          }`
        )
        .end(function(err, res) {
          res.should.have.status(401);
          res.should.be.a("object");
          res.body.should.have
            .property("error")
            .that.include("Email not confirmed");
          res.body.should.have
            .property("message")
            .that.include("validate your email first");
          done();
        });
    });
    it("Reset password when user is OK ", function(done) {
      chai
        .request(server)
        .get(
          `/api/user/reset_password?email=${validEmailUser.email}&token=${
            validEmailUser.passwordChange.token
          }`
        )
        .end(function(err, res) {
          should.not.exist(err);
          res.should.be.a("object");
          res.body.should.have
            .property("message")
            .that.include("Ready to recieve new password");
          done();
        });
    });
  });
});