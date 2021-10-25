const { User, Thought } = require('../models');

const thoughtController = {
    getAllThoughts(req, res) {
        Thought.find({})
          .then(dbThoughtData => res.json(dbThoughtData))
          .catch(err => {
            console.log(err);
            res.status(400).json(err);
        });
    },
    getOneThought({ params }, res) {
        Thought.findOne({ _id: params.thoughtId })
          .then(dbThoughtData => {
            if (!dbThoughtData) {
              res.status(404).json({ message: 'No thought found with this id!' });
              return;
            }
            res.json(dbThoughtData);
          })
          .catch(err => {
            console.log(err);
            res.status(400).json(err);
          });
    },
    createThought({ body }, res) {
        Thought.create(body)
          .then((dbThoughtData) => {
            return User.findOneAndUpdate(
              { _id: body.userId },
              { $push: { thoughts: dbThoughtData._id } },
              { new: true }
            );
          })
          .then((dbUserData) => {
            if (!dbUserData) {
              return res.status(404).json({ message: 'No user to connect this thought to!' });
            }
    
            res.json({ message: 'Thought created!' });
          })
          .catch((err) => {
            console.log(err);
            res.status(500).json(err);
          });
    },
    updateThought({ params, body }, res) {
        Thought.findOneAndUpdate(
            {_id: params.thoughtId}, 
            body, 
            {new: true}
        )
        .then(dbThoughtData => {
            if (!dbThoughtData){
                res.status(404).json({message: 'No thought found with this id!'});
                return;
            }
            res.json(dbThoughtData);
        })
        .catch (err => {
            res.status(400).json(err);
        });
    },
    removeThought({ params }, res) {
        Thought.findOneAndDelete({ _id: params.thoughtId })
          .then(dbThoughtData => {
            if (!dbThoughtData) {
              res.status(404).json({ message: 'No thought found with this id!' });
              return;
            }
            res.json(dbThoughtData);
          })
          .catch(err => res.json(err));
    },
    addReaction({ params, body }, res) {
        Thought.findOneAndUpdate(
          { _id: params.thoughtId },
          { $push: { reactions: body } },
          { new: true, runValidators: true }
        )
          .then(dbThoughtData => {
            if (!dbThoughtData) {
              res.status(404).json({ message: 'No thought found with this id!' });
              return;
            }
            res.json(dbThoughtData);
          })
          .catch(err => res.json(err));
      },
      removeReaction({ params }, res) {
        Thought.findOneAndUpdate(
          { _id: params.thoughtId },
          { $pull: { reactions: { reactionId: params.reactionId } } },
          { new: true }
        )
          .then(dbThoughtData => res.json(dbThoughtData))
          .catch(err => res.json(err));
      },
};

module.exports = thoughtController;