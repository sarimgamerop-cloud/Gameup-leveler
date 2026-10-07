## This is the file for all the questions and their respective
## answer data, u can directly access it from this file.


# list of all the roles to be displayed on the plain:
roles = ["Collector", "Creator", "Competitor", "Strategist", "Socializer", "Explorer"]

# Question Queries:
## each question have their individual 6 answers as MCQs
questions = [
    "You start a new game. What do you do first?",
    "What feels most satisfying?",
    "You find a locked area. What do you do?",
    "You have free time in a game. What do you do?",
    "What motivates you most?",
    "Your favorite reward is?",
    "Your team is struggling. You do,",
    "Which achievement would make you proudest?",
    "You lose a difficult challenge. You...",
    "Pick a game activity.",
    "You discover a rare item.",
    "What type of game world attracts you most?",
    "When playing with others, you usually...",
    "Which challenge sounds best?",
    "At the end of a game, you'd rather say..."
]

# answer queries:
## hotfix: added "f" instead of "d" in all enteries
answer_dict = {
    "first_answer": {
        "a": ("Collect items", "Collector"),
        "b": ("Build/customize", "Creator"),
        "c": ("Test yourself", "Competitor"),
        "d": ("Learn the mechanics", "Strategist"),
        "e": ("Explore", "Explorer"),
        "f": ("Find players", "Socializer")
    },

    "second_answer": {
        "a": ("Completing collections", "Collector"),
        "b": ("Creating something", "Creator"),
        "c": ("Winning", "Competitor"),
        "d": ("Solving problems", "Strategist"),
        "e": ("Discovering secrets", "Explorer"),
        "f": ("Playing with friends", "Socializer")
    },

    "third_answer": {
        "a": ("Search for the key", "Collector"),
        "b": ("Build a way in", "Creator"),
        "c": ("Challenge yourself to enter", "Competitor"),
        "d": ("Figure out the mechanism", "Strategist"),
        "e": ("Look for another entrance", "Explorer"),
        "f": ("Ask someone to help", "Socializer")
    },

    "fourth_answer": {
        "a": ("Hunt rare items", "Collector"),
        "b": ("Build a project", "Creator"),
        "c": ("Practice combat", "Competitor"),
        "d": ("Optimize your setup", "Strategist"),
        "e": ("Explore the map", "Explorer"),
        "f": ("Join your friends", "Socializer")
    },

    "fifth_answer": {
        "a": ("Completion", "Collector"),
        "b": ("Creativity", "Creator"),
        "c": ("Competition", "Competitor"),
        "d": ("Mastery", "Strategist"),
        "e": ("Discovery", "Explorer"),
        "f": ("Friendship", "Socializer")
    },

    "sixth_answer": {
        "a": ("A rare collectible", "Collector"),
        "b": ("A new building/custom item", "Creator"),
        "c": ("A rank or trophy", "Competitor"),
        "d": ("A powerful upgrade", "Strategist"),
        "e": ("Access to a new area", "Explorer"),
        "f": ("A reward shared with teammates", "Socializer")
    },

    "seventh_answer": {
        "a": ("Gather resources", "Collector"),
        "b": ("Create a better setup", "Creator"),
        "c": ("Take the lead in combat", "Competitor"),
        "d": ("Make a strategy", "Strategist"),
        "e": ("Find a different route", "Explorer"),
        "f": ("Coordinate everyone", "Socializer")
    },

    "eighth_answer": {
        "a": ("100% completion", "Collector"),
        "b": ("An incredible build", "Creator"),
        "c": ("A top leaderboard position", "Competitor"),
        "d": ("Mastering a difficult system", "Strategist"),
        "e": ("Finding a secret nobody noticed", "Explorer"),
        "f": ("Building a great team", "Socializer")
    },

    "ninth_answer": {
        "a": ("Improve your equipment", "Collector"),
        "b": ("Change your setup", "Creator"),
        "c": ("Try again immediately", "Competitor"),
        "d": ("Analyze your mistake", "Strategist"),
        "e": ("Try a different approach", "Explorer"),
        "f": ("Ask teammates what happened", "Socializer")
    },

    "tenth_answer": {
        "a": ("Hunting collectibles", "Collector"),
        "b": ("Building", "Creator"),
        "c": ("Ranked matches", "Competitor"),
        "d": ("Puzzle solving", "Strategist"),
        "e": ("Exploring an open world", "Explorer"),
        "f": ("Multiplayer sessions", "Socializer")
    },

    "eleventh_answer": {
        "a": ("Add it to your collection", "Collector"),
        "b": ("Use it in a creation", "Creator"),
        "c": ("Use it to gain an advantage", "Competitor"),
        "d": ("Figure out its best use", "Strategist"),
        "e": ("Investigate where it came from", "Explorer"),
        "f": ("Show your friends", "Socializer")
    },

    "twelfth_answer": {
        "a": ("A world with huge amounts of loot", "Collector"),
        "b": ("A creative sandbox", "Creator"),
        "c": ("A competitive arena", "Competitor"),
        "d": ("A world with complex systems", "Strategist"),
        "e": ("A massive unexplored world", "Explorer"),
        "f": ("A shared multiplayer world", "Socializer")
    },

    "thirteenth_answer": {
        "a": ("Share useful items", "Collector"),
        "b": ("Build things for everyone", "Creator"),
        "c": ("Try to outperform others", "Competitor"),
        "d": ("Plan the team's actions", "Strategist"),
        "e": ("Lead everyone into new areas", "Explorer"),
        "f": ("Keep everyone involved", "Socializer")
    },

    "fourteenth_answer": {
        "a": ("Find every hidden collectible", "Collector"),
        "b": ("Build something amazing", "Creator"),
        "c": ("Defeat highly skilled players", "Competitor"),
        "d": ("Solve a complex challenge", "Strategist"),
        "e": ("Find a secret location", "Explorer"),
        "f": ("Complete it with friends", "Socializer")
    },

    "fifteenth_answer": {
        "a": ("I collected everything.", "Collector"),
        "b": ("Look what I created.", "Creator"),
        "c": ("I became one of the best.", "Competitor"),
        "d": ("I mastered the game.", "Strategist"),
        "e": ("I discovered everything.", "Explorer"),
        "f": ("I met some awesome people.", "Socializer")
    }
}

# test for the data sheet, will be used in the flask to frontend
# connections.
print(questions[7])
for answers,roles in answer_dict["eighth_answer"].values():
    print(answers)


