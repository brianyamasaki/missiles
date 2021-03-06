var gameData = [

  { // level 0
    levelNumber: 0,
    levelName: "In the Beginning",
    launchers: [
      {x: 0.5, y: 0.5}
    ],
    cities: [
      { x: 0.2, y: .95},
      { x: 0.4, y: .95},
      { x: 0.7, y: .95},
      { x: 0.9, y: .95}
    ],
    grounds: [
      {
        fillStyle: 'darkgray',
        points : [
          { x: 0, y: 0.9 },
          { x: 0.1, y: 0.95 },
          { x: 0.40, y: 0.95 },
          { x: 0.5, y: 0.8},
          { x: 0.6, y: 0.95},
          { x: 0.9, y: 0.95},
          { x: 1, y: 0.9},
          { x: 1, y: 1},
          { x: 0, y: 1}
        ] 
      },
      {
        fillStyle: 'gray',
        points : [
          { x: .3, y: .3},
          { x: .35, y: .35},
          { x: .3, y: .4},
          { x: .25, y: .35}
        ]
      }
    ]
  },
  { // level 1
    "levelNumber": 1,
    "levelName": "First Custom Level",
    "launcherImage": {
      "filepath": "img/missile-defense/img/launcher1.png",
      "imageCenter":  {"x": -25, "y": -25 }
    },
    "launchers": [
      {"x": 0.78, "y": 0.6}
    ],
    "missileImage": {
      "filepath": "img/missile-defense/img/missile1.png", 
      "imageCenter": { "x": -10, "y": -5}
    },
    "projectileAnimation": {
      "filepath": "img/missile-defense/img/bullet.animation.png",
      "frames": 15,
      "fps": 60,
      "animationCenter": {"x": -10, "y":-10}
    },
    "projectileImage": {
      "filepath": "img/missile-defense/img/bullet.png",
      "imageCenter": {"x": -10, "y":-10}
    },
    "cityImage": {
      "filepath" : "img/missile-defense/img/city.png", 
      "imageCenter": { "x": -50, "y": -50}
    },
    cities: [
      { x: 0.15, y: .8},
      { x: 0.3, y: .8},
      { x: 0.57, y: .9},
      { x: 0.89, y: .75}
    ],
    grounds: [
      {
        fillStyle: 'orange',
        points: [
          { x: 0, y: .8},
          { x: .45, y: .8},
          { x: .50, y: .9},
          { x: .65, y: .9},
          { x: .80, y: .75},
          { x: 1, y: .75},
          { x: 1, y: 1},
          { x: 0, y: 1}
        ]
      },
      {
        fillStyle: '#333333',
        points: [
          { x: 0.75, y: 0.80}, 
          { x: 0.75, y: 0.65},
          { x: 0.78, y: 0.6},
          { x: 0.80, y: 0.65},
          { x: 0.80, y: 0.75}
        ]
      }
    ] 
  }
];