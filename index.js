var canvas = Raphael('canvas', 320, 568)
canvas.rect(0, 0, 320, 568).attr('fill', 'black')
// center point 160 215
// cross: length 140
// inner circle r 105
// outer circle r 125
// north length 58 width 5
// deg circle r 150
var cross = canvas.set()
var crossStyle = {
  stroke: 'white',
  'stroke-width': 1
}
cross.push(
  canvas.path('M90 215L230 215').attr(crossStyle),
  canvas.path('M160 145L160 285').attr(crossStyle)
)
var northBar = canvas.path('M160 110L160 52').attr({
  stroke: 'white',
  'stroke-width': 4
})
var compass = canvas.set()
var strokeWidth
var billet
var degText
for (var i = 0; i < 360; i = i + 2) {
  if (i % 30 == 0) {
    strokeWidth = 2
    degText = canvas.text(160, 60, i).attr({
      fill: 'white',
      'font-size': '16px'
    }).transform('R' + i + ', 160, 215')
    degText.degPosition = i
    compass.push(degText)
  } else {
    strokeWidth = 1
  }
  billet = canvas.path('M160 110L160 93').attr({
    stroke: 'white',
    'stroke-width': strokeWidth
  }).transform('R' + i + ', 160, 215')
  billet.degPosition = i
  compass.push(
    billet
  );
}
['N', 'E', 'W', 'S'].forEach(function(direction, index) {
  var directionText = canvas.text(160, 128, direction).attr({
    fill: 'white',
    'font-size': '28px'
  }).transform('R' + index * 90 + ', 160, 215')
  directionText.degPosition = index * 90
  compass.push(directionText)
})
var redTriangle = canvas.path('M160 70L150 88L170 88Z').attr({
  fill: 'red',
  'stroke-width': 0
})
redTriangle.degPosition = 0
compass.push(redTriangle)

var alphaText = canvas.text(160, 440, '0°').attr({
  fill: 'white',
  'font-size': '64px'
})

var directionText = canvas.text(160, 480, 'N').attr({
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

function deviceOrientationListener(event) {
  // http://mobiforge.com/design-development/html5-mobile-web-device-orientation-events
  var alpha = event.webkitCompassHeading;

  alphaText.attr({
    text: parseInt(alpha) + '°'
  })
  if (alpha > 315 && alpha <= 45) {
    directionText.attr({
      text: 'N'
    })
  } else if (alpha > 225 && alpha <= 315) {
    directionText.attr({
      text: 'W'
    })
  } else if (alpha > 135 && alpha <= 225) {
    directionText.attr({
      text: 'S'
    })
  } else if (alpha > 45 && alpha <= 135) {
    directionText.attr({
      text: 'E'
    })
  }
  compass.forEach(function(item) {
    item.transform('R' + (-item.degPosition - alpha) + ',160, 215')
  })

}
if (window.DeviceOrientationEvent) {
  window.addEventListener('deviceorientation', throttle(deviceOrientationListener, 10, 20))
} else {
  alert("Sorry your browser doesn't support Device Orientation")
}