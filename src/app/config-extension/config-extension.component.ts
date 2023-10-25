import {Component, NgZone, OnInit} from '@angular/core';
import {LoggerService} from '../services/logger.service';
import {TwitchAuthorization, TwitchContext, TwitchWindow} from 'twitch-typings';
import {HttpClient} from '@angular/common/http';
import {GoogleAnalyticsService} from '../services/google-analytics.service';
import {InstagramResponse, InstagramService} from '../services/instagram.service';
import {InstagramConfiguration, InstagramPhoto} from '../instagram-configuration';
import {TwitchService} from '../services/twitch.service';
import {extension} from '../../environments/extension';

@Component({
	selector: 'app-config-extension',
	templateUrl: './config-extension.component.html',
	styleUrls: ['./config-extension.component.css', './bootstrap.css']
})
export class ConfigExtensionComponent implements OnInit {

	message = '';
	show_loading = false;

	title = 'My Instagram';
	isDarkMode = false;
	photos: Array<InstagramPhoto> = [];

	auth: TwitchAuthorization;

	username = '';
	profilePic = '';
	following = -1;
	followedBy = -1;
	numberOfPosts = -1;

	isSetupTabSelected = true;

	constructor(private zone: NgZone, private logger: LoggerService, private http: HttpClient, private ga: GoogleAnalyticsService, private instagram: InstagramService, private twitch: TwitchService) {
		this.initializeCallbacks(window);

		this.ga.trackPageView('Config');
	}

	private initializeCallbacks(window: any) {

		window.Twitch.ext.onAuthorized((auth: TwitchAuthorization) => {
			this.zone.run(() => {
				this.onAuthorized(auth);
			});
		});

		window.Twitch.ext.onContext((context: TwitchContext) => {
			this.zone.run(() => {
				this.onContext(context);
			});
		});

		window.Twitch.ext.configuration.onChanged(() => {
			this.zone.run(() => {
				this.onConfigurationChanged(window);
			});
		});
	}

	ngOnInit() {
	}

	private onContext(context: TwitchContext) {
		this.logger.log('onContext: ' + JSON.stringify(context));

		this.isDarkMode = (context.theme === 'dark');
	}

	private reloadPhotos() {
		const now = +new Date();
		const url = `${extension.cdnPrefix}/${this.auth.channelId}.json?ts=${now}`;
		this.http.get(url).subscribe((response: InstagramResponse) => {
			this.photos = response.photos;
			this.profilePic = response.profilePic;
			this.following = response.following;
			this.followedBy = response.followedBy;
			this.numberOfPosts = response.numberOfPosts;
			this.username = response.username;
		});
	}

	private onAuthorized(auth: TwitchAuthorization) {

		this.auth = auth;
		this.logger.log('Authorized: ' + JSON.stringify(auth));

		this.twitch.getUserName((auth as any).helixToken, this.auth.channelId).subscribe((username: string) => {
			this.logger.log('Extension loaded with user ' + username);
		});

		this.reloadPhotos();
	}

	onUsernameChanged(event: any) {
		this.username = event.target.value.trim();
	}

	async onUpdateClicked() {
		if (this.username === '') {
			this.message = 'Please enter Instagram username and try again.';
			return;
		}

		this.show_loading = true;
		this.message = null;

		const response = await this.instagram.getPhotos((this.auth as any).token, this.username);
		const photos = response.photos;
		this.logger.log('Got response from update: ' + JSON.stringify(response));

		if (photos && photos.length > 0) {
			this.show_loading = false;
			this.message = 'Success! Head over to your channel to see your feed.';
		} else {
			this.show_loading = false;
			this.message = 'Ouch! We failed to find photos for ' + this.username + '. Please make sure your account is set to public. See <a href="https://www.instagram.com/accounts/who_can_see_your_content/" target="_blank">this link</a> for more information.';
		}

		this.reloadPhotos();
	}

	onSubscribeClicked() {
	}

	private onConfigurationChanged(window: TwitchWindow) {
		this.logger.log('onConfigurationChanged:', window.Twitch.ext.configuration);

		if (window.Twitch.ext.configuration.broadcaster && window.Twitch.ext.configuration.broadcaster.content) {
			const content: InstagramConfiguration = JSON.parse(window.Twitch.ext.configuration.broadcaster.content);
			this.username = content.username;

			if ('title' in content) {
				this.title = content.title;
			}
		}
	}

	onTitleChanged(e: any) {
		this.title = e.currentTarget.value;
	}
}
