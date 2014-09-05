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
  'stroke-width': 5
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
  fill: 'red'
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
var north
function deviceOrientationListener(event) {
  if (!north) {
    north = event.alpha
  }
  alphaText.attr({
    text: parseInt(event.alpha) + '°'
  })
  if (event.alpha > 315 && event.alpha <= 45) {
    directionText.attr({
      text: 'N'
    })
  } else if (event.alpha > 225 && event.alpha <= 315) {
    directionText.attr({
      text: 'W'
    })
  } else if (event.alpha > 135 && event.alpha <= 225) {
    directionText.attr({
      text: 'S'
    })
  } else {
    directionText.attr({
      text: 'E'
    })
  }
  compass.forEach(function(item) {
    item.transform('R' + (item.degPosition + - event.alpha + north) + ',160, 215')
  })

}
if (window.DeviceOrientationEvent) {
  window.addEventListener('deviceorientation', throttle(deviceOrientationListener, 10, 20))
} else {
  alert("Sorry your browser doesn't support Device Orientation")
}