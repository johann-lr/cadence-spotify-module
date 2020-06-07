import axios, { AxiosResponse, AxiosError } from "axios";
import { stringify } from "querystring";
import { spotify } from "./access.json";
import { SpotifyResponse } from "./@types/music";

// TODO Wrap this in a new class and create an instance in each player to improve authentication

/**
 * @description Authenticate against Spotify Web API and request access token
 */
export function authSpotify(callback: (result: string | null, error?: Error) => void): any {
    // base64 encoded client credentials
    const credentials: string = Buffer.from(`${spotify.id}:${spotify.secret}`).toString("base64"),
        data = stringify({ grant_type: "client_credentials" });
    axios
        .post("https://accounts.spotify.com/api/token", data, {
            headers: {
                Authorization: `Basic ${credentials}`,
                "Content-Type": "application/x-www-form-urlencoded"
            }
        })
        .then((response: AxiosResponse) => callback(response.data.access_token))
        .catch((error: AxiosError) => callback(null, error));
}

/**
 *
 * @param {string} token Access token by authSpotify()
 * @param {string} type tracks, playlists, albums (always plural!)
 * @param {string} id Spotify track/playlist/album ID
 */
export default function getSpotifyData(
    token: string,
    type: string,
    id: string
): Promise<SpotifyResponse> {
    return new Promise((resolve, reject) => {
        axios
            .get(`https://api.spotify.com/v1/${type}/${id}?market=de`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            .then((response: AxiosResponse) => {
                return resolve(
                    type === "tracks"
                        ? [
                            {
                                title: response.data.name,
                                img: response.data.album.images[1].url,
                                artists: response.data.artists.map((artist: any) => artist.name)
                            }
                        ]
                        : type === "playlists"
                        ? response.data.tracks.items.map((item: any) => ({
                            title: item.track.name,
                            img: item.track.album.images[1].url,
                            artists: item.track.artists.map((artist: any) => artist.name)
                        }))
                        : response.data.tracks.items.map((item: any) => ({
                            title: item.name,
                            img: response.data.images[1].url,
                            artists: item.artists.map((artist: any) => artist.name)
                        }))
                );
            })
            .catch((error: AxiosError) => {
                return reject(error);
            });
    });
}
