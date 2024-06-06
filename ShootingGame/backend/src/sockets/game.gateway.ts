import { WebSocketGateway, WebSocketServer, SubscribeMessage, MessageBody, ConnectedSocket } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway()
export class GameGateway {
  @WebSocketServer() server: Server;

  private backEndPlayers = {};
  private backEndProjectiles = {};

  private SPEED = 5;
  private RADIUS = 10;
  private PROJECTILE_RADIUS = 5;
  private projectileId = 0;

  @SubscribeMessage('shoot')
  handleShoot(@MessageBody() data: { x: number; y: number; angle: number }, @ConnectedSocket() client: Socket) {
    this.projectileId++;

    const velocity = {
      x: Math.cos(data.angle) * 5,
      y: Math.sin(data.angle) * 5,
    };

    this.backEndProjectiles[this.projectileId] = {
      x: data.x,
      y: data.y,
      velocity,
      playerId: client.id,
    };

    console.log(this.backEndProjectiles);
  }

  @SubscribeMessage('initGame')
  handleInitGame(@MessageBody() data: { username: string; width: number; height: number }, @ConnectedSocket() client: Socket) {
    this.backEndPlayers[client.id] = {
      x: 1024 * Math.random(),
      y: 576 * Math.random(),
      color: `hsl(${360 * Math.random()}, 100%, 50%)`,
      sequenceNumber: 0,
      score: 0,
      username: data.username,
      canvas: {
        width: data.width,
        height: data.height,
      },
      radius: this.RADIUS,
    };
  }

  @SubscribeMessage('keydown')
  handleKeyDown(@MessageBody() data: { keycode: string; sequenceNumber: number }, @ConnectedSocket() client: Socket) {
    const backEndPlayer = this.backEndPlayers[client.id];

    if (!backEndPlayer) return;

    backEndPlayer.sequenceNumber = data.sequenceNumber;

    switch (data.keycode) {
      case 'KeyW':
        backEndPlayer.y -= this.SPEED;
        break;

      case 'KeyA':
        backEndPlayer.x -= this.SPEED;
        break;

      case 'KeyS':
        backEndPlayer.y += this.SPEED;
        break;

      case 'KeyD':
        backEndPlayer.x += this.SPEED;
        break;
    }

    const playerSides = {
      left: backEndPlayer.x - backEndPlayer.radius,
      right: backEndPlayer.x + backEndPlayer.radius,
      top: backEndPlayer.y - backEndPlayer.radius,
      bottom: backEndPlayer.y + backEndPlayer.radius,
    };

    if (playerSides.left < 0) backEndPlayer.x = backEndPlayer.radius;

    if (playerSides.right > backEndPlayer.canvas.width)
      backEndPlayer.x = backEndPlayer.canvas.width - backEndPlayer.radius;

    if (playerSides.top < 0) backEndPlayer.y = backEndPlayer.radius;

    if (playerSides.bottom > backEndPlayer.canvas.height)
      backEndPlayer.y = backEndPlayer.canvas.height - backEndPlayer.radius;
  }

//   @SubscribeMessage('disconnect')
//   handleDisconnect(reason: string) {
//     console.log(reason);
//     delete this.backEndPlayers[this.socket.id];
//     this.server.emit('updatePlayers', this.backEndPlayers);
//   }

    // Define the handleDisconnect method
    @SubscribeMessage('disconnect')
    handleDisconnect(@ConnectedSocket() client: Socket, reason: string) {
      console.log(reason);
      delete this.backEndPlayers[client.id];
      this.server.emit('updatePlayers', this.backEndPlayers);
    }

    @SubscribeMessage('message')
    handleMessage(client: any, payload: any): void {
       this.server.emit('msg', payload); // Broadcast message to all connected clients
    }
  

  // Define the handleTicker method
  handleTicker() {
    // Update projectile positions
    for (const id in this.backEndProjectiles) {
      this.backEndProjectiles[id].x += this.backEndProjectiles[id].velocity.x;
      this.backEndProjectiles[id].y += this.backEndProjectiles[id].velocity.y;

      // Check if projectile is out of bounds
      if (
        this.backEndProjectiles[id].x - this.PROJECTILE_RADIUS >=
          this.backEndPlayers[this.backEndProjectiles[id].playerId]?.canvas?.width ||
        this.backEndProjectiles[id].x + this.PROJECTILE_RADIUS <= 0 ||
        this.backEndProjectiles[id].y - this.PROJECTILE_RADIUS >=
          this.backEndPlayers[this.backEndProjectiles[id].playerId]?.canvas?.height ||
        this.backEndProjectiles[id].y + this.PROJECTILE_RADIUS <= 0
      ) {
        // Remove projectile if out of bounds
        delete this.backEndProjectiles[id];
        continue;
      }

      // Check for projectile-player collisions
      for (const playerId in this.backEndPlayers) {
        const backEndPlayer = this.backEndPlayers[playerId];

        const DISTANCE = Math.hypot(
          this.backEndProjectiles[id].x - backEndPlayer.x,
          this.backEndProjectiles[id].y - backEndPlayer.y
        );

        // Collision detection
        if (
          DISTANCE < this.PROJECTILE_RADIUS + backEndPlayer.radius &&
          this.backEndProjectiles[id].playerId !== playerId
        ) {
          if (this.backEndPlayers[this.backEndProjectiles[id].playerId])
            this.backEndPlayers[this.backEndProjectiles[id].playerId].score++;

          console.log(this.backEndPlayers[this.backEndProjectiles[id].playerId]);
          delete this.backEndProjectiles[id];
          delete this.backEndPlayers[playerId];
          break;
        }
      }
    }

   

    // Emit updated projectiles and players to all clients
    this.server.emit('updateProjectiles', this.backEndProjectiles);
    this.server.emit('updatePlayers', this.backEndPlayers);
  }
}