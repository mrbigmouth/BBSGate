var net = require('net')
  , server = net.createServer()
  ;

server.on('connection'  ,function(conn) {
  var client
    , host      =
        {'host'   : 'ptt.cc'
        ,'port' : '23'
        }
    , status    = 'host'
    , endClient =
        function() {
          //console.log(fromIP + ' already end!');
          if (client && typeof client.end === 'function') {
            client.end();
          }
        }
    , endConn   =
        function() {
          //console.log(fromIP + ' already end!');
          conn.end();
        }
    , input     = ''
    , fromIP    = conn.remoteAddress
    ;
  //console.log(conn.remoteAddress + ' connect!');
  conn.write('Input Connect IP[ptt2.cc]:');
  conn.on('close', endClient);
  conn.on('end', endClient);
  conn.on('error', endClient);
  conn.on('timeout', endClient);
  conn.on('data', function(d) {
    var dJson
      , dStr
      ;
    switch (status) {
      case 'connected' :
        client.write(d);
        break;
      default:
        dJson = d.toJSON();
        dStr = d.toString();
        conn.write(dStr);
        if (dJson.length === 1 && dJson[0] === 13) {
          conn.write('\r\n');
          if (input) {
            host[status] = input;
          }
          if (status === 'host') {
            conn.write('Input Connect Port[23]:');
            status = 'port';
          }
          else if (status === 'port') {
            client = net.connect(host);
            client.on("data", function(d){
              conn.write(d);
            });
            client.on("close", endConn);
            client.on("end", endConn);
            client.on("error", endConn);
            client.on("timeout", endConn);
            status = 'connected';
          }
          input = '';
        }
        else {
          input += dStr;
        }
        break;
    }
  });
});
server.listen(process.argv[2] || 80);
server.on('error', function() {
  console.log(arguments);
})