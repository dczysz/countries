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
            `https://restcountries.eu/rest/v2/name/${args.name}?fields=name;capital;region;flag`
          )
          .then(res => res.data[0]);
      },
    },
  },
});

module.exports = new GraphQLSchema({
  query: RootQuery,
});
