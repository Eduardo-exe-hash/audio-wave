package com.example.audio_wave;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication
@EnableJpaAuditing
public class AudioWaveApplication {

	public static void main(String[] args) {
		SpringApplication.run(AudioWaveApplication.class, args);
	}

}
