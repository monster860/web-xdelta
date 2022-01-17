let runtime_init_resolve;
let runtime_initialized_promise = new Promise(resolve => {runtime_init_resolve = resolve;});

var Module = {
	noInitialRun: true,
	printErr: e => {
		postMessage({stderr: e});
		console.log(e);
	},
	onRuntimeInitialized: runtime_init_resolve
};

importScripts(['xdelta3.js']);

/** @type{Blob} */
let output_blob = undefined;
let output_writable = undefined;

let output_initialized = false;
function initialize_output_file() {
	if(output_initialized) return;
	output_initialized = true;
	let num = FS.makedev(64, 0);
	FS.registerDevice(num, {
		open(stream) {
			console.log(...arguments);
		},
		close(stream) {
			console.log(...arguments);
		},
		write(stream, buffer, offset, length, position) {
			//console.log(position);
			//console.log(buffer.slice(offset, offset+length));
			if(output_writable) {
				/*output_writable.write({
					type: 'write',
					data: buffer.slice(offset, offset+length),
					position
				})*/
				let data = buffer.slice(offset, offset+length);
				postMessage({
					write: curr_run_id, data, position
				}, [data.buffer]);
			} else if(output_blob) {
				output_blob = new Blob([
					output_blob.slice(0, position),
					buffer.slice(offset, offset+length),
					output_blob.slice(Math.min(output_blob.size, position+length))
				]);
			}
			return length;
		},
	});
	FS.mkdev("/out", 0o0777, num)
}

let curr_run_id = 0;

onmessage = async (msg) => {
	let data = msg.data;
	await runtime_initialized_promise;
	if(data.args) {
		try {
			if(data.fh) {
				output_writable = true;
			} else {
				output_blob = new Blob([]);
				output_writable = undefined;
			}
			const inputdir = "/in";
			if(data.files) {
				let files = data.files.map((b, index) => new File([b], "file" + index));
				try {FS.unmount(inputdir);} catch(e){}
				try {FS.mkdir(inputdir);} catch(e){}
				FS.mount(WORKERFS, { files }, inputdir);
			}
			initialize_output_file();
			curr_run_id = data.run_id;
			let result = -1;
			result = callMain(data.args);
			postMessage({
				done: data.run_id,
				result,
				blob: output_blob
			});
		} catch(e) {
			postMessage({
				done: data.run_id,
				failed: true,
				error: e
			});
			console.error(e);
		}
	}
}