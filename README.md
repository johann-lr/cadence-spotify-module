# Cadence - Spotify Module

This project contains a basic Spotify API wrapper that is used by the Cadence client (v3, only v2 is currently available on github).

You can use this code snippet for your own project by simply copying code snippets, or you can build the complete module.

## Installation

Run  ``yarn`` first to install the required dependencies (use `yarn install` if you already have a lockfile).
In case you do not use the yarn package manager `npm install` should work as well.

After the dependencies were installed, build the TS code using `yarn build` or `npm build`.

## Usage

You do not need to follow every installation step, if you have a full TS Project set up. 

Example: 
```ts
	getAuth(callback: (res: string) => void) {
        authSpotify((res: string | any) => {
            // the access token is already extracted in authSpotify
			if (res) this.sets.set("spotify_token", res);
			// this may also include "null" in case of unexpected failures
			// reason: the command should validate the res. again and send err to discord user
			callback(res);
        });
	}
    
    getSpotify(async (userInput: string, token: string) => {
        const spotifyURI: string = userInput.match(/(\d|\w){22}/)![0];
            getspotifyData(token, "albums", spotifyURI)
				.then((res) => resolve(res))
				.catch((fail) => reject(fail));
    });
```
