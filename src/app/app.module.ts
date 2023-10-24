import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {PanelExtensionComponent} from './panel-extension/panel-extension.component';
import {ConfigExtensionComponent} from './config-extension/config-extension.component';
import {HttpClientModule} from '@angular/common/http';
import {RouterModule, Routes} from '@angular/router';
import {LoggerService} from './services/logger.service';
import {GoogleAnalyticsService} from './services/google-analytics.service';
import {InstagramService} from './services/instagram.service';
import {GridThemeComponent} from './themes/grid-theme/grid-theme.component';
import {TwitchService} from './services/twitch.service';

const appRoutes: Routes = [
	{path: 'index.html', component: AppComponent},
];

@NgModule({
	declarations: [
		AppComponent,
		PanelExtensionComponent,
		ConfigExtensionComponent,
		GridThemeComponent,
	],
	imports: [
		BrowserModule,
		HttpClientModule,
		RouterModule.forRoot(appRoutes),
	],
	providers: [
		GoogleAnalyticsService,
		LoggerService,
		InstagramService,
		TwitchService,
	],
	bootstrap: [AppComponent]
})
export class AppModule {
}
