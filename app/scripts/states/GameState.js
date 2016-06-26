const path = require('path');
const _ = require('lodash');
const GameClient = require(path.join(__dirname, '..', 'GameClient.js'));
const Player = require(path.join(__dirname, '..', 'entities', 'Player.js'));
const Chest = require(path.join(__dirname, '..', 'entities', 'Chest.js'));
const Burger = require(path.join(__dirname, '..', 'entities', 'Burger.js'));
const Egg = require(path.join(__dirname, '..', 'entities', 'Egg.js'));
const Linemate = require(path.join(__dirname, '..', 'entities', 'Linemate.js'));
const Deraumere = require(path.join(__dirname, '..', 'entities', 'Deraumere.js'));
const Sibur = require(path.join(__dirname, '..', 'entities', 'Sibur.js'));
const Mendiane = require(path.join(__dirname, '..', 'entities', 'Mendiane.js'));
const Phiras = require(path.join(__dirname, '..', 'entities', 'Phiras.js'));
const Thystame = require(path.join(__dirname, '..', 'entities', 'Thystame.js'));
const Meat = require(path.join(__dirname, '..', 'entities', 'Meat.js'));

class GameState extends Phaser.State {
  preload() {
    this.connect(this.game.global.host, this.game.global.port);
  }

  create() {
    this.minScale = 1;
    this.maxScale = 3;
    this.worldScale = this.minScale;
    this.gridSize = 16;
    this.offsetX = 10 * this.gridSize;
    this.offsetY = 10 * this.gridSize;

    this.tilemap = this.add.tilemap('trantor');
    this.tilemap.addTilesetImage('trantor', 'tiles');

    this.layerGrass = this.tilemap.createLayer('grass');
    this.layerGrass.wrap = true;
    this.layerGrass.smoothed = false;

    this.layerVegetals = this.tilemap.createLayer('flowers');
    this.layerVegetals.wrap = true;
    this.layerVegetals.smoothed = false;

    this.foodSprites = this.add.group();
    this.gemSprites = this.add.group();
    this.eggSprites = this.add.group();

    this.chestSprites = this.add.group();
    this.burgerSprites = this.add.group();

    this.playerSprites = this.add.group();

    this.linemate = [];
    this.deraumere = [];
    this.sibur = [];
    this.mendiane = [];
    this.phiras = [];
    this.thystame = [];
    this.food = [];
    this.players = [];
    this.eggs = [];
    this.chests = [];
    this.burgers = [];

    this.followingId = 0;

    this.soundtrack = this.add.audio('route_101', 1, true);
    this.soundtrack.play();

    this.showGrid = false;

    this.setupKeys();
    this.setupGamepad();

    this.infoText = this.game.add.text(20, 20, 'Hello!', {
      font: '16px Courier',
      fill: '#ffffff',
    });
    this.infoText.setShadow(3, 3, 'rgba(0, 0, 0, 0.5)', 2);
    this.infoText.fixedToCamera = true;
    this.infoText.visible = false;
  }

  updateScale() {
    this.layerGrass.scale.set(this.worldScale);
    this.layerVegetals.scale.set(this.worldScale);

    this.gemSprites.scale.set(this.worldScale);
    this.foodSprites.scale.set(this.worldScale);
    this.playerSprites.scale.set(this.worldScale);
    this.burgerSprites.scale.set(this.worldScale);
    this.chestSprites.scale.set(this.worldScale);

    if (this.gridSprite) {
      this.gridSprite.scale.set(this.worldScale);
    }

    this.world.setBounds(-this.offsetX, -this.offsetY,
      this.mapWidth * this.gridSize * this.worldScale + this.offsetX * 2,
      this.mapHeight * this.gridSize * this.worldScale + this.offsetY * 2);

    if (this.worldScale < this.maxScale) {
      this.chestSprites.visible = true;
      this.burgerSprites.visible = true;
      this.foodSprites.visible = false;
      this.gemSprites.visible = false;
    } else {
      this.chestSprites.visible = false;
      this.burgerSprites.visible = false;
      this.foodSprites.visible = true;
      this.gemSprites.visible = true;
    }
  }

  worldZoomIn() {
    this.worldScale += 0.05;
    this.worldScale = Phaser.Math.clamp(this.worldScale, this.minScale, this.maxScale);
    this.updateScale();
  }

  worldZoomOut() {
    this.worldScale -= 0.05;
    this.worldScale = Phaser.Math.clamp(this.worldScale, this.minScale, this.maxScale);
    this.updateScale();
  }

