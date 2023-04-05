package com.team.cwl.chat;

import java.util.List;

public class ApplicationEvent {
	
	public class ChatWebSocketConnectEvent extends ApplicationEvent {
		
	    private List<MessageDTO> chatMessages;

	    public ChatWebSocketConnectEvent(Object source, List<MessageDTO> chatMessages) {
	        this.chatMessages = chatMessages;
	    }

	    public List<MessageDTO> getChatMessages() {
	        return chatMessages;
	    }
	}

	public class ChatWebSocketDisconnectEvent extends ApplicationEvent {
	    private List<MessageDTO> chatMessages;

	    public ChatWebSocketDisconnectEvent(Object source, List<MessageDTO> chatMessages) {
	        this.chatMessages = chatMessages;
	    }

	    public List<MessageDTO> getChatMessages() {
	        return chatMessages;
	    }
	}


}
