import {
  GraphQLNonNull,
  GraphQLID
} from 'graphql'
import { PostType } from '../types'
import { Post } from '../models'
import checkLoggedIn from 'server/utils/checkLoggedIn'

export default {
  type: PostType,
  args: {
    id: {
      type: new GraphQLNonNull(GraphQLID)
    }
  },
  resolve: async (root, { id }, { req }) => {
    checkLoggedIn(req)

    const { user } = req

    if (!user.likes.some(postId => postId.equals(id))) {
      user.likes.push(id)

      await user.save()
    }

    return Post.findById(id)
  }
}
