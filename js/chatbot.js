let MESSAGE_TYPE = ["text", "img", "audio", "video"];


class ChatBot
{
	
	constructor(first_message)
	{
		this.messages = [];
		
		this.brain = new ChatBotBrain({});
		
		// build the GUI
		this.init_chatbot(first_message);
	}
	
	init_chatbot(first_message)
	{
		var chatbot_btn = document.createElement("button");
		chatbot_btn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="30" height="30" viewBox="0 0 172 172" style=" fill:#000000;"><g fill="none" fill-rule="nonzero" stroke="none" stroke-width="1" stroke-linecap="butt" stroke-linejoin="miter" stroke-miterlimit="10" stroke-dasharray="" stroke-dashoffset="0" font-family="none" font-weight="none" font-size="none" text-anchor="none" style="mix-blend-mode: normal"><path d="M0,172v-172h172v172z" fill="none"></path><g fill="#ffffff"><path d="M74.53333,17.2c-34.83,0 -63.06667,25.66813 -63.06667,57.33333c0,16.2632 7.49993,30.88989 19.47318,41.30911c-1.71739,5.62423 -5.29979,11.21796 -11.88099,16.20339c-0.00372,0.00374 -0.00746,0.00748 -0.0112,0.0112c-1.11129,0.42263 -1.84635,1.48737 -1.84766,2.6763c0,1.58322 1.28345,2.86667 2.86667,2.86667c0.19588,-0.00244 0.391,-0.02496 0.58229,-0.06719c11.12306,-0.03241 20.61351,-4.78364 28.16276,-10.7388c3.58246,1.45718 7.32203,2.65852 11.22031,3.49375c-1.74293,-4.93067 -2.6987,-10.18016 -2.6987,-15.62109c0,-28.45453 25.71973,-51.6 57.33333,-51.6c7.92347,0 15.47677,1.45564 22.35104,4.08724c-3.99041,-28.1736 -30.41211,-49.95391 -62.48438,-49.95391zM114.66667,74.53333c-25.33146,0 -45.86667,17.96831 -45.86667,40.13333c0,22.16503 20.53521,40.13333 45.86667,40.13333c5.86456,-0.00812 11.67293,-1.00025 17.11042,-2.92266c7.03112,4.91169 15.54015,8.55476 25.28489,8.5888c0.19861,0.04378 0.40131,0.06631 0.60469,0.06719c1.58322,0 2.86667,-1.28345 2.86667,-2.86667c-0.00188,-1.20157 -0.7529,-2.27446 -1.88125,-2.6875c-5.24708,-3.98365 -8.6101,-8.36855 -10.62683,-12.83281c8.01571,-7.4324 12.48919,-17.26044 12.50808,-27.47969c0,-22.16503 -20.53521,-40.13333 -45.86667,-40.13333z"></path></g></g></svg>';
		chatbot_btn.classList.add("chatbot-btn");
		chatbot_btn.setAttribute("id", "chatbot-btn");
		chatbot_btn.setAttribute("onclick", "return bot.open_panel();");
		document.body.appendChild(chatbot_btn);
		
		var chatbot_panel = document.createElement("div");
		chatbot_panel.classList.add("chatbot-panel");
		chatbot_panel.setAttribute("id", "chatbot-panel");
		
		var chatbot_panel_continer = document.createElement("div");
		chatbot_panel_continer.classList.add("chatbot-panel-container");
		chatbot_panel_continer.setAttribute("id", "chatbot-panel-container");
		
		var chatbot_panel_header = document.createElement("div");
		chatbot_panel_header.classList.add("chatbot-panel-header");
		chatbot_panel_header.setAttribute("id", "chatbot-panel-header");
		
		var chatbot_panel_header_contianer = document.createElement("div");
		chatbot_panel_header_contianer.classList.add("chatbot-panel-header-container");
		chatbot_panel_header_contianer.setAttribute("id", "chatbot-panel-header-container");
		
		var chatbot_panel_exit = document.createElement("button");
		chatbot_panel_exit.classList.add("chatbot-panel-exit");
		chatbot_panel_exit.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="26" height="26" viewBox="0 0 172 172" style=" fill:#000000;"><g fill="none" fill-rule="nonzero" stroke="none" stroke-width="1" stroke-linecap="butt" stroke-linejoin="miter" stroke-miterlimit="10" stroke-dasharray="" stroke-dashoffset="0" font-family="none" font-weight="none" font-size="none" text-anchor="none" style="mix-blend-mode: normal"><path d="M0,172v-172h172v172z" fill="none"></path><g fill="#ffffff"><path d="M139.75,0h-107.5c-17.80469,0 -32.25,14.44531 -32.25,32.25v107.5c0,17.80469 14.44531,32.25 32.25,32.25h107.5c17.80469,0 32.25,-14.44531 32.25,-32.25v-107.5c0,-17.80469 -14.44531,-32.25 -32.25,-32.25zM124.24519,115.07151l-9.19952,9.17368c-1.67969,1.67969 -4.41887,1.67969 -6.09856,0l-22.94712,-22.94712l-22.94712,22.94712c-1.67969,1.67969 -4.41887,1.67969 -6.09856,-0.02584l-9.19952,-9.14784c-1.65385,-1.70553 -1.65385,-4.41887 0,-6.1244l22.94712,-22.94712l-22.92128,-22.92128c-1.67969,-1.70553 -1.67969,-4.44471 0,-6.1244l9.17368,-9.17368c1.67969,-1.70553 4.44471,-1.70553 6.1244,0l22.92128,22.92128l22.94712,-22.92128c1.67969,-1.70553 4.44471,-1.70553 6.09856,0l9.19952,9.14784c1.67969,1.70553 1.67969,4.44471 0,6.15024l-22.94712,22.92128l22.94712,22.94712c1.65385,1.70553 1.65385,4.41887 0,6.1244z"></path></g></g></svg>';
		chatbot_panel_exit.setAttribute("onclick", "return bot.close_panel();");
		chatbot_panel_exit.setAttribute("id", "chatbot-panel-exit");
		
		var chatbot_panel_profile = document.createElement("div");
		chatbot_panel_profile.classList.add("chatbot-panel-profile");
		chatbot_panel_profile.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="32" height="32" viewBox="0 0 172 172" style=" fill:#000000;"><g fill="none" fill-rule="nonzero" stroke="none" stroke-width="1" stroke-linecap="butt" stroke-linejoin="miter" stroke-miterlimit="10" stroke-dasharray="" stroke-dashoffset="0" font-family="none" font-weight="none" font-size="none" text-anchor="none" style="mix-blend-mode: normal"><path d="M0,172v-172h172v172z" fill="none"></path><g fill="#0e53a7"><path d="M86,16.125c-5.93937,0 -10.75,4.81063 -10.75,10.75c0,3.97184 2.17347,7.39808 5.375,9.25928v12.24072h-26.875c-14.77865,0 -26.875,12.09635 -26.875,26.875v5.375h-16.125v37.625h16.125v26.875h21.5h5.375h16.125v-10.75h-10.75v-10.75h53.75v5.375h10.75v-16.125h-75.25v21.5h-10.75v-59.125c0,-8.9681 7.1569,-16.125 16.125,-16.125h64.5c8.9681,0 16.125,7.1569 16.125,16.125v48.375c0,8.9681 -7.1569,16.125 -16.125,16.125h-17.61572c-1.8612,-3.20153 -5.28744,-5.375 -9.25928,-5.375c-5.93937,0 -10.75,4.81062 -10.75,10.75c0,5.93938 4.81063,10.75 10.75,10.75c3.97183,0 7.39808,-2.17347 9.25928,-5.375h17.61572c14.77865,0 26.875,-12.09635 26.875,-26.875v-5.375h16.125v-37.625h-16.125v-5.375c0,-14.77865 -12.09635,-26.875 -26.875,-26.875h-26.875v-12.24072c3.20153,-1.8612 5.375,-5.28744 5.375,-9.25928c0,-5.93937 -4.81063,-10.75 -10.75,-10.75zM64.5,75.25c-5.93938,0 -10.75,4.81063 -10.75,10.75c0,5.93937 4.81062,10.75 10.75,10.75c5.93937,0 10.75,-4.81063 10.75,-10.75c0,-5.93937 -4.81063,-10.75 -10.75,-10.75zM107.5,75.25c-5.93937,0 -10.75,4.81063 -10.75,10.75c0,5.93937 4.81063,10.75 10.75,10.75c5.93937,0 10.75,-4.81063 10.75,-10.75c0,-5.93937 -4.81063,-10.75 -10.75,-10.75zM21.5,91.375h5.375v16.125h-5.375zM145.125,91.375h5.375v16.125h-5.375z"></path></g></g></svg>';
		chatbot_panel_profile.setAttribute("id", "chatbot-panel-profile");
		
		var chatbot_panel_profile_name = document.createElement("h3");
		chatbot_panel_profile_name.classList.add("chatbot-panel-profile-name");
		chatbot_panel_profile_name.innerHTML = 'Virtual Teddy';
		chatbot_panel_profile_name.setAttribute("id", "chatbot-panel-profile-name");
		
		chatbot_panel_header_contianer.appendChild(chatbot_panel_profile);
		chatbot_panel_header_contianer.appendChild(chatbot_panel_profile_name);
		
		chatbot_panel_header.appendChild(chatbot_panel_header_contianer);
		chatbot_panel_header.appendChild(chatbot_panel_exit);
		
		var chatbot_panel_body = document.createElement("div");
		chatbot_panel_body.classList.add("chatbot-panel-body");
		chatbot_panel_body.setAttribute("id", "chatbot-panel-body");
		
		var chatbot_panel_footer = document.createElement("div");
		chatbot_panel_footer.classList.add("chatbot-panel-footer");
		chatbot_panel_footer.setAttribute("id", "chatbot-panel-footer");
		
		var chatbot_panel_input = document.createElement("input");
		chatbot_panel_input.classList.add("chatbot-panel-input");
		chatbot_panel_input.setAttribute("id", "chatbot-panel-input");
		chatbot_panel_input.setAttribute("onkeyup", "if (event.keyCode == 13) document.getElementById('chatbot-panel-send').click()");
		
		var chatbot_panel_send = document.createElement("button");
		chatbot_panel_send.classList.add("chatbot-panel-send");
		chatbot_panel_send.setAttribute("onclick", "return bot.send();");
		chatbot_panel_send.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="24" height="24" viewBox="0 0 172 172" style=" fill:#000000;"><g fill="none" fill-rule="nonzero" stroke="none" stroke-width="1" stroke-linecap="butt" stroke-linejoin="miter" stroke-miterlimit="10" stroke-dasharray="" stroke-dashoffset="0" font-family="none" font-weight="none" font-size="none" text-anchor="none" style="mix-blend-mode: normal"><path d="M0,172v-172h172v172z" fill="none"></path><g fill="#0e53a7"><path d="M157.66667,14.33333l-143.33333,52.1123l38.96875,38.98275l75.69792,-62.42839l-62.42839,75.69792l38.98275,38.96875z"></path></g></g></svg>';
		chatbot_panel_send.setAttribute("id", "chatbot-panel-send");
		
		chatbot_panel_footer.appendChild(chatbot_panel_input);
		chatbot_panel_footer.appendChild(chatbot_panel_send);
		
		chatbot_panel_continer.appendChild(chatbot_panel_header);
		chatbot_panel_continer.appendChild(chatbot_panel_body);
		chatbot_panel_continer.appendChild(chatbot_panel_footer);
		chatbot_panel.appendChild(chatbot_panel_continer);
		document.body.appendChild(chatbot_panel);
		
		this.add_message(false, "text", first_message);
	}
	
