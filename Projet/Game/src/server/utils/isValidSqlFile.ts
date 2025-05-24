import path, { dirname } from "path";
import fs from 'fs';
import { fileURLToPath } from 'url';
import chalk from "chalk";

/**
 *
 */
// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Verier que nous avons un fichier sql valide
 * @param relativePath chemin relatif puis sera ajouter le dirname
 * @returns le chemin si tout est bon null sinon.
 */
export default function isValidSqlFile(relativePath: string): string | null {
	// console.log(`__dirname = ${__dirname}`);
	// console.log(`relativePath = ${relativePath}`);
	const fullPath = path.resolve(__dirname, relativePath);
	// console.log(`fullPath = ${fullPath}`);
	if (!fs.existsSync(fullPath)) {
		console.error(chalk.red(`❌ Le fichier n'existe pas : '${fullPath}'`));
		return null;
	}

	const stat = fs.statSync(fullPath);
	if (!stat.isFile()) {
		console.error(chalk.red(`❌ Ce n'est pas un fichier valide : '${relativePath}'`));
		return null;
	}
	else if (path.extname(fullPath).toLowerCase() !== '.sql') {
		console.error(chalk.red(`❌ Mauvaise extension (attendu .sql) : '${relativePath}'`));
		return null;
	}
	try {
		fs.accessSync(fullPath, fs.constants.R_OK);
	} catch (err) {
		console.error(chalk.red(`❌ Pas les droits de lecture sur le fichier : '${relativePath}'`));
		return null;
	}
	return fullPath;
}
