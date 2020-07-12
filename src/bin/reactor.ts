#!/usr/bin/env node

import cli, { IOptions } from '../cli';
import { createComponent, createPage, createService } from '../core/reactor';
import Component from '../core/reactor/createComponent';


(async () => {
 const options: IOptions = await cli(process.argv);

 switch (options.element) {
  case 'component':
   new Component(options.template, options.name);
   break;
  case 'page':
   await createPage(options.template, options.name);
   break;
  case 'service':
   await createService(options.template, options.name);
   break;
  default:
   new Component(options.template, options.name);
 }
})();
