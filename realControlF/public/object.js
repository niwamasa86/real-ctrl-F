const api_key = `AIzaSyDrVpHg5DF8UHMQEIhLQ_eu6fMwdq6mE68`;
const url = `https://vision.googleapis.com/v1/images:annotate`;
let selectedImage = new Image();
let textDetctionRes = {};

let many=0;

function go() {
  //EnterキーならSubmit
  console.log("enter");
  if (window.event.keyCode == 13) searchString(document.forms.form1.textBox1.value);
}

// cloudvisionAPI にファイルを送信
const sendAPI = (base64string) => {
  $('.neon').css('display', 'none');
  $('#search-form form').css('display','table');
  var myh1 = document.getElementById("many");
      myh1.innerHTML = "Nowloading...";
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
        type: "LOGO_DETECTION"
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



 // ファイル読み込み
const readFile = (file) => {
  let reader = new FileReader();
  const p = new Promise((resolve, reject) => {
    reader.onload = (ev) => {
      document.querySelector('img').setAttribute('src', ev.target.result);
      selectedImage.onload = () => {
        console.log(selectedImage.width);
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

  console.log('SUCSESS', res);

  let data = JSON.stringify(res, null, 2);
  let data2 = JSON.parse(data);
  let data3 = data["responses"];
//jsonデータをbodyに出力
 //document.getElementById('output').innerHTML = "<code>" + data + "</code>";
  //from datalist に追加
  const dom = document.getElementById('datalist')
  res.responses[0].localizedObjectAnnotations.forEach((annotation,index) => {
    if(index==0) return
    const optionDom = document.createElement('option')

    optionDom.value = annotation.name

    dom.appendChild(optionDom)
  })

  //onButtonClick
  $('#exec').on('click',()=>{
    searchString(document.forms.form1.textBox1.value)
  })

}

//失敗した場合の処理
const fail = (err => {
  console.log('FAILED:', err);
  document.querySelector('pre').innerHTML = JSON.stringify(err, null, 2);
})



let searchString = () => {
$('.button').css('display','inline-block');
  let url="https://script.google.com/macros/s/AKfycbweJFfBqKUs5gGNnkV2xwTZtZPptI6ebEhcCU2_JvOmHwM2TCk/exec?text=honyaku&source=ja&target=en";
  $('#output').empty();
  $('.frame').remove();
    let search = document.forms.form1.textBox1.value;
    var resulturl=url.replace("honyaku" , search );
    console.log(resulturl);
    var $defer = new $.Deferred();

  $(function(){
       $.ajax({
         url:resulturl,
       }

       ).done(function(search){
       search=search.charAt(0).toUpperCase()+search.slice(1);

             //もし、検索窓に入力した文字列とidが一致したら、そのオブジェクトを（特定して）取り出したい
             console.log(search);
             var i = 0;
             for( let value of  textDetctionRes.responses[0].localizedObjectAnnotations ) {
                 if(value.name == search) {
                     $("#canvas").append('<div id="frame'+i+'" class="frame"></div>');
                     let miny=Math.min(value.boundingPoly.normalizedVertices[0].y,value.boundingPoly.normalizedVertices[1].y,value.boundingPoly.normalizedVertices[2].y,value.boundingPoly.normalizedVertices[3].y);
                     let maxy=Math.max(value.boundingPoly.normalizedVertices[0].y,value.boundingPoly.normalizedVertices[1].y,value.boundingPoly.normalizedVertices[2].y,value.boundingPoly.normalizedVertices[3].y);
                     let minx= Math.min(value.boundingPoly.normalizedVertices[0].x,value.boundingPoly.normalizedVertices[1].x,value.boundingPoly.normalizedVertices[2].x,value.boundingPoly.normalizedVertices[3].x);
                     let maxx= Math.max(value.boundingPoly.normalizedVertices[0].x,value.boundingPoly.normalizedVertices[1].x,value.boundingPoly.normalizedVertices[2].x,value.boundingPoly.normalizedVertices[3].x);
                     let propaty = {
                       'top':   miny*window.parent.screen.width/selectedImage.width*selectedImage.height  + 'px',
                       'left':  minx*window.parent.screen.width/selectedImage.width *selectedImage.width+ 'px',
                       'width': (maxx-minx)*window.parent.screen.width/selectedImage.width*selectedImage.width + 'px',
                       'height':(maxy-miny)*window.parent.screen.width/selectedImage.width*selectedImage.height+ 'px'
                     };
                     $('#frame'+i).css(propaty);
                     i++;
                 }
             }

       });
  });



}
let btn2=0;
function moving(){
  btn2++;
if(btn2%2==1){
    $('.frame').css({
    'animation-name': 'r1',
    'animation-duration':'0.4s',
    'animation-timing-function':'linear',
    'animation-delay':'infinite',
    'animation-iteration-count':'infinite'
  });}else{
      $('.frame').css({
      'animation-iteration-count':'1'});
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
