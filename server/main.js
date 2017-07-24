import { Mongo } from 'meteor/mongo';

const Collection1 = new Mongo.Collection('collection1');
const Collection2 = new Mongo.Collection('collection2');

Collection1.remove({});
Collection2.remove({});
Collection1.insert({});
Collection2.insert({});

for (let i = 1; i <= 2; i++) {
    let observeHandler;
    let observeChangesHandler;

    const handler = (action) => (doc) => {
        console.log(i, 'Collection1', action, doc);
        if (observeHandler) observeHandler.stop();
        if (observeChangesHandler) observeChangesHandler.stop();
        const cursor = Collection2.find({});
        observeHandler = cursor.observe({
            added:   doc => console.log(i, 'Collection2', 'added', doc),
            changed: doc => console.log(i, 'Collection2', 'changed', doc),
        });
        observeChangesHandler = cursor.observeChanges({
            changed: (id, fields) =>
                console.log(i, 'Collection2', 'observeChanges', id, fields),
        });
    };

    Collection1.find({}).observe({
        added: handler('added'),
        changed: handler('changed'),
    });
}

Collection1.update({}, { $set: { test: 'collection1' } });
Collection2.update({}, { $set: { test: 'collection2' } });
