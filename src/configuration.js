export let name = 'cmd-line';
export let template = (name, cmd, args, options, description) => {
	return `    ${name.yellow} ${cmd.yellow} ${args} ${options.length > 0 ? '[options]'.cyan : /* istanbul ignore next */''}
      ${description}
${options.join('\n')}`;
};
export let argSerializer = (args) => {
	let res = [];
	for (const arg of args) {
		if (arg.indexOf('?') > -1) {
			res.push('?'.gray + arg.replace('?', '').italic.green);
		} else {
			res.push(arg.green);
		}
	}
	return res.join(' ');
};
export let optionSerializer = (option, longest, varlen) => {
	let {shortag, tag, variable, description} = option;
	let data = `${shortag}  ${tag}`;
	let fill = '',
		varfill = '';
	while ((data.length + fill.length) < longest) {
		fill += ' ';
	}
	if (variable.length > 0) {
		while (varlen > (variable.length + varfill.length)) {
			/* istanbul ignore next */
			varfill += ' ';
		}
		variable = ` ${variable.cyan}`;
	}
	return `        ${shortag.cyan}  ${tag.gray}${fill}${variable}${varfill} ${description}`;
};
