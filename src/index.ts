import 'dotenv/config';
import pleaseUpgradeNode from 'please-upgrade-node';
const packageJson = require('../package.json');
pleaseUpgradeNode(packageJson);

export * from './types';
export { default as Acho, ResourceEndpoints, ProjectEndpoints } from './Acho';
