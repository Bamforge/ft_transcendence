interface AppState {
	view: string;
}

interface ErrorResponse {
	error: string;
}

const appElement = document.getElementById('app');
if (!(appElement instanceof HTMLDivElement)) {
	throw new Error("Element with id 'app' is not a div or does not exist.");
}
const appDiv: HTMLDivElement = appElement;

async function loadView(view: string): Promise<void> {
	try {
		const response = await fetch(`/api/view/${view}`);
		if (response.ok) {
			const html = await response.text();
			appDiv.innerHTML = html;
			const scriptTags = appDiv.querySelectorAll('script');
			scriptTags.forEach((oldScript) => {
				const newScript = document.createElement('script');
				if (oldScript.src) {
					newScript.src = oldScript.src;
				} else {
					newScript.textContent = oldScript.textContent;
				}
				Array.from(oldScript.attributes).forEach((attr) => {
					newScript.setAttribute(attr.name, attr.value);
				});
				oldScript.replaceWith(newScript);
			});
			// attachEventListeners();
			history.pushState({ view } as AppState, '', `/${view}`);
		} else {
			appDiv.innerHTML = '<p class="text-red-500 text-center">Error loading view</p>';
		}
	} catch (error) {
		console.error('Error:', error);
	}
}

// function attachEventListeners(): void {
// 	const toSignin: HTMLElement | null = document.getElementById('to-signin');
// 	const toSignup: HTMLElement | null = document.getElementById('to-signup');
// 	const signupForm: HTMLFormElement | null = document.getElementById(
// 		'signup-form'
// 	) as HTMLFormElement | null;
// 	const signinForm: HTMLFormElement | null = document.getElementById(
// 		'signin-form'
// 	) as HTMLFormElement | null;
// 	const logoutButton: HTMLElement | null = document.getElementById('logout');

// 	if (toSignin)
// 		toSignin.addEventListener('click', (e: MouseEvent) => {
// 			e.preventDefault();
// 			loadView('signin');
// 		});
// 	if (toSignup)
// 		toSignup.addEventListener('click', (e: MouseEvent) => {
// 			e.preventDefault();
// 			loadView('signup');
// 		});
// 	if (signupForm) signupForm.addEventListener('submit', handleSignup);
// 	if (signinForm) signinForm.addEventListener('submit', handleSignin);
// 	if (logoutButton) logoutButton.addEventListener('click', handleLogout);
// }

// async function handleSignup(event: Event): Promise<void> {
// 	event.preventDefault();
// 	const formData = new FormData(event.target as HTMLFormElement);
// 	const response = await fetch('/api/signup', {
// 		method: 'POST',
// 		headers: { 'Content-Type': 'application/json' },
// 		body: JSON.stringify({
// 			username: formData.get('username'),
// 			password: formData.get('password'),
// 		}),
// 	});
// 	const data: ErrorResponse = await response.json();
// 	if (response.ok) {
// 		appDiv.innerHTML =
// 			'<p class="text-green-500 text-center mb-4">Account created!</p><button id="to-signin" class="w-full bg-blue-500 text-white py-2 rounded-lg">Sign In</button>';
// 		attachEventListeners();
// 	} else {
// 		appDiv.insertAdjacentHTML(
// 			'afterbegin',
// 			`<p class="text-red-500 text-center mb-4">${data.error}</p>`
// 		);
// 	}
// }

// async function handleSignin(event: Event): Promise<void> {
// 	event.preventDefault();
// 	const formData = new FormData(event.target as HTMLFormElement);
// 	const response = await fetch('/api/signin', {
// 		method: 'POST',
// 		headers: { 'Content-Type': 'application/json' },
// 		body: JSON.stringify({
// 			username: formData.get('username'),
// 			password: formData.get('password'),
// 		}),
// 	});
// 	if (response.ok) {
// 		loadView('profile');
// 	} else {
// 		const data: ErrorResponse = await response.json();
// 		appDiv.insertAdjacentHTML(
// 			'afterbegin',
// 			`<p class="text-red-500 text-center mb-4">${data.error}</p>`
// 		);
// 	}
// }

// async function handleLogout(): Promise<void> {
// 	await fetch('/api/logout', { method: 'POST' });
// 	loadView('signin');
// }

async function init(): Promise<void> {
	const path = window.location.pathname.slice(1) || 'game';
	console.log('Path: ', path);
	loadView(path);
}

window.addEventListener('popstate', (event: PopStateEvent) => {
	const state = event.state as AppState | null;
	if (state && state.view) loadView(state.view);
});

init();
