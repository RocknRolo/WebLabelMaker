// Author: Roeland L.C. Kemp (RocknRolo)

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext('2d');

const toText = document.getElementById("to_textarea");
const selectAddr = document.getElementById("select_address");
const addrText = document.getElementById("address_textarea");
const customAddr = document.getElementById("custom_addr_cb");
const express = document.getElementById('express');
const saveButton = document.getElementById('save_btn');
const printButton = document.getElementById('print_btn');
const battButton = document.getElementById('batt_btn');

const addrArr = makeAddrArr();

function makeAddrArr() {
	let rawArr = addressList.split("\n");
	let arr = [];
	for (let i = 0; i < rawArr.length; i++) {
		arr.push(rawArr[i].split(";"))
	}
	return arr;
}

function populateSelectAddr() {
    for (let i = 0; i < addrArr.length; i++) {
    	option = document.createElement('option');
    	option.text = addrArr[i][0];
    	option.value = i;
    	selectAddr.add(option);
    }
}

function updateAddrText() {
	let curAddr = addrArr[selectAddr.value];
	let addrStr = "";
	for (let i = 0; i < curAddr.length; i++) {
		addrStr += curAddr[i];
		if (i < curAddr.length - 1) {
			addrStr += "\n"
		}
	}
	addrText.value = addrStr;
}

function customAddress() {
	if (customAddr.checked) {
		addrText.removeAttribute("readOnly");
		selectAddr.value = "";
		selectAddr.setAttribute("disabled","");
	} else {
		addrText.value = "";
		addrText.setAttribute("readOnly","");
		selectAddr.removeAttribute("disabled");
		selectAddr.value = "Select an address...";
	}
}

////////////////////////////////////////////////////////////////////////////////////////////////////

// Constant variables for generateLabel():
const LABEL_WIDTH = 700;
const LABEL_HEIGHT = 450;
const LABEL_BG_COLOR = "#AAA";

canvas.setAttribute("width", LABEL_WIDTH);
canvas.setAttribute("height", LABEL_HEIGHT);

const TEXTBOX_WIDTH_MARGIN = 30;
const TEXTBOX_WIDTH = LABEL_WIDTH - (TEXTBOX_WIDTH_MARGIN * 2);

const BORDER_WIDTH = 3;

const X = (LABEL_WIDTH - TEXTBOX_WIDTH) / 2;

const TEXT_OFFSET = 8;

const TO_Y = 20;
const ADDR_Y = 138;
const TOS_Y = 386;

const HEADER_TEXT_Y_OFFSET	= 30;
const TO_TEXT_Y_OFFSET = 80;
const ADDR_TEXT_Y_OFFSET = 70;

const RET_ADDR_OFFSET = -5;

const TO_HEADER_WIDTH = 57;
const ADDR_HEADER_WIDTH = 135;
const TOS_HEADER_WIDTH = 254;

const HEADER_BOX_HEIGHT = 35;

const TO_BOX_HEIGHT = 70;
const ADDR_BOX_HEIGHT = 200;
const TOS_BOX_HEIGHT = 40;

const ADDR_LINE_HEIGHT = 35;

const HEADER_FONT = '30px sans-serif';
const RET_ADDR_FONT = '14px sans-serif';
const RET_ADDR_COLOR = "#666";

const TO_FONT_SIZE = 30;
const TO_FONT = TO_FONT_SIZE + 'px sans-serif';
const MIN_TO_FONT_SIZE = 8;

const ADDR_FONT = '30px sans-serif';
const TOS_FONT = 'bold 30px sans-serif';

const RET_ADDR_TEXT = "Company Name - Return address 1 - ZIPCODE - CITY - Country";

