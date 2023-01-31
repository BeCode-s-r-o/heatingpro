const aliases = (prefix = `src`) => ({
  '@app': `${prefix}/@app`,
  '@history': `${prefix}/@history`,
  '@lodash': `${prefix}/@lodash`,
  'app/store': `${prefix}/app/store`,
  'app/shared': `${prefix}/app/shared`,
  'app/config': `${prefix}/app/config`,
  'app/theme-layouts': `${prefix}/app/theme-layouts`,
  'app/AppContext': `${prefix}/app/AppContext`,
});

module.exports = aliases;
