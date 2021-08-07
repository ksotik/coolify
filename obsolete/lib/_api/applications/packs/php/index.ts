import { docker, streamEvents } from '$lib/_api/dockerr';
import { promises as fs } from 'fs';
//   'HEALTHCHECK --timeout=10s --start-period=10s --interval=5s CMD curl -I -s -f http://localhost/ || exit 1',
const publishPHPDocker = (configuration) => {
	return [
		'FROM php:apache',
		'RUN a2enmod rewrite',
		'WORKDIR /usr/src/app',
		`COPY ./${configuration.build.directory} /var/www/html`,
		'EXPOSE 80',
		'CMD ["apache2-foreground"]'
	].join('\n');
};

export default async function (configuration) {
	await fs.writeFile(
		`${configuration.general.workdir}/Dockerfile`,
		publishPHPDocker(configuration)
	);
	const stream = await docker.engine.buildImage(
		{ src: ['.'], context: configuration.general.workdir },
		{ t: `${configuration.build.container.name}:${configuration.build.container.tag}` }
	);
	await streamEvents(stream, configuration);
}
