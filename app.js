const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
const color = document.getElementById("color");

// forEach 함수를 사용하려면 배열이 필요함 Array.from()으로 배열로 바꿈
const colorOptions = Array.from(
  document.getElementsByClassName("color-option")
);

const lineWidth = document.getElementById("line-width");
const fileInput = document.getElementById("file");
const textInput = document.getElementById("text");

const eraserBtn = document.getElementById("eraser-btn");
const destroyBtn = document.getElementById("destroy-btn");
const modeBtn = document.getElementById("mode-btn");
const saveBtn = document.getElementById("save");

// 가로,세로 길이
const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 800;

canvas.width = CANVAS_WIDTH;
canvas.height = CANVAS_HEIGHT;
ctx.lineWidth = lineWidth.value;
ctx.lineCap = "round"; //라인 선 둥글게

let isPainting = false;
let isFilling = false;

function onMove(event) {
  if (isPainting) {
    ctx.lineTo(event.offsetX, event.offsetY);
    ctx.stroke();
    return;
  }
  ctx.beginPath();
  ctx.moveTo(event.offsetX, event.offsetY);
}

function onMouseDown(event) {
  isPainting = true;
}
function onMouseUp(event) {
  isPainting = false;
}

function onLineWidthChange(event) {
  // console.log(event.target.value)
  ctx.lineWidth = event.target.value;
  console.log(event.target.value);
}
function onColorChange(event) {
  // console.log(event.target.value)
  ctx.fillStyle = event.target.value;
  ctx.strokeStyle = event.target.value;
}

// 사용자에게 알리는 용도
function onColorClick(event) {
  //누군가 색깔 박스를 클릭하면, data 어트리뷰트에서 color를 가져옴
  const colorValue = event.target.dataset.color;
  ctx.fillStyle = colorValue; //배경 색깔을 바꿔줌
  ctx.strokeStyle = colorValue; //라인 색깔을 바꿔줌
  color.value = colorValue; //color input 값도 바꿔줌
}

// 버튼
function onModeClick(event) {
  // 사용자가 채우기 모드일 때 이 버튼을 클릭한다면, 채우기 모드를 멈추고, modeBtn 텍스트를 Fill로 바꿔줘서 사용자에게 모드가 바뀌었다는 걸 알려줌.
  if (isFilling) {
    isFilling = false;
    modeBtn.innerText = "Fill";
    // 채우기 모드가 아니면, 채우기 모드로 바꾸고 싶다는 거니까 isFilling는 true가 되고, 버튼의 텍스트도 바꿔줌
  } else {
    isFilling = true;
    modeBtn.innerText = "Draw";
  }
}
function onCanvasClick(event) {
  //isFilling이 true면, 사각형을 그릴건데, 좌표x,y가 0이고 가로세로가 800로 캔버스 전체를 덮어줌
  if (isFilling) {
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  }
}
function onDestroyClick(event) {
  //무조건 fillStyle을 흰색으로 채워줌
  ctx.fillStyle = "white";
  //그리고 사각형을 만듬 0,0에서 시작하고 캔버스 크기만큼
  ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
}
function onEraserClick(event) {
  // 선을 흰색으로
  ctx.strokeStyle = "white";
  isFilling = false;
  // 채우기 모드로 바꿔줌.
  modeBtn.innerHTML = "Fill";
}
function onfileChange(event) {
  //업로드한 파일을 가져옴 (배열인 이유는 input multiple속성을 추가할 수 있기 때문.)
  //multiple 속성을 추가하면 유저가 파일을 여러 개 업로드 할 수 있음. 여기서는 하나만 필요하니까 [0] 첫번째 파일만 필요함
  const file = event.target.files[0];
  //그 파일을 가리키는 url요청
  const url = URL.createObjectURL(file);
  const image = new Image();
  image.src = url;
  //이미지가 로딩되면 캔버스에 그 이미지를 그림
  image.onload = function () {
    ctx.drawImage(image, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    //다른 이미지를 추가
    fileInput.value = null;
  };
}
function onDoubleClick(event) {
  const text = textInput.value;
  if (text !== "") {
    ctx.save(); //ctx의 현재 상태, 색상, 스타일 등 모든 것을 저장함. "즉 현재상태를 저장함"
    ctx.lineWidth = 1;
    ctx.font = "68px serif"; //size, family
    ctx.fillText(text, event.offsetX, event.offsetY);
    ctx.restore(); //save와의 사이에서는 어떤 수정을 하던 저장 되지 않음. "즉 저장해뒀던 버전으로 되돌림"
    //restore();를 쓰면 기존의 체크포인트로 돌아감.
    // console.log(event.offsetX, event.offsetY); //offsetX,Y 는 마우스가 클릭한 켄버스 내부 좌표임
  }
}
function onSaveClick(event) {
  // console.log(canvas.toDataURL()); //toDataURL :내가 그린게 URL로 인코딩 됨.
  const url = canvas.toDataURL();
  const a = document.createElement("a");
  a.href = url;
  a.download = "myDrawing.png";
  a.click();
}
{
  /* <a href="" download></a> //download라는 속성을 a태그에 더해주면 파일 다운로드를 작동시킴. */
}

// 이벤트
canvas.addEventListener("dblclick", onDoubleClick); //더블클릭은 mousedown, mouseup이 빠르게 일어날 때 발생함.
canvas.addEventListener("mousemove", onMove);
canvas.addEventListener("mousedown", onMouseDown);
canvas.addEventListener("mouseup", onMouseUp);
canvas.addEventListener("mouseleave", onMouseUp);
canvas.addEventListener("click", onCanvasClick);

lineWidth.addEventListener("change", onLineWidthChange);
color.addEventListener("change", onColorChange);

// forEach를 사용해 onColorClick 함수를 가진 클릭 이벤트리스너를 추가함
colorOptions.forEach((color) => color.addEventListener("click", onColorClick));

modeBtn.addEventListener("click", onModeClick);
destroyBtn.addEventListener("click", onDestroyClick);
eraserBtn.addEventListener("click", onEraserClick);
fileInput.addEventListener("change", onfileChange);
saveBtn.addEventListener("click", onSaveClick);
