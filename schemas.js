export const parentSchema = {
  name: 'parent',
  schemaVersion: 1,
  properties: {
    id: 'string',
    child: 'child',
  },
};

export const childSchema = {
  name: 'child',
  schemaVersion: 1,
  embedded: true,
  properties: {
    id: 'string',
  },
};

export const lightObjectSchema = {
  name: 'lightObject',
  schemaVersion: 1,
  properties: {
    id: 'string',
  },
};

export const save = {
  name: 'Save',
  schemaVersion: 1,
  primaryKey: 'name',
  properties: {
    name: 'string',
    backgroundImage: 'string?',
    timeSpent: 'int',
    timestamp: 'int',
    _saveData: `string?`,
  },
};
