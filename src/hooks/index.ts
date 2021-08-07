import dotEnvExtended from 'dotenv-extended';
dotEnvExtended.load();
import { publicPages } from '$lib/consts';
import mongoose from 'mongoose';
// // import { verifyUserId } from '$lib/_api/commonn';
// // import { initializeSession } from 'svelte-kit-cookie-session';
// // import { cleanupStuckedDeploymentsInDB } from '$lib/_api/applications/cleanupp';
// // import { docker } from '$lib/_api/dockerr';
// import Configuration from '$models/Configuration';
import cookie from 'cookie'
// process.on('SIGINT', function () {
// 	mongoose.connection.close(function () {
// 		console.log('Mongoose default connection disconnected through app termination');
// 		process.exit(0);
// 	});
// });

// async function connectMongoDB() {
// 	// TODO: Save configurations on start?
// 	const { MONGODB_USER, MONGODB_PASSWORD, MONGODB_HOST, MONGODB_PORT, MONGODB_DB } = process.env;
// 	try {
// 		if (process.env.NODE_ENV === 'production') {
// 			await mongoose.connect(
// 				`mongodb://${MONGODB_USER}:${MONGODB_PASSWORD}@${MONGODB_HOST}:${MONGODB_PORT}/${MONGODB_DB}?authSource=${MONGODB_DB}&readPreference=primary&ssl=false`,
// 				{ useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false }
// 			);
// 		} else {
// 			await mongoose.connect(
// 				'mongodb://supercooldbuser:developmentPassword4db@localhost:27017/coolify?&readPreference=primary&ssl=false',
// 				{ useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false }
// 			);
// 		}
// 		console.log('Connected to mongodb.');
// 	} catch (error) {
// 		console.log(error);
// 	}
// }

// (async () => {
// 	// if (mongoose.connection.readyState !== 1) await connectMongoDB();
// 	// try {
// 	// 	await mongoose.connection.db.dropCollection('logs-servers');
// 	// } catch (error) {
// 	// 	//
// 	// }
// 	// try {
// 	// 	await cleanupStuckedDeploymentsInDB();
// 	// } catch (error) {
// 	// 	console.log(error);
// 	// }
// 	try {
// 		const dockerServices = await docker.engine.listServices();
// 		let applications: any = dockerServices.filter(
// 			(r) =>
// 				r.Spec.Labels.managedBy === 'coolify' &&
// 				r.Spec.Labels.type === 'application' &&
// 				r.Spec.Labels.configuration
// 		);
// 		applications = applications.map((r) => {
// 			if (JSON.parse(r.Spec.Labels.configuration)) {
// 				return {
// 					configuration: JSON.parse(r.Spec.Labels.configuration),
// 					UpdatedAt: r.UpdatedAt
// 				};
// 			}
// 			return {};
// 		});
// 		applications = [
// 			...new Map(
// 				applications.map((item) => [
// 					item.configuration.publish.domain + item.configuration.publish.path,
// 					item
// 				])
// 			).values()
// 		];
// 		for (const application of applications) {
// 			/// TODO send API request instead of this
// 			// await Configuration.findOneAndUpdate(
// 			// 	{
// 			// 		'repository.name': application.configuration.repository.name,
// 			// 		'repository.organization': application.configuration.repository.organization,
// 			// 		'repository.branch': application.configuration.repository.branch,
// 			// 		'publish.domain': application.configuration.publish.domain
// 			// 	},
// 			// 	{
// 			// 		...application.configuration
// 			// 	},
// 			// 	{ upsert: true, new: true }
// 			// );
// 		}
// 		let databases: any = dockerServices.filter(
// 			(r) =>
// 				r.Spec.Labels.managedBy === 'coolify' &&
// 				r.Spec.Labels.type === 'database' &&
// 				r.Spec.Labels.configuration
// 		);

// 		databases = databases.map((r) => {
// 			if (JSON.parse(r.Spec.Labels.configuration)) {
// 				// console.log(r)
// 				return {
// 					configuration: JSON.parse(r.Spec.Labels.configuration),
// 					image: r.Spec.Labels['com.docker.stack.image'],
// 					type: r.Spec.Labels['com.docker.stack.image'],
// 					UpdatedAt: r.UpdatedAt
// 				};
// 			}
// 			return {};
// 		});
// 		// console.log(JSON.stringify(databases))
// 		for (const database of databases) {
// 			// {
// 			// 	'general.deployId': database.configuration.general.deployId
// 			// },
// 			// {
// 			// 	general: ...database.configuration.general,
// 			// 	'database.defaultDatabaseName': database.configuration.database.defaultDatabaseName,


// 			// }
// 			// await Configuration.findOneAndUpdate(
// 			// 	{
// 			// 		'repository.name': application.configuration.repository.name,
// 			// 		'repository.organization': application.configuration.repository.organization,
// 			// 		'repository.branch': application.configuration.repository.branch,
// 			// 		'publish.domain': application.configuration.publish.domain
// 			// 	},
// 			// 	{
// 			// 		...application.configuration
// 			// 	},
// 			// 	{ upsert: true, new: true }
// 			// );
// 		}
// 	} catch (error) {
// 		console.log(error);
// 	}
// })();

export async function handle({ request, resolve }) {
	let cookies = {
		coolToken: null,
		ghToken: null
	}
	if (request.headers.cookie) {
		cookies = cookie.parse(request.headers.cookie)
	}

	const session = {
		data: {
			coolToken: cookies.coolToken,
			ghToken: cookies.ghToken
		}
	};
	request.locals.session = session;
	if (session?.data?.coolToken) {
		try {
			// TODO: API call here
			// await verifyUserId(session.data.coolToken);
			request.locals.session = session;
		} catch (error) {
			request.locals.session = null;
		}
	}
	const response = await resolve(request);
	// if (!session['set-cookie']) {
	// 	if (!session?.data?.coolToken && !publicPages.includes(request.path)) {
	// 		return {
	// 			status: 302,
	// 			headers: {
	// 				location: '/'
	// 			}
	// 		};
	// 	}
	// 	return response;
	// }
	return {
		...response,
		headers: {
			...response.headers,
			...session
		}
	};
}
export function getSession(request) {
	const { data } = request.locals.session;
	return {
		isLoggedIn: data?.coolToken ? true : false,
		expires: data.expires,
		coolToken: data.coolToken,
		ghToken: data.ghToken || null
	};
}
