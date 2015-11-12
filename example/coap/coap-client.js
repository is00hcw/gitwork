const coap  = require('coap') 
    , req   = coap.request('coap://localhost/abcd')

req.on('response', function(res) {
  res.pipe(process.stdout)
})

req.end()
