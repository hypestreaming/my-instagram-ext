import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {extension} from '../../environments/extension';
import {Observable, Observer} from 'rxjs';

interface GetUsersResponse {
	data: [{
		id: string;
		type: string;
		login: string; // cannot be changed
		display_name: string; // displayable name on screen
		description: string;
		profile_image_url: string;
		created_at: string;
		updated_at: string;
	}];
}

@Injectable()
export class TwitchService {

	constructor(private http: HttpClient) {
	}

	getUserName(token: string, user_id: string): Observable<string> {
		return new Observable<string>((observer: Observer<string>) => {

			const httpOptions = {
				headers: new HttpHeaders({
					'Authorization': 'Extension ' + token,
					'Client-ID': extension.extensionClientId,
				})
			};
			const url = 'https://api.twitch.tv/helix/users?id=' + user_id;
			this.http.get<GetUsersResponse>(url, httpOptions).subscribe((response) => {
				observer.next(response.data[0].login);
			});
		});
	}
}
