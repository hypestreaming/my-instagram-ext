export interface InstagramPhoto {
	img: string;
	url: string;
	likes: number;
}

export interface InstagramConfiguration {
	username: string;
	title: string;
	theme: number;
	lastUpdated: number;
	photos: Array<InstagramPhoto>;
}
