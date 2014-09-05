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
for (var i = 0; i < 360 ; i = i + 2) {
  if (i%30 == 0) {
    strokeWidth = 2
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
  )
}
var alphaText = canvas.text(50, 50, '0°').attr({
  stroke: 'white',
  'font-size': '16px'
})
function deviceOrientationListener(event) {
  alphaText.attr({
    text: parseInt(event.alpha) + '°'
  })
  compass.forEach(function(billet) {
    billet.transform('R' + (billet.degPosition + event.alpha) + ',160, 215')
  })

}
if (window.DeviceOrientationEvent) {
  window.addEventListener('deviceorientation', deviceOrientationListener)
} else {
  alert("Sorry your browser doesn't support Device Orientation")
}