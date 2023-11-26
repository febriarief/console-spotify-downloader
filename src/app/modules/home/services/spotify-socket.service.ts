import { Injectable } from "@angular/core";
import { environment } from "src/environmets/environment";

@Injectable()

export class SpotifySocketService extends WebSocket
{
    constructor() {
        super(`ws://${environment.socketUrl}/app/spotify-track-downloader`)
    }
}