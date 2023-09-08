console.log("content loaded");

import './inject-scripts';
/**
 * @description
 * Chrome extensions don't support modules in content scripts.
 */
// import("./components/Demo");
import './message';
import './vm-override-mount';

