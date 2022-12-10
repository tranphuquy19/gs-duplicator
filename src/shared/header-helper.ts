
const HeaderHelper = (options?: { token: string | undefined }): any => {
	return {
		'Content-Type': 'application/json',
		'PRIVATE-TOKEN': options?.token,
	}
};

export { HeaderHelper };
