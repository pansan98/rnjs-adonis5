declare module 'contracts/media' {
	type MediaContract = {
		path: string,
		name: string,
		value: string,
		identify_code: number,
		type: string,
		size: number,
		media_group_id: number|null
	}
	type MediaArrayContract = [
		MediaContract
	]
}