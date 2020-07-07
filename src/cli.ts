import arg from 'arg';
import inquirer from 'inquirer';

export interface IOptions {
 makeComponent: boolean;
 makeService: boolean;
 makePage: boolean;
 template: string | any;
 element: string | any;
 name: string | any;
}

interface IAnswers {
 template: string;
 element: string;
 name: string;
}

interface IQuestion {
 type: string;
 name: string;
 choices?: string[];
 message: string;
 default: string;
}

const parseArgumentsIntoOptions = (rawArgs: string[]): IOptions => {
 const args = arg(
  {
   '--component':  Boolean,
   '--service':  Boolean,
   '--page':  Boolean,
   '-c': '--component',
   '-s': '--service',
   '-p': '--page',
  },
  {
   argv: rawArgs.slice(2),
  }
 );

 return {
  makeComponent: args['--component'] || false,
  makeService: args['--service'] || false,
  makePage: args['--page'] || false,
  template: args._[0],
  element: args._[1],
  name: args._[2],
 }
}

const promptForMissingOptions = async (options: IOptions): Promise<IOptions> => {
 if (options.template && options.element && options.name) return options;

 const defaultElement: string = 'component';
 const defaultTemplate: string = 'javascript';
 const defaultName: string = 'example';

 const questions: IQuestion[] = [];

 questions.push({
  type: 'list',
  name: 'template',
  message : 'Please select the desired code template',
  choices: ['Javascript', 'Typescript'],
  default: defaultTemplate,
 });

 questions.push({
  type: 'list',
  name: 'element',
  message : 'Please select the desired react element to generate',
  choices: ['Component', 'Service', 'Page'],
  default: defaultElement,
 });

 questions.push({
  type: 'input',
  name: 'name',
  message : 'Please give the element a name',
  default: defaultName,
 });

 const answers: IAnswers = await inquirer.prompt(questions);

 return {
  ...options,
  template: options.template || answers.template.toLowerCase(),
  element: options.element || answers.element.toLowerCase(),
  name: options.name || answers.name,
 }
}

const cli = async (args: string[]) => {
 let options: IOptions = parseArgumentsIntoOptions(args);
 options = await promptForMissingOptions(options);
 return options;
}

export default cli;
