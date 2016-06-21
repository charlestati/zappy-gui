const path = require('path');
const _ = require('lodash');
const GameClient = require(path.join(__dirname, '..', 'GameClient.js'));
const Player = require(path.join(__dirname, '..', 'entities', 'Player.js'));
const Chest = require(path.join(__dirname, '..', 'entities', 'Chest.js'));
const Burger = require(path.join(__dirname, '..', 'entities', 'Burger.js'));

class GameState extends Phaser.State {
  preload() {
    this.connect(this.game.global.host, this.game.global.port);
  }

  create() {
    this.cursors = this.input.keyboard.createCursorKeys();
    this.swipe = this.game.input.activePointer;

    this.initWorld();
  }

  setupEntities() {
    this.entities = [];

    for (let i = 0; i < this.mapWidth; ++i) {
      this.entities[i] = [];
      for (let j = 0; j < this.mapHeight; ++j) {
        this.entities[i][j] = [];
      }
    }
  }

  addPlayer(x, y) {
    const player = new Player(x, y, this);
    this.entities[x][y].push(player);
    return player;
  }

  initWorld() {
    this.worldScale = 1;
    this.gridSize = 32;
    this.world.setBounds(0, 0, 20 * this.gridSize, 20 * this.gridSize);

    this.tilemap = this.add.tilemap('trantor');
    this.tilemap.addTilesetImage('trantor', 'tiles');

    this.layerGrass = this.tilemap.createLayer('grass');
    this.layerGrass.wrap = true;
    this.layerGrass.scale.setTo(window.devicePixelRatio, window.devicePixelRatio);
    this.layerGrass.smoothed = false;

    this.layerVegetals = this.tilemap.createLayer('vegetals');
    this.layerVegetals.wrap = true;
    this.layerVegetals.scale.setTo(1.5, 1.5);
    this.layerVegetals.smoothed = false;

    this.chestSprites = this.add.group();
    this.foodSprites = this.add.group();
    this.playerSprites = this.add.group();
  }

  setupWorld() {
    const width = this.mapWidth * this.gridSize;
    const height = this.mapHeight * this.gridSize;
    const paddingWidth = this.mapWidth > 20 ? 10 * this.gridSize : 5 * this.gridSize;
    const paddingHeight = this.mapHeight > 20 ? 10 * this.gridSize : 5 * this.gridSize;
    this.world.setBounds(-paddingWidth, -paddingHeight,
      width + paddingWidth * 2, height + paddingHeight * 2);
    this.setupEntities();
    const player = this.addPlayer(this.mapWidth / 2, this.mapWidth / 2, this);
    const space = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    space.onDown.add(() => {
      player.moveTo(Phaser.Math.clamp(player.x + Math.random(), 0, this.mapWidth),
        Phaser.Math.clamp(player.y + Math.random(), 0, this.mapHeight));
    }, this);
    this.camera.focusOnXY(width / 2, height / 2);
  }

  update() {
    if (!this.mapWidth || !this.mapHeight) {
      return;
    }
    this.updateCamera();
    this.updateWorldScale();
  }

  updateCamera() {
    let speed = 10;

    if (this.game.input.keyboard.isDown(Phaser.Keyboard.SHIFT)) {
      speed = 30;
    }

    if (this.cursors.up.isDown) {
      this.camera.follow(null);
      this.camera.y -= speed;
    } else if (this.cursors.down.isDown) {
      this.camera.follow(null);
      this.camera.y += speed;
    }

    if (this.cursors.left.isDown) {
      this.camera.follow(null);
      this.camera.x -= speed;
    } else if (this.cursors.right.isDown) {
      this.camera.follow(null);
      this.camera.x += speed;
    }
  }

  updateWorldScale() {
    if (this.swipe.isDown && (this.swipe.positionDown.y > this.swipe.position.y)) {
      this.worldScale += 0.05;
    } else if (this.swipe.isDown && (this.swipe.positionDown.y < this.swipe.position.y)) {
      this.worldScale -= 0.05;
    }

    this.worldScale = Phaser.Math.clamp(this.worldScale, 1, 3);
    this.world.scale.set(this.worldScale);
  }

  receiveMsz(x, y) {
    this.mapWidth = x;
    this.mapHeight = y;
    this.setupWorld();
  }

  receiveBct(x, y, q1, q2, q3, q4, q5, q6, q7) {
    if (q1 > 0) {
      this.entities[x][y].push(new Burger(x, y, this));
    } else if (q2 > 0
      || q3 > 0
      || q4 > 0
      || q5 > 0
      || q6 > 0
      || q7 > 0) {
      this.entities[x][y].push(new Burger(x, y, this));
      //this.entities[x][y].push(new Chest(x, y, this));
    }
  }

  receiveTna(name) {
    console.log(name);
  }

  handleData(data) {
    const args = data.split(' ');
    const command = _.head(args);
    const handler = `receive${command.charAt(0).toUpperCase()}${command.slice(1)}`;
    const parameters = _.tail(args);

    if (typeof this[handler] === 'function') {
      this[handler].apply(this, parameters);
    }
  }

  connect(host, port) {
    this.client = new GameClient(host, port);

    this.client.on('error', e => {
      console.log(e.code);
    });

    this.client.on('close', () => {
      this.game.global.app.showIntro();
      this.destroy();
    });

    this.client.on('data', (data) => {
      this.handleData(data);
    });

    this.client.on('connect', () => {
      this.client.sendHello();
    });

    this.client.connect();
  }
}

module.exports = GameState;
