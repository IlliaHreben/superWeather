const fetch = require('node-fetch')

fetch('https://api.ambeedata.com/latest/by-lat-lng?lat=30.5238&lng=50.45466', {
        method: 'GET',
        headers: {
            'Content-type': 'application/json',
            'Accept': 'application/json',
            'X-api-key': 'uDo874l2eS2cZu0cGWGBR9udKtfi9S1f4aPFL45p'
        }
    })

    .then(reply => {
          console.log('success');
          console.log(reply);
      }).catch(err => {
          console.log('error');
          console.log(err);
      });
