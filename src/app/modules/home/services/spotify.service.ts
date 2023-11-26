import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environmets/environment";

@Injectable()

export class SpotifyService
{
    private _apiUrl: string;
    private _endPoint: string;

	constructor(
		private _httpClient: HttpClient
	) {
		this._apiUrl = environment.apiUrl;
		this._endPoint = 'spotify';
	}

    /**
     * Retrieves the current queue information using an HTTP GET request.
     * 
     * @returns An Observable containing the response data.
     */
	getQueue(): Observable<Object> {
        return this._httpClient.get(`${this._apiUrl}/${this._endPoint}/get-queue`);
	}

    /**
     * Initiates a download request for a specified track using an HTTP POST request.
     * 
     * @param track_id string - The ID of the track for which the download is requested.
     * @param socket_id string - The socket ID associated with the request (can be null).
     * @returns An Observable containing the response data.
     */
	requestDownload(track_id: string, socket_id: string|null): Observable<Object> {
        return this._httpClient.post(`${this._apiUrl}/${this._endPoint}/request-download`, { track_id, socket_id });
	}

    /**
     * Initiates the process of downloading a specified track using an HTTP POST request.
     * 
     * @param track_id string - The ID of the track for which the download process is initiated.
     * @param socket_id string - The socket ID associated with the request (can be null).
     * @returns An Observable containing the response data.
     */
	processDownload(track_id: string, socket_id: string|null): Observable<Object> {
        return this._httpClient.post(`${this._apiUrl}/${this._endPoint}/process-download`, { track_id, socket_id });
	}
    
    /**
     * Retrieves information about a video from a given URL using an HTTP POST request.
     * 
     * @param url - The URL of the video for which information is to be retrieved.
     * @returns An Observable emitting the response object containing video information.
     */
	getInfo(url: string): Observable<Object> {
		return this._httpClient.post(`${this._apiUrl}/${this._endPoint}/get-info`, { url });
	}
}
