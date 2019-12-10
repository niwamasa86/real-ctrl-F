const api_key = `AIzaSyDrVpHg5DF8UHMQEIhLQ_eu6fMwdq6mE68`;
const url = `https://vision.googleapis.com/v1/images:annotate`;
let selectedImage = new Image();
let textDetctionRes = {};
let yoko = 1000;
var result = 1;
let many = 0;

function go() {
  //EnterキーならSubmit
  console.log("enter");
  if (window.event.keyCode == 13) searchString(document.forms.form1.textBox1.value);
}

// cloudvisionAPI にファイルを送信
const sendAPI = (base64string) => {
  $('.neon').css('display', 'none');
  $('#search-form form').css('display', 'table');
  var myh1 = document.getElementById("many");
  myh1.innerHTML = "Nowloading...";
  $('.originalFileBtn').css({'position':'relative','top':'0','left':'0','transform':''});
  $('.img-wrap').css('opacity', '0.4');
  $('.frame').remove()
  let body = {
    requests: [{
      image: {
        content: base64string
      },
      features: [{
          type: 'TEXT_DETECTION'
        },

        {
          type: "OBJECT_LOCALIZATION"
        }
      ]
    }]
  };

  let xhr = new XMLHttpRequest();
  xhr.open('POST', `${url}?key=${api_key}`, true);
  xhr.setRequestHeader('Content-Type', 'application/json');
  const p = new Promise((resolve, reject) => {
    xhr.onreadystatechange = () => {
      if (xhr.readyState != XMLHttpRequest.DONE) return;
      if (xhr.status >= 400) return reject({
        message: `Failed with ${xhr.status}:${xhr.statusText}`
      });
      resolve(JSON.parse(xhr.responseText));
    };
  })
  xhr.send(JSON.stringify(body));
  return p;
}

//音声処理　pcなら起動　スマホなら使わない
// if ((navigator.userAgent.indexOf('iPhone') > 0 && navigator.userAgent.indexOf('iPad') == -1) || navigator.userAgent.indexOf('iPod') > 0 || navigator.userAgent.indexOf('Android') > 0) {} else {
//   SpeechRecognition = webkitSpeechRecognition || SpeechRecognition;
//   const recognition = new SpeechRecognition();
//   recognition.interimResults = true;
//   recognition.continuous = true;
//   recognition.onresult = (event) => {
//     console.log(event.results[event.results.length - 1][0].transcript);
//     searchString(event.results[event.results.length - 1][0].transcript);
//   }
//   recognition.start();
//
//   recognition.onend = () => {
//     console.log('onend')
//
//   }
//
// }

//exifの値を表示
const getexif = (file) => {
  var file_input = $('#input_img');
  var filen = file_input[0].files[0];
  EXIF.getData(filen, function() {
    // EXIF.getTag(this, "[exifのタグ名]")で、値を取
    result = EXIF.getTag(this, "Orientation");
    console.log(result);
  });
  return file;
}

// ファイル読み込み
const readFile = (file) => {
  let reader = new FileReader();
  const p = new Promise((resolve, reject) => {
    reader.onload = (ev) => {
      document.querySelector('#target_image').setAttribute('src', ev.target.result);
      selectedImage.onload = () => {
        $(".img-wrap img").css({
          "width": window.parent.screen.width + "px"
        });
      }
      selectedImage.src = ev.target.result;
      resolve(ev.target.result.replace(/^data:image\/(png|jpeg);base64,/, ''));
    };
  })
  reader.readAsDataURL(file);
  return p;
};

//成功した場合の処理
const suc = (res) => {
  textDetctionRes = res;
  var myh1 = document.getElementById("many");
  myh1.innerHTML = "Ready";
  document.querySelector('#textbox').setAttribute('placeholder', "探したい文字列を入力してね");
  $('.img-wrap').css('opacity', '1');
  $('.button').css('display', 'inline');
  console.log('SUCSESS', res);

  let data = JSON.stringify(res, null, 2);
  let data2 = JSON.parse(data);
  let data3 = data["responses"];
  //jsonデータをbodyに出力
  //document.getElementById('output').innerHTML = "<code>" + data + "</code>";
  //from datalist に追加
  const dom = document.getElementById('datalist')
  res.responses[0].textAnnotations.forEach((annotation, index) => {
    if (index == 0) return
    const optionDom = document.createElement('option')
    optionDom.value = annotation.description

    dom.appendChild(optionDom)
  })

  //onButtonClick
  $('#exec').on('click', () => {
    searchString(document.forms.form1.textBox1.value)
  })

}

//失敗した場合の処理
const fail = (err => {
  console.log('FAILED:', err);
  document.querySelector('pre').innerHTML = JSON.stringify(err, null, 2);
})

let btn = 0;
function option() {
  btn++;
  searchString(document.forms.form1.textBox1.value)
}

var array=[];
var howmanyclick=1;

function change() {
  howmanyclick++;
  console.log(array.length)
  console.log("ok")
  console.log(array)
  if(howmanyclick%2==1){
  $('.img-wrap').css('transform', 'scale(1.0)');
}else{
  var i=(howmanyclick/2)%array.length
  var x=array[i][0]+'px'+'\t'+array[i][1]+'px';
  console.log(x);
  $('.img-wrap').css('transform-origin',x);
  $('.img-wrap').css('transform', 'scale(4.0)');
}
}


