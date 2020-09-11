const cmd = require('node-cmd');
const inquirer = require('inquirer');
const ora = require('ora');
const chalk = require('chalk');

 
const loader = () => {
	const spinner = ora({text: '............scanning'}).start();
 	setTimeout(() => {
		let colors = ['white', 'red', 'green', 'yellow', 'blue', 'magenta', 'cyan', 'gray']
		spinner.text = '............scanning';
	    spinner.color = colors[Math.round(Math.random()*colors.length)];
	}, 2000);
}

const qes = () => {
	let q = {
		name: 'base',
		type: 'input',
		message: 'Your IP: '
	}
	return inquirer.prompt(q)
}

const qes2 = () => {
	let q = {
		name: 'base',
		type: 'input',
		message: 'Subnet range to scan: '
	}
	return inquirer.prompt(q)
}

const ask = async () => {
	let ip = await qes();
	let range = await qes2();
	go2(ip.base, range.base)
}

const go1 = (base, res) => {
	for(let i = 0; i < 256; i++){
		cmd.get(('ping -n 1 ' + base + i), (err, data, stderr) => {
			if(!err && !data.includes('Request timed out.') && !data.includes('Destination net unreachable.') && !data.includes('Destination host unreachable.')){
				console.log(data)
				return res(chalk.cyan('Success :: ' + chalk.red(base + i)))
			}
		})
	}
}

const go2 = (ip, range) => {
	let prepIP = ip.split('.')
	if(range == undefined){
		console.log(chalk.cyan('\nScanning subnet ranges 0-10.....\n'))
		loader()
		for(let i = 0; i < 10; i++){
			go1(`${prepIP[0]}.${prepIP[1]}.${i}.` , res => {
				console.log(chalk.cyan(`${res}`))
			});
		}
	}else{
		if(range.includes('-')){
			console.log(chalk.cyan(`\nScanning subnet ranges ${range.split('-')[0]}-${range.split('-')[1]}...\n`))
			loader()
			for(let i = range.split('-')[0]; i < range.split('-')[1]; i++){
				go1(`${prepIP[0]}.${prepIP[1]}.${i}.` , res => {
					console.log(chalk.cyan(`${res}`))
				});
			}
		}else{
			console.log(chalk.cyan(`\nScanning subnet range ${range}...\n`))
			loader()
			go1(`${prepIP[0]}.${prepIP[1]}.${prepIP[2]}.` , res => {
				console.log(chalk.cyan(`${res}`))
			});
		}
	}
}


ask();