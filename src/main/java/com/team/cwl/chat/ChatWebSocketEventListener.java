package com.team.cwl.chat;

import java.util.List;

import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;

import com.team.cwl.chat.ApplicationEvent.ChatWebSocketConnectEvent;
import com.team.cwl.chat.ApplicationEvent.ChatWebSocketDisconnectEvent;

@Component
public class ChatWebSocketEventListener {
    
    @EventListener
    public void handleWebSocketConnect(ChatWebSocketConnectEvent event) {
        // ChatWebSocketConnectEvent 이벤트 처리 로직
        List<MessageDTO> messageDTOs = event.getChatMessages();
        // ... 처리 로직 작성
    }

    @EventListener
    public void handleWebSocketDisconnect(ChatWebSocketDisconnectEvent event) {
        // ChatWebSocketDisconnectEvent 이벤트 처리 로직
        List<MessageDTO> messageDTOs = event.getChatMessages();
        // ... 처리 로직 작성
    }
}
