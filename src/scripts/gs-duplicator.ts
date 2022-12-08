import { sleep } from "@/utils";

const main = async () => {
	console.log("Hello World!");
	await sleep(1000);
	console.log("Goodbye World!");
};


(async () => {
	try {
		main();
	} catch (error) {
		console.error(error);
	}
})();

export { };
