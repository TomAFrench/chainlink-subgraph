import fs from 'fs';
import path from 'path';
import glob from 'glob';
import yargs from 'yargs';
import mustache from 'mustache';
import config from './config.json';

yargs
  .command('flatten', 'Flatten the generated code.', () => {
    const generated = path.resolve(__dirname, '..', 'src', 'generated');
    const globbed = glob.sync('**/*', { cwd: path.join(generated) });
    const files = globbed.filter((item) => {
      const stats = fs.statSync(path.join(generated, item));
      return stats.isFile();
    });

    const directories = globbed.filter((item) => {
      const stats = fs.statSync(path.join(generated, item));
      return stats.isDirectory();
    });

    files.forEach((item) => {
      const from = path.join(generated, item);
      const to = path.join(generated, path.basename(item));
      fs.renameSync(from, to);
    });

    directories.forEach((item) => {
      fs.rmdirSync(path.join(generated, item), { recursive: true });
    });
  })
  .command(
    'graphgen',
    'Generate the subgraph based for the configured feeds.',
    () => {
      const pairs = config.map((item) => ({
        name: item.pair.replace('/', ''),
        filename: item.pair.replace('/', '').toLowerCase(),
        ...item,
      }));

      const templatePath = path.join(__dirname, '../subgraph.mustache');
      const template = fs.readFileSync(templatePath, 'utf8');

      const subgraphPath = path.join(__dirname, '../subgraph.yaml');
      const subgraph = mustache.render(template, { pairs });

      fs.writeFileSync(subgraphPath, subgraph, 'utf8');

      pairs.forEach((item) => {
        const feedsPath = path.join(__dirname, '../src/mappings/feeds');
        const templatePath = path.join(feedsPath, 'feed.mustache');
        const template = fs.readFileSync(templatePath, 'utf8');

        const mappingPath = path.join(feedsPath, `${item.filename}.ts`);
        const mapping = mustache.render(template, item);

        fs.writeFileSync(mappingPath, mapping, 'utf8');
      });
    },
  )
  .help().argv;
