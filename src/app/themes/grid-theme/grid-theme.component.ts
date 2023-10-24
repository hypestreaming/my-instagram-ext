import {Component, Input} from '@angular/core';
import {LoggerService} from '../../services/logger.service';
import {InstagramPhoto, InstagramService} from '../../services/instagram.service';

@Component({
	selector: 'app-grid-theme',
	templateUrl: './grid-theme.component.html',
	styleUrls: ['./grid-theme.component.css']
})
export class GridThemeComponent {

	border_radius = '0';
	border_padding = '1';
	grid_template_columns = '107px 107px 107px';
	// grid_template_columns = '105px 105px 105px';

	@Input() username = '';
	@Input() title = 'My Instagram';
	@Input() isDarkMode = false;
	@Input() isMissingConfiguration = false;
	@Input() photos: Array<InstagramPhoto> = [];
	@Input() profilePic = "";
	@Input() followedBy = -1;
	@Input() following = -1;
	@Input() numberOfPosts = -1;

	constructor(private logger: LoggerService) {
	}

	protected readonly Math = Math;
}
