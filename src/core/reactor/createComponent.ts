import fs from 'fs';
import { logRed, logBlue, logGreen } from '../../Util/chalk';
import path from 'path';

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
  this.indexFile = `./index.${this.extension}`;
  this.cwd = process.cwd();

  this.create();
 }

 private create() {
  this.createFolder();
  this.createFile();
  this.createIndex();
 }

 private createFile() {
  const component = `./${this.name}/${this.name}.${this.extension}`;
  const style = `./${this.name}/${this.name}.scss`;
  const componentFolder = `./${this.name}/`;

  if (!fs.existsSync(component)) {
   if (!fs.existsSync(componentFolder)) {
    fs.mkdir(componentFolder, (err) => {
     if (err) logRed(err.message);
     logGreen(`${this.name} folder has been created at: ${path.resolve(this.cwd, './component')}`);
    });
   }

   fs.appendFile(component, this.getComponentTemplate(), 'utf-8', (err) => {
    if (err) logRed(err.message);
    logGreen(`Component has been generated at: ${path.resolve(this.cwd, component)}`);
   });

   fs.appendFile(style, '','utf-8', (err) => {
    if (err) logRed(err.message);
    logGreen(`Style has been generated at: ${path.resolve(this.cwd, style)}`);
   });
  } else {
   logRed('File already exists');
  }
 }

 private async createIndex() {
  if (!fs.existsSync(this.indexFile)) {
   fs.appendFile(this.indexFile, this.getExportTemplate(), 'utf-8', (err) => {
    if (err) logRed(err.message);
    logGreen(`Export index file has been created at: ${path.resolve(this.cwd, this.indexFile)}`);
   });
  } else {
   await this.generateIndexImport();
   await this.generateIndexExport();

   logGreen(`Export file has been updated: ${path.resolve(this.cwd, this.indexFile)}`);
  }
 }

 private createFolder() {
   fs.mkdir(`./${this.name}`, (err) => {
    if (err) logRed(err.message);
    logGreen(`${this.name} folder has been created at: ${path.resolve(this.cwd, `./${this.name}`)}`);
   });
 }

 private getExportTemplate() {
  const componentPath = path.resolve(__dirname, `../../templates/${this.template}/exportComponent.txt`)
  const readPath: string = componentPath;
  return this.replaceTemplate(this.readFile(readPath), this.name);
 }

 private getComponentTemplate() {
  const componentPath = path.resolve(__dirname, `../../templates/${this.template}/component.txt`)
  const readPath: string = componentPath;
  return this.replaceTemplate(this.readFile(readPath), this.name);
 }

 private readFile(path: string): string {
  const data = fs.readFileSync(path, 'utf8');
  return data.toString();
 }

 private replaceTemplate(data: string, name: string) {
  const regex = /EXAMPLE/gi;
  return data.replace(regex, name);
 }

 private generateIndexImport() {
  return new Promise((resolve, reject) => {
   let data = this.readFile(this.indexFile);
   const lastColon = data.lastIndexOf(';');
   const importStatement = `;\nimport ${this.name} from './${this.name}/${this.name}';`;

   // Add the import statement after the semicolon
   fs.readFile(this.indexFile, (err, data) => {
    let file_content = data.toString();
    file_content = file_content.substring(lastColon + 1);
    const file = fs.openSync(this.indexFile,'r+');
    const bufferedText = new Buffer(importStatement + file_content);
    fs.writeSync(file, bufferedText, 0, bufferedText.length, lastColon);
    fs.close(file, (err) => {
     resolve();
    });
   });
  });
 }

 private generateIndexExport() {
  return new Promise((resolve, reject) => {
   let data = this.readFile(this.indexFile);
   const lastComma = data.lastIndexOf(',');
   const exportStatement = `,\n${this.name},`;

   // Add the import statement after the semicolon
   fs.readFile(this.indexFile, (err, data) => {
    if (err) throw err;
    let file_content = data.toString();
    file_content = file_content.substring(lastComma + 1);
    const file = fs.openSync(this.indexFile,'r+');
    const bufferedText = new Buffer(exportStatement + file_content);
    fs.writeSync(file, bufferedText, 0, bufferedText.length, lastComma);
    fs.close(file, (err) => {
     resolve();
    });
   });
  });
 }
}

export default Component;
