package com.campusmarketplace.service;

import com.campusmarketplace.Entity.Message;
import com.campusmarketplace.repository.MessageRepository;
import com.campusmarketplace.Entity.User;
import com.campusmarketplace.repository.UserRepository;
import java.time.LocalDateTime;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MessageService {

    private final MessageRepository messageRepository;
    private final UserRepository userRepository;

    public MessageService(MessageRepository messageRepository, UserRepository userRepository) {
        this.messageRepository = messageRepository;
        this.userRepository = userRepository;
    }

    public List<Message> getMessagesBetweenUsers(String username1, String username2) {
        User user1 = userRepository.findByUsername(username1)
                .orElseThrow(() -> new RuntimeException("User " + username1 + " not found"));
        User user2 = userRepository.findByUsername(username2)
                .orElseThrow(() -> new RuntimeException("User " + username2 + " not found"));

        return messageRepository.findMessagesBetweenUsers(user1.getId(), user2.getId());

    }

    public Message sendMessage(String fromUsername, String toUsername, String content) {
        User fromUser = userRepository.findByUsername(fromUsername)
                .orElseThrow(() -> new RuntimeException("Sender user " + fromUsername + " not found"));
        User toUser = userRepository.findByUsername(toUsername)
                .orElseThrow(() -> new RuntimeException("Receiver user " + toUsername + " not found"));

        Message message = new Message();
        message.setFrom(fromUser);
        message.setTo(toUser);
        message.setContent(content);
        message.setTimestamp(LocalDateTime.now());

        return messageRepository.save(message);
    }

}