	add_api_message(message_obj)
	{
		this.add_message(message_obj.is_human, message_obj.type, message_obj.content);
	}
	
	add_message(is_human, message_type, content)
	{
		// build history
		var new_message = new Massage(is_human, message_type, content);
		this.messages.push(new_message);
		
		var message_container = document.createElement("div");
		message_container.classList.add("chatbot-panel-message-container");
		message_container.setAttribute("id", "message-container-" + this.messages.length);
		
		var message_talker = document.createElement("div");
		message_talker.classList.add("chatbot-talker");
		message_talker.setAttribute("id", "chatbot-talker-"  + this.messages.length);
		
		var message_box = document.createElement("div");
		message_box.classList.add("chatbot-message");
		message_box.setAttribute("id", "chatbot-message-"  + this.messages.length);
		
		var message_content;
		if (message_type == "text")
		{
			message_content = document.createElement("p");
			message_content.innerHTML = content;
			message_content.setAttribute("id", "chatbot-message-p-"  + this.messages.length);
		}
		
		// if human or not
		if (is_human)
		{
			message_talker.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="30" height="30" viewBox="0 0 172 172" style=" fill:#000000;"><g fill="none" fill-rule="nonzero" stroke="none" stroke-width="1" stroke-linecap="butt" stroke-linejoin="miter" stroke-miterlimit="10" stroke-dasharray="" stroke-dashoffset="0" font-family="none" font-weight="none" font-size="none" text-anchor="none" style="mix-blend-mode: normal"><path d="M0,172v-172h172v172z" fill="none"></path><g fill="#0e53a7"><path d="M86,17.2c-19.00027,0 -34.4,15.39973 -34.4,34.4v5.73333c0,19.00027 15.39973,34.4 34.4,34.4c19.00027,0 34.4,-15.39973 34.4,-34.4v-5.73333c0,-19.00027 -15.39973,-34.4 -34.4,-34.4zM85.9888,108.93333c-22.96773,0 -52.43707,12.42324 -60.91667,23.44844c-5.24027,6.81693 -0.25182,16.68489 8.34245,16.68489h105.15964c8.59427,0 13.58271,-9.86796 8.34245,-16.68489c-8.4796,-11.01947 -37.96013,-23.44844 -60.92786,-23.44844z"></path></g></g></svg>';
			message_box.style.marginLeft = "20px";
			message_container.style.flexDirection = "row-reverse";
		}
		else
		{
			message_talker.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="32" height="32" viewBox="0 0 172 172" style=" fill:#000000;"><g fill="none" fill-rule="nonzero" stroke="none" stroke-width="1" stroke-linecap="butt" stroke-linejoin="miter" stroke-miterlimit="10" stroke-dasharray="" stroke-dashoffset="0" font-family="none" font-weight="none" font-size="none" text-anchor="none" style="mix-blend-mode: normal"><path d="M0,172v-172h172v172z" fill="none"></path><g fill="#0e53a7"><path d="M86,16.125c-5.93937,0 -10.75,4.81063 -10.75,10.75c0,3.97184 2.17347,7.39808 5.375,9.25928v12.24072h-26.875c-14.77865,0 -26.875,12.09635 -26.875,26.875v5.375h-16.125v37.625h16.125v26.875h21.5h5.375h16.125v-10.75h-10.75v-10.75h53.75v5.375h10.75v-16.125h-75.25v21.5h-10.75v-59.125c0,-8.9681 7.1569,-16.125 16.125,-16.125h64.5c8.9681,0 16.125,7.1569 16.125,16.125v48.375c0,8.9681 -7.1569,16.125 -16.125,16.125h-17.61572c-1.8612,-3.20153 -5.28744,-5.375 -9.25928,-5.375c-5.93937,0 -10.75,4.81062 -10.75,10.75c0,5.93938 4.81063,10.75 10.75,10.75c3.97183,0 7.39808,-2.17347 9.25928,-5.375h17.61572c14.77865,0 26.875,-12.09635 26.875,-26.875v-5.375h16.125v-37.625h-16.125v-5.375c0,-14.77865 -12.09635,-26.875 -26.875,-26.875h-26.875v-12.24072c3.20153,-1.8612 5.375,-5.28744 5.375,-9.25928c0,-5.93937 -4.81063,-10.75 -10.75,-10.75zM64.5,75.25c-5.93938,0 -10.75,4.81063 -10.75,10.75c0,5.93937 4.81062,10.75 10.75,10.75c5.93937,0 10.75,-4.81063 10.75,-10.75c0,-5.93937 -4.81063,-10.75 -10.75,-10.75zM107.5,75.25c-5.93937,0 -10.75,4.81063 -10.75,10.75c0,5.93937 4.81063,10.75 10.75,10.75c5.93937,0 10.75,-4.81063 10.75,-10.75c0,-5.93937 -4.81063,-10.75 -10.75,-10.75zM21.5,91.375h5.375v16.125h-5.375zM145.125,91.375h5.375v16.125h-5.375z"></path></g></g></svg>';
			message_box.style.marginRight = "20px";
			message_container.style.flexDirection = "row";
		}
		
		message_box.appendChild(message_content);
		
		message_container.appendChild(message_talker);
		message_container.appendChild(message_box);
		
		var panel = document.getElementById("chatbot-panel-body");
		panel.appendChild(message_container);
		panel.scrollTop = panel.scrollHeight;
	}
	
	send()
	{
		var messageElement = document.getElementById("chatbot-panel-input");
		var message = messageElement.value.trim();
		if (message != "")
		{
			// add user's message
			this.add_message(true, "text", message); 
			
			setTimeout(function(){
				messageElement.disabled = false;
				chatbot_response(message);
				messageElement.focus();
			}, 500);
			
			
			// GUI logic
			messageElement.disabled = true;
			messageElement.value = "";
			messageElement.focus();
		}
	}
	
	open_panel()
	{
		document.getElementById("chatbot-panel").style.display = "inherit";
		document.getElementById("chatbot-btn").style.display = "none";
		return false;
	}
	
	close_panel()
	{
		document.getElementById("chatbot-panel").style.display = "none";
		document.getElementById("chatbot-btn").style.display = "inherit";
		return false;
	}
}

function chatbot_response(message)
{
	bot.add_api_message(bot.brain.response(message)); 
}

class ChatBotBrain
{
	constructor(qna)
	{
		this.qna = qna;
	}
	
	response(message)
	{
		// TODO: add here some cool logic
		return new Massage(false, "text", "answer");
	}
}

class Massage{
	
	constructor(is_human, type, content)
	{
		this.is_human = is_human;
		this.type = type;
		this.content = content;
	}
}