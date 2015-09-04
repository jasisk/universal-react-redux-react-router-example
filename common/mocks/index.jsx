export const slides = {
  entities: {
    counts: [
      { liked: 0, disliked: 0 },
      { liked: 1, disliked: 0 }
    ],
    sentiments: {
      liked: {
        id: 'liked',
        text: 'Like'
      },
      disliked: {
        id: 'disliked',
        text: 'Dislike'
      }
    },
    slides: [
      {
        is: []
      },
      {
        is: [ 'liked' ]
      }
    ]
  },
  slideIdx: 0
};