  followNext() {
    if (this.players.length > 0) {
      ++this.followingId;
      if (this.followingId >= this.players.length) {
        this.followingId = 0;
      }
      this.players[this.followingId].follow();
    }
  }

  followPrev() {
    if (this.players.length > 0) {
      --this.followingId;
      if (this.followingId <= 0) {
        this.followingId = this.players.length - 1;
      }
      this.players[this.followingId].follow();
    }
  }

  setupKeys() {
    this.cursors = this.input.keyboard.createCursorKeys();

    const keyExit = this.input.keyboard.addKey(Phaser.Keyboard.ESC);
    keyExit.onDown.add(() => {
      this.game.global.app.showIntro();
      this.game.destroy();
    });

    const keyI = this.input.keyboard.addKey(Phaser.Keyboard.I);
    keyI.onHoldCallback = () => {
      if (this.worldScale < this.maxScale) {
        this.worldZoomIn();
      }
    };

    const keyO = this.input.keyboard.addKey(Phaser.Keyboard.O);
    keyO.onHoldCallback = () => {
      if (this.worldScale > this.minScale) {
        this.worldZoomOut();
      }
    };

    const keySpacebar = this.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    keySpacebar.onDown.add(() => {
      this.followNext();
    });

    const keyG = this.input.keyboard.addKey(Phaser.Keyboard.G);
    keyG.onDown.add(() => {
      if (this.showGrid) {
        this.showGrid = false;
        if (this.gridSprite) {
          this.gridSprite.visible = false;
        }
      } else {
        this.showGrid = true;
        this.gridSprite.visible = true;
      }
    });

    const keyM = this.input.keyboard.addKey(Phaser.Keyboard.M);
    keyM.onDown.add(() => {
      if (this.soundtrack.paused) {
        this.soundtrack.resume();
      } else {
        this.soundtrack.pause();
      }
    });
  }

  setupGamepad() {
    this.game.input.gamepad.start();
    this.pad = this.game.input.gamepad.pad1;
  }

  setupWorld() {
    if (this.mapWidth < 30 && this.mapHeight < 30) {
      if (this.mapWidth < 10 && this.mapHeight < 10) {
        this.worldScale = this.maxScale;
      } else {
        this.worldScale = 2;
      }
    }

    const width = this.mapWidth * this.gridSize;
    const height = this.mapHeight * this.gridSize;

    this.world.setBounds(-this.offsetX, -this.offsetY,
      width + this.offsetX * 2, height + this.offsetY * 2);

    this.gridSprite = this.game.add.sprite(0, 0, this.game.create.grid('grid',
      this.mapWidth * this.gridSize,
      this.mapHeight * this.gridSize,
      this.gridSize, this.gridSize, 'rgba(0, 0, 0, 0.1)'));
    this.gridSprite.smoothed = false;
    this.gridSprite.visible = false;

    this.updateScale();
  }

  addPlayer(x, y, id, team, spriteName) {
    this.players.push(new Player(x, y, id, team, spriteName, this));
  }

  getTileInfo(x, y) {
    const food = _.find(this.food, f =>
      f.x === x.toString() && f.y === y.toString()
    );

    const linemate = _.find(this.linemate, f =>
      f.x === x.toString() && f.y === y.toString()
    );

    const deraumere = _.find(this.deraumere, f =>
      f.x === x.toString() && f.y === y.toString()
    );

    const sibur = _.find(this.sibur, f =>
      f.x === x.toString() && f.y === y.toString()
    );

    const mendiane = _.find(this.mendiane, f =>
      f.x === x.toString() && f.y === y.toString()
    );

    const phiras = _.find(this.phiras, f =>
      f.x === x.toString() && f.y === y.toString()
    );

    const thystame = _.find(this.thystame, f =>
      f.x === x.toString() && f.y === y.toString()
    );

    return {
      food: food ? food.quantity : 0,
      linemate: linemate ? linemate.quantity : 0,
      deraumere: deraumere ? deraumere.quantity : 0,
      sibur: sibur ? sibur.quantity : 0,
      mendiane: mendiane ? mendiane.quantity : 0,
      phiras: phiras ? phiras.quantity : 0,
      thystame: thystame ? thystame.quantity : 0,
    };
  }

  tileHasPlayer(x, y) {
    return _.find(this.players, p =>
      p.x === x && p.y === y
    );
  }

  formatInfoText(tileInfo) {
    return `Food: ${tileInfo.food}
Linemate: ${tileInfo.linemate}
Deraumère: ${tileInfo.deraumere}
Sibur: ${tileInfo.sibur}
Mendiane: ${tileInfo.mendiane}
Phiras: ${tileInfo.phiras}
Thystame: ${tileInfo.thystame}`;
  }

