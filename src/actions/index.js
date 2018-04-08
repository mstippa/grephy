import fs from 'fs';

export function fileUpload(file) {
	return {
		type: 'FILE_UPLOAD',
		payload: file
	}

}