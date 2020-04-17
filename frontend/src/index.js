
var socket = io();

socket.on('news', function (data) {
    console.log(data);
    socket.emit('my other event', { my: 'data' });
});

const form = document.querySelector('form');

console.log(form, " IS THE FORM")

form.addEventListener('submit', e => {
  e.preventDefault()

  const files = document.querySelector('[type=file]').files

  let dat = URL.createObjectURL(files[0]);
  document.getElementById("uploadedImage").src = dat;

  console.log(files);
  console.log(files[0]);
  console.log(dat);


  /*
  var base64 = btoa(uint8ToString(yourUint8Array));
  window.open("data:application/octet-stream;base64," + base64);
  */

  socket.emit('image-upload', { buffer : files[0]});

})

function uint8ToString(buf) {
  var i, length, out = '';
  for (i = 0, length = buf.length; i < length; i += 1) {
      out += String.fromCharCode(buf[i]);
  }
  return out;
}

socket.on('response image', function (data) {
  console.log(data.buffer)

  let viewAsU8 = new Uint8Array(data.buffer);
  let u8convToString = uint8ToString(viewAsU8);
  let base64 = btoa(u8convToString);

  //console.log(viewAsU8);
  //console.log(u8convToString);
  //console.log(base64);

  /// window.btoa([data.buffer])
  document.getElementById("filteredImage").src = 'data:image/png;base64,' + base64;
});