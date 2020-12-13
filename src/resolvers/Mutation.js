import { v4 as uuidv4 } from 'uuid';
const Mutation = {
	createUser(parent, args, { db }, info) {
		const emailTaken = db.users.some((user) => user.email === args.data.email);
		if (emailTaken) {
			throw new Error('Email taken');
		}
		const user = {
			id: uuidv4(),
			...args.data
		};
		db.users.push(user);
		return user;
	},
	createBook(parent, args, { db }, info) {
		const authorExist = db.users.some((user) => user.id === args.data.author);
		if (!authorExist) {
			throw new Error("Author does'nt exist");
		}
		const book = {
			id: uuidv4(),
			...args.data
		};
		db.books.push(book);
		return book;
	},
	createReview(parent, args, { db }, info) {
		const userExist = db.users.some((user) => user.id === args.data.author);
		const bookExist = db.books.some((book) => book.id === args.data.book);
		if (!userExist) {
			throw new Error("Author doesn't exist");
		}
		if (!bookExist) {
			throw new Error("Book doesn't exist");
		}
		const review = {
			id: uuidv4(),
			...args.data
		};
		db.reviews.push(review);
		return review;
	},
	deleteUser(parent, args, { db }, info) {
		const userIndex = db.users.findIndex((user) => user.id === args.id);
		if (userIndex === -1) {
			throw new Error('User not Found');
		}
		const deletedUser = db.users.splice(userIndex, 1);
		db.books = db.books.filter((book) => {
			const match = book.author === args.id;
			if (match) {
				db.reviews = db.reviews.filter((review) => review.book !== book.id);
			}
			return !match;
		});
		db.reviews = db.reviews.filter((review) => review.author === args.id);
		return deletedUser[0];
	},
	deleteBook(parent, args, { db }, info) {
		const bookIndex = db.books.findIndex((book) => book.id === args.id);
		if (bookIndex === -1) throw new Error('Book not found');
		const deletedBook = db.books.splice(bookIndex, 1);
		db.reviews = db.reviews.filter((review) => review.book !== args.id);
		return deletedBook[0];
	},
	deleteReview(parent, args, { db }, info) {
		const reviewIndex = db.reviews.findIndex((review) => review.id === args.id);
		if (reviewIndex === -1) throw new Error('Review not found');
		const deletedReview = db.reviews.splice(reviewIndex, 1);

		return deletedReview[0];
	},

	updateUser(parent, args, { db }, info) {
		const { id, data } = args;
		const user = db.users.find((user) => user.id === id);
		if (!user) throw new Error('User not found');

		if (typeof data.email === 'string') {
			const emailTaken = db.users.some((user) => user.email === data.email);

			if (emailTaken) throw new Error('Email taken already');

			user.email = data.email;
		}

		if (typeof data.name === 'string') user.name = data.name;

		if (typeof data.location !== undefined) user.location = data.location;

		if (typeof data.age !== undefined) user.age = data.age;

		return user;
	},

	updateBook(parent, args, { db }, info) {
		const { id, data } = args;
		const book = db.books.find((book) => book.id === id);
		if (!book) throw new Error('Book not found.');
		//title, price, author, instock
		if (typeof data.title === 'string') book.title = data.title;
		if (typeof data.price === 'float') book.price = data.price;
		if (typeof book.inStock === 'boolean') book.inStock = data.inStock;

		return book;
	},
	updateReview(parent, args, { db }, info) {
		const { id, data } = args;
		const review = db.reviews.find((review) => review.id === id);
		if (!review) throw new Error('Review not found.');
		if (typeof data.text === 'string') review.text = data.text;
		return review;
	}
};

export { Mutation as default };
