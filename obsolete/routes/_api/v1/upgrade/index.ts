import { saveServerLog } from '$lib/_api/applications/loggingg';
import { execShellAsync } from '$lib/_api/commonn';
import type { Request } from '@sveltejs/kit';

export async function get(request: Request) {
	const upgradeP1 = await execShellAsync(
		'bash -c "$(curl -fsSL https://get.coollabs.io/coolify/upgrade-p1.sh)"'
	);
	await saveServerLog({ message: upgradeP1, type: 'UPGRADE-P-1' });
	execShellAsync(
		'docker run --rm -v /var/run/docker.sock:/var/run/docker.sock -u root coolify bash -c "$(curl -fsSL https://get.coollabs.io/coolify/upgrade-p2.sh)"'
	);
	return {
		status: 200,
		body: {
			message: "I'm trying, okay?"
		}
	};
}
