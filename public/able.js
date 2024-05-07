const key = "3JcURg.fOPmbg:efBqHXpjjaogZHqRcPvOOsPuiyJJt7y0UCTcQwI_GAA";
const realtime = new Ably.Realtime(key);
const serverChannel = realtime.channels.get("server-ch");
const clientChannel = realtime.channels.get("client-ch");

export { serverChannel, clientChannel };
