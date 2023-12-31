const amqp = require('amqplib');
const PlaylistService = require('./PlaylistService');
const MailSender = require('./MailSender');
const Listener = require('./listener');
require('dotenv').config();

const init = async () => {
  const playlistService = new PlaylistService();
  const mailSender = new MailSender();
  const listener = new Listener(playlistService, mailSender);

  const connection = await amqp.connect(process.env.RABBITMQ_SERVER);
  const channel = await connection.createChannel();

  await channel.assertQueue('export:playlistSongs', {
    durable: true,
  });

  channel.consume('export:playlistSongs', listener.listen, { noAck: true });
};

init();
