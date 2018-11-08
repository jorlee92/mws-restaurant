let toggleFavStatus = (ID) => {

      fetch('http://localhost:1337/restaurants/' + ID)
      .then(result => { return result.json()})
      .then(result => {
        console.log(result.is_favorite)
        result.is_favorite = JSON.parse(result.is_favorite)
        console.log(typeof result.is_favorite)
        console.log(result.is_favorite)
        if(result.is_favorite == false){
            console.log('isnt a favorite')
                if(!navigator.onLine){
                    console.log("Offline, adding to key/val store");
                    idbKeyval.set('fav-' + ID, is_favorite)
                }
                else { 
                    fetch('http://localhost:1337/restaurants/'+ ID + '/?is_favorite=true', {
                    method: 'PUT'
                    }).then(result => {
                        console.log(result);
                        location.reload();

                    })
                }
        }
        else {
            console.log('is a favorite')
            if(!navigator.onLine){
                console.log("Offline, adding to key/val store");
                idbKeyval.set('fav-' + ID, is_favorite)
            }
            else 
            {
                fetch('http://localhost:1337/restaurants/'+ ID + '/?is_favorite=false', {method: 'PUT'})
                .then(
                    result => {
                        console.log(result)
                        location.reload();
                    })
            }
                }
            })
    }
