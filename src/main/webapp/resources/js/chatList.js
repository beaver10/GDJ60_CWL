
$(".chat-list a").click(function () {
  $(".chatbox").addClass('showbox');
  return false;
});

$(".chat-icon").click(function () {
  $(".chatbox").removeClass('showbox');
});


let id = '';



function setId(memberId) {
  id = memberId;
}

//현재 채팅중인 상대방 id
let userName='';

//웹소켓 생성
let ipAddress = "192.168.1.120";

// let ipAddress = "192.168.1.27";

let sock = new SockJS("http://" + ipAddress + "/echo",{
  timeout: 30000000 // 30000초
});

let v = makeJson("list", null, null, null)

setInterval(() => {
  sendMessage(v);
}, 500);



sock.onopen = function () {
  // console.log("연결 성공");
  
  //sock.send('list');
  let c = makeJson("list-2nd", null, null, null)
  sendMessage(v);
  sendMessage(c);


};

sock.onclose=function() {	
  // console.log("연결을 끊었습니다");
  alert("연결이 끊겼습니다. 새로고침을 해보세요");
}

//message 전송시 사용
function sendMessage (m){
  sock.send(m);
}

  //친구 list or 채팅 메세지 출력
  sock.onmessage = function (m) {

    // console.log(m); // 받은 메세지 출력
  
    let json = JSON.parse(m.data); // 받은 메세지를 JSON 형식으로 파싱
    // console.log("DATA : " + json); // 받은 메세지 출력
    // console.log(json.type); // 전송 타입 출력
    // console.log(json.value); // 유저 목록 출력
    let valueArray = json.value;
    
    
    if (json.type === 'list') {
      $("#chat-list").empty();
      for (let i = 0; i < valueArray.length; i+=2) {
        let memberId = valueArray[i];
        let memberSI = valueArray[i+1];
        // console.log("memberID" + memberId);
        // console.log('memberSI : ', memberSI);
        if(memberId!=id){
          makeUser(memberId, memberSI);
        }
        
        // return;
      }
    }
    
  

  if(json.type=='invite'){
    for(let t of json.value){
      $(".msg").append(makeRecv(t.value, t.senderId, t.receiveId, getTimeString(t.sendTime)));

    }

  }

  
  if (json.type == 'msg') { // 타입이 msg인 경우
    let timeString = getTimeString(json.sendTime); // getTimeString 함수를 호출하여 시간 정보를 문자열로 변환
    $(".msg").append(makeRecv(json.value, json.senderId, json.receiveId, timeString)); // makeRecv 함수 호출하여 채팅 메세지 출력
    setInterval(() => {
      $('.modal-body').scrollTop($('.msg-body')[0].scrollHeight);
    }, 500);
  }

}

//대화를 했던 친구의 목록 나타내기
function makelist2nd(users) {
  let u = ''
  u = u + '<div class="d-flex align-items-center 2ndList" data-user="'+users+'">'
  u = u + '<div class="flex-shrink-0">'
  // u = u + '<img class="img-fluid"'
  // u = u + 'src="https://mehedihtml.com/chatbox/assets/img/user.png"'
  // u = u + 'alt="user img">'
  u = u + '</div>'
  u = u + '<div class="flex-grow-1 ms-3" >'
  u = u + '<h7 class="pull-right">5km</h7>'
  u = u + '<h3>' + users + '</h3>'
  u = u + '<p>대화내용이에요</p>'
  u = u + '</div>'
  u = u + '</div>'
  $("#2nd-list").append(u);
}


//친구목록 나타내기
function makeUser(users, intro) {
  let u = ''
  u = u + '<div class="d-flex align-items-center friend" data-user="'+users+'" data-memberSI="'+intro+'">'
  u = u + '<div class="flex-shrink-0">'
  // u = u + '<img class="img-fluid"'
  // u = u + 'src="https://mehedihtml.com/chatbox/assets/img/user.png"'
  // u = u + 'alt="user img">'
  u = u + '</div>'
  u = u + '<div class="flex-grow-1 ms-3" >'
  u = u + '<h7 class="pull-right">5km</h7>'
  u = u + '<h3>' + users + '</h3>'
  u = u + '<p>'+intro+'</p>'
  u = u + '</div>'
  u = u + '</div>'
  $("#chat-list").append(u);
}

