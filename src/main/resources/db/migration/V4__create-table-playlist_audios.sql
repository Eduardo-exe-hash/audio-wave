CREATE TABLE tb_playlist_audios(
    playlist_id BIGINT NOT NULL,
    audio_id BIGINT NOT NULL,
    PRIMARY KEY(playlist_id, audio_id),
    CONSTRAINT fk_playlist_audios_playlist FOREIGN KEY(playlist_id) REFERENCES tb_playlists(id) ON DELETE CASCADE,
    CONSTRAINT fk_playlist_audios_audio FOREIGN KEY(audio_id) REFERENCES tb_audio(id) ON DELETE CASCADE

);