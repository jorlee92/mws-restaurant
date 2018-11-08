let toggleFavStatus = (ID) => {

	fetch('http://localhost:1337/restaurants')
		.then(result => { return result.json();})
		.then(result => {
			for (let i = 0; i < result.length; i++){
				if(result[i].id == ID){
					return result[i];
				}
			}
		})
		.then(result => {
			console.log(result.is_favorite);
			result.is_favorite = JSON.parse(result.is_favorite);
			console.log(typeof result.is_favorite);
			console.log(result.is_favorite);
			if(result.is_favorite == false){
				console.log('isnt a favorite');
				if(!navigator.onLine){
					console.log('Offline, adding to key/val store');
					idbKeyval.set('fav-' + ID, !result.is_favorite);
					location.reload();
				}
				else { 
					fetch('http://localhost:1337/restaurants/'+ ID + '/?is_favorite=true', {
						method: 'PUT'
					}).then(result => {
						console.log(result);
						location.reload();

					});
				}
			}
			else {
				console.log('is a favorite');
				if(!navigator.onLine){
					console.log('Offline, adding to key/val store');
					idbKeyval.set('fav-' + ID, !result.is_favorite);
					location.reload();

				}
				else 
				{
					fetch('http://localhost:1337/restaurants/'+ ID + '/?is_favorite=false', {method: 'PUT'})
						.then(
							result => {
								console.log(result);
								location.reload();
							});
				}
			}
		});
};
