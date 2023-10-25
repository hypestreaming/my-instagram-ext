import {Injectable} from '@angular/core';
import {LoggerService} from './logger.service';
import {HttpClient} from '@angular/common/http';
import {extension} from '../../environments/extension';

export interface InstagramPhoto {
	img: string;
	url: string;
	likes: number;
}

export interface InstagramResponse {
	username: string;
	following: number;
	followedBy: number;
	profilePic: string;
	numberOfPosts: number;
	photos: Array<InstagramPhoto>;
}

@Injectable()
export class InstagramService {

	constructor(private logger: LoggerService, private httpClient: HttpClient) {
	}

	public async getPhotos(token: string, username: string): Promise<InstagramResponse> {

		const url = extension.serverEndpoint + '/api/myinstagram.get_photos';
		this.logger.log('Fetching photos for user ' + username + ' through url ' + url);

		const httpOptions = {
			withCredentials: false,
			headers: {
				'Authorization': 'Bearer ' + token,
			},
		};

		const body = JSON.stringify({
			username,
		});

		const response = await this.httpClient.post<any>(url, body, httpOptions).toPromise();
		this.logger.log('Received body: ' + JSON.stringify(response));

		const json = await this.httpClient.get<InstagramResponse>(response.url).toPromise();
		return json;
	}
}
