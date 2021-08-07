<script>
	import { browser } from '$app/env';
	import cookies from 'js-cookie'
	if (browser) {
		cookies.set('coolToken',new URL(window.document.URL).searchParams.get('coolToken'), {
			path: '/',
			domain: 'localhost',
			secure: false
		})
		cookies.set('ghToken',new URL(window.document.URL).searchParams.get('ghToken'), {
			path: '/',
			domain: 'localhost',
			secure: false
		})
		setTimeout(() => {
			window.close();
		}, 1000);
	}
</script>

<div class="flex w-full h-screen justify-center items-center">
	<div class="text-3xl font-bold">Succesfully logged in! 🎉</div>
</div>
