#!/usr/bin/env node

import cli, { IOptions } from '../cli';
import { createComponent, createPage, createService } from '../core/reactor';


(async () => {
 const options: IOptions = await cli(process.argv);

 switch (options.element) {
  case 'component':
   await createComponent(options.template, options.name);
   break;
  case 'page':
   await createPage(options.template, options.name);
   break;
  case 'service':
   await createService(options.template, options.name);
   break;
  default:
   await createComponent(options.template, options.name);
 }
})();
