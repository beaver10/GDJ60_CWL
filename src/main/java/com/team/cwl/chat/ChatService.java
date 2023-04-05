package com.team.cwl.chat;

import java.util.List;

import javax.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ChatService {
	
	@Autowired
	private ChatDAO chatDAO;
	
	//최근 대화한 채팅리스트 받아오는 
	public List<ChatDTO> getChatList(ChatDTO chatDTO) throws Exception{
		return chatDAO.getChatList(chatDTO);
	}
	
	public int setChatAdd(ChatDTO chatDTO) throws Exception{
		return chatDAO.setChatAdd(chatDTO);
	}
	
	

}
