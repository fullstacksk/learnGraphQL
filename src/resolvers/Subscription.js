const Subscription = {
	count: {
		subscribe(parent, args, { pubsub }, info) {
			let count = 0;

			setInterval(() => {
				count++;
				pubsub.publish('count', {
					count
				});
			}, 2000);
			return pubsub.asyncIterator('count');
		}
	},

	review: {
		subscribe(parent, { bookId }, { pubsub, db }, info) {
			const book = db.books.find((book) => book.id === bookId);
			if (!book) {
				throw new Error('Book not found');
			}

			return pubsub.asyncIterator(`review ${bookId}`);
		}
	},

	book: {
		subscribe(parent, { userId }, { db, pubsub }, info) {
			const user = db.users.find((user) => user.id === userId);
			if (!user) throw new Error('User not found');

			return pubsub.asyncIterator(`book ${userId}`);
		}
	}
};

export { Subscription as default };
