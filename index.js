// center point 160 215
// cross: length 140
// inner circle r 105
// outer circle r 125
// north length 58 width 5
// deg circle r 150

var compassPaper = Raphael('compass', 320, 568)
compassPaper.rect(0, 0, 320, 568).attr('fill', 'black')

var cross = compassPaper.set()
var crossStyle = {
  stroke: 'white',
  'stroke-width': 1
}
cross.push(
  compassPaper.path('M90 215L230 215').attr(crossStyle),
  compassPaper.path('M160 145L160 285').attr(crossStyle)
)
var northBar = compassPaper.path('M160 110L160 52').attr({
  stroke: 'white',
  'stroke-width': 4
})
var compass = compassPaper.set()
var strokeWidth
var billet
var degText
for (var i = 0; i < 360; i = i + 2) {
  if (i % 30 == 0) {
    strokeWidth = 2
    degText = compassPaper.text(160, 60, i).attr({
      fill: 'white',
      'font-size': '16px'
    }).transform('R' + i + ', 160, 215')
    degText.degPosition = i
    compass.push(degText)
  } else {
    strokeWidth = 1
  }
  billet = compassPaper.path('M160 110L160 93').attr({
    stroke: 'white',
    'stroke-width': strokeWidth
  }).transform('R' + i + ', 160, 215')
  billet.degPosition = i
  compass.push(
    billet
  );
}
['N', 'E', 'S', 'W'].forEach(function(direction, index) {
  var directionText = compassPaper.text(160, 128, direction).attr({
    fill: 'white',
    'font-size': '28px'
  }).transform('R' + index * 90 + ', 160, 215')
  directionText.degPosition = index * 90
  compass.push(directionText)
})
var redTriangle = compassPaper.path('M160 70L150 88L170 88Z').attr({
  fill: 'red',
  'stroke-width': 0
})
redTriangle.degPosition = 0
compass.push(redTriangle)

var alphaText = compassPaper.text(160, 440, '0°').attr({
  fill: 'white',
  'font-size': '64px'
})

var directionText = compassPaper.text(160, 480, 'N').attr({
  fill: 'white',
  'font-size': '16px'
})

function throttle(method, delay, duration) {
  var timer = null,
    begin = new Date();
  return function() {
    var context = this,
      args = arguments,
      current = new Date();;
    clearTimeout(timer);
    if (current - begin >= duration) {
      method.apply(context, args);
      begin = current;
    } else {
      timer = setTimeout(function() {
        method.apply(context, args);
      }, delay);
    }
  }
}

var directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW']

// gradienter
var gradienter = document.getElementById('gradienter').getContext('2d')
gradienter.font = '200px sans-serif'
gradienter.textAlign = 'center'
gradienter.textBaseline = 'middle'

var positiveCircleCenter = [320, 568]
var negativeCircleCenter = [320, 568]
var positiveCircle, negativeCircle

var getIt = false
function drawGradienterCircles(angle) {
  if (getIt) {
    return
  }

  if (angle < .2) {
    angle = 0
  } else if (angle > 1) {
    angle = parseInt(angle)
  } else {
    angle = 1
  }

  gradienter.clearRect(0, 0, 640, 1136)
  gradienter.globalCompositeOperation = 'xor'

  if (angle == 0) {
    gradienter.fillStyle = '#76ff03'
    getIt = true
    setTimeout(function(){
      getIt = false
    }, 618)
  } else {
    gradienter.fillStyle = 'black'
  }
  gradienter.fillRect(0, 0, 640, 1136)

  gradienter.beginPath()
  gradienter.arc(positiveCircleCenter[0], positiveCircleCenter[1], 200, 0, 360)
  gradienter.closePath()
  gradienter.fill()

  gradienter.beginPath()
  gradienter.arc(negativeCircleCenter[0], negativeCircleCenter[1], 200, 0, 360)
  gradienter.closePath()
  gradienter.fill()

  gradienter.fillText( angle + '°', 350, 576)
}
drawGradienterCircles(0)

function deviceOrientationListener(event) {
  // compass start
  // http://mobiforge.com/design-development/html5-mobile-web-device-orientation-events
  var alpha = event.webkitCompassHeading || event.alpha;

  alphaText.attr({
    text: parseInt(alpha) + '°'
  })

  var directionIndex

  if (alpha > 337.5 || alpha < 22.5) {
    directionIndex = 0
  } else if (alpha > 45 - 22.5 && alpha < 45 + 22.5) {
    directionIndex = 1
  } else if (alpha > 90 - 22.5 && alpha < 90 + 22.5) {
    directionIndex = 2
  } else if (alpha > 135 - 22.5 && alpha < 135 + 22.5) {
    directionIndex = 3
  } else if (alpha > 180 - 22.5 && alpha < 180 + 22.5) {
    directionIndex = 4
  } else if (alpha > 225 - 22.5 && alpha < 225 + 22.5) {
    directionIndex = 5
  } else if (alpha > 270 - 22.5 && alpha < 270 + 22.5) {
    directionIndex = 6
  } else if (alpha > 315 - 22.5 && alpha < 315 + 22.5) {
    directionIndex = 7
  }

  directionText.attr({
    text: directions[directionIndex]
  })

  compass.forEach(function(item) {
    item.transform('R' + (item.degPosition - alpha) + ',160, 215')
  })
  // compass end

  // gradienter start
  var dx = 320 * Math.tan(event.gamma/180 * Math.PI)
  var dy = 568 * Math.tan(event.beta/180 * Math.PI)

  positiveCircleCenter = [320 + dx, 568 + dy]
  negativeCircleCenter = [320 - dx, 568 - dy]

  // http://www.zhihu.com/question/25219398/answer/30254099
  // http://www.doc88.com/p-38079350479.html
  var gamma = event.gamma / 360 * Math.PI
  var beta = event.beta / 360 * Math.PI
  var sinGamma = Math.sin(gamma)
  var cosGamma = Math.cos(gamma)
  var sinBeta = Math.sin(beta)
  var cosBeta = Math.cos(beta)
  var angle = Math.acos(cosGamma * cosBeta/(Math.sqrt(Math.pow(cosBeta * sinGamma, 2) + Math.pow(sinBeta, 2) + Math.pow(cosBeta * cosGamma, 2))))
  drawGradienterCircles(angle / Math.PI * 360)
  // gradienter end

}
if (window.DeviceOrientationEvent) {
  window.addEventListener('deviceorientation', throttle(deviceOrientationListener, 10, 30))
} else {
  alert("Sorry your browser doesn't support Device Orientation")
}

// swipe event
var compassEl = document.getElementById('compass')
var gradienterEl= document.getElementById('gradienter')
var hammerFace = new Hammer(document.body)
var navs = document.getElementsByTagName('li')
hammerFace.get('swipe').set({direction: Hammer.DIRECTION_HORIZONTAL})
hammerFace.on('swipe', function (event) {
  event.preventDefault()
  if (event.direction == Hammer.DIRECTION_LEFT) {
    compassEl.style.left = -320 + 'px'
    gradienterEl.style.left = 0
    setTimeout(function () {
      navs[0].setAttribute('class', '')
      navs[1].setAttribute('class', 'active')
    },218)
  } else {
    compassEl.style.left = 0
    gradienterEl.style.left = 320 + 'px'
    setTimeout(function() {
      navs[0].setAttribute('class', 'active')
      navs[1].setAttribute('class', '')
    },218)
  }
})
