import {execFileSync} from 'node:child_process';
import {promises as fs} from 'node:fs';
import path from 'node:path';

const SVG_DIR = path.resolve('src/assets/svg');
const ICONS_DIR = path.resolve('src/shared/icons');
const OUT_FILE = path.join(ICONS_DIR, 'index.ts');

function toPascalCase(name: string): string {
  const pascalName = getIconName(name)
    .split(/[^a-zA-Z0-9]/)
    .filter(Boolean)
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join('');
  return `IcSvg${pascalName}`;
}

function toKebabCaseFileName(name: string): string {
  const kebabName = getIconName(name)
    .replace(/([a-z0-9])([A-Z])/g, '$1_$2')
    .split(/[^a-zA-Z0-9]/)
    .filter(Boolean)
    .map((s) => s.toLowerCase())
    .join('-');
  return `ic-${kebabName}.tsx`;
}

function getIconName(name: string): string {
  return name
    .replace(/\.[^.]+$/, '')
    .replace(/^Property\s*\d+=/i, '')
    .replace(/^ic(?=[A-Z_-])|^ic[-_\s]+/i, '')
    .replace(/^Ic(?=[A-Z])/, '');
}

async function getSvgFiles(dir: string): Promise<string[]> {
  try {
    const entries = await fs.readdir(dir, {withFileTypes: true});
    const nestedFiles = await Promise.all(
      entries.map(async (entry) => {
        const entryPath = path.join(dir, entry.name);

        if (entry.isDirectory()) {
          return getSvgFiles(entryPath);
        }

        return entry.isFile() && entry.name.endsWith('.svg') ? [entryPath] : [];
      })
    );

    return nestedFiles.flat();
  } catch (error) {
    if (error instanceof Error && 'code' in error && error.code === 'ENOENT') {
      return [];
    }

    throw error;
  }
}

async function main() {
  try {
    await fs.rm(ICONS_DIR, {recursive: true, force: true});
    await fs.mkdir(ICONS_DIR, {recursive: true});

    const svgFiles = await getSvgFiles(SVG_DIR);
    const exportLines = [
      '// (auto-generated) Do not edit manually.',
      '// Run `pnpm build:icons` to regenerate.\n',
    ];

    if (svgFiles.length === 0) {
      await fs.writeFile(OUT_FILE, `${exportLines.join('\n')}\n`, 'utf8');
      console.log(
        `No SVG files found in ${path.relative(process.cwd(), SVG_DIR)}.`
      );
      return;
    }

    execFileSync(
      'pnpm',
      [
        'exec',
        'svgr',
        SVG_DIR,
        '--out-dir',
        ICONS_DIR,
        '--ext',
        'tsx',
        '--typescript',
        '--no-dimensions',
        '--icon',
        '--no-index',
        '--jsx-runtime',
        'automatic',
        '--no-prettier',
      ],
      {stdio: 'inherit'}
    );

    const generatedFiles = (await fs.readdir(ICONS_DIR)).filter(
      (file) => file.endsWith('.tsx') && !file.startsWith('index')
    );

    for (const file of generatedFiles) {
      const oldPath = path.join(ICONS_DIR, file);
      const newFileName = toKebabCaseFileName(file);
      const newPath = path.join(ICONS_DIR, newFileName);
      const componentName = toPascalCase(file);

      await fs.rename(oldPath, newPath);

      let content = await fs.readFile(newPath, 'utf8');

      content = content.replace(
        /(stroke)=['"]([^'"]+)['"]/g,
        (match, property, value) => {
          if (
            value === 'none' ||
            value === 'transparent' ||
            value.startsWith('url(')
          ) {
            return match;
          }

          return `${property}="currentColor"`;
        }
      );

      content = content.replace(
        /(<path[^>]*?|<g[^>]*?)fill=['"]([^'"]+?)['"]/g,
        (match, p1, p2) => {
          if (p2 === 'none' || p2 === 'transparent' || p2.startsWith('url(')) {
            return match;
          }

          return `${p1}fill="currentColor"`;
        }
      );

      content = content.replace(
        /^import \* as React from ['"]react['"];\r?\n/m,
        ''
      );

      content = content.replace(
        /const\s+Svg[A-Za-z0-9_$]+\s*=/,
        `const ${componentName} =`
      );
      content = content.replace(
        /export default Svg[^;]+;/,
        `export default ${componentName};`
      );

      const importMatch = content.match(
        /^(import type \{ SVGProps \} from ['"]react['"];\r?\n)/m
      );

      if (importMatch) {
        if (!content.startsWith(`${importMatch[0]}\n`)) {
          content = content.replace(importMatch[0], `${importMatch[0]}\n`);
        }
      }

      await fs.writeFile(newPath, content);

      exportLines.push(
        `export { default as ${componentName} } from './${newFileName.replace('.tsx', '')}'`
      );
    }

    exportLines.push('');
    await fs.writeFile(OUT_FILE, exportLines.join('\n'), 'utf8');

    execFileSync('pnpm', ['exec', 'prettier', ICONS_DIR, '--write'], {
      stdio: 'inherit',
    });
  } catch (error) {
    console.error('An error occurred during icon build process:', error);
    process.exit(1);
  }
}

main();
