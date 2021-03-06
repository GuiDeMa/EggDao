const Twetch = require("@twetch/sdk");
const twetch = new Twetch();

export const twquery = async (q) => {
  return twetch.query(q);
};

const PostFields = `{
  bContent
  createdAt
  id
  numLikes
  postsByReplyPostId {
    totalCount
  }
  transaction
  youLikedCalc
  userId
  userByUserId {
    icon
    name
  }
}`;

const PostDetailFields = `{
  ...${PostFields}
  parents{
    nodes{
      ...${PostFields}
    }
  }
}`;

const ReplyFields = `{
  ...${PostDetailFields}
  children {
    nodes {
      ...${PostDetailFields}
    }
  }
}`;

export const userData = `{
    me {
      createdAt
      defaultWallet
      description
      hasAutoTweetFromTwetch
      hasImageUpload
      hasTwetchToTweet
      hasEncrypted
      hideFreeNotifications
      icon
      id
      isAdmin
      isApproved
      isDarkMode
      isOneClick
      lastReadNotifications
      moneyButtonUserId
      name
      nodeId
      numPosts
      onboardedAt
      oneButtonAddress
      profileUrl
      publicKey
      publicKeys: publicKeysByUserId(filter: { revokedAt: { isNull: true } }) {
        nodes {
          id
          walletType
          signingAddress
          identityPublicKey
          encryptedMnemonic
          address
        }
      }
      purchasedAdvancedSearchAt
      purchasedDarkModeAt
      purchasedTwetchToTweetAt
      purchasedChatAt
      referralLinkId
      xpub
      __typename
    }
    currentUserId
  }
  `;

export function FetchNotifications(offset) {
  //console.log(filter);
  return twquery(`{
    me {
      notificationsByUserId(
        first: 30
        offset: ${offset}
        orderBy: ID_DESC
        filter: {actorUserId: {distinctFrom: "${localStorage.id}"}}
      ) {
        nodes {
          actorUserId
          createdAt
          description
          id
          nodeId
          postId
          price
          priceSats
          type
          url
          userId
          userByActorUserId {
            icon
            name
          }
        }
        totalCount
      }
    }
  }`);
}

export function FetchPosts(rootId, order, offset) {
  return twquery(`{
    allPosts(
      condition: {replyPostId: "${rootId}"}
      orderBy: ${order}
      first: 33
      offset: ${offset}
    ) {
      totalCount
      edges {
        node {
          ...${PostFields}
        }
      }
    }
  }`);
}

export function FetchUserPosts(userId, order, offset) {
  return twquery(`{
    allPosts(orderBy: ${order} first: 30 offset: ${offset} filter: {userId: {equalTo: "${userId}"}}) {
      totalCount
      edges {
        node {
          ...${PostFields}
        }
      }
    }
  }`);
}

export function FetchUserData(userId) {
  return twquery(`
  {
    userById(id: "${userId}") {
      description
      earned
      earnedCalc
      earnedSatsCalc
      followerCount
      followingCount
      icon
      id
      name
      postsEarnedCalc
      profileUrl
    }
  }`);
}

export function FetchPostDetail(txId) {
  return twquery(`{
    allPosts(
      condition: {transaction: "${txId}"}
    ) {
      edges {
        node {
          ...${PostFields}
        }
      }
    }
  }`);
}

export function FetchPostReplies(txId, order) {
  return twquery(`
  {
    allPosts(
      condition: { transaction: "${txId}" }
      orderBy: ${order}
    ) {
      totalCount
      pageInfo{
        hasNextPage
        endCursor
      }
      nodes {
        parents {
          edges {
            node
            {
              ...${PostFields}
            }
          }
        }
        children {
          edges {
            node
            {
              ...${PostFields}
            }
          }
        }
      }
    }
  }
  `);
}
