let CITE_TYPES = 4;
let CITE_MODELS = 2;

let shown = [];
for (var i = 0; i < CITE_MODELS; i++)
{
	shown.push(1);
}


function cite_update(model_index, answer_index)
{
	for (var i = 1; i <= CITE_TYPES; i++)
	{
		$("#cite_" + model_index + "" + i).hide();
	}
	$("#cite_" + model_index + "" + answer_index).show();
	// update the overall data to later handling
	shown[model_index] = answer_index;
}

function cite_update_mobile(model_index)
{
	cite_update(model_index, $("#cite_mobile_" + model_index).val());
}

function cite_copy(model_index) 
{
	var elem = document.getElementById("cite_"  + model_index + "" + shown[model_index]);
	var targetId = "_hiddenCopyText_";
	var isInput = elem.tagName === "INPUT" || elem.tagName === "TEXTAREA";
	var origSelectionStart, origSelectionEnd;
	if (isInput) {
		// can just use the original source element for the selection and copy
		target = elem;
		origSelectionStart = elem.selectionStart;
		origSelectionEnd = elem.selectionEnd;
	} else {
		// must use a temporary form element for the selection and copy
		target = document.getElementById(targetId);
		if (!target) {
			var target = document.createElement("textarea");
			target.style.position = "absolute";
			target.style.left = "-9999px";
			target.style.top = "0";
			target.id = targetId;
			document.body.appendChild(target);
		}
		target.textContent = elem.textContent;
	}
	// select the content
	var currentFocus = document.activeElement;
	target.focus();
	target.setSelectionRange(0, target.value.length);

	// copy the selection
	var succeed;
	try {
		  succeed = document.execCommand("copy");
	} catch(e) {
		succeed = false;
	}
	// restore original focus
	if (currentFocus && typeof currentFocus.focus === "function") {
		currentFocus.focus();
	}
	
	$("#cite_copy_btn_"  + model_index).html("copied");
	setTimeout(function(){ 
		$("#cite_copy_btn_"  + model_index).html('<svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="16" height="16" viewBox="0 0 172 172" style=" fill:#000000;"><g fill="none" fill-rule="nonzero" stroke="none" stroke-width="1" stroke-linecap="butt" stroke-linejoin="miter" stroke-miterlimit="10" stroke-dasharray="" stroke-dashoffset="0" font-family="none" font-weight="none" font-size="none" text-anchor="none" style="mix-blend-mode: normal"><path d="M0,172v-172h172v172z" fill="none"></path><g fill="#ffffff"><path d="M65.36,0v20.64l6.88,6.88v-20.64h51.6v41.28h41.28v89.44h-51.6v6.88h58.48v-101.1575l-43.3225,-43.3225zM130.72,11.7175l29.5625,29.5625h-29.5625zM0,27.52v144.48h106.64v-101.1575l-0.9675,-1.075l-41.28,-41.28l-1.075,-0.9675zM6.88,34.4h51.6v41.28h41.28v89.44h-92.88zM65.36,39.345l29.455,29.455h-29.455z"></path></g></g></svg> Copy Citation');
	}, 1000);
}