import {FixtureLoader} from '../fixtures/FixtureLoader';
import {Server} from '../src/server';
import {JwtUtils} from '../src/security/JwtUtils';
import {IUser} from '../../shared/models/IUser';
import chai = require('chai');
import chaiHttp = require('chai-http');

export class TestHelper {
  public app = new Server().app;
  public fixtureLoader = new FixtureLoader();
  public baseUrl: string;

  public static commonChaiSetup() {
    chai.use(chaiHttp);
    return chai;
  }

  constructor (BASE_URL: string) {
    this.baseUrl = BASE_URL;
  }

  public async resetForNextTest() {
    // Before each test we reset the database by reloading the fixtures
    await this.fixtureLoader.load();
  }

  public async basicUserGetRequest(user: IUser, url: string, queryOptions?: string | object) {
    return await chai.request(this.app)
      .get(url)
      .query(queryOptions)
      .set('Cookie', `token=${JwtUtils.generateToken(user)}`)
      .catch((err) => err.response);
  }

  public async basicUserPostRequest(user: IUser, url: string, sendData?: string | object) {
    return await chai.request(this.app)
      .post(url)
      .set('Cookie', `token=${JwtUtils.generateToken(user)}`)
      .send(sendData)
      .catch((err) => err.response);
  }

  public async basicUserPutRequest(user: IUser, url: string, sendData?: string | object) {
    return await chai.request(this.app)
      .put(url)
      .set('Cookie', `token=${JwtUtils.generateToken(user)}`)
      .send(sendData)
      .catch((err) => err.response);
  }

  public async basicUserDeleteRequest(user: IUser, url: string) {
    return await chai.request(this.app)
      .del(url)
      .set('Cookie', `token=${JwtUtils.generateToken(user)}`)
      .catch((err) => err.response);
  }

  public async commonUserGetRequest(user: IUser, urlPostfix: string, queryOptions?: string | object) {
    return await this.basicUserGetRequest(user, this.baseUrl + urlPostfix, queryOptions);
  }

  public async commonUserPostRequest(user: IUser, urlPostfix: string, sendData?: string | object) {
    return await this.basicUserPostRequest(user, this.baseUrl + urlPostfix, sendData);
  }

  public async commonUserPutRequest(user: IUser, urlPostfix: string, sendData?: string | object) {
    return await this.basicUserPutRequest(user, this.baseUrl + urlPostfix, sendData);
  }

  public async commonUserDeleteRequest(user: IUser, urlPostfix: string) {
    return await this.basicUserDeleteRequest(user, this.baseUrl + urlPostfix);
  }
}
