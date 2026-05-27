package com.sergio.springaidemo.controller;

import java.util.List;

import com.sergio.springaidemo.controller.dto.ChatMessage;
import com.sergio.springaidemo.controller.dto.ChatRequest;
import com.sergio.springaidemo.controller.dto.ChatResponse;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/chat")
public class ChatController {

    private final ChatClient chatClient;

    public ChatController(ChatClient chatClient) {
        this.chatClient = chatClient;
    }

    @PostMapping
    public ChatResponse chat(@Valid @RequestBody ChatRequest request) {
        String prompt = buildConversationPrompt(request.messages());
        String reply = this.chatClient.prompt()
                .user(prompt)
                .call()
                .content();

        return new ChatResponse(reply);
    }

    private String buildConversationPrompt(@NotEmpty List<ChatMessage> messages) {
        StringBuilder prompt = new StringBuilder();
        prompt.append("Continue this conversation as the assistant. Reply only with the next assistant message.\n\n");

        for (ChatMessage message : messages) {
            String role = message.role() == null ? "user" : message.role().trim().toLowerCase();
            String content = message.content() == null ? "" : message.content().trim();
            if (content.isEmpty()) {
                continue;
            }

            prompt.append(role.equals("assistant") ? "Assistant" : "User")
                    .append(": ")
                    .append(content)
                    .append('\n');
        }

        prompt.append("Assistant:");
        return prompt.toString();
    }
}
