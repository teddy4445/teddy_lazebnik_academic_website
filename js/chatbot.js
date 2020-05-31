class ChatBot{
	
	constructor()
	{
		this.messages = [];
		
		// build the GUI
		this.init_chatbot();
	}
	
	init_chatbot()
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
		
		var chatbot_panel_body = document.createElement("div");
		chatbot_panel_body.classList.add("chatbot-panel-body");
		chatbot_panel_body.setAttribute("id", "chatbot-panel-body");
		
		var chatbot_panel_footer = document.createElement("div");
		chatbot_panel_footer.classList.add("chatbot-panel-footer");
		chatbot_panel_footer.setAttribute("id", "chatbot-panel-footer");
		
		var chatbot_panel_input = document.createElement("input");
		chatbot_panel_input.classList.add("chatbot-panel-input");
		chatbot_panel_input.setAttribute("id", "chatbot-panel-input");
		
		chatbot_panel_footer.appendChild(chatbot_panel_input);
		
		chatbot_panel_continer.appendChild(chatbot_panel_header);
		chatbot_panel_continer.appendChild(chatbot_panel_body);
		chatbot_panel_continer.appendChild(chatbot_panel_footer);
		chatbot_panel.appendChild(chatbot_panel_continer);
		document.body.appendChild(chatbot_panel);
	}	
	
	open_panel()
	{
		document.getElementById("chatbot-panel").style.display = "inherit";
		document.getElementById("chatbot-btn").style.display = "none";
		return false;
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