  updateInfoText(x, y) {
    const tileInfo = this.getTileInfo(x, y);
    this.infoText.setText(this.formatInfoText(tileInfo));
  }

  listenClick() {
    if (this.input.activePointer.isDown) {
      const x = Math.floor(this.input.worldX / this.gridSize / this.worldScale);
      const y = Math.floor(this.input.worldY / this.gridSize / this.worldScale);

      if (!this.tileHasPlayer(x, y)) {
        this.clearInfoText();
        this.updateInfoText(x, y);
        this.infoText.visible = true;
      }
    }
  }

  listenPad() {
    if (this.pad.justPressed(Phaser.Gamepad.XBOX360_RIGHT_BUMPER)) {
      if (this.worldScale < this.maxScale) {
        this.worldZoomIn();
      }
    }

    if (this.pad.justPressed(Phaser.Gamepad.XBOX360_LEFT_BUMPER)) {
      if (this.worldScale > this.minScale) {
        this.worldZoomOut();
      }
    }

    if (this.pad.justPressed(Phaser.Gamepad.XBOX360_A)) {
      this.followNext();
    }

    if (this.pad.justPressed(Phaser.Gamepad.XBOX360_B)) {
      this.followPrev();
    }

    // todo Fix multiple pressed bug
    if (this.pad.justPressed(Phaser.Gamepad.XBOX360_X)) {
      if (this.showGrid) {
        this.gridSprite.visible = false;
        this.showGrid = false;
      } else {
        this.gridSprite.visible = true;
        this.showGrid = true;
      }
    }
  }

  update() {
    this.updateCamera();
    this.listenPad();
    this.listenClick();
  }

  updateCamera() {
    let speed = 10;

    if (this.game.input.keyboard.isDown(Phaser.Keyboard.SHIFT)
      || this.pad.isDown(Phaser.Gamepad.XBOX360_RIGHT_TRIGGER)) {
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

    if (this.pad.isDown(Phaser.Gamepad.XBOX360_DPAD_LEFT)
      || this.pad.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_X) < -0.1) {
      this.camera.follow(null);
      this.camera.x -= speed;
    } else if (this.pad.isDown(Phaser.Gamepad.XBOX360_DPAD_RIGHT)
      || this.pad.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_X) > 0.1) {
      this.camera.follow(null);
      this.camera.x += speed;
    }

