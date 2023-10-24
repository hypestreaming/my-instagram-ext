import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';

@Injectable()
export class LoggerService {

	constructor() {
	}

	public log(...data: any[]): void {
		if (!environment.production) {
			console.log(data);
		}
	}

	public dir(obj: any): void {
		if (!environment.production) {
			console.dir(obj);
		}
	}
}
