import { execShellAsync } from '$lib/_api/commonn';
import { docker } from '$lib/_api/dockerr';
import type { Request } from '@sveltejs/kit';

export async function get(request: Request) {
	const { serviceName } = request.params;

	try {
		const service = (await docker.engine.listServices()).find(
			(r) =>
				r.Spec.Labels.managedBy === 'coolify' &&
				r.Spec.Labels.type === 'service' &&
				r.Spec.Labels.serviceName === serviceName &&
				r.Spec.Name === `${serviceName}_${serviceName}`
		);
		if (service) {
			const payload = {
				config: JSON.parse(service.Spec.Labels.configuration)
			};
			return {
				status: 200,
				body: {
					success: true,
					...payload
				}
			};
		} else {
			return {
				status: 200,
				body: {
					success: false,
					showToast: false,
					message: 'Not found'
				}
			};
		}
	} catch (error) {
		return {
			status: 500,
			body: {
				success: false,
				error: error.message || error
			}
		};
	}
}

export async function del(request: Request) {
	const { serviceName } = request.params;
	await execShellAsync(`docker stack rm ${serviceName}`);
	return { status: 200, body: {} };
}
