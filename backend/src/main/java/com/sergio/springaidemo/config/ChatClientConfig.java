package com.sergio.springaidemo.config;

import org.springframework.ai.chat.client.ChatClient;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class ChatClientConfig {

    @Bean
    ChatClient chatClient(ChatClient.Builder builder) {
        return builder
                .defaultSystem("You're an assistant focused on writing short concept stories. These concepts must not be larger than 3 paragraphs.")
                .build();
    }
}
