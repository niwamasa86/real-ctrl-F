let selectedImage = new Image();
let textDetctionRes = {};

let many = 0;
let yoko = '';

function go() {
  //EnterキーならSubmit
  console.log("enter");
  if (window.event.keyCode == 13) searchString(document.forms.form1.textBox1.value);
}


// cloudvisionAPI にファイルを送信
const sendAPI = (base64string) => {
$('.neon').css('display', 'none');
  //manyを定義してNowloadingと表示
  let myh1 = document.getElementById("many");
  myh1.innerHTML = "Nowloading...";
  //frame削除
  $('.frame').remove()
  //bodyでリクエストする情報を指定
  let body = {
    requests: [{
      image: {
        content: base64string
      },
      features: [{
          type: 'TEXT_DETECTION'
        },
        {
          type: 'LOGO_DETECTION'
        }
      ]
    }]
  };
  let xhr = new XMLHttpRequest();
  xhr.open('POST', '/api/vision', true);
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
//     recogniton.start()
//   }
//
// }



// ファイル読み込み
const readFile = (file) => {
  let reader = new FileReader();
  const p = new Promise((resolve, reject) => {
    reader.onload = (ev) => {
      document.querySelector('img').setAttribute('src', ev.target.result);
      selectedImage.onload = () => {
        console.log(selectedImage.width);
        console.log(selectedImage.height);
        $(".img-wrap img").css({
          "width": window.parent.screen.width + "px"
        });
      }
      selectedImage.src = ev.target.result;
      resolve(ev.target.result.replace(/^data:image\/(png|jpeg);base64,/, ''));
    };
  })
  reader.readAsDataURL(file);
  EXIF.getData(file, function() {
    // EXIF.getTag(this, "[exifのタグ名]")で、値を取得
    let result = EXIF.getTag(this, "Orientation");
    console.log(result);
    //orientatioの値によっておこるバグの修正
    if (result == 6) {
      yoko = selectedImage.height
    } else {
      yoko = selectedImage.width
    }



  });
  return p;

};

//成功した場合の処理
const suc = (res) => {
  textDetctionRes = res;
  var myh1 = document.getElementById("many");
  myh1.innerHTML = "Ready";
  //検索ボックス表示
  $('#search-form form').css('display', 'table');

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

//word/characterを押したときの動作
let btn = 0;

function option() {
  btn++;
  searchString(document.forms.form1.textBox1.value)
}

const searchString = (search) => {
  $('.button').css('display', 'inline-block');
  $('#output').empty()
  $('.frame').remove()
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
          'left': minx * window.parent.screen.width /yoko + 'px',
          'width': (maxx - minx) * window.parent.screen.width / yoko + 'px',
          'height': (maxy - miny) * window.parent.screen.width / yoko + 'px'
        }
        $('#frame' + i).css(propaty)
        i++
        many = i;
        console.log(i)
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
    .then(readFile)
    .then(sendAPI)
    .then(suc)
    .catch(fail)



});
