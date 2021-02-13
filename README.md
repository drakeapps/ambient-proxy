# Ambient Weather Socket Proxy

This blindly proxies ambient data to a websocket server

You can then use pws-publisher to write this data to influx/mqtt/another websocket server. 

For reasons I can't figure out, ambient realtime api works about 10% of the time in python. But I get a 100% success rate in node

Rather than rewrite everything in js or spend more time pulling hair over python working, I'm just going to put a dumb proxy in between it

This can also be used as a way to proxy out the ambient api to multiple devices while only maintaining a single connection to ambient. 