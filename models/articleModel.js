const mongoose = require("mongoose");
const { Schema } = mongoose;
const slugify = require("slugify");

const articleSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "A article must have a title."],
      trim: true,
      minlength: [7, "A article title must have at least 7 characters."],
      maxlength: [250, "A article title must have at most 250 characters."],
    },
    slug: String,
    inappropriate: {
      type: Boolean,
      default: false,
      select: false,
    },
    body: {
      type: String,
      required: [true, "A article must have some content."],
      //REFACTOR: FIX:
      minlength: [50, "Article body must at least 50 characters."],
    },
    //create own model for tags FIX:
    tags: {
      type: [String],
      // enum: {
      //     values: ['js', 'py', 'ai', 'ml', null],
      //     message: 'Tags is either: js ,py ,ai ,ml or null.'
      // },
      validate: {
        // FIX: FOR AT MOST 4 Tags
        validator: function (val) {
          return val.length >= 1;
        },
        message: "You must provide at least 1 tag.",
      },
    },
    expertiseLevel: {
      type: String,
      required: [true, "A article must have a level of expertise"],
      enum: {
        values: ["beginner", "intermediate", "advanced"],
        message: "Expertise Level can be either of the following: beginner, intermediate, advanced.",
      },
    },
    shortDescription: {
      type: String,
      trim: true,
    },
    image: {
      type: String,
    },
    images: [{ type: String }],
    readingTime: Schema.Types.Mixed,
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "A article must belong to a user."],
    },
    likeCounts: { type: Number, default: 0 },
    commentCounts: { type: Number, default: 0 },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// indexes REFACTOR:
articleSchema.index({ slug: 1 });
articleSchema.index({ timestamps: 1 });
articleSchema.index({ likeCounts: -1, commentCounts: -1 });
articleSchema.index({ title: "text" });
articleSchema.index({ tags: 1 });
// virtual populate
articleSchema.virtual("comments", {
  ref: "Comment",
  localField: "_id",
  foreignField: "article",
});
// REFACTOR:
articleSchema.virtual("articleLikes", {
  ref: "ArticleLike",
  localField: "_id",
  foreignField: "article",
  justOne: true, //FIX:
});
// REFACTOR:
articleSchema.virtual("articleBookmarks", {
  ref: "ArticleBookmark",
  localField: "_id",
  foreignField: "article",
  justOne: true, //FIX:
});
// middlewares
articleSchema.pre("save", function (next) {
  // HACK:
  let slugifiedTitle = `${slugify(this.title, { lower: true })}-${(0 | (Math.random() * 9e6)).toString(36)}`;
  this.slug = slugifiedTitle;
  const readingTime = require("reading-time");
  this.readingTime = readingTime(this.body);
  next();
});

articleSchema.pre(/^find/, function (next) {
  this.find({ inappropriate: { $ne: true } });
  next();
});

articleSchema.pre("aggregate", function (next) {
  this.pipeline().unshift({
    $match: { inappropriate: { $ne: true } },
  });
  next();
});

//pre save hook
articleSchema.pre("save", async function (next) {
  // console.log('this', this)
  // this points to current article
  if (this.isNew) {
    const ArticleLike = require("./articleLikeModel");
    const ArticleBookmark = require("./articleBookmarkModel");
    await ArticleLike.create({
      article: this._id,
    });
    await ArticleBookmark.create({
      article: this._id,
    });
  }
  next();
});

articleSchema.post(/^findOneAndDelete/, async function (doc) {
  if (doc) {
    const Comment = require("./../models/commentModel");
    // console.log('hello from post find&delete hook', doc)
    const comments = await Comment.find({
      article: doc._id,
    });
    if (comments && comments.length > 0) {
      comments.forEach(async (doc) => {
        // REFACTOR: for commentLike delete
        await doc.deleteOne();
      });
    }
    // await Comment.deleteMany({
    //     article: doc._id
    // });
    const ArticleLike = require("./articleLikeModel");
    await ArticleLike.deleteOne({
      article: doc._id,
    });
    const ArticleBookmark = require("./articleBookmarkModel");
    await ArticleBookmark.deleteOne({
      article: doc._id,
    });
  }
});

module.exports = mongoose.model("Article", articleSchema);
