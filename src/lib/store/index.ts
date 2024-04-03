import { browser } from '$app/environment';
import { writable } from 'svelte/store';

const expiredAt = Date.now() + 1000 * 60 * 60 * 24; // 24 hours

function getTagLocal() {
	if (browser) {
		return localStorage.getItem('tag');
	}
}

function getTechLocal() {
	if (browser) {
		return localStorage.getItem('tech');
	}
}

function getPostLocal() {
	if (browser) {
		return localStorage.getItem('post');
	}
}

function setTagLocal(value: any) {
	if (browser) {
		localStorage.setItem(
			'tag',
			JSON.stringify({
				expiredAt,
				data: value
			})
		);
	}
}

function setTechLocal(value: any) {
	if (browser) {
		localStorage.setItem(
			'tech',
			JSON.stringify({
				expiredAt,
				data: value
			})
		);
	}
}

function setPostLocal(value: any) {
	if (browser) {
		localStorage.setItem(
			'post',
			JSON.stringify({
				expiredAt,
				data: value
			})
		);
	}
}

export { getPostLocal, getTagLocal, getTechLocal, setPostLocal, setTagLocal, setTechLocal };

export const imgStore = writable('');