function generateLabel() {
	// Drawing background
	ctx.fillStyle = LABEL_BG_COLOR;
	ctx.fillRect(0, 0, LABEL_WIDTH, LABEL_HEIGHT);

	// Setting initial drawing properties
	ctx.lineWidth = BORDER_WIDTH;
	ctx.font = HEADER_FONT;

	// Drawing "To:" and "Address:" box.
	drawBox(TO_Y, "To:", TO_HEADER_WIDTH, TO_BOX_HEIGHT);
	drawBox(ADDR_Y, "Address:", ADDR_HEADER_WIDTH, ADDR_BOX_HEIGHT);
	
	// Drawing "Type of shipment:" box.
	ctx.fillStyle = "#FFF"; // White
	ctx.strokeRect(X, TOS_Y, TOS_HEADER_WIDTH, TOS_BOX_HEIGHT);
	ctx.fillRect(X + TOS_HEADER_WIDTH, TOS_Y, TEXTBOX_WIDTH - TOS_HEADER_WIDTH, TOS_BOX_HEIGHT);
	ctx.strokeRect(X + TOS_HEADER_WIDTH, TOS_Y, TEXTBOX_WIDTH - TOS_HEADER_WIDTH, TOS_BOX_HEIGHT);

	ctx.fillStyle = "#000"; // Black
	ctx.fillText("Type of shipment:", X + TEXT_OFFSET, TOS_Y + HEADER_TEXT_Y_OFFSET);

	// Writing return address
	ctx.fillStyle = RET_ADDR_COLOR;
	ctx.font = RET_ADDR_FONT;

	ctx.fillText(RET_ADDR_TEXT, (LABEL_WIDTH - ctx.measureText(RET_ADDR_TEXT).width) / 2, LABEL_HEIGHT + RET_ADDR_OFFSET);

	// Setting parameters for writing the content
	ctx.fillStyle = "#000"; // Black

	// Drawing "To:" contents
	// If "To:" field is empty: first line of "address" field will be placed in "To:" field and removed from "Address:" field.
	ctx.font = TO_FONT;
	let toTextStr = (toText.value.length != 0) ? toText.value : addrText.value.split("\n")[0];

	fitToFont(toTextStr);
	ctx.fillText(toTextStr, X + TEXT_OFFSET, TO_Y + TO_TEXT_Y_OFFSET);

	// Generating the appropriate Address array
	let addrToDraw = addrText.value.split("\n");
	if (toText.value.length == 0) {
		addrToDraw.shift();
	}

	// Drawing "Address:" contents
	ctx.font = ADDR_FONT;
	let addrLineOffset = ADDR_TEXT_Y_OFFSET;
	for (let i = 0; i < addrToDraw.length; i++) {
		ctx.fillText(addrToDraw[i], X + TEXT_OFFSET, ADDR_Y + addrLineOffset);
		addrLineOffset += ADDR_LINE_HEIGHT;
	}

	// Drawing "Type of shipment" contents
	ctx.font = TOS_FONT;
	let tosStr = express.checked ? "Express" : "Normal";
	let tosBoxWidth = LABEL_WIDTH - TOS_HEADER_WIDTH - (X * 2);
	let tosX = X + TOS_HEADER_WIDTH + (tosBoxWidth - ctx.measureText(tosStr).width) / 2;
	ctx.fillText(tosStr, tosX, TOS_Y + HEADER_TEXT_Y_OFFSET);
}

function drawBox(y, headerText, headerBoxWidth, height) {
	ctx.fillStyle = "#FFF";

	ctx.strokeRect(X, y, headerBoxWidth, height);
	ctx.fillRect(X, HEADER_BOX_HEIGHT + y, TEXTBOX_WIDTH, height);
	ctx.strokeRect(X, HEADER_BOX_HEIGHT + y, TEXTBOX_WIDTH, height);
	
	ctx.fillStyle = "#000";
	ctx.fillText(headerText, X + TEXT_OFFSET, y + HEADER_TEXT_Y_OFFSET);
}

function fitToFont(textStr) {
	let fontSize = TO_FONT_SIZE;
	while (ctx.measureText(textStr).width > TEXTBOX_WIDTH) {
		fontSize--;
		ctx.font = fontSize + "px sans-serif";
		if (ctx.measureText(textStr).width <= TEXTBOX_WIDTH || fontSize <= MIN_TO_FONT_SIZE) {
			break;
		}
	}
}

////////////////////////////////////////////////////////////////////////////////////////////////////
const FORM_PATH = 'form.png';


saveButton.addEventListener("click", function() {
	generateLabel();
    saveLabel(canvas.toDataURL("image/png", 1.0), 'address_label.png');
});

function saveLabel(data, filename) {
    let a = document.createElement('a');
    a.href = data;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
}

printButton.addEventListener("click", function() {
	generateLabel();
	let newWin = window.open();
	newWin.document.write("<img src = '" + canvas.toDataURL("image/png", 1.0) + "'/>");
	setTimeout(function() {
		newWin.print();
	}, 5);
});

battButton.addEventListener("click", function() {
	let newWin = window.open();
	newWin.document.write("<img src = '" + FORM_PATH + "'/>");
	setTimeout(function() {
		newWin.print();
	}, 5);
});