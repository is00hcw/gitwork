class Greeter {
	data: string;
	constructor(data: string) {
		this.data = data;
	}
	run() {
		alert(this.data);	 
	}
}
window.onload = () => {
	var greeter = new Greeter("Clark");
	greeter.run();
};