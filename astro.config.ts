import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import auth from 'auth-astro';
import starlightImageZoom from 'starlight-image-zoom';
import vercel from '@astrojs/vercel/serverless';


// https://astro.build/config
export default defineConfig({
  integrations: [auth({
    injectEndpoints: false
  }), 
		starlight({
			plugins: [starlightImageZoom()],
			title: 'My Docs',
			logo: {
				light: './src/assets/addvals_rgb.png',
				dark: './src/assets/addvals_rgbonred.png',
				replacesTitle: true,
			  },
				favicon: '/favicon.png',
			customCss: [
				'./src/styles/custom.css', 
				'./src/fonts/font-face.css',
			],
			sidebar: [
				{
					label: 'Welcome', link:'welcome',

				},
				{
					label: 'AppVision',
					collapsed: true,
					items: [
						{label: 'Data', link:'appvision/data'},
					],
				},
				{
					label: 'Installation',
					collapsed: true,
					items: [
						{label: 'Requirements', link:'installation/requirements'},
						{label: 'Server', link:'installation/server'},
						{label: 'SQL', link:'installation/sql'},
						{label: 'Client', link:'installation/client'},
						{label: '32bits mode', link:'installation/32bit'},
						{label: 'Windows Service', link:'installation/windowsservice'},
						{label: 'Update', link:'installation/update'},
					],
				},
				{
					label: 'Configurator',
					collapsed: true,
					items: [
						{label: 'Introduction', link:'configurator/introduction'},
						{label: 'Synoptics', link:'configurator/synoptics'},
						{label: 'Protocols', link:'configurator/protocols'},
						{label: 'Variables', link:'configurator/variables'},
						{label: 'Areas', link:'configurator/areas'},
						{label: 'Groups', link:'configurator/groups'},
						{label: 'User profiles', link:'configurator/userprofiles'},
						{label: 'Users', link:'configurator/users'},

						{label: 'Actions', collapsed: true, items: [
							{label: 'Scripts', link:'configurator/actions/scripts'},
							{label: 'Instructions', link:'configurator/actions/instructions'},
							{label: 'Workflow', link:'configurator/actions/workflow'},
							{label: 'Mailings', link:'configurator/actions/mailings'},
							{label: 'Links', link:'configurator/actions/links'},
							{label: 'Scenarios', link:'configurator/actions/scenarios'},
						]},
						{label: 'Options',collapsed: true, items: [
							{label: 'General', link:'configurator/options/general'},
							{label: 'Authentication', link:'configurator/options/authentication'},
							{label: 'Archive', link:'configurator/options/archive'},
							{label: 'Color', link:'configurator/options/color'},
							{label: 'Sound', link:'configurator/options/sound'},
							{label: 'Synoptic', link:'configurator/options/synoptic'},
							{label: 'Report', link:'configurator/options/report'},
							{label: 'User Message', link:'configurator/options/usermessage'},
							{label: 'Custom fields', link:'configurator/options/customfield'},
							{label: 'Custom User Rights', link:'configurator/options/customuserrights'},
							{label: 'Security', link:'configurator/options/security'},
							{label: 'SMTP', link:'configurator/options/smtp'},
							{label: 'SMS', link:'configurator/options/SMS'},
							{label: 'Video', link:'configurator/options/video'},
							{label: 'Audio', link:'configurator/options/audio'},
							{label: 'All', link:'configurator/options/all'},
							{label: 'AppServer', link:'configurator/options/appserver'},
							{label: 'AppClient', link:'configurator/options/appclient'},
							{label: 'Web Client', link:'configurator/options/webclient'},
							{label: 'AppMobile', link:'configurator/options/appmobile'},
							{label: 'Configuration', link:'configurator/options/configuration'},
						]},
						{label: 'Tools', link:'configurator/tools'},
						{label: 'License', link:'configurator/license'},
						{label: 'Basic Mode', link:'configurator/basicmode'},
						{label: 'Configuration', link:'configurator/configuration'},
					],
				},
				{
					label: 'Options',
					collapsed: true,
					autogenerate: { directory: 'options' },
				},
				{
					label: 'Integrations',
					collapsed: true,

					autogenerate: { directory: 'integrations' },
				},
				{
					label: 'Programming',
					collapsed: true,
					items: [
						{label: 'Introduction', link:'programming/introduction'},
						{label: 'Operands', link:'programming/operands'},
						{label: 'Server-side Scripts', link:'programming/serverscript'},
						{label: 'Client-side Scripts', link:'programming/clientscript'},
						{label: 'Synoptic scripts', link:'programming/synoscript'},
						{label: 'Display', link:'programming/display'},
						{label: 'Customized forms', link:'programming/customforms'},
						{label: 'Dynamic filters', link:'programming/dynamicfilters'},
						{label: 'Annex 1 - PCS Files', link:'programming/annex1'},
					],
				},
				{
					label: 'How To',
					collapsed: true,
					autogenerate: { directory: 'howto' },
				},
				{
					label: 'SDK',
					collapsed: true,
					autogenerate: { directory: 'sdk' },
				},
			],
		}),
],
  output: 'server',

  adapter: vercel()
});
