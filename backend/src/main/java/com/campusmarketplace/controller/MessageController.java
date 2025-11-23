package com.campusmarketplace.controller;

import com.campusmarketplace.Entity.Message;
import com.campusmarketplace.dto.MessageResponse;
import com.campusmarketplace.service.MessageService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/messages")
public class MessageController {

    private final MessageService messageService;

    public MessageController(MessageService messageService) {
        this.messageService = messageService;
    }

    @GetMapping("/between")
    public ResponseEntity<List<MessageResponse>> getMessagesBetweenUsers(
            @RequestParam String username1,
            @RequestParam String username2) {

        List<Message> messages = messageService.getMessagesBetweenUsers(username1, username2);

        List<MessageResponse> response = messages.stream()
                .map(msg -> new MessageResponse(
                        msg.getId(),
                        msg.getFrom().getUsername(),
                        msg.getTo().getUsername(),
                        msg.getTimestamp(),
                        msg.getContent()
                ))
                .collect(Collectors.toList());

        return ResponseEntity.ok(response);
    }

    @PostMapping("/send")
    public ResponseEntity<MessageResponse> sendMessage(@RequestParam String fromUsername,
                                               @RequestParam String toUsername,
                                               @RequestBody String content) {
        System.out.println("Sending message from " + fromUsername + " to " + toUsername + ": " + content);
        Message message = messageService.sendMessage(fromUsername, toUsername, content);

        MessageResponse response = new MessageResponse(
                message.getId(),
                message.getFrom().getUsername(),
                message.getTo().getUsername(),
                message.getTimestamp(),
                message.getContent()
        );

        return ResponseEntity.ok(response);

    }

}
