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

  public async commonUserGetRequest(user: IUser, urlPostfix: string, queryOptions?: string | object) {
    return await chai.request(this.app)
      .get(this.baseUrl + urlPostfix)
      .query(queryOptions)
      .set('Cookie', `token=${JwtUtils.generateToken(user)}`)
      .catch((err) => err.response);
  }
}
