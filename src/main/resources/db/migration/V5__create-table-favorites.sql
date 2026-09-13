CREATE TABLE tb_favorite(
    user_id UUID NOT NULL,
    audio_id BIGINT NOT NULL,
    favorited_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT pk_tb_favorite PRIMARY KEY(user_id, audio_id),
    CONSTRAINT fk_favorite_user FOREIGN KEY(user_id) REFERENCES tb_users(id) ON DELETE CASCADE,
    CONSTRAINT fk_favorite_audio FOREIGN KEY(audio_id) REFERENCES tb_audio(id) ON DELETE CASCADE
);