const searchString = (search) => {
  $('.button').css('display', 'inline-block');
  $('#output').empty()
  $('.frame').remove()
  if (result == 6) {
    yoko = selectedImage.height
  } else {
    yoko = selectedImage.width
  }
  array=[];
  // const search = document.forms.form1.textBox1.value
  console.log(search)
  //もし、検索窓に入力した文字列とidが一致したら、そのオブジェクトを（特定して）取り出したい
  if (btn % 2 == 1) {
    let i = 0
    textDetctionRes.responses[0].fullTextAnnotation.pages.forEach((page) => {
      page.blocks.forEach((block) => {
        block.paragraphs.forEach((paragraph) => {
          // boundingBox
          paragraph.words.forEach((word) => {
            // boundingBox
            word.symbols.forEach((symbol) => {
              if (search.indexOf(symbol.text) >= 0) {
                $('#canvas').append('<div id="frame' + i + '" class="frame"></div>')
                const miny = Math.min(symbol.boundingBox.vertices[0].y, symbol.boundingBox.vertices[1].y, symbol.boundingBox.vertices[2].y, symbol.boundingBox.vertices[3].y)
                const maxy = Math.max(symbol.boundingBox.vertices[0].y, symbol.boundingBox.vertices[1].y, symbol.boundingBox.vertices[2].y, symbol.boundingBox.vertices[3].y)
                const minx = Math.min(symbol.boundingBox.vertices[0].x, symbol.boundingBox.vertices[1].x, symbol.boundingBox.vertices[2].x, symbol.boundingBox.vertices[3].x)
                const maxx = Math.max(symbol.boundingBox.vertices[0].x, symbol.boundingBox.vertices[1].x, symbol.boundingBox.vertices[2].x, symbol.boundingBox.vertices[3].x)
                const propaty = {
                  'top': miny * window.parent.screen.width / yoko + 'px',
                  'left': minx * window.parent.screen.width / yoko + 'px',
                  'width': (maxx - minx) * window.parent.screen.width / yoko + 'px',
                  'height': (maxy - miny) * window.parent.screen.width / yoko + 'px'
                }
                $('#frame' + i).css(propaty)
                array.push([(minx+maxx)/2 * window.parent.screen.width / yoko ,(miny+maxy)/2 * window.parent.screen.width / yoko]);
                i++
                many = i;
              }
            })
          })
        })
      })
    })
  } else if (btn % 2 == 0) {
    let i = 0
    //キーワード検索の文
    for (const value of textDetctionRes.responses[0].textAnnotations) {
      if (search.indexOf(value.description) >= 0) {
        $('#canvas').append('<div id="frame' + i + '" class="frame"></div>')
        const miny = Math.min(value.boundingPoly.vertices[0].y, value.boundingPoly.vertices[1].y, value.boundingPoly.vertices[2].y, value.boundingPoly.vertices[3].y)
        const maxy = Math.max(value.boundingPoly.vertices[0].y, value.boundingPoly.vertices[1].y, value.boundingPoly.vertices[2].y, value.boundingPoly.vertices[3].y)
        const minx = Math.min(value.boundingPoly.vertices[0].x, value.boundingPoly.vertices[1].x, value.boundingPoly.vertices[2].x, value.boundingPoly.vertices[3].x)
        const maxx = Math.max(value.boundingPoly.vertices[0].x, value.boundingPoly.vertices[1].x, value.boundingPoly.vertices[2].x, value.boundingPoly.vertices[3].x)
        const propaty = {
          'top': miny * window.parent.screen.width / yoko + 'px',
          'left': minx * window.parent.screen.width / yoko  + 'px',
          'width': (maxx - minx) * window.parent.screen.width / yoko + 'px',
          'height': (maxy - miny) * window.parent.screen.width / yoko + 'px'
        }
        console.log(yoko)
        array.push([(minx+maxx)/2 * window.parent.screen.width / yoko ,(miny+maxy)/2 * window.parent.screen.width / yoko]);
        $('#frame' + i).css(propaty)
        i++
        many = i;
        var myh1 = document.getElementById("many");
        if (i == 0) {
          myh1.innerHTML = search + "見つかりませんでした！word/characterで精度を上げる";
        } else {
          myh1.innerHTML = search + "、それを含むものは" + i + "個見つかりました！";
        }
      }
    }
  }
}




let btn2 = 0;

function moving() {
  btn2++;
  if (btn2 % 2 == 1) {
    $('.frame').css({
      'animation-name': 'r1',
      'animation-duration': '0.4s',
      'animation-timing-function': 'linear',
      'animation-delay': 'infinite',
      'animation-iteration-count': 'infinite'
    });
  } else {
    $('.frame').css({
      'animation-iteration-count': '1'
    });
  }
}

// 実行
document.getElementById('input_img').addEventListener('change', ev => {
  if (!ev.target.files || ev.target.files.length == 0) return;
  Promise.resolve(ev.target.files[0])
    .then(getexif)
    .then(readFile)
    .then(sendAPI)
    .then(suc)
    .catch(fail)


});
