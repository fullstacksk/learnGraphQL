import { GraphQLServer } from 'graphql-yoga';
import db from './db';
import Book from './resolvers/Book';
import Mutation from './resolvers/Mutation';
import Query from './resolvers/Query';
import Review from './resolvers/Review';
import User from './resolvers/User';

const server = new GraphQLServer({
	typeDefs: './src/schema.graphql',
	resolvers: {
		Query,
		Mutation,
		User,
		Book,
		Review
	},
	context: { db }
});

server.start(() => {
	console.log('The server is up!');
});
