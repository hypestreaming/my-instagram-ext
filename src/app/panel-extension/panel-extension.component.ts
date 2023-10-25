import {Component, NgZone, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {LoggerService} from '../services/logger.service';
import {TwitchAuthorization, TwitchContext, TwitchWindow} from 'twitch-typings';
import {GoogleAnalyticsService} from '../services/google-analytics.service';
import {InstagramPhoto} from '../services/instagram.service';
import {InstagramConfiguration} from '../instagram-configuration';
import {extension} from '../../environments/extension';

@Component({
	selector: 'app-panel-extension',
	templateUrl: './panel-extension.component.html',
	styleUrls: ['./panel-extension.component.css']
})
export class PanelExtensionComponent implements OnInit {

	photos: Array<InstagramPhoto> = [];

	title = 'My Instagram';

	isDarkMode = false;

	isMissingConfiguration = false;

	username = '';
	profilePic = '';
	following = -1;
	followedBy = -1;
	numberOfPosts = -1;


	constructor(private http: HttpClient, private logger: LoggerService, private zone: NgZone, private ga: GoogleAnalyticsService) {
		this.ga.trackPageView('Panel');
	}

	private initializeCallbacks(window: TwitchWindow) {
		window.Twitch.ext.onContext((context: TwitchContext) => {
			this.zone.run(() => {
				this.onContext(context);
			});
		});

		window.Twitch.ext.onAuthorized((auth: TwitchAuthorization) => {
			this.zone.run(() => {
				this.onAuthorized(auth);
			});
		});

		window.Twitch.ext.configuration.onChanged(() => {
			this.zone.run(() => {
				this.onConfigurationChanged(window);
			});
		});
	}

	private onContext(context: TwitchContext) {
		this.logger.log('onContext: ' + JSON.stringify(context));

		this.isDarkMode = (context.theme === 'dark');
	}

	private onAuthorized(auth: TwitchAuthorization) {
		this.logger.log('onAuthorized', auth);

		const url = `${extension.cdnPrefix}/${auth.channelId}.json`;
		this.http.get(url).subscribe((response: any) => {
			this.photos = response.photos;
			this.profilePic = response.profilePic;
			this.following = response.following;
			this.followedBy = response.followedBy;
			this.numberOfPosts = response.numberOfPosts;
			this.username = response.username;
		});
	}

	private onConfigurationChanged(window: TwitchWindow) {
		this.logger.log('onConfigurationChanged ' + JSON.stringify(window.Twitch.ext.configuration));

		if (window.Twitch.ext.configuration.broadcaster) {
			const text = window.Twitch.ext.configuration.broadcaster.content;

			const object: InstagramConfiguration = JSON.parse(text);
			this.logger.log('onConfigurationChanged with: ' + text);

			if (object.username) {
				this.username = object.username;
			}

			if (object.title) {
				this.title = object.title;
			}
		}

		if (this.username === null) {
			// we couldn't read configuration :(
			this.isMissingConfiguration = true;
		}
	}

	ngOnInit() {
		this.initializeCallbacks(<any>window);

		// on mobile, let's update the zoom
		window.onresize = () => {
			this.logger.log('Window innerWidth ' + window.innerWidth);
			if (window.innerWidth !== 320) {
				const ratio = window.innerWidth / 320.0;
				const body: HTMLBodyElement = document.getElementsByTagName('body')[0] as HTMLBodyElement;
				body.style.zoom = '' + ratio;
				body.style.overflowY = 'auto';
				this.logger.log('Setting zoom ' + ratio);
			}
		};
	}
}
