package com.example.audio_wave.backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.reactive.function.client.WebClient;

@Configuration
public class WebClientConfig {

    @Bean
    public WebClient jamendoWebClient(){
        return WebClient.builder()
                .baseUrl("https://api.jamendo.com/v3.0")
                .build();
    }
}
