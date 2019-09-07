const axios = require('axios');
const { GraphQLObjectType, GraphQLString, GraphQLSchema } = require('graphql');

const CountryType = new GraphQLObjectType({
  name: 'Country',
  fields: () => ({
    name: { type: GraphQLString },
    capital: { type: GraphQLString },
    region: { type: GraphQLString },
    flag: { type: GraphQLString },
  }),
});

// Only ask for necessary data (better perf even with graphql)
const COUNTRY_QUERY_FIELDS = ['name', 'capital', 'region', 'flag'].join(';');

const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    country: {
      type: CountryType,
      args: {
        name: { type: GraphQLString },
      },
      resolve(parent, args) {
        return axios
          .get(
            `https://restcountries.eu/rest/v2/name/${args.name}?fields=${COUNTRY_QUERY_FIELDS}`
          )
          .then(res => res.data[0]);
      },
    },
  },
});

module.exports = new GraphQLSchema({
  query: RootQuery,
});
