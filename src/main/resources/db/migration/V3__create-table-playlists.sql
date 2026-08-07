CREATE TABLE tb_playlists(
    id BIGSERIAL PRIMARY KEY,
    name_playlist VARCHAR(255) NOT NULL,
    description VARCHAR(500),
    id_public BOOLEAN NOT NULL DEFAULT TRUE,
    cover_image_url VARCHAR(1000) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    user_id UUID NOT NULL,
    CONSTRAINT fk_playlists_users FOREIGN KEY(user_id) REFERENCES tb_users(id) ON DELETE CASCADE
);