import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Title } from '@angular/platform-browser';
import { SpotifyService, SpotifySocketService } from '../services';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'home',
    templateUrl: './home.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class HomeComponent implements OnInit
{
    public showResult: boolean;
    public showRequestDownloadButton: boolean;
    public showProcessDownloadButton: boolean;
    public showDownloadButton: boolean;
    public downloadInQueue: boolean;
    public downloadInProgress: boolean;
    public downloadMessage: string | null;
    public queueNumber: number;
    public form: any;
    public loading: any;
    public resultTrack: any;
    public downloadUrl: string | null;

    private _socketId: string|null;

    constructor(
        @Inject(DOCUMENT) private _document: Document,
        private _changeDetectorRef: ChangeDetectorRef,
        private _spotifyService: SpotifyService,
        private _spotifySocketService: SpotifySocketService,
        private _title: Title,
        private _toastrService: ToastrService,
    ) {
        this._title.setTitle('Spotify Track Downloader')
        this._document.getElementById('appFavicon')?.setAttribute('href', 'assets/images/favicon.png');

        this.showResult = false;
        this.showRequestDownloadButton = false;
        this.showProcessDownloadButton = false;
        this.showDownloadButton = false;
        this.downloadInQueue = false;
        this.downloadInProgress = false;
        
        this.queueNumber = 0;
        this.downloadMessage = null;
        
        this.loading = {
            search_track: false,
            request_download: false,
            process_download: false,
            download_track: false
        };
        
        this.downloadUrl = null;
        this._socketId = null;
    }

    /**
     * A callback method that is invoked immediately after the
     * default change detector has checked the directive's
     * data-bound properties for the first time,
     * and before any of the view or content children have been checked.
     * It is invoked only once when the directive is instantiated.
     * 
     * @returns void
     */
    ngOnInit(): void {
        this.clearForm();
        this.getQueue();
        this._socketOnNewMessage();        
    }

    /**
     * Handles new messages received through the Spotify Socket Service.
     * 
     * @returns void
     */
    private _socketOnNewMessage(): void {
        this._spotifySocketService.onmessage = (evt: MessageEvent) => {
            const rawEvtData = evt.data;
            if (!rawEvtData) return;

            const evtdata = typeof rawEvtData === 'string' ? JSON.parse(rawEvtData) : null;
            const event   = evtdata?.event || null; 
            const rawData = evtdata?.data || null;
            const data    = typeof rawData === 'string' ? JSON.parse(rawData) : null;
            
            if (event === 'pusher:connection_established') {
                this._socketId = data.socket_id;
                this._subscribeChannel();
            }

            if (event === 'download-sleep') {
                this._toastrService.success('Our server preparing your track for download.');
                
                this.downloadInProgress = true;
                this.downloadInQueue = false;
                this.downloadMessage = "Please wait 10 seconds before our server download your track.";
                this._changeDetectorRef.detectChanges();
            }
            
            if (event === 'begin-download') {
                this._toastrService.success('Your track starts downloading.');
                
                this.downloadInProgress = true;
                this.downloadInQueue = false;
                this.downloadMessage = "Downloading your track";
                this._changeDetectorRef.detectChanges();
            }

            if (event === 'download-error') {
                const message = data?.data?.message || 'Failed to download your track';
                this._toastrService.error(message);
                
                this.showResult = false;
                this._changeDetectorRef.detectChanges();
                
                this.clearResultTrack();
            }
            
            if (event === 'download-success') {
                this._toastrService.success('Your file is ready to download!');

                this.showRequestDownloadButton = false;
                this.showProcessDownloadButton = false;
                this.downloadInQueue = false;
                this.downloadInProgress = false;

                this.downloadUrl = data?.data?.path || null;
                this.showDownloadButton = true;
                this._changeDetectorRef.detectChanges();
            }

            if (event === 'spotify-downloader-queue') {
                this.queueNumber = data?.data?.queue || 0;
                this._changeDetectorRef.detectChanges();
            }
        };
    }

    /**
     * Subscribes to the specified Pusher channels using the Spotify Socket Service.
     * 
     * @returns void
     */
    private _subscribeChannel(): void {
        if (!this._socketId) return;

        const subsDataString = JSON.stringify({
            event: 'pusher:subscribe',
            data: { channel: `channel.spotify-track-downloader.${this._socketId}` }
        });

        const subsDataString2 = JSON.stringify({
            event: 'pusher:subscribe',
            data: { channel: `spotify-downloader` }
        });

        this._spotifySocketService.send(subsDataString);
        this._spotifySocketService.send(subsDataString2);
    }

    /**
     * Clears the form data, resetting the 'url' and 'track_id' properties to null.
     * 
     * @returns void
     */
    clearForm(): void {
        this.form = { url: null, track_id: null };
        this._changeDetectorRef.detectChanges();
    }

    /**
     * Clears the result track data, resetting properties to null.
     * 
     * @returns void
     */
    clearResultTrack(): void {
        this.resultTrack = {
            id: null,
            artist_id: null,
            artist_name: null,
            album_artist: null,
            album_name: null,
            audio_name: null,
            image_url: null,
            release_year: null,
            disc_number: null,
            audio_number: null,
            scraped_song_id: null,
            is_playable: null,
            release_date: null
        };
        this._changeDetectorRef.detectChanges();
    }

    /**
     * Pastes the contents of the clipboard into the 'url' property of the form.
     * 
     * @returns void
     */
    pasteLink(): void {
        navigator.clipboard.readText()
        .then((text: string) => {
            if (text) {
                this.form.url = text;
                this._changeDetectorRef.detectChanges();
            }
        });
    }

    /**
     * Retrieves the queue number from the Spotify service.
     * 
     * @returns void
     */
    getQueue(): void {
        this.queueNumber = 0;
        this._changeDetectorRef.detectChanges();

        this._spotifyService.getQueue()
        .subscribe({
            next: (res: any) => {
                if (res.data) {
                    this.queueNumber = res.data.queue;
                    this._changeDetectorRef.detectChanges();
                }
            },
            error: (err: any) => {
                let errorMessage = 'Cannot load data.'
				if (err.error && err.error.message) errorMessage = err.error.message
				this._toastrService.error(errorMessage, 'Error')
            }
        });
    }

    /**
     * Searches for a track based on the provided track URL using the Spotify service.
     * 
     * @returns void
     */
    searchTrack(): void {
        if (!this.form.url) {
            this._toastrService.error('Field track url cannot be empty');
            return;
        }
        
        this.showResult = false;
        
        this.showRequestDownloadButton = false;
        this.showProcessDownloadButton = false;
        this.showDownloadButton = false;
        this.downloadInQueue = false;
        this.downloadInProgress = false;

        this.loading.search_track = true;
        this._changeDetectorRef.detectChanges()

        this.clearResultTrack();

        this._spotifyService.getInfo(this.form.url)
        .subscribe({
            next: (res: any) => {
                this.downloadInQueue = false;
                this.downloadInProgress = false;
                
                this.showResult = true;
                this.showRequestDownloadButton = true;

                this.loading.search_track = false;
                
                if (res.data) {
                    this.resultTrack = res.data;
                    this.form.track_id = this.resultTrack.id;
                }

                this._changeDetectorRef.detectChanges();
            },
            error: (err: any) => {
                this.loading.search_track = false;
                this._changeDetectorRef.detectChanges()

                let errorMessage = 'Cannot load data.'
				if (err.error && err.error.message) errorMessage = err.error.message
				this._toastrService.error(errorMessage, 'Error')
            }
        });
    }

    /**
     * Sends a request to download the track using the Spotify service.
     * 
     * @returns void
     */
    requestDownload(): void {
        this.showProcessDownloadButton = false;
        this.showDownloadButton = false;
        this.downloadInQueue = false;
        this.downloadInProgress = false;

        this.showProcessDownloadButton = false;
        this.showDownloadButton = false;

        this.downloadUrl = null;

        this.loading.request_download = true;
        this._changeDetectorRef.detectChanges();

        this._spotifyService.requestDownload(this.form.track_id, this._socketId)
        .subscribe({
            next: (res: any) => {
                this.loading.request_download  = false;
                this.showRequestDownloadButton = false;

                if (res.data) {
                    const status = res.data?.status || null;
                    if (status === 'ready') {
                        this.showProcessDownloadButton = true;
                    } else if (status === 'queue') {
                        this.downloadInQueue = true;
                        this.queueNumber = res.data.queue;
                    } else if (status === 'exist') {
                        this.showDownloadButton = true;
                        this.downloadUrl = res.data.url;
                    }
                }

                this._changeDetectorRef.detectChanges();
            },
            error: (err: any) => {
                this.loading.request_download = false;
                this._changeDetectorRef.detectChanges();

                let errorMessage = 'Request download failed.'
				if (err.error && err.error.message) errorMessage = err.error.message
				this._toastrService.error(errorMessage, 'Error')
            }
        });
    }

    /**
     * Initiates the process of downloading the track using the Spotify service.
     * 
     * @returns void
     */
    processDownload(): void {
        this.showRequestDownloadButton = false;
        this.showDownloadButton = false;
        this.downloadInQueue = false;
        this.downloadInProgress = false;
        this.loading.process_download = true;
        this._changeDetectorRef.detectChanges();

        this._spotifyService.processDownload(this.form.track_id, this._socketId)
        .subscribe({
            next: () => {
                this.downloadInProgress = true;
                this.showProcessDownloadButton = false;
                this.loading.process_download = false;
                this._changeDetectorRef.detectChanges();
            },
            error: (err: any) => {
                this.loading.process_download = false;
                this._changeDetectorRef.detectChanges();

                let errorMessage = 'Process download failed.'
				if (err.error && err.error.message) errorMessage = err.error.message
				this._toastrService.error(errorMessage, 'Error')
            }
        });
    }

    /**
     * Initiates the download of the track file by opening a new browser tab with the download URL.
     * 
     * @returns void
     */
    downloadFile(): void {
        if (!this.downloadUrl) {
            this._toastrService.error('Cannot get download URL.');
            return;
        }

        this.downloadUrl = this.modifyUrl(this.downloadUrl);
        const newTab = window.open(this.downloadUrl, '_blank');
        newTab?.focus();
    }

    /**
     * Modifies the original URL by adding a query parameter ('fl_attachment') to a specific part of the URL.
     * 
     * @param originalUrl string - The original URL to be modified.
     * @returns string
     */
    modifyUrl(originalUrl: string): string {
        const attachmentKeyword = 'fl_attachment';
        const parts = originalUrl.split('/upload/');
        
        if (parts.length === 2) {
            const modifiedUrl = `${parts[0]}/upload/${attachmentKeyword}/${parts[1]}`;
            return modifiedUrl;
        } else {
            return originalUrl;
        }
    }
}
