const axios = require('axios');
const {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLFloat,
  GraphQLList,
} = require('graphql');

const CountryType = new GraphQLObjectType({
  name: 'Country',
  fields: () => ({
    name: { type: GraphQLString },
    nativeName: { type: GraphQLString },
    flag: { type: GraphQLString },
    capital: { type: GraphQLString },
    region: { type: GraphQLString },
    subregion: { type: GraphQLString },
    population: { type: GraphQLInt },
    gini: { type: GraphQLFloat },
    latlng: { type: new GraphQLList(GraphQLFloat) },
    timezones: { type: new GraphQLList(GraphQLString) },
    currencies: { type: new GraphQLList(CurrencyType) },
    languages: { type: new GraphQLList(LanguageType) },
  }),
});

const CurrencyType = new GraphQLObjectType({
  name: 'Currency',
  fields: () => ({
    code: { type: GraphQLString },
    name: { type: GraphQLString },
    symbol: { type: GraphQLString },
  }),
});

const LanguageType = new GraphQLObjectType({
  name: 'Language',
  fields: () => ({
    iso639_1: { type: GraphQLString },
    iso639_2: { type: GraphQLString },
    name: { type: GraphQLString },
    nativeName: { type: GraphQLString },
  }),
});

// Only ask for necessary data
const COUNTRY_QUERY_FIELDS = [
  'name',
  'nativeName',
  'flag',
  'capital',
  'region',
  'subregion',
  'population',
  'gini',
  'latlng',
  'timezones',
  'currencies',
  'languages',
].join(';');

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
            `https://restcountries.eu/rest/v2/alpha/${args.name}?fields=${COUNTRY_QUERY_FIELDS}`
          )
          .then(res => res.data);
      },
    },
  },
});

module.exports = new GraphQLSchema({
  query: RootQuery,
});
