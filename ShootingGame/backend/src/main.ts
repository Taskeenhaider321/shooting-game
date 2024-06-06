// import { NestFactory } from '@nestjs/core';
// import { AppModule } from './app.module';
// import { IoAdapter } from '@nestjs/platform-socket.io';
// import { GameGateway } from './sockets/game.gateway';

// async function bootstrap() {
//   const app = await NestFactory.create(AppModule);
//   app.useWebSocketAdapter(new IoAdapter(app));

//   const gameGateway = app.get(GameGateway);
//   gameGateway.server = app.createIOServer();

//   await app.listen(3000);
// }

// bootstrap();
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { GameGateway } from './sockets/game.gateway';

async function bootstrap() {
  const app = await NestFactory.create(AppModule,{ cors: true });
  app.useWebSocketAdapter(new IoAdapter(app));

  const httpServer = app.getHttpServer();
  const gameGateway = app.get(GameGateway);

  // Create Socket.IO server using the httpServer
  const io = require('socket.io')(httpServer, {
    path: '/game', // Adjust the path accordingly
  });

  gameGateway.server = io;
  app.enableCors();

  await app.listen(3000);
}

bootstrap();
