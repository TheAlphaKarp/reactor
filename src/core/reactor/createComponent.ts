import fs from 'fs';
import { logRed, logBlue, logGreen } from '../../Util/chalk';
import path from 'path';

const createComponent = async (template: string, name: string) => {
 createComponentsFolder();
 await generateComponent(template, name);
 await generateIndex(template, name);
};

const generateIndex = async (template: string, name: string) => {
 const extension = (template == 'javascript')? 'jsx': 'tsx';
 const indexFile = `./components/index.${extension}`;
 const cwd: string = process.cwd();

 if (!fs.existsSync(indexFile)) {
  fs.appendFile(indexFile, await getExportTemplate(template, name), 'utf-8', (err) => {
   if (err) logRed(err.message);
   logGreen(`Export file has been created at: ${path.resolve(cwd, indexFile)}`);
  });
 } else {
  await generateIndexImport(indexFile, name);
  await generateIndexExport(indexFile, name);

  logGreen(`Export file has been updated: ${path.resolve(cwd, indexFile)}`);
 }
}

const generateIndexImport = (indexFile: string, name: string): Promise<void> => {
 return new Promise((resolve, reject) => {
  let data = readFile(indexFile);
  const lastColon = data.lastIndexOf(';');
  const importStatement = `;\nimport ${name} from './${name}/${name}';`;

  // Add the import statement after the semicolon
  fs.readFile(indexFile, (err, data) => {
   let file_content = data.toString();
   file_content = file_content.substring(lastColon + 1);
   const file = fs.openSync(indexFile,'r+');
   const bufferedText = new Buffer(importStatement + file_content);
   fs.writeSync(file, bufferedText, 0, bufferedText.length, lastColon);
   fs.close(file, (err) => {
    resolve();
   });
  });
 });
}

const generateIndexExport = (indexFile: string, name: string): Promise<void> => {
 return new Promise((resolve, reject) => {
  let data = readFile(indexFile);
  const lastComma = data.lastIndexOf(',');
  const exportStatement = `,\n${name},`;

  // Add the import statement after the semicolon
  fs.readFile(indexFile, (err, data) => {
   if (err) throw err;
   let file_content = data.toString();
   file_content = file_content.substring(lastComma + 1);
   const file = fs.openSync(indexFile,'r+');
   const bufferedText = new Buffer(exportStatement + file_content);
   fs.writeSync(file, bufferedText, 0, bufferedText.length, lastComma);
   fs.close(file, (err) => {
    resolve();
   });
  });
 });
}

const generateComponent = async (template: string, name: string) => {
 const cwd: string = process.cwd();
 const extension = (template == 'javascript')? 'jsx': 'tsx';
 const component = `./components/${name}/${name}.${extension}`;
 const componentFolder = `./components/${name}/`;

 if (!fs.existsSync(component)) {
  if (!fs.existsSync(componentFolder)) {
   fs.mkdir(componentFolder, (err) => {
    if (err) logRed(err.message);
    logGreen(`${name} folder has been created at: ${path.resolve(cwd, './component')}`);
   });
  }

  fs.appendFile(component, await getComponentTemplate(template, name), 'utf-8', (err) => {
   if (err) logRed(err.message);
   logGreen(`Component has been generated at: ${path.resolve(cwd, component)}`);
  });
 } else {
  logRed('File already exists');
 }
}

const createComponentsFolder = () => {
 const cwd: string = process.cwd();

 if (!fs.existsSync('./components')) {
  fs.mkdir('./components', (err) => {
   if (err) logRed(err.message);
   logGreen(`Components folder has been created at: ${path.resolve(cwd, './component')}`);
  });
 }
}

const getComponentTemplate = async (template: string, name: string): Promise<string> => {
 const componentPath = path.resolve(__dirname, `../../templates/${template}/component.txt`)
 const readPath: string = componentPath;
 return replaceTemplate(readFile(readPath), name);
}

const getExportTemplate = async (template: string, name: string): Promise<string> => {
 const componentPath = path.resolve(__dirname, `../../templates/${template}/exportComponent.txt`)
 const readPath: string = componentPath;
 return replaceTemplate(readFile(readPath), name);
}

const readFile = (path: string): string => {
 const data = fs.readFileSync(path, 'utf8');
 return data.toString();
}

const replaceTemplate = (data: string, name: string) => {
 const regex = /EXAMPLE/gi;
 return data.replace(regex, name);
}

export default createComponent;


class Component {
 private readonly template: string;
 private readonly name: string;
 private readonly indexFile: string;
 private readonly extension: string;
 private readonly cwd: string;


 public constructor(template: string, name: string) {
  this.template = template;
  this.name = name;
  this.extension = (template == 'javascript')? 'jsx': 'tsx';
  this.indexFile = `./components/index.${this.extension}`;
  this.cwd = process.cwd();

  this.createFolder();
  this.create();
  this.createIndex();
 }

 private create() {

 }

 private createIndex() {

 }

 private createFolder() {

 }
}
