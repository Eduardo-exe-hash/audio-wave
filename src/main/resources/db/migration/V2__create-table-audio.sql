CREATE TABLE tb_audio(
    id BIGSERIAL PRIMARY KEY,
    jamendo_id VARCHAR(255) NOT NULL UNIQUE,
    music_title VARCHAR(255) NOT NULL,
    artist_name VARCHAR(255),
    album_name VARCHAR(255),
    duration_seconds INT,
    audio_url VARCHAR(1000),
    cover_image VARCHAR(1000),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);