    if (this.pad.isDown(Phaser.Gamepad.XBOX360_DPAD_UP)
      || this.pad.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_Y) < -0.1) {
      this.camera.follow(null);
      this.camera.y -= speed;
    } else if (this.pad.isDown(Phaser.Gamepad.XBOX360_DPAD_DOWN)
      || this.pad.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_Y) > 0.1) {
      this.camera.follow(null);
      this.camera.y += speed;
    }
  }

  clearInfoText() {
    _.map(this.players, (player) => {
      player.infoText.visible = false;
    });

    this.infoText.visible = false;
  }

  tileHasFood(x, y) {
    return _.find(this.food, f =>
        f.x === x && f.y === y
      ) || _.find(this.burgers, b =>
        b.x === x && b.y === y
      );
  }

  getPlayerFromId(id) {
    return _.find(this.players, player =>
      player.id === id
    );
  }

  getEggFromId(id) {
    return _.find(this.eggs, egg =>
      egg.id === id
    );
  }

  getPlayersOnTile(x, y) {
    return _.filter(this.players, (player) =>
      player.x === x && player.y === y
    );
  }

  removePlayer(id) {
    const player = this.getPlayerFromId(id);

    if (player) {
      this.players = _.without(this.players, player);
      player.destroy();
    }
  }

  spawnEgg(x, y, eggId, playerId) {
    this.eggs.push(new Egg(x, y, eggId, playerId, this));
  }

  removeEgg(id) {
    const egg = this.getEggFromId(id);

    if (egg) {
      this.eggs = _.without(this.eggs, egg);
      egg.destroy();
    }
  }

  tileHasChest(x, y) {
    return _.find(this.chests, c =>
      c.x === x && c.y === y
    );
  }

  spawnChest(x, y) {
    this.chests.push(new Chest(x, y, this));
  }

  removeChest(x, y) {
    const chest = _.find(this.chests, c =>
      c.x === x && c.y === y
    );

    if (chest) {
      this.chests = _.without(this.chests, chest);
      chest.destroy();
    }
  }

  updateFood(x, y, quantity) {
    if (quantity > 0) {
      if (!this.tileHasFood(x, y)) {
        this.spawnFood(x, y);
      } else {
        const food = _.find(this.food, f =>
          f.x === x && f.y === y
        );

        if (food) {
          food.setQuantity(quantity);
        }
      }
    } else {
      this.removeFood(x, y);
    }
  }

  updateLinemate(x, y, quantity) {
    if (quantity > 0) {
      if (!this.tileHasLinemate(x, y)) {
        this.spawnLinemate(x, y);
      } else {
        const linemate = _.find(this.linemate, f =>
          f.x === x && f.y === y
        );

        if (linemate) {
          linemate.setQuantity(quantity);
        }
      }
    } else {
      this.removeLinemate(x, y);
    }
  }

  updateDeraumere(x, y, quantity) {
    if (quantity > 0) {
      if (!this.tileHasDeraumere(x, y)) {
        this.spawnDeraumere(x, y);
      } else {
        const deraumere = _.find(this.deraumere, f =>
          f.x === x && f.y === y
        );

        if (deraumere) {
          deraumere.setQuantity(quantity);
        }
      }
    } else {
      this.removeDeraumere(x, y);
    }
  }

  updateSibur(x, y, quantity) {
    if (quantity > 0) {
      if (!this.tileHasSibur(x, y)) {
        this.spawnSibur(x, y);
      } else {
        const sibur = _.find(this.sibur, f =>
          f.x === x && f.y === y
        );

        if (sibur) {
          sibur.setQuantity(quantity);
        }
      }
    } else {
      this.removeSibur(x, y);
    }
  }

  updateMendiane(x, y, quantity) {
    if (quantity > 0) {
      if (!this.tileHasMendiane(x, y)) {
        this.spawnMendiane(x, y);
      } else {
        const mendiane = _.find(this.mendiane, f =>
          f.x === x && f.y === y
        );

        if (mendiane) {
          mendiane.setQuantity(quantity);
        }
      }
    } else {
      this.removeMendiane(x, y);
    }
  }

  updatePhiras(x, y, quantity) {
    if (quantity > 0) {
      if (!this.tileHasPhiras(x, y)) {
        this.spawnPhiras(x, y);
      } else {
        const phiras = _.find(this.phiras, f =>
          f.x === x && f.y === y
        );

        if (phiras) {
          phiras.setQuantity(quantity);
        }
      }
    } else {
      this.removePhiras(x, y);
    }
  }

  updateThystame(x, y, quantity) {
    if (quantity > 0) {
      if (!this.tileHasThystame(x, y)) {
        this.spawnThystame(x, y);
      } else {
        const thystame = _.find(this.thystame, f =>
          f.x === x && f.y === y
        );

        if (thystame) {
          thystame.setQuantity(quantity);
        }
      }
    } else {
      this.removeThystame(x, y);
    }
  }

  spawnFood(x, y) {
    this.food.push(new Meat(x, y, this));
    this.burgers.push(new Burger(x, y, this));
  }

  removeFood(x, y) {
    const food = _.find(this.food, f =>
      f.x === x && f.y === y
    );

    if (food) {
      this.food = _.without(this.food, food);
      food.destroy();
    }

    const burger = _.find(this.burgers, b =>
      b.x === x && b.y === y
    );

    if (burger) {
      this.burgers = _.without(this.burgers, burger);
      burger.destroy();
    }
  }

  spawnLinemate(x, y, quantity) {
    this.linemate.push(new Linemate(x, y, this));
  }

  tileHasLinemate(x, y) {
    return _.find(this.linemate, g =>
      g.x === x && g.y === y
    );
  }

  removeLinemate(x, y) {
    const gem = _.find(this.linemate, g =>
      g.x === x && g.y === y
    );

    if (gem) {
      this.linemate = _.without(this.linemate, gem);
      gem.destroy();
    }
  }

  spawnDeraumere(x, y, quantity) {
    this.deraumere.push(new Deraumere(x, y, this));
  }

  tileHasDeraumere(x, y) {
    return _.find(this.deraumere, g =>
      g.x === x && g.y === y
    );
  }

  removeDeraumere(x, y) {
    const gem = _.find(this.deraumere, g =>
      g.x === x && g.y === y
    );

    if (gem) {
      this.deraumere = _.without(this.deraumere, gem);
      gem.destroy();
    }
  }

  spawnSibur(x, y, quantity) {
    this.sibur.push(new Sibur(x, y, this));
  }

  tileHasSibur(x, y) {
    return _.find(this.sibur, g =>
      g.x === x && g.y === y
    );
  }

  removeSibur(x, y) {
    const gem = _.find(this.sibur, g =>
      g.x === x && g.y === y
    );

    if (gem) {
      this.sibur = _.without(this.sibur, gem);
      gem.destroy();
    }
  }

  spawnMendiane(x, y, quantity) {
    this.mendiane.push(new Mendiane(x, y, this));
  }

  tileHasMendiane(x, y) {
    return _.find(this.mendiane, g =>
      g.x === x && g.y === y
    );
  }

  removeMendiane(x, y) {
    const gem = _.find(this.mendiane, g =>
      g.x === x && g.y === y
    );

    if (gem) {
      this.mendiane = _.without(this.mendiane, gem);
      gem.destroy();
    }
  }

  spawnPhiras(x, y, quantity) {
    this.phiras.push(new Phiras(x, y, this));
  }

  tileHasPhiras(x, y) {
    return _.find(this.phiras, g =>
      g.x === x && g.y === y
    );
  }

  removePhiras(x, y) {
    const gem = _.find(this.phiras, g =>
      g.x === x && g.y === y
    );

    if (gem) {
      this.phiras = _.without(this.phiras, gem);
      gem.destroy();
    }
  }

  spawnThystame(x, y, quantity) {
    this.thystame.push(new Thystame(x, y, this));
  }

  tileHasThystame(x, y) {
    return _.find(this.thystame, g =>
      g.x === x && g.y === y
    );
  }

  removeThystame(x, y) {
    const gem = _.find(this.thystame, g =>
      g.x === x && g.y === y
    );

    if (gem) {
      this.thystame = _.without(this.thystame, gem);
      gem.destroy();
    }
  }

  setPlayerInv(id, q0, q1, q2, q3, q4, q5, q6) {
    const player = this.getPlayerFromId(id);

    if (player) {
      player.setInventory(q0, q1, q2, q3, q4, q5, q6);
    }
  }

  receiveMsz(x, y) {
    this.mapWidth = x;
    this.mapHeight = y;
    this.setupWorld();
  }

  receiveBct(x, y, q0, q1, q2, q3, q4, q5, q6) {
    this.updateFood(x, y, q0);

    this.updateLinemate(x, y, q1);
    this.updateDeraumere(x, y, q2);
    this.updateSibur(x, y, q3);
    this.updateMendiane(x, y, q4);
    this.updatePhiras(x, y, q5);
    this.updateThystame(x, y, q6);

    if (q1 > 0 || q2 > 0 || q3 > 0 || q4 > 0 || q5 > 0 || q6 > 0) {
      if (!this.tileHasChest(x, y)) {
        this.spawnChest(x, y);
      }
    } else {
      this.removeChest(x, y);
    }
  }

  receivePnw(id, x, y, orientation, level, team) {
    this.addPlayer(x, y, id, team, 'brendan');
  }

  receivePpo(id, x, y, orientation) {
    const player = this.getPlayerFromId(id);

    if (player) {
      player.moveTo(x, y, orientation);
    }
  }

  receivePdi(id) {
    this.removePlayer(id);
  }

  receiveEnw(eggId, playerId, x, y) {
    this.spawnEgg(x, y, eggId, playerId);
  }

  receiveEdi(id) {
    this.removeEgg(id);
  }

  receiveEbo(id) {
    this.removeEgg(id);
  }

  receiveEht(id) {
    this.removeEgg(id);
  }

  receiveSeg(team) {
    alert(`Team ${team} won!`);
    this.game.global.app.showIntro();
    this.game.destroy();
  }

  receivePic(x, y, level, ...playerIds) {
    for (let i = 0; i < playerIds.length; ++i) {
      const player = this.getPlayerFromId(playerIds[i]);

      if (player) {
        player.startCasting();
      }
    }
  }

  receivePie(x, y, result) {
    for (let i = 0; i < this.players.length; ++i) {
      this.players[i].stopCasting();
    }
  }

  receivePin(id, x, y, q0, q1, q2, q3, q4, q5, q6) {
    this.setPlayerInv(id, q0, q1, q2, q3, q4, q5, q6);
  }

  receivePgt(id, resource) {
    const player = this.getPlayerFromId(id);

    console.log('ok');

    if (player) {
      player.pickedResource(resource);
    }
  }

  receivePdr(id, resource) {
    const player = this.getPlayerFromId(id);

    if (player) {
      player.threwResource(resource);
    }
  }

  receivePlv(id, level) {
    const player = this.getPlayerFromId(id);

    if (player) {
      player.updateLevel(level);
    }
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
      this.game.destroy();
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
