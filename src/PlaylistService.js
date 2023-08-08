const { Pool } = require('pg');

class PlaylistService {
  constructor() {
    this.pgPool = new Pool();
  }

  async getPlaylist(playlistId) {
    const query = {
      text: `SELECT P.id, P.name, PS.song_id, S.title, S.performer 
      FROM playlist_songs as PS 
      JOIN playlists as P ON P.id = PS.playlist_id 
      JOIN songs as S ON PS.song_id = S.id 
      JOIN users AS U ON P.owner = U.id 
      WHERE PS.playlist_id = $1`,
      values: [playlistId],
    };
    const result = await this.pgPool.query(query);
    return result.rows;
  }
}

module.exports = PlaylistService;
