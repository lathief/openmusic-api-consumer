class Listener {
  constructor(playlistService, mailSender) {
    this.playlistService = playlistService;
    this.mailSender = mailSender;

    this.listen = this.listen.bind(this);
  }

  async listen(message) {
    try {
      console.log(message.content.toString());
      const { playlistId, targetEmail } = JSON.parse(
        message.content.toString(),
      );

      const datas = await this.playlistService.getPlaylist(playlistId);
      let map;

      const dataResponse = {
        id: datas[0].id,
        name: datas[0].name,
        songs: [],
      };

      if (datas[0] === null) {
        map = {
          ...dataResponse,
        };
      } else {
        datas.map((data) => {
          if (data.song_id) {
            dataResponse.songs.push({
              id: data.song_id,
              title: data.title,
              performer: data.performer,
            });
          }
          return data;
        });

        map = {
          ...dataResponse,
        };
      }
      const hasil = {
        playlist: map,
      };
      const res = await this.mailSender.sendEmail(
        targetEmail,
        JSON.stringify(hasil),
      );
      console.log(res);
    } catch (error) {
      console.error(`error: ${error}`);
    }
  }
}

module.exports = Listener;