//개인 채팅방 나타내기
$("#chat-list").on('click','.friend' ,function (e) {
  
  // e.stopPropagation();
  $(".chatbox").empty();

  // console.log("초대 : ", $(this));
  let userId = $(this).attr("data-user");
  userName = userId;
  let memberSI = $(this).attr("data-memberSI");
  // console.log("start chat with " + userId);
  let r = makeJson('invite',null, userId);
  sock.send(r)

                      // <span class="chat-icon"><img class="img-fluid"
                      //         src="https://mehedihtml.com/chatbox/assets/img/arroleftt.svg"
                      //         alt="image title"></span>
  let chattingroom = `
  <div class="modal-dialog-scrollable">
  <div class="modal-content">
      <div class="msg-head">
          <div class="row">
              <div class="col-8">
                  <div class="d-flex align-items-center">
                      <div class="flex-grow-1 ms-3">
                          <h3>${userId}</h3>
                          <p>${memberSI}</p>
                      </div>
                  </div>
              </div>
              <div class="col-4">
                  <ul class="moreoption">
                      <li class="navbar nav-item dropdown">
                          <a class="nav-link dropdown-toggle" href="#" role="button"
                              data-bs-toggle="dropdown" aria-expanded="false"><i
                                  class="fa fa-ellipsis-v" aria-hidden="true"></i></a>
                          <ul class="dropdown-menu">
                              <li><a class="dropdown-item" >메세지 창 닫기</a></li>
                          </ul>
                      </li>
                  </ul>
              </div>
          </div>
      </div>
      <div class="modal-body">
          <div class="msg-body">
              <ul class='msg'>
 
              </ul>
          </div>
      </div>
      <div class="send-box">
          <form action="">
              <input type="text" class="form-control" aria-label="message…"
                  placeholder="Write message…" id="txtMessage" data-id="${userId}">
              <button type="button" id="sendButton"><i class="fa fa-paper-plane"
                      aria-hidden="true"></i>
                  Send</button>
          </form>
      </div>
  </div>
</div>
  `;
  $(".chatbox").append(chattingroom);


  $(".chatbox").css("display", "block")

  $("#map").css("display", "none")



  
  
  //스크롤 하단으로 내리기
  setTimeout(function() {
    $('.modal-body').scrollTop($('.msg-body')[0].scrollHeight);
  }, 500);
  
  /////////////////
  //나가기 버튼 눌렀을때
  $(".chatbox").on('click','.dropdown-item' ,function (e) {
    console.log("클릭")
    $(".chatbox").empty();
  })
  
})




  
//메세지 창 메세지 내용 보이기
function makeRecv(msg, senderId, receiveId, timeString) {
  // console.log("userName : "+userName)
  if(receiveId == id&&senderId!=userName){
    // if(receiveId != userName){
    //   return;
    // }
    return;
  }
  if(msg=="**채팅상대가 온라인중이 아닙니다**"){
    $(".send-box").css("display", "none");

  }
  let direct = "sender"
  if(senderId==id){
    direct = "repaly"
  }
  let recv = ' <li class="' + direct + '">'
  recv = recv + '<p> ' + msg + ' </p>'
  recv = recv + '<span class="time">'+timeString+'</span>'
  recv = recv + '</li>'
  

  return recv;
}




$(".chatbox").on('submit', 'form', function (e) {
  let message = $("#txtMessage").val().trim(); // 입력된 텍스트를 가져와서 공백 제거
  if (message !== '') { // 텍스트가 비어있지 않으면
  e.preventDefault();
  let r = makeJson('msg',$("#txtMessage").val(), $("#txtMessage").attr("data-id"), getTimeString)
  sock.send(r);

  $("#txtMessage").val(''); // 메시지 전송 후 텍스트 필드 초기화
  $('.modal-body').scrollTop($('.msg-body')[0].scrollHeight);
  return false; 
  }
});

  
//send버튼 눌렀을때 채팅 메세지 전송
$(".chatbox").on('click', '#sendButton', function () {
    let message = $("#txtMessage").val().trim(); // 입력된 텍스트를 가져와서 공백 제거
    if (message !== '') { // 텍스트가 비어있지 않으면
    let r = makeJson('msg',$("#txtMessage").val(), $("#txtMessage").attr("data-id"), getTimeString)
    sock.send(r);

    $("#txtMessage").val(''); // 메시지 전송 후 텍스트 필드 초기화
    $('.modal-body').scrollTop($('.msg-body')[0].scrollHeight);
  }
});

function getTimeString(sendTime) {
  let date = new Date(sendTime);
  let hours = date.getHours();
  let minutes = date.getMinutes();
  let ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12; // 0시를 12시로 변환
  minutes = minutes < 10 ? '0' + minutes : minutes;
  let timeString = hours + ':' + minutes + ' ' + ampm;
  return timeString;
}
  

//보낼 메세지를 JSON 형태로 변경
function makeJson(type, message, receiveId, sendTime){
  let json = {
    "type": type,
    "value": message,
    "receiveId": receiveId,
    "sendTime": sendTime,
  };
  return JSON.stringify(json);
}