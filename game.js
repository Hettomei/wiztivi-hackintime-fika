/*eslint-disable no-undef */

var minScale = 1
var game = new Phaser.Game(
    1920,
    1080,
    Phaser.CANVAS,
    'phaser-example',
    {
        preload,
        create,
        update,
        render
    }
)

var speed = 30
var step = 'portalEntrance'

var character
var cursors
var emitterLeft
var emitterAppear1
var emitterOrange

var worldScale = minScale
var i = 1

function preload() {
    game.load.image('backdropHome', 'choosePortals.png')
    game.load.image('backdropWaitGame', 'waitGame.png')
    game.load.image('backdropWaitPeople', 'waitPeople.png')

    game.load.image('character', 'character.png')

    game.load.image('bluerain', 'bluerain.png')
    game.load.image('redrain', 'redrain.png')
    game.load.image('whiterain', 'whiterain.png')

    game.time.advancedTiming = true
}

function create() {
    if (step === 'portalEntrance') {
        createHome()
    }
}

function createHome() {
    game.world.setBounds(0, 0, 2000, 2000)

    game.add.sprite(0, 0, 'backdropHome')
    game.scale.fullScreenScaleMode = Phaser.ScaleManager.SHOW_ALL

    cursors = game.input.keyboard.createCursorKeys()
    zoomKey = game.input.keyboard.addKey(Phaser.KeyCode.F)
    zoomKey.onDown.add(gofull)

    emiterYpos = 600

    emitterLeft = game.add.emitter(700, emiterYpos, 100)
    emitterLeft.makeParticles('redrain', 0, 3000, false, false  )
    emitterLeft.gravity = 0
    emitterLeft.start(false, 1500, 1)

    emitterOrange = game.add.emitter(1350, emiterYpos, 100)
    emitterOrange.makeParticles('bluerain', 0, 3000, false, false  )
    emitterOrange.gravity = 0
    emitterOrange.start(false, 1500, 1)
}

function createSelectAgame() {
    // // CLEAR
    game.world.scale.set(1)
    game.world.removeAll()
    game.world.pivot.x = 0
    game.world.pivot.y = 0
    speed = 30


    spWaitGame = game.add.sprite(0, 0, 'backdropWaitGame')
    spWaitGame.inputEnabled = true
    spWaitGame.events.onInputDown.add(listener, game)
}

function createUnzoom() {
    game.world.pivot.x = 0
    game.world.pivot.y = 0
    spWaitGame = game.add.sprite(0, 0, 'backdropWaitGame')
}

function listener() {
    createWaitPeople()
}

function createWaitPeople() {
    // CLEAR
    game.world.removeAll()
    spWaitGame.inputEnabled = false

    game.add.sprite(0, 0, 'backdropWaitPeople')

    const emitterY = 470
    const emitterX = 1350
    const sizePerso1 = 350

    // appear people
    character = game.add.sprite(emitterX - sizePerso1 / 2, emitterY, 'character')
    character.anchor.setTo(0, 0)
    character.alpha = 0
    setTimeout(startTween, 6000)

    emitterAppear1 = game.add.emitter(emitterX, emitterY + character.height / 2, 100)
    emitterAppear1.makeParticles('whiterain', 0, 3000, false, false  )
    emitterAppear1.gravity = 0
    emitterAppear1.minParticleSpeed.setTo(-500, -500)
    emitterAppear1.maxParticleSpeed.setTo(500, 500)
    emitterAppear1.minParticleScale = 1
    emitterAppear1.maxParticleScale = 5
    emitterAppear1.start(false, 200, 1)

    step = 'waitPeople'
}

function startTween() {
    const tween = game.add.tween(character).to( { alpha: 1 }, 3000, Phaser.Easing.Linear.None, true)
    tween.onComplete.add(stopEmitterWaitPerso, this)
}

function stopEmitterWaitPerso() {
    game.add.tween(emitterAppear1).to( { alpha: 0 }, 500, Phaser.Easing.Linear.None, true)
}

function gofull() {

    if (game.scale.isFullScreen)
    {
        game.scale.stopFullScreen()
    }
    else
    {
        game.scale.startFullScreen(false)
    }

}



function update() {
    if (step === 'portalEntrance') {
        updateFirst()
    } else if (step === 'unzoom') {
        updateUnZoom()
    } else if (step === 'waitPeople') {
        updateWaitPeople()
    }
}

function render() {
    if (step === 'portalEntrance') {
        renderFirst()
    }
}

function renderFirst() {
    // game.debug.cameraInfo(game.camera, 500, 32)
}


function updateFirst() {
    if (cursors.up.isDown)
    {
        game.world.pivot.y -= speed
    }
    else if (cursors.down.isDown)
    {
        game.world.pivot.y += speed
    }

    if (cursors.left.isDown)
    {
        game.world.pivot.x -= speed
    }
    else if (cursors.right.isDown)
    {
        game.world.pivot.x += speed
    }

    // zoom
    if (game.input.keyboard.isDown(Phaser.Keyboard.A)) {
        i += 0.3
        a = 0.05 * i
        worldScale += a
        // game.world.pivot.y += speed
        // game.world.pivot.x += speed
    }
    else if (game.input.keyboard.isDown(Phaser.Keyboard.Q)) {
        i -= 0.3
        a = 0.05 * i
        i = i < 1 ? 1 : i
        worldScale -= a
        // game.world.pivot.y -= speed
        // game.world.pivot.x -= speed
    }

    worldScale = worldScale < minScale ? minScale : worldScale
    if (worldScale > 12) {
        step = 'unzoom'
        worldScale = 12
        game.world.scale.set(worldScale)
        createUnzoom()
        // step = 'selectAGame'
        // createSelectAgame()
    }
    game.world.scale.set(worldScale)
}

function updateUnZoom() {
    // zoom
    if (game.input.keyboard.isDown(Phaser.Keyboard.A)) {
        // i += 0.1
        a = 0.2
        worldScale -= a
    }

    worldScale = worldScale < 1 ? 1 : worldScale
    if (worldScale <= 1) {
        step = 'selectAGame'
        createSelectAgame()
    } else {
        game.world.scale.set(worldScale)
    }
}

function updateWaitPeople() {
    character.updateCrop()
}
