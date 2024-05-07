const key = "3JcURg.fOPmbg:efBqHXpjjaogZHqRcPvOOsPuiyJJt7y0UCTcQwI_GAA";
const realtime = new Ably.Realtime(key);
var serverChannel = realtime.channels.get("server-ch");
var clientChannel = realtime.channels.get("client-ch");

export { serverChannel, clientChannel };
