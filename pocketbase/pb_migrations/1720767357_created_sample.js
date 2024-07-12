/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const collection = new Collection({
    "id": "9bqlfr8yoqsqw98",
    "created": "2024-07-12 06:55:57.951Z",
    "updated": "2024-07-12 06:55:57.951Z",
    "name": "sample",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "p0w5sa3p",
        "name": "field",
        "type": "text",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {
          "min": null,
          "max": null,
          "pattern": ""
        }
      }
    ],
    "indexes": [],
    "listRule": null,
    "viewRule": null,
    "createRule": null,
    "updateRule": null,
    "deleteRule": null,
    "options": {}
  });

  return Dao(db).saveCollection(collection);
}, (db) => {
  const dao = new Dao(db);
  const collection = dao.findCollectionByNameOrId("9bqlfr8yoqsqw98");

  return dao.deleteCollection(collection);
})
