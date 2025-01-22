import { ApolloServer } from "@apollo/server";

import { startStandaloneServer } from "@apollo/server/standalone";
import { typeDefs } from "./schema.js";
import db from "./_db.js"


const resolvers = {
  Query: {
    reviews() {
      return db.reviews
    },
    review(parent, args, context) {
      const idParam = args.id
      return db.reviews.find(review => review.id === idParam)
    },
    games() {
        /**
     * *SAMPLE
      query ExampleGame($id: ID!) {
          game(id: $id) {
            title,
            reviews {
              rating,
              content,
            }
          }
        }
    */
      return db.games
    },
    game(parent, args, context) {
      const idParam = args.id
      return db.games.find(game => game.id === idParam)
    },
    authors() {
      return db.authors
    },
    author(parent, args, context) {
      const idParam = args.id
      return db.authors.find(author => author.id === idParam)
    },
  },
  Game: {
    reviews(parent){
      return db.reviews.filter(r => r.game_id === parent.id)
    }
  },
  Author: {
    reviews(parent) {
      return db.reviews.filter(r => r.author_id === parent.id)
    }
  },
  Review: {
        /**
     * *SAMPLE
        query Review($id: ID!) {
          review(id: $id) {
            rating,
            game {
              title,
              platform
              reviews {
                rating
                author {
                  name
                }
              }
            }
            # author {
            #   name,
            #   verified
            # }
          }
        }
    */
    author(parent) {
      return db.authors.find(a => a.id === parent.author_id)
    },
    game(parent) {
      return db.games.find(a => a.id === parent.game_id)
    }
  },
  Mutation: {

    deleteGame(parent, args, context) {
    /**
     * *SAMPLE
      mutation DeleteMutation($id: ID!) {
        deleteGame(id: $id) {
          id, title, platform
        }
      }
    */
      const idParam = args.id
      db.games = db.games.filter(g => g.id !== args.id)

      return db.games
    },
    addGame(parent, args, context) {
          /**
     * *SAMPLE
        mutation AddGameMutation($game: GameInput) {
          addGame(game: $game) {
            id, title, platform
          }
        }
    */
      let game = {
        ...args.game,
        id: Math.floor(Math.random() * 10000).toString()
      }

      db.games.push(game)
      return game
    },
    updateGame(parent, args, context) {
    /**
     * *SAMPLE
      mutation UpdateameMutation($id: ID!, $edits: GameEditsInput!) {
        updateGame(id: $id, edits: $edits) {
          id, title, platform
        }
      }
        params: {
          "edits": {
            "title": "package manager game",
            "platform": ["PC", "PS2"]
          },
          "id": "2"
        }
    */

      db.games = db.games.map((g) => {
        if (g.id === args.id) return {...g, ...args.edits}
        return g
      })

      return db.games.find((g) => g.id === args.id)
    }
  }
}

const server = new ApolloServer({
  //type definitions -- definitions of data exposed on graph
  typeDefs,
  //resolver functions
  resolvers

});

const { url } = await startStandaloneServer(server, {
  listen: { port: 4000 },
});

console.log("Server at port 4000");
