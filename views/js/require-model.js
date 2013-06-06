define('model/<%= collection.name %>', [
        <%= _(collection.relations).map(function (relation, key) { return '\'model/' + relation.relatedCollection + '\''; }).join(', ') %>
    ], function (
        <%= _(collection.relations).map(function (relation, key) { return relation.relatedCollection.toCamelCase(); }).join(', ') %>
    ) {


    <%
        /*
        var schema = {};
        // exclude all relationship fields from the model schema, they must be set on the form schemas
        _(collection.backboneForms.schema).each(function (def, key) {
            if (!(collection.relations && collection.relations[key])) {
                schema[key] = def;
            }
        });
        */

        // TODO this may be the refactor approach to take in order to maintain relations using ObjectID in mongo
        var schema = {};

        schema['_id'] = {
            type: 'Text',
            title: collection.name.toCamelCase() + 'Id',
            validators: ['required'],
            editorAttrs: { 'disabled': 'disabled' }
        };
        schema[collection.toStringField] = {
            type: 'Text',
            title: collection.backboneForms.schema[collection.toStringField].title || collection.toStringField,
            validators: ['required'],
            editorAttrs: {
                'data-autocomplete-field': collection.toStringField,
                'data-autocomplete-collection-name': collection.name,
                'placeholder': 'Search...',
                'autocomplete': 'off'
            }
        };
    %>

    Backbone.Model.<%= collection.name.toCamelCase() %> = Backbone.DeepModel.extend({
        id: '_id',
        defaults: <%= JSON.stringify(collection.backboneForms.defaults||{}) %>,
        schema: <%= global.helpers.stringify(schema) %>,
        toString: function () {
            <% if (collection.toStringField) { %>
            return this.get('<%= collection.toStringField %>');
            <% } else { %>
            return 'Missing config setting: collection.toStringField must be set';
            <% } %>
        }
    });

    return Backbone.Model.<%= collection.name.toCamelCase() %>;
});