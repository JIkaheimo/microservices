// import * as request from 'supertest';
// import { Test } from '@nestjs/testing';
// import { CatsModule } from './cats.module';
// import { CatsService } from './cats.service';
// import { INestApplication, ValidationPipe } from '@nestjs/common';
// import { catMock, catsServiceMock } from './cats.service.mock';

// describe('Cats', () => {
//   let app: INestApplication;

//   beforeAll(async () => {
//     const moduleRef = await Test.createTestingModule({
//       imports: [CatsModule],
//     })
//       .overrideProvider(CatsService)
//       .useValue(catsServiceMock)
//       .compile();

//     app = moduleRef.createNestApplication();
//     app.useGlobalPipes(new ValidationPipe());
//     await app.init();
//   });

//   it('[GET] /cats', () => {
//     return request(app.getHttpServer())
//       .get('/cats')
//       .expect(200)
//       .expect([catMock]);
//   });

//   it('[POST] /cats', () => {
//     return request(app.getHttpServer()).post('/cats').expect(400);
//   });

//   afterAll(async () => {
//     await app.close();
//   });
// });
